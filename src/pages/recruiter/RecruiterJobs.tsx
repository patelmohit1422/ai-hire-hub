import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Briefcase, Plus, MapPin, DollarSign, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Job {
  id: string;
  title: string;
  location: string;
  salary_range: string;
  status: string;
  deadline: string | null;
  created_at: string;
  skills: string[];
  applications: { count: number }[];
}

export default function RecruiterJobs() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) fetchJobs();
  }, [profile?.id]);

  async function fetchJobs() {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, location, salary_range, status, deadline, created_at, skills, applications(count)')
      .eq('recruiter_id', profile!.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setJobs(data as any);
    }
    setLoading(false);
  }

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Job Postings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your active job listings</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/recruiter/jobs/add')}
            className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow flex items-center gap-2"
          >
            <Plus size={16} /> New Job
          </motion.button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No jobs posted yet</p>
            <p className="text-sm mt-1">Create your first job posting to start receiving applications</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-sm">{job.title}</h3>
                      <span className={`text-xs font-medium capitalize ${
                        job.status === 'active' ? 'text-success' :
                        job.status === 'paused' ? 'text-warning' :
                        'text-muted-foreground'
                      }`}>{job.status}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><MapPin size={12} /> {job.location}</div>
                  {job.salary_range && <div className="flex items-center gap-1"><DollarSign size={12} /> {job.salary_range}</div>}
                  {job.deadline && <div className="flex items-center gap-1"><Clock size={12} /> Deadline: {new Date(job.deadline).toLocaleDateString()}</div>}
                </div>
                {job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {job.skills.slice(0, 4).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">{s}</span>
                    ))}
                    {job.skills.length > 4 && <span className="text-[10px] text-muted-foreground">+{job.skills.length - 4}</span>}
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{job.applications?.[0]?.count || 0} applicants</span>
                  <motion.button whileHover={{ scale: 1.05 }} className="text-xs text-primary font-medium">View Details →</motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
