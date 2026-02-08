import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, MoreHorizontal } from 'lucide-react';

const jobs = [
  { id: 1, title: 'Senior React Developer', dept: 'Engineering', location: 'Remote', apps: 45, status: 'active', posted: '2026-02-01' },
  { id: 2, title: 'Product Manager', dept: 'Product', location: 'New York', apps: 32, status: 'active', posted: '2026-01-28' },
  { id: 3, title: 'UX Designer', dept: 'Design', location: 'San Francisco', apps: 28, status: 'paused', posted: '2026-01-20' },
  { id: 4, title: 'Data Scientist', dept: 'Analytics', location: 'Remote', apps: 67, status: 'active', posted: '2026-01-15' },
  { id: 5, title: 'DevOps Engineer', dept: 'Engineering', location: 'Austin', apps: 19, status: 'closed', posted: '2025-12-10' },
];

export default function AdminJobs() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Job & Role Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of all job postings across the platform</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase size={18} className="text-primary" />
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
                  job.status === 'active' ? 'bg-success/10 text-success' :
                  job.status === 'paused' ? 'bg-warning/10 text-warning' :
                  'bg-muted text-muted-foreground'
                }`}>{job.status}</span>
              </div>
              <h3 className="font-display font-semibold text-foreground text-sm">{job.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{job.dept}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {job.posted}</span>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <span className="text-xs text-foreground font-medium">{job.apps} applicants</span>
                <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
