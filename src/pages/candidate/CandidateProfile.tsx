import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Upload, User, FileText, Award, Plus, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function CandidateProfile() {
  const { user, profile: authProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    title: '',
    location: '',
    experience: '',
    resume_skills: [] as string[],
  });

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user?.id]);

  async function fetchProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user!.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
      setForm({
        name: data.name || '',
        email: data.email || '',
        title: data.title || '',
        location: data.location || '',
        experience: data.experience || '',
        resume_skills: data.resume_skills || [],
      });
    }
    setLoading(false);
  }

  function addSkill() {
    const skill = skillInput.trim();
    if (skill && !form.resume_skills.includes(skill)) {
      setForm({ ...form, resume_skills: [...form.resume_skills, skill] });
      setSkillInput('');
    }
  }

  function removeSkill(skill: string) {
    setForm({ ...form, resume_skills: form.resume_skills.filter(s => s !== skill) });
  }

  async function saveProfile() {
    if (!user?.id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: form.name,
          title: form.title,
          location: form.location,
          experience: form.experience,
          resume_skills: form.resume_skills,
        })
        .eq('user_id', user.id);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Profile saved successfully!');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="candidate">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="candidate">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Profile & Resume</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your profile and skills</p>
          </div>
          <motion.button
            whileHover={{ scale: saving ? 1 : 1.03 }}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            disabled={saving}
            onClick={saveProfile}
            className="px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Profile'}
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-primary mx-auto flex items-center justify-center text-2xl font-bold text-primary-foreground mb-3">
                <User size={32} />
              </div>
              <h2 className="font-display font-bold text-foreground">{form.name || 'Your Name'}</h2>
              <p className="text-sm text-muted-foreground">{form.title || 'Your Title'}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-xs text-muted-foreground">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Email</label>
                <input type="email" value={form.email} disabled className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-muted-foreground" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Full Stack Developer"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="New York, NY"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Experience</label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  placeholder="4 years"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
            {/* Skills */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Award size={18} className="text-primary" /> Skills (used for AI interview questions)
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Add your skills here. The AI interviewer will generate questions based on these skills and the job requirements.</p>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  placeholder="Type a skill and press Enter"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addSkill}
                  className="px-3 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/30"
                >
                  <Plus size={16} />
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.resume_skills.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                    {s}
                    <button onClick={() => removeSkill(s)} className="hover:text-destructive"><X size={12} /></button>
                  </span>
                ))}
                {form.resume_skills.length === 0 && (
                  <p className="text-xs text-muted-foreground">No skills added yet. Add your skills to get relevant interview questions.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
