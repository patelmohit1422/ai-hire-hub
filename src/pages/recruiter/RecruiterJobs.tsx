import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Briefcase, Plus, MapPin, DollarSign, Clock, Loader2, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editForm, setEditForm] = useState({ title: '', location: '', salary_range: '', status: '' });

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

  async function deleteJob(jobId: string) {
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Job deleted');
      setJobs(prev => prev.filter(j => j.id !== jobId));
    }
    setMenuOpen(null);
  }

  function startEdit(job: Job) {
    setEditingJob(job);
    setEditForm({ title: job.title, location: job.location || '', salary_range: job.salary_range || '', status: job.status });
    setMenuOpen(null);
  }

  async function saveEdit() {
    if (!editingJob) return;
    const { error } = await supabase.from('jobs').update({
      title: editForm.title,
      location: editForm.location,
      salary_range: editForm.salary_range,
      status: editForm.status,
    }).eq('id', editingJob.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Job updated');
      setJobs(prev => prev.map(j => j.id === editingJob.id ? { ...j, ...editForm } : j));
      setEditingJob(null);
    }
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

        {/* Edit Modal */}
        {editingJob && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
            <h3 className="font-display font-semibold text-foreground">Edit Job</h3>
            <input type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Job Title" className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground" />
            <input type="text" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} placeholder="Location" className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground" />
            <input type="text" value={editForm.salary_range} onChange={e => setEditForm({ ...editForm, salary_range: e.target.value })} placeholder="Salary Range" className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground" />
            <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.97 }} onClick={saveEdit} className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold">Save</motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setEditingJob(null)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground">Cancel</motion.button>
            </div>
          </motion.div>
        )}

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
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === job.id ? null : job.id)} className="text-muted-foreground hover:text-foreground p-1">
                      <MoreHorizontal size={16} />
                    </button>
                    {menuOpen === job.id && (
                      <div className="absolute right-0 top-8 z-10 w-32 rounded-lg border border-border bg-card shadow-elevated py-1">
                        <button onClick={() => startEdit(job)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted">
                          <Pencil size={14} /> Edit
                        </button>
                        <button onClick={() => deleteJob(job.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
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
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate(`/recruiter/jobs/${job.id}`)} className="text-xs text-primary font-medium">View Details →</motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
