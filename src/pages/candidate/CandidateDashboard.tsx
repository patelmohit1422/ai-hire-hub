import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { motion } from 'framer-motion';
import { FileText, Briefcase, PlayCircle, Award, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function CandidateDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ applications: 0, activeApps: 0, interviews: 0, upcomingInterviews: 0, avgScore: 0, profileComplete: 0 });
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) fetchDashboardData();
  }, [profile?.id]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      // Fetch applications
      const { data: apps } = await supabase
        .from('applications')
        .select('id, status, job_id, jobs(title)')
        .eq('candidate_id', profile!.id)
        .order('created_at', { ascending: false });

      const appsList = apps || [];
      const activeApps = appsList.filter(a => !['rejected', 'shortlisted'].includes(a.status)).length;

      // Fetch interviews
      const appIds = appsList.map(a => a.id);
      let interviewsList: any[] = [];
      if (appIds.length > 0) {
        const { data: interviews } = await supabase
          .from('interviews')
          .select('id, status, application_id, created_at')
          .in('application_id', appIds)
          .order('created_at', { ascending: false });
        interviewsList = interviews || [];
      }

      const upcomingInterviews = interviewsList.filter(i => i.status === 'pending' || i.status === 'in_progress');
      const completedInterviews = interviewsList.filter(i => i.status === 'completed');

      // Fetch scores
      let totalScore = 0;
      let scoreCount = 0;
      const results: any[] = [];
      if (completedInterviews.length > 0) {
        const intIds = completedInterviews.map(i => i.id);
        const { data: scores } = await supabase
          .from('scores')
          .select('interview_id, total_score, status')
          .in('interview_id', intIds);

        if (scores) {
          scores.forEach(s => {
            totalScore += Number(s.total_score);
            scoreCount++;
            const intv = completedInterviews.find(i => i.id === s.interview_id);
            const app = appsList.find(a => a.id === intv?.application_id);
            results.push({
              role: (app as any)?.jobs?.title || 'Unknown',
              score: Number(s.total_score),
              status: s.status === 'passed' ? 'Shortlisted' : s.status === 'under_review' ? 'Under Review' : 'Needs Improvement',
            });
          });
        }
      }

      // Profile completeness
      let complete = 0;
      if (profile?.name && profile.name.length > 0) complete += 25;
      if (profile?.email && profile.email.length > 0) complete += 25;
      if (profile?.resume_url && profile.resume_url.length > 0) complete += 25;
      if (profile?.resume_skills && profile.resume_skills.length > 0) complete += 25;

      // Build upcoming list
      const upcomingList = upcomingInterviews.slice(0, 3).map(i => {
        const app = appsList.find(a => a.id === i.application_id);
        return {
          title: `AI Interview — ${(app as any)?.jobs?.title || 'Unknown Role'}`,
          time: new Date(i.created_at).toLocaleDateString(),
          status: i.status === 'pending' ? 'ready' : 'in_progress',
        };
      });

      setStats({
        applications: appsList.length,
        activeApps,
        interviews: interviewsList.length,
        upcomingInterviews: upcomingInterviews.length,
        avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
        profileComplete: complete,
      });
      setUpcoming(upcomingList);
      setRecentResults(results.slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="candidate">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="candidate">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Welcome back, {profile?.name || 'Candidate'}! 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your applications and interviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Applications" value={stats.applications} change={`${stats.activeApps} active`} icon={<Briefcase size={20} />} trend="up" delay={0} />
          <StatCard title="Interviews" value={stats.interviews} change={`${stats.upcomingInterviews} upcoming`} icon={<PlayCircle size={20} />} trend="neutral" delay={0.1} />
          <StatCard title="Avg Score" value={stats.avgScore || '—'} change={stats.avgScore > 0 ? 'from completed interviews' : 'no scores yet'} icon={<Award size={20} />} trend={stats.avgScore >= 70 ? 'up' : 'neutral'} delay={0.2} />
          <StatCard title="Profile Complete" value={`${stats.profileComplete}%`} change={stats.profileComplete < 100 ? 'Complete your profile' : 'All done!'} icon={<FileText size={20} />} trend={stats.profileComplete === 100 ? 'up' : 'neutral'} delay={0.3} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock size={18} className="text-primary" /> Upcoming
            </h3>
            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming interviews</p>
              ) : upcoming.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${item.status === 'ready' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{item.status}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-primary" /> Recent Results
            </h3>
            <div className="space-y-3">
              {recentResults.length === 0 ? (
                <p className="text-sm text-muted-foreground">No results yet</p>
              ) : recentResults.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.role}</p>
                    <p className="text-xs text-muted-foreground">Score: {item.score}/100</p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${item.status === 'Shortlisted' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
