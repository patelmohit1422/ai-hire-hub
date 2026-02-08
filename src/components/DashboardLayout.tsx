import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Briefcase, BarChart3, Settings, FileText,
  UserCheck, GitCompare, ClipboardList, MessageSquare, Award,
  Upload, Search, PlayCircle, TrendingUp, Bell, ChevronLeft, LogOut, Shield
} from 'lucide-react';

interface SidebarItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const sidebarConfigs: Record<string, { title: string; items: SidebarItem[] }> = {
  admin: {
    title: 'Admin Panel',
    items: [
      { label: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} /> },
      { label: 'User Management', path: '/admin/users', icon: <Users size={18} /> },
      { label: 'Job Management', path: '/admin/jobs', icon: <Briefcase size={18} /> },
      { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={18} /> },
      { label: 'Scoring Rules', path: '/admin/scoring', icon: <Award size={18} /> },
      { label: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
    ],
  },
  recruiter: {
    title: 'Recruiter Panel',
    items: [
      { label: 'Overview', path: '/recruiter', icon: <LayoutDashboard size={18} /> },
      { label: 'Job Postings', path: '/recruiter/jobs', icon: <Briefcase size={18} /> },
      { label: 'Applications', path: '/recruiter/applications', icon: <ClipboardList size={18} /> },
      { label: 'Candidate View', path: '/recruiter/candidates', icon: <UserCheck size={18} /> },
      { label: 'Comparison', path: '/recruiter/compare', icon: <GitCompare size={18} /> },
      { label: 'Results', path: '/recruiter/results', icon: <BarChart3 size={18} /> },
      { label: 'Decisions', path: '/recruiter/decisions', icon: <MessageSquare size={18} /> },
      { label: 'Settings', path: '/recruiter/settings', icon: <Settings size={18} /> },
    ],
  },
  candidate: {
    title: 'Candidate Panel',
    items: [
      { label: 'Dashboard', path: '/candidate', icon: <LayoutDashboard size={18} /> },
      { label: 'Profile & Resume', path: '/candidate/profile', icon: <Upload size={18} /> },
      { label: 'Job Listings', path: '/candidate/jobs', icon: <Search size={18} /> },
      { label: 'Interview', path: '/candidate/interview', icon: <PlayCircle size={18} /> },
      { label: 'Progress', path: '/candidate/progress', icon: <TrendingUp size={18} /> },
      { label: 'Results', path: '/candidate/results', icon: <Award size={18} /> },
      { label: 'Settings', path: '/candidate/settings', icon: <Settings size={18} /> },
    ],
  },
};

interface DashboardLayoutProps {
  role: 'admin' | 'recruiter' | 'candidate';
  children: ReactNode;
}

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const location = useLocation();
  const config = sidebarConfigs[role];

  const roleIcon = role === 'admin' ? <Shield size={20} /> : role === 'recruiter' ? <Briefcase size={20} /> : <Users size={20} />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-64 flex-shrink-0 flex flex-col border-r border-border bg-sidebar"
      >
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground">
              {roleIcon}
            </div>
            <div>
              <h2 className="font-display font-semibold text-sm text-foreground">{config.title}</h2>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {config.items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId={`sidebar-indicator-${role}`}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <ChevronLeft size={18} />
            <span>Back to Home</span>
          </NavLink>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-all w-full">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
