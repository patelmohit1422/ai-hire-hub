import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Award, Sliders, Loader2, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const defaultWeights = [
  { id: 'resume_weight', label: 'Resume Score Weight', value: 40, desc: 'Skills, education, experience match' },
  { id: 'interview_weight', label: 'Interview Score Weight', value: 60, desc: 'AI interview performance' },
];

export default function AdminScoring() {
  const [weights, setWeights] = useState(defaultWeights);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWeights();
  }, []);

  async function fetchWeights() {
    try {
      const { data } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', ['resume_weight', 'interview_weight']);

      if (data && data.length > 0) {
        setWeights(prev => prev.map(w => {
          const found = data.find(d => d.key === w.id);
          if (found) {
            return { ...w, value: Number(found.value) || w.value };
          }
          return w;
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const updateWeight = (id: string, newValue: number) => {
    setWeights(prev => prev.map(w => w.id === id ? { ...w, value: newValue } : w));
  };

  async function saveWeights() {
    setSaving(true);
    try {
      for (const w of weights) {
        // Upsert: try update first, then insert if no row exists
        const { data: existing } = await supabase
          .from('system_settings')
          .select('id')
          .eq('key', w.id)
          .maybeSingle();

        if (existing) {
          await supabase.from('system_settings').update({ value: w.value as any }).eq('key', w.id);
        } else {
          await supabase.from('system_settings').insert({ key: w.id, value: w.value as any });
        }
      }
      toast.success('Scoring weights saved!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  const total = weights.reduce((sum, w) => sum + w.value, 0);

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Scoring Rules & Weightage</h1>
            <p className="text-sm text-muted-foreground mt-1">Configure how candidates are scored and ranked</p>
          </div>
          <motion.button
            whileHover={{ scale: saving ? 1 : 1.03 }}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            disabled={saving || total !== 100}
            onClick={saveWeights}
            className="px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : (
              <><CheckCircle size={16} /> Save Weights</>
            )}
          </motion.button>
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
            <p><strong className="text-foreground">Overall Score</strong> = (Resume Score × {weights[0]?.value}% + Interview Score × {weights[1]?.value}%) / 100</p>
            <p>Each category is scored on a scale of 0–100 by the AI system.</p>
            <p>The AI provides <strong className="text-foreground">recommendations only</strong> — final hiring decisions are always made by recruiters.</p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
