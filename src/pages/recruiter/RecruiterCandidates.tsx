import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Mail, MapPin, Award, FileText, Briefcase, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function RecruiterCandidates() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get('id');
  const [candidate, setCandidate] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (candidateId) fetchCandidate(candidateId);
    else setLoading(false);
  }, [candidateId]);

  async function fetchCandidate(id: string) {
    setLoading(true);
    try {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (prof) setCandidate(prof);

      // Find scores for this candidate
      const { data: apps } = await supabase
        .from('applications')
        .select('id')
        .eq('candidate_id', id);

      if (apps && apps.length > 0) {
        const appIds = apps.map(a => a.id);
        const { data: interviews } = await supabase
          .from('interviews')
          .select('id')
          .in('application_id', appIds)
          .eq('status', 'completed');

        if (interviews && interviews.length > 0) {
          const { data: scoreData } = await supabase
            .from('scores')
            .select('*')
            .in('interview_id', interviews.map(i => i.id))
            .order('created_at', { ascending: false })
            .limit(1);

          if (scoreData && scoreData.length > 0) setScores(scoreData[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateAppStatus(newStatus: string) {
    if (!candidateId) return;
    const { data: apps } = await supabase
      .from('applications')
      .select('id')
      .eq('candidate_id', candidateId);
    
    if (apps && apps.length > 0) {
      await supabase.from('applications').update({ status: newStatus }).eq('id', apps[0].id);
      toast.success(`Candidate ${newStatus}`);
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

  if (!candidate) {
    return (
      <DashboardLayout role="recruiter">
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">Select a candidate from Applications to view their profile</p>
        </div>
      </DashboardLayout>
    );
  }

  const resumeScore = scores ? Number(scores.resume_score) : 0;
  const interviewScore = scores ? Number(scores.interview_score) : 0;
  const overall = scores ? Number(scores.total_score) : 0;

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Candidate Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Detailed view with AI analysis</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-primary mx-auto flex items-center justify-center text-2xl font-bold text-primary-foreground mb-3">
                {(candidate.name || 'U').charAt(0)}
              </div>
              <h2 className="font-display font-bold text-foreground text-lg">{candidate.name}</h2>
              <p className="text-sm text-muted-foreground">{candidate.title || 'No title'}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail size={14} /> {candidate.email}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin size={14} /> {candidate.location || 'Not specified'}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Briefcase size={14} /> {candidate.experience || 'Not specified'}</div>
            </div>
            <div className="mt-6">
              <p className="text-xs font-medium text-muted-foreground mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {(candidate.resume_skills || []).map((s: string) => (
                  <span key={s} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">{s}</span>
                ))}
                {(!candidate.resume_skills || candidate.resume_skills.length === 0) && (
                  <span className="text-xs text-muted-foreground">No skills listed</span>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
            {/* Scores */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><Award size={18} className="text-primary" /> AI Scores</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Resume', score: resumeScore },
                  { label: 'Interview', score: interviewScore },
                  { label: 'Overall', score: overall },
                ].map((s) => (
                  <div key={s.label} className="text-center p-4 rounded-lg bg-muted/50">
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                      className={`text-3xl font-display font-bold ${s.score >= 80 ? 'text-success' : s.score >= 60 ? 'text-warning' : 'text-destructive'}`}
                    >
                      {s.score}
                    </motion.p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label} Score</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-3">Decision</h3>
              <div className="mt-4 flex gap-3">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => updateAppStatus('shortlisted')} className="px-4 py-2 rounded-lg bg-success/10 text-success text-sm font-medium">Shortlist</motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => updateAppStatus('review')} className="px-4 py-2 rounded-lg bg-warning/10 text-warning text-sm font-medium">Hold</motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => updateAppStatus('rejected')} className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">Reject</motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
