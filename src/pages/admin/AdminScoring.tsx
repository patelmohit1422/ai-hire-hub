import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Award, Sliders } from 'lucide-react';
import { useState } from 'react';

const defaultWeights = [
  { id: 'resume', label: 'Resume Score Weight', value: 40, desc: 'Skills, education, experience match' },
  { id: 'interview', label: 'Interview Score Weight', value: 35, desc: 'AI interview performance' },
  { id: 'communication', label: 'Communication Weight', value: 15, desc: 'Clarity, articulation, confidence' },
  { id: 'cultural', label: 'Cultural Fit Weight', value: 10, desc: 'Values alignment, team compatibility' },
];

export default function AdminScoring() {
  const [weights, setWeights] = useState(defaultWeights);

  const updateWeight = (id: string, newValue: number) => {
    setWeights(prev => prev.map(w => w.id === id ? { ...w, value: newValue } : w));
  };

  const total = weights.reduce((sum, w) => sum + w.value, 0);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Scoring Rules & Weightage</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure how candidates are scored and ranked</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 shadow-card max-w-2xl"
        >
          <h3 className="font-display font-semibold text-foreground mb-6 flex items-center gap-2">
            <Sliders size={18} className="text-primary" /> Score Weightage Configuration
          </h3>
          <div className="space-y-6">
            {weights.map((w) => (
              <div key={w.id}>
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{w.label}</p>
                    <p className="text-xs text-muted-foreground">{w.desc}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">{w.value}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={w.value}
                  onChange={(e) => updateWeight(w.id, parseInt(e.target.value))}
                  className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer accent-primary"
                  style={{ accentColor: 'hsl(168 80% 50%)' }}
                />
              </div>
            ))}
          </div>
          <div className={`mt-6 p-3 rounded-lg text-center text-sm font-medium ${
            total === 100 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}>
            Total: {total}% {total === 100 ? '✓ Balanced' : `(must equal 100%)`}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 shadow-card max-w-2xl"
        >
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award size={18} className="text-primary" /> Scoring Methodology
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Overall Score</strong> = Σ (Category Score × Weight)</p>
            <p>Each category is scored on a scale of 0–100 by the AI system.</p>
            <p>The AI provides <strong className="text-foreground">recommendations only</strong> — final hiring decisions are always made by recruiters.</p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
