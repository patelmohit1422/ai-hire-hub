import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { motion } from 'framer-motion';
import { Briefcase, Users, ClipboardCheck, Clock, FileText } from 'lucide-react';

const recentApps = [
  { name: 'Alice Johnson', role: 'Senior React Dev', score: 87, status: 'interviewed' },
  { name: 'Bob Smith', role: 'Senior React Dev', score: 72, status: 'screening' },
  { name: 'Carol W.', role: 'Product Manager', score: 91, status: 'shortlisted' },
  { name: 'David Brown', role: 'UX Designer', score: 65, status: 'new' },
  { name: 'Eve Davis', role: 'Data Scientist', score: 78, status: 'interviewed' },
];

export default function RecruiterOverview() {
  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Recruiter Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Your hiring pipeline at a glance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Jobs" value={12} change="+3 this week" icon={<Briefcase size={20} />} trend="up" delay={0} />
          <StatCard title="Total Applicants" value={284} change="+45 today" icon={<Users size={20} />} trend="up" delay={0.1} />
          <StatCard title="Interviews Scheduled" value={18} change="Next: 2PM today" icon={<Clock size={20} />} trend="neutral" delay={0.2} />
          <StatCard title="Shortlisted" value={34} change="Ready for review" icon={<ClipboardCheck size={20} />} trend="up" delay={0.3} />
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
            {recentApps.map((app, i) => (
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
