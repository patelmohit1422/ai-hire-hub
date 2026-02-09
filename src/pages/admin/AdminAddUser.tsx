import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AdminAddUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate' as 'admin' | 'recruiter' | 'candidate',
    status: 'active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-add-user', {
        body: form,
      });

      if (error) {
        toast.error(error.message || 'Failed to create user');
        setLoading(false);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      toast.success(`User ${form.name} created successfully!`);
      navigate('/admin/users');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/users')}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} className="text-muted-foreground" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Add New User</h1>
            <p className="text-sm text-muted-foreground mt-1">Create a new user account</p>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card p-6 shadow-card space-y-5"
        >
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['candidate', 'recruiter', 'admin'] as const).map((r) => (
                <motion.button
                  key={r}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-2.5 rounded-lg text-sm font-medium capitalize transition-all flex items-center justify-center gap-2 ${
                    form.role === r
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                  }`}
                >
                  {r === 'admin' && <Shield size={14} />}
                  {r}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {['active', 'inactive'].map((s) => (
                <motion.button
                  key={s}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setForm({ ...form, status: s })}
                  className={`py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                    form.status === s
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                  }`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-glow disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Creating User...</>
            ) : (
              'Create User'
            )}
          </motion.button>
        </motion.form>
      </div>
    </DashboardLayout>
  );
}
