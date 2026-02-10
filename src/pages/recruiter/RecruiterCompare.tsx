import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { GitCompare, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CompareCandidate {
  name: string;
  resume: number;
  interview: number;
  overall: number;
  skills: string[];
}

export default function RecruiterCompare() {
  const { profile } = useAuth();
  const [candidates, setCandidates] = useState<CompareCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) fetchAcceptedCandidates();
  }, [profile?.id]);

  async function fetchAcceptedCandidates() {
    setLoading(true);
    try {
      // Get recruiter's jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id')
        .eq('recruiter_id', profile!.id);

      if (!jobs || jobs.length === 0) {
        setLoading(false);
        return;
      }

      const jobIds = jobs.map(j => j.id);

      // Get accepted/shortlisted applications only
      const { data: apps } = await supabase
        .from('applications')
        .select('id, candidate_id, job_id')
        .in('job_id', jobIds)
        .in('status', ['shortlisted', 'review']);

      if (!apps || apps.length === 0) {
        setLoading(false);
        return;
      }

      const candidateIds = [...new Set(apps.map(a => a.candidate_id))];
      const appIds = apps.map(a => a.id);

      // Get candidate profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, resume_skills')
        .in('id', candidateIds);

      // Get interviews and scores
      const { data: interviews } = await supabase
        .from('interviews')
        .select('id, application_id')
        .in('application_id', appIds)
        .eq('status', 'completed');

      let scoreMap: Record<string, any> = {};
      if (interviews && interviews.length > 0) {
        const interviewIds = interviews.map(i => i.id);
        const { data: scores } = await supabase
          .from('scores')
          .select('interview_id, resume_score, interview_score, total_score')
          .in('interview_id', interviewIds);

        if (scores) {
          // Map interview_id -> app's candidate_id
          scores.forEach(s => {
            const intv = interviews.find(i => i.id === s.interview_id);
            const app = apps.find(a => a.id === intv?.application_id);
            if (app) {
              scoreMap[app.candidate_id] = s;
            }
          });
        }
      }

      const mapped: CompareCandidate[] = (profiles || []).map(p => {
        const s = scoreMap[p.id];
        return {
          name: p.name || 'Unknown',
          resume: s ? Number(s.resume_score) : 0,
          interview: s ? Number(s.interview_score) : 0,
          overall: s ? Number(s.total_score) : 0,
          skills: (p.resume_skills || []).slice(0, 5),
        };
      });

      setCandidates(mapped);
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
            <GitCompare size={24} className="text-primary" /> Candidate Comparison
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Side-by-side analysis of shortlisted/reviewed candidates</p>
        </div>

        {candidates.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <GitCompare size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No candidates to compare</p>
            <p className="text-sm mt-1">Shortlisted or reviewed candidates will appear here</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {candidates.map((c, i) => (
              <motion.div
                key={c.name + i}
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
        )}
      </div>
    </DashboardLayout>
  );
}
