import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, Calendar, Users, Pencil, Trash2, Loader2, X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface JobDetail {
  id: string;
  title: string;
  description: string;
  location: string | null;
  salary_range: string | null;
  status: string;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  skills: string[];
  experience_level: string;
  job_type: string | null;
  applications: { count: number }[];
}

export default function RecruiterJobDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    salary_range: '',
    status: 'active',
    experience_level: 'mid',
    job_type: 'Full-time',
    deadline: '',
    skills: [] as string[],
  });

  useEffect(() => {
    if (jobId) fetchJob();
  }, [jobId]);

  async function fetchJob() {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, description, location, salary_range, status, deadline, created_at, updated_at, skills, experience_level, job_type, applications(count)')
      .eq('id', jobId!)
      .maybeSingle();

    if (error || !data) {
      toast.error('Job not found');
      navigate('/recruiter/jobs');
      return;
    }
    setJob(data as any);
    setForm({
      title: data.title,
      description: data.description || '',
      location: data.location || '',
      salary_range: data.salary_range || '',
      status: data.status,
      experience_level: data.experience_level,
      job_type: data.job_type || 'Full-time',
      deadline: data.deadline ? data.deadline.split('T')[0] : '',
      skills: data.skills || [],
    });
    setLoading(false);
  }

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
  };

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from('jobs').update({
      title: form.title,
      description: form.description,
      location: form.location,
      salary_range: form.salary_range,
      status: form.status,
      experience_level: form.experience_level,
      job_type: form.job_type,
      deadline: form.deadline || null,
      skills: form.skills,
    }).eq('id', jobId!);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Job updated successfully');
      setEditing(false);
      fetchJob();
    }
    setSaving(false);
  }

  async function handleDelete() {
    setDeleting(true);
    const { error } = await supabase.from('jobs').delete().eq('id', jobId!);
    if (error) {
      toast.error(error.message);
      setDeleting(false);
    } else {
      toast.success('Job deleted successfully');
      navigate('/recruiter/jobs');
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="recruiter">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!job) return null;

  return (
    <DashboardLayout role="recruiter">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/recruiter/jobs')}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <ArrowLeft size={18} className="text-muted-foreground" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">{editing ? 'Edit Job' : 'Job Details'}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Posted {new Date(job.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          {!editing && (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted flex items-center gap-2"
              >
                <Pencil size={14} /> Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setDeleteOpen(true)}
                className="px-4 py-2 rounded-lg border border-destructive/30 text-sm font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </motion.button>
            </div>
          )}
        </div>

        {editing ? (
          /* Edit Form */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6 shadow-card space-y-5"
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Job Title</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none h-32" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Skills</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} placeholder="Add a skill" className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={addSkill} className="px-3 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/30 text-sm"><Plus size={16} /></motion.button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.skills.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="hover:text-destructive"><X size={12} /></button>
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Experience Level</label>
                <select value={form.experience_level} onChange={e => setForm({ ...form, experience_level: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Location</label>
                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Salary Range</label>
                <input type="text" value={form.salary_range} onChange={e => setForm({ ...form, salary_range: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Job Type</label>
                <select value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow flex items-center gap-2 disabled:opacity-60">
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Changes'}
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setEditing(false); fetchJob(); }} className="px-6 py-2.5 rounded-lg border border-border text-sm text-muted-foreground">Cancel</motion.button>
            </div>
          </motion.div>
        ) : (
          /* Detail View */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase size={22} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">{job.title}</h2>
                    <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded-md ${
                      job.status === 'active' ? 'bg-success/10 text-success' :
                      job.status === 'paused' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>{job.status}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} className="text-primary" />
                  <span>{job.location || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign size={14} className="text-primary" />
                  <span>{job.salary_range || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={14} className="text-primary" />
                  <span className="capitalize">{job.experience_level} level</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users size={14} className="text-primary" />
                  <span>{job.applications?.[0]?.count || 0} applicants</span>
                </div>
              </div>

              {job.job_type && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase size={14} className="text-primary" />
                  <span>{job.job_type}</span>
                </div>
              )}

              {job.deadline && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={14} className="text-primary" />
                  <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="text-sm font-display font-semibold text-foreground mb-3">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {job.description || 'No description provided.'}
              </p>
            </div>

            {/* Skills */}
            {job.skills.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="text-sm font-display font-semibold text-foreground mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(s => (
                    <span key={s} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="text-xs text-muted-foreground pt-2">
              Last updated: {new Date(job.updated_at).toLocaleString()}
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{job.title}"? This action cannot be undone and will remove all associated applications.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <><Loader2 size={14} className="animate-spin mr-1" /> Deleting...</> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
