import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, MoreHorizontal, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Job {
  id: string;
  title: string;
  location: string;
  status: string;
  created_at: string;
  skills: string[];
  experience_level: string;
  applications: { count: number }[];
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, location, status, created_at, skills, experience_level, applications(count)')
      .order('created_at', { ascending: false });

    if (!error && data) setJobs(data as any);
    setLoading(false);
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Job & Role Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of all job postings across the platform</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No jobs posted yet</p>
            <p className="text-sm mt-1">Jobs will appear here when recruiters create them</p>
          </div>
        ) : (
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
                <p className="text-xs text-muted-foreground mt-1 capitalize">{job.experience_level} level</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                {job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {job.skills.slice(0, 3).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">{s}</span>
                    ))}
                    {job.skills.length > 3 && <span className="text-[10px] text-muted-foreground">+{job.skills.length - 3}</span>}
                  </div>
                )}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="text-xs text-foreground font-medium">{job.applications?.[0]?.count || 0} applicants</span>
                  <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={16} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
