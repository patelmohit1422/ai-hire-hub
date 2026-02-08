import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Upload, User, FileText, Award, Plus } from 'lucide-react';

export default function CandidateProfile() {
  return (
    <DashboardLayout role="candidate">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Profile & Resume</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your profile and upload your resume</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-primary mx-auto flex items-center justify-center text-2xl font-bold text-primary-foreground mb-3"><User size={32} /></div>
              <h2 className="font-display font-bold text-foreground">John Doe</h2>
              <p className="text-sm text-muted-foreground">Full Stack Developer</p>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground">john@example.com</span></div>
              <div><span className="text-muted-foreground">Location:</span> <span className="text-foreground">New York, NY</span></div>
              <div><span className="text-muted-foreground">Experience:</span> <span className="text-foreground">4 years</span></div>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} className="w-full mt-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors">
              Edit Profile
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
            {/* Resume Upload */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><Upload size={18} className="text-primary" /> Resume</h3>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-foreground font-medium">Drop your resume here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX (max 5MB)</p>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20 flex items-center gap-3">
                <FileText size={18} className="text-success" />
                <div>
                  <p className="text-sm font-medium text-foreground">john_doe_resume.pdf</p>
                  <p className="text-xs text-muted-foreground">Uploaded Jan 28, 2026 • AI Parsed ✓</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><Award size={18} className="text-primary" /> Parsed Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'GraphQL', 'REST APIs', 'Git', 'CI/CD'].map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">{s}</span>
                ))}
                <button className="px-3 py-1.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors flex items-center gap-1">
                  <Plus size={12} /> Add Skill
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
