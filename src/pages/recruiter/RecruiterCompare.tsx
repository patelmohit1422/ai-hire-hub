import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { GitCompare } from 'lucide-react';

const candidates = [
  { name: 'Alice J.', resume: 85, interview: 89, overall: 87, skills: ['React', 'TS', 'Node'], communication: 90, cultural: 85 },
  { name: 'Bob S.', resume: 70, interview: 74, overall: 72, skills: ['React', 'JS', 'Python'], communication: 68, cultural: 75 },
  { name: 'Carol W.', resume: 92, interview: 90, overall: 91, skills: ['PM', 'Agile', 'SQL'], communication: 95, cultural: 88 },
];

export default function RecruiterCompare() {
  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <GitCompare size={24} className="text-primary" /> Candidate Comparison
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Side-by-side analysis for informed decisions</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {candidates.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-glow transition-all"
            >
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-primary font-bold text-lg mb-2">{c.name.charAt(0)}</div>
                <h3 className="font-display font-bold text-foreground">{c.name}</h3>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Resume', val: c.resume },
                  { label: 'Interview', val: c.interview },
                  { label: 'Communication', val: c.communication },
                  { label: 'Cultural Fit', val: c.cultural },
                ].map(metric => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className="font-medium text-foreground">{metric.val}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.val}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={`h-full rounded-full ${metric.val >= 80 ? 'bg-success' : metric.val >= 60 ? 'bg-warning' : 'bg-destructive'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-border text-center">
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.5 }}
                  className={`text-2xl font-display font-bold ${c.overall >= 80 ? 'text-success' : c.overall >= 60 ? 'text-warning' : 'text-destructive'}`}
                >
                  {c.overall}
                </motion.p>
                <p className="text-xs text-muted-foreground">Overall Score</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1 justify-center">
                {c.skills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
