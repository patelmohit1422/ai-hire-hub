import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AppProgress {
  id: string;
  jobTitle: string;
  status: string;
  progress: number;
  skills: string[];
}

function getProgressFromStatus(status: string): number {
  switch (status) {
    case 'pending': return 20;
    case 'interviewing': return 50;
    case 'review': return 70;
    case 'shortlisted': return 100;
    case 'rejected': return 60;
    default: return 10;
  }
}

function getStageLabel(status: string): string {
  switch (status) {
    case 'pending': return 'Application Sent';
    case 'interviewing': return 'Interview In Progress';
    case 'review': return 'Under Review';
    case 'shortlisted': return 'Shortlisted';
    case 'rejected': return 'Rejected';
    default: return 'Applied';
  }
}

export default function CandidateProgress() {
  const { profile } = useAuth();
  const [applications, setApplications] = useState<AppProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeSkills, setResumeSkills] = useState<string[]>([]);

  useEffect(() => {
    if (profile?.id) fetchProgress();
  }, [profile?.id]);

  async function fetchProgress() {
    setLoading(true);

    // Fetch candidate's resume skills
    setResumeSkills(profile?.resume_skills || []);

    // Fetch applications with job data
    const { data } = await supabase
      .from('applications')
      .select('id, status, jobs(title, skills)')
      .eq('candidate_id', profile!.id)
      .order('created_at', { ascending: false });

    if (data) {
      const mapped: AppProgress[] = data.map((app: any) => {
        // Show only skills from candidate's resume that overlap with this job
        const jobSkills: string[] = app.jobs?.skills || [];
        const candidateSkills: string[] = profile?.resume_skills || [];
        const relevantSkills = candidateSkills.filter((s: string) =>
          jobSkills.some((js: string) => js.toLowerCase() === s.toLowerCase())
        ).slice(0, 4);

        return {
          id: app.id,
          jobTitle: app.jobs?.title || 'Unknown Job',
          status: app.status,
          progress: getProgressFromStatus(app.status),
          skills: relevantSkills.length > 0 ? relevantSkills : candidateSkills.slice(0, 4),
        };
      });
      setApplications(mapped);
    }
    setLoading(false);
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

  return (
    <DashboardLayout role="candidate">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <TrendingUp size={24} className="text-primary" /> Application Progress
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track every application's status in real-time</p>
        </div>

        {/* Resume Skills Summary */}
        {resumeSkills.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <p className="text-xs font-medium text-muted-foreground mb-2">Your Resume Skills</p>
            <div className="flex flex-wrap gap-1">
              {resumeSkills.slice(0, 8).map(s => (
                <span key={s} className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <TrendingUp size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No applications yet</p>
            <p className="text-sm mt-1">Apply to jobs to track your progress</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-sm">{app.jobTitle}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {app.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                    app.status === 'shortlisted' ? 'bg-success/10 text-success' :
                    app.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                    app.status === 'review' ? 'bg-info/10 text-info' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {app.status === 'shortlisted' && <CheckCircle size={12} />}
                    {app.status === 'rejected' && <XCircle size={12} />}
                    {(app.status === 'review' || app.status === 'pending' || app.status === 'interviewing') && <Clock size={12} />}
                    {getStageLabel(app.status)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${app.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                    className={`h-full rounded-full ${
                      app.status === 'rejected' ? 'bg-destructive' :
                      app.status === 'shortlisted' ? 'bg-success' :
                      'bg-gradient-primary'
                    }`}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Applied</span>
                  <span className="text-xs text-muted-foreground">Screening</span>
                  <span className="text-xs text-muted-foreground">Interview</span>
                  <span className="text-xs text-muted-foreground">Decision</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
