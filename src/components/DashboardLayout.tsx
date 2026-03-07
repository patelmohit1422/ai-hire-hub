import { ReactNode, useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  LayoutDashboard, Users, Briefcase, BarChart3, Settings, FileText,
  UserCheck, GitCompare, ClipboardList, MessageSquare, Award,
  Upload, Search, PlayCircle, TrendingUp, Bell, ChevronLeft, LogOut, Shield
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface SidebarItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const sidebarConfigs: Record<string, { title: string; items: SidebarItem[] }> = {
  admin: {
    title: 'Admin Panel',
    items: [
      { label: 'Overview', path: '/admin', icon: <LayoutDashboard size={17} /> },
      { label: 'User Management', path: '/admin/users', icon: <Users size={17} /> },
      { label: 'Job Management', path: '/admin/jobs', icon: <Briefcase size={17} /> },
      { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={17} /> },
      { label: 'Scoring Rules', path: '/admin/scoring', icon: <Award size={17} /> },
      { label: 'Settings', path: '/admin/settings', icon: <Settings size={17} /> },
    ],
  },
  recruiter: {
    title: 'Recruiter Panel',
    items: [
      { label: 'Overview', path: '/recruiter', icon: <LayoutDashboard size={17} /> },
      { label: 'Job Postings', path: '/recruiter/jobs', icon: <Briefcase size={17} /> },
      { label: 'Applications', path: '/recruiter/applications', icon: <ClipboardList size={17} /> },
      { label: 'Candidate View', path: '/recruiter/candidates', icon: <UserCheck size={17} /> },
      { label: 'Comparison', path: '/recruiter/compare', icon: <GitCompare size={17} /> },
      { label: 'Results', path: '/recruiter/results', icon: <BarChart3 size={17} /> },
      { label: 'Decisions', path: '/recruiter/decisions', icon: <MessageSquare size={17} /> },
      { label: 'Settings', path: '/recruiter/settings', icon: <Settings size={17} /> },
    ],
  },
  candidate: {
    title: 'Candidate Panel',
    items: [
      { label: 'Dashboard', path: '/candidate', icon: <LayoutDashboard size={17} /> },
      { label: 'Profile & Resume', path: '/candidate/profile', icon: <Upload size={17} /> },
      { label: 'Job Listings', path: '/candidate/jobs', icon: <Search size={17} /> },
      { label: 'Interview', path: '/candidate/interview', icon: <PlayCircle size={17} /> },
      { label: 'Progress', path: '/candidate/progress', icon: <TrendingUp size={17} /> },
      { label: 'Results', path: '/candidate/results', icon: <Award size={17} /> },
      { label: 'Settings', path: '/candidate/settings', icon: <Settings size={17} /> },
    ],
  },
};

interface DashboardLayoutProps {
  role: 'admin' | 'recruiter' | 'candidate';
  children: ReactNode;
}

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const config = sidebarConfigs[role];
  const [userName, setUserName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from('profiles').select('name').eq('user_id', session.user.id).maybeSingle()
          .then(({ data }) => { if (data?.name) setUserName(data.name); });
      }
    });
  }, []);

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col border-r border-border bg-sidebar">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              {role === 'admin' ? <Shield size={16} /> : role === 'recruiter' ? <Briefcase size={16} /> : <Users size={16} />}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{userName || config.title}</p>
              <p className="text-xs text-muted-foreground">{roleLabel}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
          {config.items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors duration-150 relative ${
                  isActive
                    ? 'bg-primary/8 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId={`sidebar-indicator-${role}`}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-2.5 border-t border-border space-y-0.5">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <NavLink
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to Home</span>
          </NavLink>
          <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-destructive hover:bg-destructive/8 transition-colors w-full">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
