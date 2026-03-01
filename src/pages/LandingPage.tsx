import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Shield, BarChart3, Users, Zap, Clock, CheckCircle2, Star, FileText, MessageSquare, Award } from 'lucide-react';
import HeroScene from '@/components/HeroScene';

const features = [
  { icon: <Brain size={24} />, title: 'AI Resume Parsing', desc: 'Extract skills, experience, and education automatically from any resume format.' },
  { icon: <Zap size={24} />, title: 'Smart Interviews', desc: 'Role-based AI-generated questions with timed responses and evaluation.' },
  { icon: <BarChart3 size={24} />, title: 'Data-Driven Scoring', desc: 'Objective candidate scoring combining resume analysis and interview performance.' },
  { icon: <Shield size={24} />, title: 'Bias Reduction', desc: 'Structured evaluation criteria that minimize unconscious bias in hiring.' },
  { icon: <Users size={24} />, title: 'Team Collaboration', desc: 'Recruiters can compare, discuss, and make decisions on a shared platform.' },
  { icon: <Clock size={24} />, title: 'Time Savings', desc: 'Automate screening to reduce time-to-hire by up to 70%.' },
];

const stats = [
  { value: '10K+', label: 'Interviews Conducted' },
  { value: '95%', label: 'Accuracy Rate' },
  { value: '70%', label: 'Time Saved' },
  { value: '500+', label: 'Companies Trust Us' },
];

const steps = [
  { icon: <FileText size={28} />, step: '01', title: 'Post a Job', desc: 'Define the role, skills required, and evaluation criteria in minutes.' },
  { icon: <Users size={28} />, step: '02', title: 'Candidates Apply', desc: 'Applicants submit their resumes and complete AI-powered interviews.' },
  { icon: <MessageSquare size={28} />, step: '03', title: 'AI Evaluates', desc: 'Our AI scores candidates based on resume match and interview responses.' },
  { icon: <Award size={28} />, step: '04', title: 'Hire the Best', desc: 'Compare scores, review insights, and make confident hiring decisions.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'HR Director, TechNova', quote: 'HireAI reduced our screening time by 65%. The AI interviews are remarkably accurate at identifying top talent.' },
  { name: 'Rahul Mehta', role: 'CTO, CloudStack', quote: 'The bias reduction features give us confidence that we\'re evaluating candidates fairly and objectively.' },
  { name: 'Ananya Desai', role: 'Talent Lead, ScaleUp', quote: 'Finally, a hiring tool that actually understands technical roles. The scoring system is incredibly insightful.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Brain size={18} className="text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">HireAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            <Link to="/auth?mode=register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero">
        <HeroScene />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
              AI-Powered Hiring Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              <span className="text-foreground">Hire Smarter with</span>
              <br />
              <span className="text-gradient-primary">AI Intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Automate resume screening, conduct AI-assisted interviews, and make data-driven hiring decisions — all on one platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow flex items-center gap-2"
                >
                  Start Free Trial <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                >
                  View Pricing
                </motion.button>
              </Link>
            </div>
            {/* Trust badges */}
            <div className="mt-12 flex items-center justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs"><CheckCircle2 size={14} className="text-primary" /> No credit card required</div>
              <div className="flex items-center gap-1.5 text-xs"><CheckCircle2 size={14} className="text-primary" /> 14-day free trial</div>
              <div className="flex items-center gap-1.5 text-xs"><CheckCircle2 size={14} className="text-primary" /> Cancel anytime</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-display font-bold text-gradient-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mb-4">Features</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Powerful Features for Modern Hiring
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to transform your hiring process from manual to intelligent.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-glow transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-hero">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">Process</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get started in four simple steps. From job posting to making your hire.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative rounded-xl border border-border bg-card p-6 shadow-card text-center group"
              >
                <div className="text-5xl font-display font-bold text-primary/10 absolute top-3 right-4">{s.step}</div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 group-hover:shadow-glow transition-shadow">
                  {s.icon}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mb-4">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Loved by Hiring Teams
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              See what industry leaders say about transforming their hiring with HireAI.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 shadow-card"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-hero">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join 500+ companies already making smarter, faster, and fairer hiring decisions with HireAI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow flex items-center gap-2"
                >
                  Get Started for Free <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                >
                  See Plans & Pricing
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Role CTAs */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-12"
          >
            Explore the Platform
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { role: 'Candidate', path: '/candidate', desc: 'Apply to jobs, take AI interviews, and track your progress.' },
              { role: 'Recruiter', path: '/recruiter', desc: 'Post jobs, review candidates, and make data-driven decisions.' },
              { role: 'Admin', path: '/admin', desc: 'Manage users, configure scoring rules, and view analytics.' },
            ].map((item, i) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <Link to={item.path} className="block rounded-xl border border-border bg-card p-8 shadow-card hover:shadow-glow transition-all duration-300 group">
                  <h3 className="font-display font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">{item.role}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{item.desc}</p>
                  <span className="flex items-center gap-2 text-primary text-sm font-medium">
                    Enter Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Brain size={14} className="text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">HireAI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 HireAI. AI-powered hiring for the future.</p>
          <div className="flex items-center gap-6">
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
