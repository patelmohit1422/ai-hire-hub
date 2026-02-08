import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, MessageSquare, AlertCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const questions = [
  { q: 'Explain the difference between useMemo and useCallback in React.', time: 120 },
  { q: 'How would you design a scalable REST API for a social media platform?', time: 120 },
  { q: 'Describe a challenging bug you fixed and your debugging approach.', time: 120 },
  { q: 'What are the SOLID principles? Give an example of each.', time: 120 },
  { q: 'How do you ensure code quality and maintainability in a team?', time: 120 },
];

export default function CandidateInterview() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  if (!started) {
    return (
      <DashboardLayout role="candidate">
        <div className="max-w-2xl mx-auto space-y-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-6">
              <PlayCircle size={36} className="text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">AI Interview</h1>
            <p className="text-muted-foreground">Senior React Developer at TechCorp</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <AlertCircle size={18} className="text-warning" /> Instructions
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><ChevronRight size={14} className="text-primary mt-0.5" /> You'll answer {questions.length} AI-generated questions</li>
              <li className="flex items-start gap-2"><ChevronRight size={14} className="text-primary mt-0.5" /> Each question has a 2-minute time limit</li>
              <li className="flex items-start gap-2"><ChevronRight size={14} className="text-primary mt-0.5" /> Type your answers in the provided text area</li>
              <li className="flex items-start gap-2"><ChevronRight size={14} className="text-primary mt-0.5" /> You cannot go back to previous questions</li>
              <li className="flex items-start gap-2"><ChevronRight size={14} className="text-primary mt-0.5" /> AI will evaluate your responses after submission</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStarted(true)}
              className="px-8 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow flex items-center gap-2 mx-auto"
            >
              Start Interview <PlayCircle size={18} />
            </motion.button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="candidate">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
          <div className="flex items-center gap-2 text-sm font-medium text-warning">
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
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare size={16} className="text-primary" />
            </div>
            <p className="text-foreground font-medium">{questions[currentQ].q}</p>
          </div>
          <textarea
            placeholder="Type your answer here..."
            className="w-full h-40 px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </motion.div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => currentQ < questions.length - 1 && setCurrentQ(currentQ + 1)}
            className="px-6 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow flex items-center gap-2"
          >
            {currentQ < questions.length - 1 ? 'Next Question' : 'Submit Interview'} <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>
    </DashboardLayout>
  );
}
