import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Search, Filter, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AppRow {
  id: string;
  name: string;
  role: string;
  resumeScore: number;
  interviewScore: number;
  overall: number;
  status: string;
  candidateId: string;
}

export default function RecruiterApplications() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (profile?.id) fetchApplications();
  }, [profile?.id]);

  async function fetchApplications() {
    setLoading(true);
    try {
      // Get recruiter's jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('recruiter_id', profile!.id);

      if (!jobs || jobs.length === 0) { setLoading(false); return; }

      const jobIds = jobs.map(j => j.id);
      const jobTitleMap: Record<string, string> = {};
      jobs.forEach(j => { jobTitleMap[j.id] = j.title; });

      // Get applications
      const { data: apps } = await supabase
        .from('applications')
        .select('id, candidate_id, job_id, status')
        .in('job_id', jobIds)
        .order('created_at', { ascending: false });

      if (!apps || apps.length === 0) { setLoading(false); return; }

      const candidateIds = [...new Set(apps.map(a => a.candidate_id))];
      const appIds = apps.map(a => a.id);

      // Get profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', candidateIds);
      const profileMap: Record<string, string> = {};
      (profiles || []).forEach(p => { profileMap[p.id] = p.name; });

      // Get interviews & scores
      const { data: interviews } = await supabase
        .from('interviews')
        .select('id, application_id')
        .in('application_id', appIds);
      
      let scoreMap: Record<string, any> = {};
      if (interviews && interviews.length > 0) {
        const intIds = interviews.map(i => i.id);
        const { data: scores } = await supabase
          .from('scores')
          .select('interview_id, resume_score, interview_score, total_score')
          .in('interview_id', intIds);
        if (scores) {
          scores.forEach(s => {
            const intv = interviews.find(i => i.id === s.interview_id);
            if (intv) scoreMap[intv.application_id] = s;
          });
        }
      }

      const rows: AppRow[] = apps.map(a => {
        const s = scoreMap[a.id];
        return {
          id: a.id,
          name: profileMap[a.candidate_id] || 'Unknown',
          role: jobTitleMap[a.job_id] || 'Unknown',
          resumeScore: s ? Number(s.resume_score) : 0,
          interviewScore: s ? Number(s.interview_score) : 0,
          overall: s ? Number(s.total_score) : 0,
          status: a.status,
          candidateId: a.candidate_id,
        };
      });
      setApplications(rows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = applications.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Candidate Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and manage all applications</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidates..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button className="px-3 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2"><Filter size={14} /> Filter</button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No applications found</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card shadow-card overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Candidate</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Role</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Resume</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Interview</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Overall</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, i) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/recruiter/candidates?id=${app.candidateId}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{app.name.charAt(0)}</div>
                        <span className="text-sm font-medium text-foreground">{app.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.role}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-sm font-bold ${app.resumeScore >= 80 ? 'text-success' : app.resumeScore >= 60 ? 'text-warning' : 'text-destructive'}`}>{app.resumeScore}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-sm font-bold ${app.interviewScore >= 80 ? 'text-success' : app.interviewScore >= 60 ? 'text-warning' : 'text-destructive'}`}>{app.interviewScore}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-foreground">{app.overall}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
                        app.status === 'shortlisted' ? 'bg-success/10 text-success' :
                        app.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                        'bg-warning/10 text-warning'
                      }`}>{app.status}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
