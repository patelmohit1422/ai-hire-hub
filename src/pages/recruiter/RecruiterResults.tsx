import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const results = [
  { name: 'Alice Johnson', role: 'Senior React Dev', resume: 85, interview: 89, overall: 87, recommendation: 'Strongly Recommend' },
  { name: 'Carol Williams', role: 'Product Manager', resume: 92, interview: 90, overall: 91, recommendation: 'Strongly Recommend' },
  { name: 'Frank Miller', role: 'Backend Engineer', resume: 88, interview: 82, overall: 85, recommendation: 'Recommend' },
  { name: 'Eve Davis', role: 'Data Scientist', resume: 80, interview: 76, overall: 78, recommendation: 'Consider' },
  { name: 'Bob Smith', role: 'Senior React Dev', resume: 70, interview: 74, overall: 72, recommendation: 'Consider' },
  { name: 'David Brown', role: 'UX Designer', resume: 60, interview: 70, overall: 65, recommendation: 'Not Recommended' },
];

export default function RecruiterResults() {
  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <BarChart3 size={24} className="text-primary" /> Interview Results
          </h1>
          <p className="text-sm text-muted-foreground mt-1">AI-evaluated scores and recommendations</p>
        </div>

        <div className="space-y-3">
          {results.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card flex items-center justify-between hover:shadow-glow transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{r.name.charAt(0)}</div>
                <div>
                  <p className="font-medium text-foreground text-sm">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center hidden sm:block">
                  <p className="text-sm font-bold text-foreground">{r.resume}</p>
                  <p className="text-xs text-muted-foreground">Resume</p>
                </div>
                <div className="text-center hidden sm:block">
                  <p className="text-sm font-bold text-foreground">{r.interview}</p>
                  <p className="text-xs text-muted-foreground">Interview</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-display font-bold ${r.overall >= 80 ? 'text-success' : r.overall >= 70 ? 'text-warning' : 'text-destructive'}`}>{r.overall}</p>
                  <p className="text-xs text-muted-foreground">Overall</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  r.recommendation.includes('Strongly') ? 'bg-success/10 text-success' :
                  r.recommendation === 'Recommend' ? 'bg-info/10 text-info' :
                  r.recommendation === 'Consider' ? 'bg-warning/10 text-warning' :
                  'bg-destructive/10 text-destructive'
                }`}>{r.recommendation}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
