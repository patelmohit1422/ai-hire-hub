import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { motion } from 'framer-motion';
import { Users, Briefcase, BarChart3, Shield, TrendingUp, Activity } from 'lucide-react';

export default function AdminOverview() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">System overview and key metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value="2,847" change="+12% this month" icon={<Users size={20} />} trend="up" delay={0} />
          <StatCard title="Active Jobs" value="156" change="+8 this week" icon={<Briefcase size={20} />} trend="up" delay={0.1} />
          <StatCard title="Interviews Done" value="1,234" change="+24% vs last month" icon={<BarChart3 size={20} />} trend="up" delay={0.2} />
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
              {[
                { action: 'New recruiter registered', time: '2 min ago', type: 'user' },
                { action: 'Job posting approved: Senior Dev', time: '15 min ago', type: 'job' },
                { action: 'Interview completed: #1247', time: '1 hour ago', type: 'interview' },
                { action: 'Scoring rules updated', time: '3 hours ago', type: 'system' },
                { action: 'New candidate batch: 45 applications', time: '5 hours ago', type: 'user' },
              ].map((item, i) => (
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
                { label: 'Avg Resume Score', value: 72, color: 'bg-primary' },
                { label: 'Interview Completion Rate', value: 89, color: 'bg-success' },
                { label: 'Candidate Satisfaction', value: 94, color: 'bg-info' },
                { label: 'Recruiter Retention', value: 85, color: 'bg-accent' },
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
