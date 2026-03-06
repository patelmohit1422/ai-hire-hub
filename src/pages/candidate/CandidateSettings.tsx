import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function CandidateSettings() {
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', currentPassword: '', newPassword: '' });
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    interview_reminders: true,
    application_updates: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setLoading(false); return; }

      const { data } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
        setForm(prev => ({ ...prev, name: data.name, email: data.email }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { toast.error('Not authenticated'); setSaving(false); return; }

      const { error } = await supabase
        .from('profiles')
        .update({ name: form.name, email: form.email })
        .eq('user_id', session.user.id);

      if (error) throw error;

      if (form.newPassword && form.newPassword.length >= 6) {
        const { error: pwErr } = await supabase.auth.updateUser({ password: form.newPassword });
        if (pwErr) throw pwErr;
        setForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      }

      toast.success('Settings saved successfully!');
      setProfile({ name: form.name, email: form.email });
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
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
            <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your account preferences</p>
          </div>
          <motion.button
            whileHover={{ scale: saving ? 1 : 1.03 }}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            disabled={saving}
            onClick={saveProfile}
            className="px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : (
              <><CheckCircle size={16} /> Save Changes</>
            )}
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2 text-primary"><User size={18} /> Account</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2 text-primary"><Lock size={18} /> Security</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Current Password</label>
                <input type="password" value={form.currentPassword} onChange={e => setForm(prev => ({ ...prev, currentPassword: e.target.value }))} placeholder="••••••••" className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">New Password</label>
                <input type="password" value={form.newPassword} onChange={e => setForm(prev => ({ ...prev, newPassword: e.target.value }))} placeholder="••••••••" className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2 text-primary"><Bell size={18} /> Notifications</h3>
            <div className="space-y-4">
              {([
                { key: 'email_notifications' as const, label: 'Email Notifications' },
                { key: 'interview_reminders' as const, label: 'Interview Reminders' },
                { key: 'application_updates' as const, label: 'Application Updates' },
              ]).map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <label className="text-sm text-foreground">{item.label}</label>
                  <div onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))} className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${notifications[item.key] ? 'bg-primary' : 'bg-muted border border-border'}`}>
                    <div className={`w-4 h-4 rounded-full bg-primary-foreground mt-0.5 transition-transform ${notifications[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
