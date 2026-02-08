import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Search, MoreHorizontal, Shield, UserCheck, UserX } from 'lucide-react';

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'candidate', status: 'active', joined: '2026-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'recruiter', status: 'active', joined: '2026-01-10' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'candidate', status: 'inactive', joined: '2025-12-20' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'admin', status: 'active', joined: '2025-11-05' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'recruiter', status: 'active', joined: '2026-02-01' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'candidate', status: 'active', joined: '2026-02-05' },
];

export default function AdminUsers() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">User Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage candidates, recruiters and admins</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow"
          >
            Add User
          </motion.button>
        </div>

        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Role</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Joined</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium capitalize ${
                      user.role === 'admin' ? 'bg-accent/20 text-accent' :
                      user.role === 'recruiter' ? 'bg-info/20 text-info' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {user.role === 'admin' && <Shield size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      user.status === 'active' ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      {user.status === 'active' ? <UserCheck size={12} /> : <UserX size={12} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{user.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
