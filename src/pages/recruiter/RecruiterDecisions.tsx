import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Pause } from 'lucide-react';

const candidates = [
  { name: 'Carol Williams', role: 'Product Manager', overall: 91, status: 'pending' },
  { name: 'Alice Johnson', role: 'Senior React Dev', overall: 87, status: 'shortlisted' },
  { name: 'Frank Miller', role: 'Backend Engineer', overall: 85, status: 'pending' },
  { name: 'Eve Davis', role: 'Data Scientist', overall: 78, status: 'hold' },
  { name: 'Bob Smith', role: 'Senior React Dev', overall: 72, status: 'rejected' },
  { name: 'David Brown', role: 'UX Designer', overall: 65, status: 'rejected' },
];

export default function RecruiterDecisions() {
  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Final Decisions</h1>
          <p className="text-sm text-muted-foreground mt-1">Shortlist, hold, or reject candidates</p>
        </div>

        <div className="space-y-3">
          {candidates.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{c.name.charAt(0)}</div>
                <div>
                  <p className="font-medium text-foreground text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.role} • Score: {c.overall}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {c.status === 'pending' ? (
                  <>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center text-success hover:bg-success/20 transition-colors" title="Shortlist">
                      <CheckCircle size={18} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center text-warning hover:bg-warning/20 transition-colors" title="Hold">
                      <Pause size={18} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors" title="Reject">
                      <XCircle size={18} />
                    </motion.button>
                  </>
                ) : (
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${
                    c.status === 'shortlisted' ? 'bg-success/10 text-success' :
                    c.status === 'hold' ? 'bg-warning/10 text-warning' :
                    'bg-destructive/10 text-destructive'
                  }`}>{c.status}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
