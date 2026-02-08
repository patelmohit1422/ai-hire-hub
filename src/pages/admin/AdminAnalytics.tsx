import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

export default function AdminAnalytics() {
  const monthlyData = [
    { month: 'Sep', interviews: 120, hires: 15 },
    { month: 'Oct', interviews: 145, hires: 22 },
    { month: 'Nov', interviews: 180, hires: 28 },
    { month: 'Dec', interviews: 165, hires: 25 },
    { month: 'Jan', interviews: 210, hires: 35 },
    { month: 'Feb', interviews: 195, hires: 31 },
  ];
  const maxInterviews = Math.max(...monthlyData.map(d => d.interviews));

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
              {[
                { stage: 'Applications', count: 2847, pct: 100 },
                { stage: 'Resume Screened', count: 1820, pct: 64 },
                { stage: 'Interviewed', count: 890, pct: 31 },
                { stage: 'Shortlisted', count: 234, pct: 8 },
                { stage: 'Hired', count: 89, pct: 3 },
              ].map((item, i) => (
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
              { label: 'Avg Time to Hire', value: '12 days', sub: '-3 days vs last quarter' },
              { label: 'Cost per Hire', value: '$420', sub: '-15% vs industry avg' },
              { label: 'Offer Acceptance', value: '87%', sub: '+5% this quarter' },
              { label: 'Quality of Hire', value: '4.2/5', sub: 'Based on 6-month reviews' },
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
