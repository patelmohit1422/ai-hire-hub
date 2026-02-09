import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, MessageSquare, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Question {
  q: string;
  time: number;
  category?: string;
}

export default function CandidateInterview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('app');
  const { profile } = useAuth();

  const [started, setStarted] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [jobTitle, setJobTitle] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>(applicationId);

  // Fetch candidate's applications that are pending/interviewing
  useEffect(() => {
    if (profile?.id) {
      fetchApplications();
    }
  }, [profile?.id]);

  async function fetchApplications() {
    const { data } = await supabase
      .from('applications')
      .select('id, status, jobs(id, title, skills, description, experience_level)')
      .eq('candidate_id', profile!.id)
      .in('status', ['pending', 'interviewing']);
    
    if (data) setApplications(data);
    if (data && data.length > 0 && !selectedApp) {
      setSelectedApp(data[0].id);
    }
  }

  // Timer
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft, currentQ]);

  // Auto-advance when time runs out
  useEffect(() => {
    if (timeLeft === 0 && started) {
      handleNext();
    }
  }, [timeLeft]);

  async function startInterview() {
    if (!selectedApp) {
      toast.error('Please select an application');
      return;
    }
    setGenerating(true);

    const app = applications.find(a => a.id === selectedApp);
    if (app?.jobs) {
      setJobTitle(app.jobs.title);
    }

    try {
      const { data, error } = await supabase.functions.invoke('generate-questions', {
        body: { application_id: selectedApp },
      });

      if (error || data?.error) {
        toast.error(data?.error || error?.message || 'Failed to generate questions');
        setGenerating(false);
        return;
      }

      setInterviewId(data.interview_id);
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(''));
      setTimeLeft(data.questions[0]?.time || 120);
      setStarted(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to start interview');
    } finally {
      setGenerating(false);
    }
  }

  function handleAnswerChange(text: string) {
    const newAnswers = [...answers];
    newAnswers[currentQ] = text;
    setAnswers(newAnswers);
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setTimeLeft(questions[currentQ + 1]?.time || 120);
    } else {
      submitInterview();
    }
  }

  async function submitInterview() {
    if (!interviewId) return;
    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('calculate-scores', {
        body: { interview_id: interviewId, answers },
      });

      if (error || data?.error) {
        toast.error(data?.error || error?.message || 'Failed to calculate scores');
        setSubmitting(false);
        return;
      }

      toast.success('Interview submitted! Viewing your results...');
      navigate(`/candidate/results?interview=${interviewId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  }

  // Pre-interview screen
  if (!started) {
    return (
      <DashboardLayout role="candidate">
        <div className="max-w-2xl mx-auto space-y-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-6">
              <PlayCircle size={36} className="text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">AI Interview</h1>
            <p className="text-muted-foreground">Answer skill-based questions generated from your resume & job requirements</p>
          </motion.div>

          {/* Application Selection */}
          {applications.length > 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-3">Select Application</h3>
              <div className="space-y-2">
                {applications.map(app => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedApp === app.id
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground">{app.jobs?.title || 'Unknown Job'}</p>
                    <p className="text-xs text-muted-foreground capitalize">Status: {app.status}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-card text-center">
              <p className="text-muted-foreground">No pending applications found. Apply to a job first!</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate('/candidate/jobs')}
                className="mt-4 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow"
              >
                Browse Jobs
              </motion.button>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <AlertCircle size={18} className="text-warning" /> Instructions
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><ChevronRight size={14} className="text-primary mt-0.5" /> AI generates questions based on your resume skills & job requirements</li>
              <li className="flex items-start gap-2"><ChevronRight size={14} className="text-primary mt-0.5" /> Each question has a timed response window</li>
              <li className="flex items-start gap-2"><ChevronRight size={14} className="text-primary mt-0.5" /> Type your answers in the provided text area</li>
              <li className="flex items-start gap-2"><ChevronRight size={14} className="text-primary mt-0.5" /> You cannot go back to previous questions</li>
              <li className="flex items-start gap-2"><ChevronRight size={14} className="text-primary mt-0.5" /> AI will evaluate your responses and generate scores</li>
            </ul>
          </motion.div>

          {applications.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center">
              <motion.button
                whileHover={{ scale: generating ? 1 : 1.05 }}
                whileTap={{ scale: generating ? 1 : 0.95 }}
                disabled={generating || !selectedApp}
                onClick={startInterview}
                className="px-8 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow flex items-center gap-2 mx-auto disabled:opacity-60"
              >
                {generating ? (
                  <><Loader2 size={18} className="animate-spin" /> Generating Questions...</>
                ) : (
                  <>Start Interview <PlayCircle size={18} /></>
                )}
              </motion.button>
            </motion.div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // Active interview
  return (
    <DashboardLayout role="candidate">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
            {jobTitle && <p className="text-xs text-primary">{jobTitle}</p>}
          </div>
          <div className={`flex items-center gap-2 text-sm font-medium ${timeLeft <= 30 ? 'text-destructive' : 'text-warning'}`}>
            <Clock size={14} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            className="h-full rounded-full bg-gradient-primary"
            transition={{ duration: 0.5 }}
          />
        </div>

        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <div className="flex items-start gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-foreground font-medium">{questions[currentQ]?.q}</p>
              {questions[currentQ]?.category && (
                <span className="text-xs text-muted-foreground capitalize mt-1 inline-block">{questions[currentQ].category.replace('_', ' ')}</span>
              )}
            </div>
          </div>
          <textarea
            value={answers[currentQ] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full h-40 px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none mt-4"
          />
        </motion.div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: submitting ? 1 : 1.03 }}
            whileTap={{ scale: submitting ? 1 : 0.97 }}
            disabled={submitting}
            onClick={handleNext}
            className="px-6 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow flex items-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> Submitting...</>
            ) : currentQ < questions.length - 1 ? (
              <>Next Question <ChevronRight size={16} /></>
            ) : (
              <>Submit Interview <ChevronRight size={16} /></>
            )}
          </motion.button>
        </div>
      </div>
    </DashboardLayout>
  );
}
