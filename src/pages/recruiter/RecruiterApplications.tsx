import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

const applications = [
  { name: 'Alice Johnson', role: 'Senior React Dev', resumeScore: 85, interviewScore: 89, overall: 87, status: 'shortlisted' },
  { name: 'Bob Smith', role: 'Senior React Dev', resumeScore: 70, interviewScore: 74, overall: 72, status: 'review' },
  { name: 'Carol Williams', role: 'Product Manager', resumeScore: 92, interviewScore: 90, overall: 91, status: 'shortlisted' },
  { name: 'David Brown', role: 'UX Designer', resumeScore: 60, interviewScore: 70, overall: 65, status: 'rejected' },
  { name: 'Eve Davis', role: 'Data Scientist', resumeScore: 80, interviewScore: 76, overall: 78, status: 'review' },
  { name: 'Frank Miller', role: 'Backend Engineer', resumeScore: 88, interviewScore: 82, overall: 85, status: 'shortlisted' },
];

export default function RecruiterApplications() {
  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Candidate Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and manage all applications</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search candidates..." className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <button className="px-3 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2"><Filter size={14} /> Filter</button>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card shadow-card overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Candidate</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Role</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Resume</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Interview</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Overall</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, i) => (
                <motion.tr
                  key={app.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{app.name.charAt(0)}</div>
                      <span className="text-sm font-medium text-foreground">{app.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{app.role}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`text-sm font-bold ${app.resumeScore >= 80 ? 'text-success' : app.resumeScore >= 60 ? 'text-warning' : 'text-destructive'}`}>{app.resumeScore}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`text-sm font-bold ${app.interviewScore >= 80 ? 'text-success' : app.interviewScore >= 60 ? 'text-warning' : 'text-destructive'}`}>{app.interviewScore}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-bold text-foreground">{app.overall}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
                      app.status === 'shortlisted' ? 'bg-success/10 text-success' :
                      app.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                      'bg-warning/10 text-warning'
                    }`}>{app.status}</span>
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
