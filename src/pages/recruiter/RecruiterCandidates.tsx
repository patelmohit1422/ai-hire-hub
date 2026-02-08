import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Mail, MapPin, Award, FileText, Briefcase } from 'lucide-react';

const candidate = {
  name: 'Alice Johnson',
  email: 'alice@example.com',
  location: 'San Francisco, CA',
  role: 'Senior React Developer',
  resumeScore: 85,
  interviewScore: 89,
  overall: 87,
  skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker'],
  education: 'B.S. Computer Science — Stanford University (2020)',
  experience: '5 years in full-stack web development',
  aiSummary: 'Strong technical skills with excellent communication. Demonstrated leadership in previous roles. Resume shows consistent career growth. Interview responses were articulate and well-structured. Recommended for shortlisting.',
};

export default function RecruiterCandidates() {
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
              <div className="w-20 h-20 rounded-full bg-gradient-primary mx-auto flex items-center justify-center text-2xl font-bold text-primary-foreground mb-3">AJ</div>
              <h2 className="font-display font-bold text-foreground text-lg">{candidate.name}</h2>
              <p className="text-sm text-muted-foreground">{candidate.role}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail size={14} /> {candidate.email}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin size={14} /> {candidate.location}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Briefcase size={14} /> {candidate.experience}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><FileText size={14} /> {candidate.education}</div>
            </div>
            <div className="mt-6">
              <p className="text-xs font-medium text-muted-foreground mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map(s => (
                  <span key={s} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
            {/* Scores */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><Award size={18} className="text-primary" /> AI Scores</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Resume', score: candidate.resumeScore },
                  { label: 'Interview', score: candidate.interviewScore },
                  { label: 'Overall', score: candidate.overall },
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

            {/* AI Summary */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-3">AI Recommendation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{candidate.aiSummary}</p>
              <div className="mt-4 flex gap-3">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 rounded-lg bg-success/10 text-success text-sm font-medium">Shortlist</motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 rounded-lg bg-warning/10 text-warning text-sm font-medium">Hold</motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">Reject</motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
