import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { BarChart3, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ResultRow {
  name: string;
  role: string;
  resume: number;
  interview: number;
  overall: number;
  recommendation: string;
}

function getRecommendation(score: number): string {
  if (score >= 85) return 'Strongly Recommend';
  if (score >= 70) return 'Recommend';
  if (score >= 55) return 'Consider';
  return 'Not Recommended';
}

export default function RecruiterResults() {
  const { profile } = useAuth();
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) fetchResults();
  }, [profile?.id]);

  async function fetchResults() {
    setLoading(true);
    try {
      const { data: jobs } = await supabase.from('jobs').select('id, title').eq('recruiter_id', profile!.id);
      if (!jobs || jobs.length === 0) { setLoading(false); return; }

      const jobIds = jobs.map(j => j.id);
      const jobTitleMap: Record<string, string> = {};
      jobs.forEach(j => { jobTitleMap[j.id] = j.title; });

      const { data: apps } = await supabase.from('applications').select('id, candidate_id, job_id').in('job_id', jobIds);
      if (!apps || apps.length === 0) { setLoading(false); return; }

      const candidateIds = [...new Set(apps.map(a => a.candidate_id))];
      const appIds = apps.map(a => a.id);

      const { data: profiles } = await supabase.from('profiles').select('id, name').in('id', candidateIds);
      const profileMap: Record<string, string> = {};
      (profiles || []).forEach(p => { profileMap[p.id] = p.name; });

      const { data: interviews } = await supabase.from('interviews').select('id, application_id').in('application_id', appIds).eq('status', 'completed');
      if (!interviews || interviews.length === 0) { setLoading(false); return; }

      const { data: scores } = await supabase.from('scores').select('interview_id, resume_score, interview_score, total_score').in('interview_id', interviews.map(i => i.id));

      const rows: ResultRow[] = [];
      (scores || []).forEach(s => {
        const intv = interviews.find(i => i.id === s.interview_id);
        const app = apps.find(a => a.id === intv?.application_id);
        if (app) {
          rows.push({
            name: profileMap[app.candidate_id] || 'Unknown',
            role: jobTitleMap[app.job_id] || 'Unknown',
            resume: Number(s.resume_score),
            interview: Number(s.interview_score),
            overall: Number(s.total_score),
            recommendation: getRecommendation(Number(s.total_score)),
          });
        }
      });

      rows.sort((a, b) => b.overall - a.overall);
      setResults(rows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="recruiter">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <BarChart3 size={24} className="text-primary" /> Interview Results
          </h1>
          <p className="text-sm text-muted-foreground mt-1">AI-evaluated scores and recommendations</p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No results yet</p>
            <p className="text-sm mt-1">Results will appear after candidates complete interviews</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((r, i) => (
              <motion.div
                key={r.name + i}
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
        )}
      </div>
    </DashboardLayout>
  );
}
