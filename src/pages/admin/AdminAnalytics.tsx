import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<{ month: string; interviews: number; hires: number }[]>([]);
  const [funnel, setFunnel] = useState<{ stage: string; count: number; pct: number }[]>([]);
  const [kpis, setKpis] = useState({ avgScore: 0, offerAcceptance: 0, totalHires: 0, totalInterviews: 0 });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const [appsRes, interviewsRes, scoresRes] = await Promise.all([
        supabase.from('applications').select('id, status, created_at'),
        supabase.from('interviews').select('id, status, created_at'),
        supabase.from('scores').select('total_score, status, created_at'),
      ]);

      const apps = appsRes.data || [];
      const interviews = interviewsRes.data || [];
      const scores = scoresRes.data || [];

      // Hiring funnel
      const totalApps = apps.length;
      const interviewed = interviews.filter(i => i.status === 'completed').length;
      const shortlisted = apps.filter(a => a.status === 'shortlisted').length;
      const rejected = apps.filter(a => a.status === 'rejected').length;
      const reviewing = apps.filter(a => a.status === 'review').length;

      setFunnel([
        { stage: 'Applications', count: totalApps, pct: 100 },
        { stage: 'Interviewing', count: interviews.length, pct: totalApps > 0 ? Math.round((interviews.length / totalApps) * 100) : 0 },
        { stage: 'Interviewed', count: interviewed, pct: totalApps > 0 ? Math.round((interviewed / totalApps) * 100) : 0 },
        { stage: 'Shortlisted', count: shortlisted, pct: totalApps > 0 ? Math.round((shortlisted / totalApps) * 100) : 0 },
        { stage: 'Under Review', count: reviewing, pct: totalApps > 0 ? Math.round((reviewing / totalApps) * 100) : 0 },
      ]);

      // Monthly data from interviews
      const monthMap: Record<string, { interviews: number; hires: number }> = {};
      interviews.forEach(i => {
        const d = new Date(i.created_at);
        const key = d.toLocaleString('default', { month: 'short' });
        if (!monthMap[key]) monthMap[key] = { interviews: 0, hires: 0 };
        monthMap[key].interviews++;
      });
      apps.filter(a => a.status === 'shortlisted').forEach(a => {
        const d = new Date(a.created_at);
        const key = d.toLocaleString('default', { month: 'short' });
        if (!monthMap[key]) monthMap[key] = { interviews: 0, hires: 0 };
        monthMap[key].hires++;
      });
      const monthlyArr = Object.entries(monthMap).map(([month, data]) => ({ month, ...data }));
      setMonthlyData(monthlyArr.length > 0 ? monthlyArr : [{ month: 'Current', interviews: interviews.length, hires: shortlisted }]);

      // KPIs
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, sc) => s + Number(sc.total_score), 0) / scores.length) : 0;
      const offerAcceptance = totalApps > 0 ? Math.round((shortlisted / totalApps) * 100) : 0;

      setKpis({
        avgScore,
        offerAcceptance,
        totalHires: shortlisted,
        totalInterviews: interviewed,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  const maxInterviews = Math.max(...monthlyData.map(d => d.interviews), 1);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Interview Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform-wide performance and trends</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <h3 className="font-display font-semibold text-foreground mb-6 flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" /> Monthly Interviews
            </h3>
            <div className="flex items-end gap-3 h-48">
              {monthlyData.map((d, i) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.interviews / maxInterviews) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="w-full rounded-t-md bg-gradient-primary min-h-[4px]"
                  />
                  <span className="text-xs text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <h3 className="font-display font-semibold text-foreground mb-6 flex items-center gap-2">
              <PieChart size={18} className="text-primary" /> Hiring Funnel
            </h3>
            <div className="space-y-4">
              {funnel.map((item, i) => (
                <div key={item.stage}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">{item.stage}</span>
                    <span className="text-muted-foreground">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                      className="h-full rounded-full bg-gradient-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" /> Key Performance Indicators
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Avg Total Score', value: `${kpis.avgScore}/100`, sub: 'Across all candidates' },
              { label: 'Total Interviews', value: String(kpis.totalInterviews), sub: 'Completed interviews' },
              { label: 'Shortlisted', value: String(kpis.totalHires), sub: 'Candidates shortlisted' },
              { label: 'Shortlist Rate', value: `${kpis.offerAcceptance}%`, sub: 'Of total applications' },
            ].map((kpi) => (
              <div key={kpi.label} className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
                <p className="text-xs text-primary mt-1">{kpi.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
