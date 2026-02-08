import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';

const applications = [
  { role: 'Senior React Dev', company: 'TechCorp', stage: 'Interview Complete', progress: 80, status: 'review' },
  { role: 'Full Stack Engineer', company: 'StartupX', stage: 'Shortlisted', progress: 100, status: 'shortlisted' },
  { role: 'Frontend Developer', company: 'DesignHub', stage: 'Resume Screening', progress: 40, status: 'screening' },
  { role: 'React Native Dev', company: 'AppWorks', stage: 'Application Sent', progress: 20, status: 'applied' },
  { role: 'Tech Lead', company: 'BigCo', stage: 'Rejected', progress: 60, status: 'rejected' },
];

export default function CandidateProgress() {
  return (
    <DashboardLayout role="candidate">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <TrendingUp size={24} className="text-primary" /> Application Progress
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track every application's status in real-time</p>
        </div>

        <div className="space-y-4">
          {applications.map((app, i) => (
            <motion.div
              key={app.role}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display font-semibold text-foreground text-sm">{app.role}</h3>
                  <p className="text-xs text-muted-foreground">{app.company}</p>
                </div>
                <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                  app.status === 'shortlisted' ? 'bg-success/10 text-success' :
                  app.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                  app.status === 'review' ? 'bg-info/10 text-info' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {app.status === 'shortlisted' && <CheckCircle size={12} />}
                  {app.status === 'rejected' && <XCircle size={12} />}
                  {(app.status === 'review' || app.status === 'screening' || app.status === 'applied') && <Clock size={12} />}
                  {app.stage}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${app.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                  className={`h-full rounded-full ${
                    app.status === 'rejected' ? 'bg-destructive' :
                    app.status === 'shortlisted' ? 'bg-success' :
                    'bg-gradient-primary'
                  }`}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">Applied</span>
                <span className="text-xs text-muted-foreground">Screening</span>
                <span className="text-xs text-muted-foreground">Interview</span>
                <span className="text-xs text-muted-foreground">Decision</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
