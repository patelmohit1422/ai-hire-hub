import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Brain, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<'candidate' | 'recruiter' | 'admin'>('candidate');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to the role-based dashboard
    window.location.href = `/${role}`;
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Brain size={22} className="text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">HireAI</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {isLogin ? 'Sign in to your dashboard' : 'Start your hiring journey'}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-elevated">
          {!isLogin && (
            <div className="mb-6">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {(['candidate', 'recruiter', 'admin'] as const).map((r) => (
                  <motion.button
                    key={r}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRole(r)}
                    className={`py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                      role === r
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                    }`}
                  >
                    {r}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {isLogin && (
            <div className="mb-6">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Login as</label>
              <div className="grid grid-cols-3 gap-2">
                {(['candidate', 'recruiter', 'admin'] as const).map((r) => (
                  <motion.button
                    key={r}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRole(r)}
                    className={`py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                      role === r
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                    }`}
                  >
                    {r}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-glow mt-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
