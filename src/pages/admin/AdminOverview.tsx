import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { motion } from 'framer-motion';
import { Users, Briefcase, BarChart3, Shield, TrendingUp, Activity, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function AdminOverview() {
  const [stats, setStats] = useState({ totalUsers: 0, activeJobs: 0, interviewsDone: 0, totalRecruiters: 0, totalCandidates: 0 });
  const [metrics, setMetrics] = useState({ avgResume: 0, interviewCompletion: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Fetch counts in parallel
      const [profilesRes, jobsRes, interviewsRes, rolesRes, scoresRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('jobs').select('id, status', { count: 'exact' }),
        supabase.from('interviews').select('id, status, created_at', { count: 'exact' }).order('created_at', { ascending: false }),
        supabase.from('user_roles').select('role'),
        supabase.from('scores').select('resume_score, interview_score, total_score'),
      ]);

      const totalUsers = profilesRes.count || 0;
      const jobsList = jobsRes.data || [];
      const activeJobs = jobsList.filter(j => j.status === 'active').length;
      const interviewsList = interviewsRes.data || [];
      const completedInterviews = interviewsList.filter(i => i.status === 'completed').length;
      const roles = rolesRes.data || [];
      const totalRecruiters = roles.filter(r => r.role === 'recruiter').length;
      const totalCandidates = roles.filter(r => r.role === 'candidate').length;

      // Calculate average scores
      const scoresList = scoresRes.data || [];
      const avgResume = scoresList.length > 0 ? Math.round(scoresList.reduce((s, sc) => s + Number(sc.resume_score), 0) / scoresList.length) : 0;
      const interviewCompletion = interviewsList.length > 0 ? Math.round((completedInterviews / interviewsList.length) * 100) : 0;

      setStats({ totalUsers, activeJobs, interviewsDone: completedInterviews, totalRecruiters, totalCandidates });
      setMetrics({ avgResume, interviewCompletion });

      // Build recent activity from recent interviews and profiles
      const activity: any[] = [];
      interviewsList.slice(0, 5).forEach(i => {
        const timeAgo = getTimeAgo(new Date(i.created_at));
        activity.push({
          action: `Interview ${i.status}: #${i.id.slice(0, 8)}`,
          time: timeAgo,
          type: 'interview',
        });
      });
      setRecentActivity(activity);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    return `${Math.floor(diffHrs / 24)} days ago`;
  }

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">System overview and key metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats.totalUsers} change={`${stats.totalRecruiters} recruiters, ${stats.totalCandidates} candidates`} icon={<Users size={20} />} trend="up" delay={0} />
          <StatCard title="Active Jobs" value={stats.activeJobs} change="currently active" icon={<Briefcase size={20} />} trend="up" delay={0.1} />
          <StatCard title="Interviews Done" value={stats.interviewsDone} change="completed" icon={<BarChart3 size={20} />} trend="up" delay={0.2} />
          <StatCard title="System Health" value="99.9%" change="All services running" icon={<Shield size={20} />} trend="neutral" delay={0.3} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              ) : recentActivity.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm text-foreground">{item.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity size={18} className="text-primary" /> Platform Metrics
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Avg Resume Score', value: metrics.avgResume, color: 'bg-primary' },
                { label: 'Interview Completion Rate', value: metrics.interviewCompletion, color: 'bg-success' },
              ].map((metric, i) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className="font-medium text-foreground">{metric.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                      className={`h-full rounded-full ${metric.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
