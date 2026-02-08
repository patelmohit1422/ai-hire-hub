import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Award, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';

export default function CandidateResults() {
  return (
    <DashboardLayout role="candidate">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Interview Results</h1>
          <p className="text-sm text-muted-foreground mt-1">Your AI-evaluated performance and feedback</p>
        </div>

        {/* Score overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display font-semibold text-foreground mb-6 flex items-center gap-2"><Award size={18} className="text-primary" /> Senior React Dev — TechCorp</h3>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Resume Score', score: 85, color: 'text-success' },
              { label: 'Interview Score', score: 82, color: 'text-info' },
              { label: 'Overall Score', score: 84, color: 'text-primary' },
            ].map((s, i) => (
              <div key={s.label} className="text-center p-6 rounded-xl bg-muted/50">
                <motion.p
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.3 + i * 0.15 }}
                  className={`text-4xl font-display font-bold ${s.color}`}
                >
                  {s.score}
                </motion.p>
                <p className="text-sm text-muted-foreground mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-primary" /> Category Breakdown</h3>
          <div className="space-y-4">
            {[
              { category: 'Technical Knowledge', score: 88 },
              { category: 'Problem Solving', score: 80 },
              { category: 'Communication', score: 85 },
              { category: 'System Design', score: 75 },
              { category: 'Cultural Fit', score: 90 },
            ].map((item, i) => (
              <div key={item.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{item.category}</span>
                  <span className={`font-bold ${item.score >= 80 ? 'text-success' : item.score >= 60 ? 'text-warning' : 'text-destructive'}`}>{item.score}/100</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    className={`h-full rounded-full ${item.score >= 80 ? 'bg-success' : item.score >= 60 ? 'bg-warning' : 'bg-destructive'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feedback */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><MessageSquare size={18} className="text-primary" /> AI Feedback</h3>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p className="flex items-start gap-2"><CheckCircle size={14} className="text-success mt-0.5 flex-shrink-0" /> Strong demonstration of React fundamentals including hooks, state management, and performance optimization.</p>
            <p className="flex items-start gap-2"><CheckCircle size={14} className="text-success mt-0.5 flex-shrink-0" /> Clear and structured communication style. Answers were well-organized with real-world examples.</p>
            <p className="flex items-start gap-2"><CheckCircle size={14} className="text-warning mt-0.5 flex-shrink-0" /> System design answer could benefit from more depth in scalability considerations.</p>
            <p className="flex items-start gap-2"><CheckCircle size={14} className="text-info mt-0.5 flex-shrink-0" /> Overall recommendation: <strong className="text-foreground">Strongly Recommended</strong> for next round.</p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
