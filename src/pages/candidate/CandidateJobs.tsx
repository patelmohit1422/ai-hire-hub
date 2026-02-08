import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Clock, Briefcase } from 'lucide-react';

const jobs = [
  { title: 'Senior React Developer', company: 'TechCorp', location: 'Remote', salary: '$120k-$160k', type: 'Full-time', match: 92 },
  { title: 'Full Stack Engineer', company: 'StartupX', location: 'New York', salary: '$100k-$140k', type: 'Full-time', match: 85 },
  { title: 'Frontend Developer', company: 'DesignHub', location: 'San Francisco', salary: '$110k-$150k', type: 'Full-time', match: 78 },
  { title: 'React Native Developer', company: 'AppWorks', location: 'Remote', salary: '$90k-$130k', type: 'Contract', match: 71 },
  { title: 'Tech Lead', company: 'BigCo', location: 'Austin', salary: '$150k-$200k', type: 'Full-time', match: 68 },
];

export default function CandidateJobs() {
  return (
    <DashboardLayout role="candidate">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Job Listings</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse and apply to positions matching your profile</p>
        </div>

        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search jobs..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>

        <div className="space-y-3">
          {jobs.map((job, i) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ x: 4 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-glow transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-sm">{job.title}</h3>
                  <p className="text-xs text-muted-foreground">{job.company}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign size={10} /> {job.salary}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {job.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className={`text-lg font-display font-bold ${job.match >= 80 ? 'text-success' : job.match >= 60 ? 'text-warning' : 'text-muted-foreground'}`}>{job.match}%</p>
                  <p className="text-xs text-muted-foreground">Match</p>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-semibold shadow-glow">
                  Apply
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
