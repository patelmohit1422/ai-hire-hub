import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Clock, Briefcase, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary_range: string;
  job_type: string;
  skills: string[];
  experience_level: string;
  recruiter_id: string;
}

export default function CandidateJobs() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [profile?.id]);

  async function fetchJobs() {
    setLoading(true);
    const { data: jobsData } = await supabase
      .from('jobs')
      .select('id, title, description, location, salary_range, job_type, skills, experience_level, recruiter_id')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (jobsData) setJobs(jobsData);

    // Fetch already-applied jobs
    if (profile?.id) {
      const { data: apps } = await supabase
        .from('applications')
        .select('job_id')
        .eq('candidate_id', profile.id);
      if (apps) setAppliedJobs(new Set(apps.map(a => a.job_id)));
    }
    setLoading(false);
  }

  async function applyToJob(jobId: string) {
    if (!profile?.id) {
      toast.error('Please log in to apply');
      return;
    }
    setApplying(jobId);
    try {
      const { error } = await supabase.from('applications').insert({
        job_id: jobId,
        candidate_id: profile.id,
        status: 'pending',
      });
      if (error) {
        toast.error(error.message.includes('duplicate') ? 'Already applied to this job' : error.message);
      } else {
        toast.success('Application submitted!');
        setAppliedJobs(prev => new Set([...prev, jobId]));
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setApplying(null);
    }
  }

  // Calculate match % based on skill overlap with candidate resume
  function getMatch(jobSkills: string[]) {
    const resumeSkills = profile?.resume_skills || [];
    if (jobSkills.length === 0) return 0;
    const matching = jobSkills.filter(js =>
      resumeSkills.some((rs: string) => rs.toLowerCase() === js.toLowerCase())
    );
    return Math.round((matching.length / jobSkills.length) * 100);
  }

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="candidate">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Job Listings</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse and apply to positions matching your profile</p>
        </div>

        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No jobs available</p>
            <p className="text-sm mt-1">Check back later for new positions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((job, i) => {
              const match = getMatch(job.skills);
              const applied = appliedJobs.has(job.id);

              return (
                <motion.div
                  key={job.id}
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
                      <p className="text-xs text-muted-foreground capitalize">{job.experience_level} level</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                        {job.salary_range && <span className="flex items-center gap-1"><DollarSign size={10} /> {job.salary_range}</span>}
                        <span className="flex items-center gap-1"><Clock size={10} /> {job.job_type}</span>
                      </div>
                      {job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {job.skills.slice(0, 5).map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {profile?.resume_skills && profile.resume_skills.length > 0 && (
                      <div className="text-center">
                        <p className={`text-lg font-display font-bold ${match >= 80 ? 'text-success' : match >= 60 ? 'text-warning' : 'text-muted-foreground'}`}>{match}%</p>
                        <p className="text-xs text-muted-foreground">Match</p>
                      </div>
                    )}
                    {applied ? (
                      <span className="px-4 py-2 rounded-lg bg-success/10 text-success text-xs font-semibold flex items-center gap-1">
                        <CheckCircle size={14} /> Applied
                      </span>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={applying === job.id}
                        onClick={() => applyToJob(job.id)}
                        className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-semibold shadow-glow disabled:opacity-60"
                      >
                        {applying === job.id ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
