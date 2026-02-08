import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { motion } from 'framer-motion';
import { FileText, Briefcase, PlayCircle, Award, Clock, CheckCircle } from 'lucide-react';

export default function CandidateDashboard() {
  return (
    <DashboardLayout role="candidate">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Welcome back, John! 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your applications and interviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Applications" value={8} change="3 active" icon={<Briefcase size={20} />} trend="up" delay={0} />
          <StatCard title="Interviews" value={3} change="1 upcoming" icon={<PlayCircle size={20} />} trend="neutral" delay={0.1} />
          <StatCard title="Avg Score" value="82" change="+5 vs last" icon={<Award size={20} />} trend="up" delay={0.2} />
          <StatCard title="Profile Complete" value="90%" change="Add certifications" icon={<FileText size={20} />} trend="neutral" delay={0.3} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock size={18} className="text-primary" /> Upcoming
            </h3>
            <div className="space-y-3">
              {[
                { title: 'AI Interview — React Dev at TechCorp', time: 'Today, 3:00 PM', status: 'ready' },
                { title: 'Resume Review — Design Lead at CreativeHub', time: 'Tomorrow', status: 'pending' },
                { title: 'Final Round — Data Analyst at DataFlow', time: 'Feb 12', status: 'scheduled' },
              ].map((item, i) => (
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
              {[
                { role: 'Frontend Dev at StartupX', score: 85, status: 'Shortlisted' },
                { role: 'Full Stack at BigCo', score: 72, status: 'Under Review' },
                { role: 'React Dev at AppWorks', score: 90, status: 'Shortlisted' },
              ].map((item, i) => (
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
