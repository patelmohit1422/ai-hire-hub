import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Award, MessageSquare, TrendingUp, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ScoreData {
  resume_score: number;
  interview_score: number;
  total_score: number;
  status: string;
  feedback: any;
  interview_id: string;
}

export default function CandidateResults() {
  const [searchParams] = useSearchParams();
  const interviewParam = searchParams.get('interview');
  const { profile } = useAuth();
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [selectedScore, setSelectedScore] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobTitles, setJobTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile?.id) fetchScores();
  }, [profile?.id]);

  async function fetchScores() {
    setLoading(true);
    try {
      // Fetch all interviews for this candidate
      const { data: apps } = await supabase
        .from('applications')
        .select('id, job_id, jobs(title)')
        .eq('candidate_id', profile!.id);

      if (!apps || apps.length === 0) {
        setLoading(false);
        return;
      }

      const appIds = apps.map(a => a.id);
      const titleMap: Record<string, string> = {};

      const { data: interviews } = await supabase
        .from('interviews')
        .select('id, application_id')
        .in('application_id', appIds)
        .eq('status', 'completed');

      if (!interviews || interviews.length === 0) {
        setLoading(false);
        return;
      }

      // Map interview to job title
      interviews.forEach(i => {
        const app = apps.find(a => a.id === i.application_id);
        if (app?.jobs) titleMap[i.id] = (app.jobs as any).title;
      });
      setJobTitles(titleMap);

      const interviewIds = interviews.map(i => i.id);
      const { data: scoreData } = await supabase
        .from('scores')
        .select('*')
        .in('interview_id', interviewIds)
        .order('created_at', { ascending: false });

      if (scoreData) {
        const mapped = scoreData.map(s => ({
          resume_score: Number(s.resume_score),
          interview_score: Number(s.interview_score),
          total_score: Number(s.total_score),
          status: s.status,
          feedback: s.feedback,
          interview_id: s.interview_id,
        }));
        setScores(mapped);

        // Auto-select the one from URL param or first
        if (interviewParam) {
          const found = mapped.find(s => s.interview_id === interviewParam);
          setSelectedScore(found || mapped[0]);
        } else {
          setSelectedScore(mapped[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="candidate">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!selectedScore) {
    return (
      <DashboardLayout role="candidate">
        <div className="text-center py-20 text-muted-foreground">
          <AlertCircle size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No results available yet</p>
          <p className="text-sm mt-1">Complete an interview to see your scores</p>
        </div>
      </DashboardLayout>
    );
  }

  const questionFeedback = selectedScore.feedback?.question_feedback || [];
  const resumeDetails = selectedScore.feedback?.resume_details || {};
  const jobTitle = jobTitles[selectedScore.interview_id] || 'Interview';

  return (
    <DashboardLayout role="candidate">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Interview Results</h1>
          <p className="text-sm text-muted-foreground mt-1">Your AI-evaluated performance and feedback</p>
        </div>

        {/* Score selector if multiple */}
        {scores.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {scores.map(s => (
              <button
                key={s.interview_id}
                onClick={() => setSelectedScore(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedScore.interview_id === s.interview_id
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                {jobTitles[s.interview_id] || 'Interview'} — {s.total_score}%
              </button>
            ))}
          </div>
        )}

        {/* Score overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Award size={18} className="text-primary" /> {jobTitle}
            </h3>
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${
              selectedScore.status === 'passed' ? 'bg-success/10 text-success' :
              selectedScore.status === 'needs_improvement' ? 'bg-destructive/10 text-destructive' :
              'bg-warning/10 text-warning'
            }`}>
              {selectedScore.status.replace('_', ' ')}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Resume Score', score: selectedScore.resume_score, color: 'text-success' },
              { label: 'Interview Score', score: selectedScore.interview_score, color: 'text-info' },
              { label: 'Overall Score', score: selectedScore.total_score, color: 'text-primary' },
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

        {/* Resume Analysis */}
        {resumeDetails.matching_skills && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Resume Analysis
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Matching Skills ({resumeDetails.skill_match_percentage || 0}%)</p>
                <div className="flex flex-wrap gap-1">
                  {(resumeDetails.matching_skills || []).map((s: string) => (
                    <span key={s} className="px-2 py-1 rounded bg-success/10 text-success text-xs font-medium">{s}</span>
                  ))}
                  {(resumeDetails.matching_skills || []).length === 0 && <span className="text-xs text-muted-foreground">None</span>}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Skill Gaps</p>
                <div className="flex flex-wrap gap-1">
                  {(resumeDetails.gap_skills || []).map((s: string) => (
                    <span key={s} className="px-2 py-1 rounded bg-warning/10 text-warning text-xs font-medium">{s}</span>
                  ))}
                  {(resumeDetails.gap_skills || []).length === 0 && <span className="text-xs text-muted-foreground">None — great match!</span>}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Question-by-Question Feedback */}
        {questionFeedback.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" /> Question Feedback
            </h3>
            <div className="space-y-4">
              {questionFeedback.map((qf: any, i: number) => (
                <div key={i} className="p-4 rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-foreground flex-1">{qf.question}</p>
                    <span className={`text-sm font-bold ml-4 ${
                      qf.score >= 80 ? 'text-success' : qf.score >= 60 ? 'text-warning' : 'text-destructive'
                    }`}>{qf.score}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${qf.score}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                      className={`h-full rounded-full ${qf.score >= 80 ? 'bg-success' : qf.score >= 60 ? 'bg-warning' : 'bg-destructive'}`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-start gap-1">
                    <CheckCircle size={12} className="mt-0.5 flex-shrink-0 text-primary" />
                    {qf.feedback}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
