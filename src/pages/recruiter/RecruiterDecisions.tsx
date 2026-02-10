import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Pause, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DecisionCandidate {
  appId: string;
  name: string;
  role: string;
  overall: number;
  status: string;
}

export default function RecruiterDecisions() {
  const { profile } = useAuth();
  const [candidates, setCandidates] = useState<DecisionCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) fetchDecisions();
  }, [profile?.id]);

  async function fetchDecisions() {
    setLoading(true);
    try {
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('recruiter_id', profile!.id);

      if (!jobs || jobs.length === 0) { setLoading(false); return; }

      const jobIds = jobs.map(j => j.id);
      const jobTitleMap: Record<string, string> = {};
      jobs.forEach(j => { jobTitleMap[j.id] = j.title; });

      const { data: apps } = await supabase
        .from('applications')
        .select('id, candidate_id, job_id, status')
        .in('job_id', jobIds)
        .order('created_at', { ascending: false });

      if (!apps || apps.length === 0) { setLoading(false); return; }

      const candidateIds = [...new Set(apps.map(a => a.candidate_id))];
      const appIds = apps.map(a => a.id);

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', candidateIds);
      const profileMap: Record<string, string> = {};
      (profiles || []).forEach(p => { profileMap[p.id] = p.name; });

      const { data: interviews } = await supabase
        .from('interviews')
        .select('id, application_id')
        .in('application_id', appIds);

      let scoreMap: Record<string, number> = {};
      if (interviews && interviews.length > 0) {
        const { data: scores } = await supabase
          .from('scores')
          .select('interview_id, total_score')
          .in('interview_id', interviews.map(i => i.id));
        if (scores) {
          scores.forEach(s => {
            const intv = interviews.find(i => i.id === s.interview_id);
            if (intv) scoreMap[intv.application_id] = Number(s.total_score);
          });
        }
      }

      const mapped: DecisionCandidate[] = apps.map(a => ({
        appId: a.id,
        name: profileMap[a.candidate_id] || 'Unknown',
        role: jobTitleMap[a.job_id] || 'Unknown',
        overall: scoreMap[a.id] || 0,
        status: a.status,
      }));

      setCandidates(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(appId: string, newStatus: string) {
    const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', appId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Candidate ${newStatus}`);
      setCandidates(prev => prev.map(c => c.appId === appId ? { ...c, status: newStatus } : c));
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
          <h1 className="text-2xl font-display font-bold text-foreground">Final Decisions</h1>
          <p className="text-sm text-muted-foreground mt-1">Shortlist, hold, or reject candidates</p>
        </div>

        {candidates.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No candidates to review</p>
          </div>
        ) : (
          <div className="space-y-3">
            {candidates.map((c, i) => (
              <motion.div
                key={c.appId}
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
                  {c.status === 'pending' || c.status === 'review' || c.status === 'interviewing' ? (
                    <>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => updateStatus(c.appId, 'shortlisted')} className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center text-success hover:bg-success/20 transition-colors" title="Shortlist">
                        <CheckCircle size={18} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => updateStatus(c.appId, 'review')} className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center text-warning hover:bg-warning/20 transition-colors" title="Hold">
                        <Pause size={18} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => updateStatus(c.appId, 'rejected')} className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors" title="Reject">
                        <XCircle size={18} />
                      </motion.button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${
                      c.status === 'shortlisted' ? 'bg-success/10 text-success' :
                      c.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                      'bg-warning/10 text-warning'
                    }`}>{c.status}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
