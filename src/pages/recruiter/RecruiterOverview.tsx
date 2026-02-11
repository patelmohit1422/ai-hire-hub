import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { motion } from 'framer-motion';
import { Briefcase, Users, ClipboardCheck, Clock, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function RecruiterOverview() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, interviewsScheduled: 0, shortlisted: 0 });
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) fetchData();
  }, [profile?.id]);

  async function fetchData() {
    setLoading(true);
    try {
      // Get recruiter's jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title, status')
        .eq('recruiter_id', profile!.id);

      const jobsList = jobs || [];
      const activeJobs = jobsList.filter(j => j.status === 'active').length;
      const jobIds = jobsList.map(j => j.id);
      const jobTitleMap: Record<string, string> = {};
      jobsList.forEach(j => { jobTitleMap[j.id] = j.title; });

      if (jobIds.length === 0) {
        setStats({ activeJobs: 0, totalApplicants: 0, interviewsScheduled: 0, shortlisted: 0 });
        setLoading(false);
        return;
      }

      // Get applications
      const { data: apps } = await supabase
        .from('applications')
        .select('id, candidate_id, job_id, status, created_at')
        .in('job_id', jobIds)
        .order('created_at', { ascending: false });

      const appsList = apps || [];
      const shortlisted = appsList.filter(a => a.status === 'shortlisted').length;

      // Get interviews count
      const appIds = appsList.map(a => a.id);
      let interviewCount = 0;
      if (appIds.length > 0) {
        const { data: interviews } = await supabase
          .from('interviews')
          .select('id, application_id')
          .in('application_id', appIds);
        interviewCount = (interviews || []).length;
      }

      // Get candidate profiles for recent apps
      const candidateIds = [...new Set(appsList.slice(0, 5).map(a => a.candidate_id))];
      let profileMap: Record<string, string> = {};
      if (candidateIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', candidateIds);
        (profiles || []).forEach(p => { profileMap[p.id] = p.name; });
      }

      // Get scores for recent apps
      let scoreMap: Record<string, number> = {};
      if (appIds.length > 0) {
        const { data: interviews } = await supabase
          .from('interviews')
          .select('id, application_id')
          .in('application_id', appIds.slice(0, 5));
        if (interviews && interviews.length > 0) {
          const { data: scores } = await supabase
            .from('scores')
            .select('interview_id, total_score')
            .in('interview_id', interviews.map(i => i.id));
          if (scores) {
            scores.forEach(s => {
              const intv = interviews.find(i => i.id === s.interview_id);
              if (intv) scoreMap[intv.application_id] = Number(s.total_score);
            });
          }
        }
      }

      const recent = appsList.slice(0, 5).map(a => ({
        name: profileMap[a.candidate_id] || 'Unknown',
        role: jobTitleMap[a.job_id] || 'Unknown',
        score: scoreMap[a.id] || 0,
        status: a.status,
      }));

      setStats({
        activeJobs,
        totalApplicants: appsList.length,
        interviewsScheduled: interviewCount,
        shortlisted,
      });
      setRecentApps(recent);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="recruiter">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Recruiter Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Your hiring pipeline at a glance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Jobs" value={stats.activeJobs} change={`${stats.activeJobs} active`} icon={<Briefcase size={20} />} trend="up" delay={0} />
          <StatCard title="Total Applicants" value={stats.totalApplicants} change="all applications" icon={<Users size={20} />} trend="up" delay={0.1} />
          <StatCard title="Interviews" value={stats.interviewsScheduled} change="total conducted" icon={<Clock size={20} />} trend="neutral" delay={0.2} />
          <StatCard title="Shortlisted" value={stats.shortlisted} change="ready for review" icon={<ClipboardCheck size={20} />} trend="up" delay={0.3} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText size={18} className="text-primary" /> Recent Applications
          </h3>
          <div className="space-y-3">
            {recentApps.length === 0 ? (
              <p className="text-sm text-muted-foreground">No applications yet</p>
            ) : recentApps.map((app, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{app.name}</p>
                    <p className="text-xs text-muted-foreground">{app.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{app.score}</p>
                    <p className="text-xs text-muted-foreground">AI Score</p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
                    app.status === 'shortlisted' ? 'bg-success/10 text-success' :
                    app.status === 'interviewed' ? 'bg-info/10 text-info' :
                    app.status === 'screening' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>{app.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
