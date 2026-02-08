import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Briefcase, Plus, MapPin, DollarSign, Clock } from 'lucide-react';

const jobs = [
  { title: 'Senior React Developer', location: 'Remote', salary: '$120k-$160k', apps: 45, status: 'active', deadline: '2026-03-01' },
  { title: 'Product Manager', location: 'New York', salary: '$130k-$170k', apps: 32, status: 'active', deadline: '2026-02-28' },
  { title: 'UX Designer', location: 'San Francisco', salary: '$100k-$140k', apps: 28, status: 'paused', deadline: '2026-02-15' },
  { title: 'Backend Engineer', location: 'Remote', salary: '$110k-$150k', apps: 19, status: 'draft', deadline: '2026-03-15' },
];

export default function RecruiterJobs() {
  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Job Postings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your active job listings</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow flex items-center gap-2">
            <Plus size={16} /> New Job
          </motion.button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job, i) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Briefcase size={18} className="text-primary" /></div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-sm">{job.title}</h3>
                    <span className={`text-xs font-medium capitalize ${job.status === 'active' ? 'text-success' : job.status === 'paused' ? 'text-warning' : 'text-muted-foreground'}`}>{job.status}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><MapPin size={12} /> {job.location}</div>
                <div className="flex items-center gap-1"><DollarSign size={12} /> {job.salary}</div>
                <div className="flex items-center gap-1"><Clock size={12} /> Deadline: {job.deadline}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{job.apps} applicants</span>
                <motion.button whileHover={{ scale: 1.05 }} className="text-xs text-primary font-medium">View Details →</motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
