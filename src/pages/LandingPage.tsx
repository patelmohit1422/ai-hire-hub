import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Shield, BarChart3, Users, Zap, Clock, CheckCircle2, Star, FileText, MessageSquare, Award, Menu, X } from 'lucide-react';
import HeroScene from '@/components/HeroScene';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react';

const features = [
  { icon: <Brain size={22} />, title: 'AI Resume Parsing', desc: 'Extract skills, experience, and education automatically from any resume format.' },
  { icon: <Zap size={22} />, title: 'Smart Interviews', desc: 'Role-based AI-generated questions with timed responses and evaluation.' },
  { icon: <BarChart3 size={22} />, title: 'Data-Driven Scoring', desc: 'Objective candidate scoring combining resume analysis and interview performance.' },
  { icon: <Shield size={22} />, title: 'Bias Reduction', desc: 'Structured evaluation criteria that minimize unconscious bias in hiring.' },
  { icon: <Users size={22} />, title: 'Team Collaboration', desc: 'Recruiters can compare, discuss, and make decisions on a shared platform.' },
  { icon: <Clock size={22} />, title: 'Time Savings', desc: 'Automate screening to reduce time-to-hire by up to 70%.' },
];

const stats = [
  { value: '10K+', label: 'Interviews Conducted' },
  { value: '95%', label: 'Accuracy Rate' },
  { value: '70%', label: 'Time Saved' },
  { value: '500+', label: 'Companies Trust Us' },
];

const steps = [
  { icon: <FileText size={24} />, step: '01', title: 'Post a Job', desc: 'Define the role, skills required, and evaluation criteria in minutes.' },
  { icon: <Users size={24} />, step: '02', title: 'Candidates Apply', desc: 'Applicants submit their resumes and complete AI-powered interviews.' },
  { icon: <MessageSquare size={24} />, step: '03', title: 'AI Evaluates', desc: 'Our AI scores candidates based on resume match and interview responses.' },
  { icon: <Award size={24} />, step: '04', title: 'Hire the Best', desc: 'Compare scores, review insights, and make confident hiring decisions.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'HR Director, TechNova', quote: 'HireAI reduced our screening time by 65%. The AI interviews are remarkably accurate at identifying top talent.' },
  { name: 'Rahul Mehta', role: 'CTO, CloudStack', quote: 'The bias reduction features give us confidence that we\'re evaluating candidates fairly and objectively.' },
  { name: 'Ananya Desai', role: 'Talent Lead, ScaleUp', quote: 'Finally, a hiring tool that actually understands technical roles. The scoring system is incredibly insightful.' },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain size={17} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground tracking-tight">HireAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            <ThemeToggle />
            <Link to="/auth?mode=register">
              <button className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </Link>
          </div>
          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-muted transition-colors">
              {mobileMenuOpen ? <X size={20} className="text-foreground" /> : <Menu size={20} className="text-foreground" />}
            </button>
          </div>
        </div>
        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border bg-background"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2">Features</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2">How It Works</a>
                <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2">Pricing</Link>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2">Login</Link>
                <Link to="/auth?mode=register" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                    Get Started
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero">
        <HeroScene />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-medium bg-primary/8 text-primary border border-primary/15 mb-8">
              AI-Powered Hiring Platform
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              <span className="text-foreground">Hire smarter with</span>
              <br />
              <span className="font-serif-display text-primary">AI intelligence</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              Automate resume screening, conduct AI-assisted interviews, and make data-driven hiring decisions — all on one platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?mode=register">
                <button className="px-7 py-3 rounded-lg bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
                  Start Free Trial <ArrowRight size={16} />
                </button>
              </Link>
              <Link to="/pricing">
                <button className="px-7 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted/60 transition-colors">
                  View Pricing
                </button>
              </Link>
            </div>
            {/* Trust badges */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs"><CheckCircle2 size={13} className="text-primary/70" /> No credit card required</div>
              <div className="flex items-center gap-1.5 text-xs"><CheckCircle2 size={13} className="text-primary/70" /> 14-day free trial</div>
              <div className="flex items-center gap-1.5 text-xs"><CheckCircle2 size={13} className="text-primary/70" /> Cancel anytime</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-primary mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Powerful features for <span className="font-serif-display text-primary">modern hiring</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Everything you need to transform your hiring process from manual to intelligent.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/20 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center text-primary mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-primary mb-3">Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              How it works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Get started in four simple steps. From job posting to making your hire.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-xl border border-border bg-card p-6 text-center"
              >
                <span className="text-4xl font-bold text-muted-foreground/15 absolute top-3 right-4 select-none">{s.step}</span>
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center text-primary mx-auto mb-4">
                  {s.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-accent mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Loved by hiring teams
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              See what industry leaders say about transforming their hiring with HireAI.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={13} className="text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 tracking-tight">
              Ready to transform <span className="font-serif-display text-primary">your hiring?</span>
            </h2>
            <p className="text-muted-foreground text-base mb-10 max-w-md mx-auto leading-relaxed">
              Join 500+ companies already making smarter, faster, and fairer hiring decisions with HireAI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?mode=register">
                <button className="px-7 py-3 rounded-lg bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
                  Get Started for Free <ArrowRight size={16} />
                </button>
              </Link>
              <Link to="/pricing">
                <button className="px-7 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted/60 transition-colors">
                  See Plans & Pricing
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Role CTAs */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 tracking-tight"
          >
            Explore the platform
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { role: 'Candidate', path: '/candidate', desc: 'Apply to jobs, take AI interviews, and track your progress.' },
              { role: 'Recruiter', path: '/recruiter', desc: 'Post jobs, review candidates, and make data-driven decisions.' },
              { role: 'Admin', path: '/admin', desc: 'Manage users, configure scoring rules, and view analytics.' },
            ].map((item, i) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={item.path} className="block rounded-xl border border-border bg-card p-7 hover:border-primary/25 transition-colors duration-300 group">
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{item.role}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{item.desc}</p>
                  <span className="flex items-center gap-1.5 text-primary text-sm font-medium">
                    Enter Dashboard <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Brain size={13} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-sm">HireAI</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 HireAI. AI-powered hiring for the future.</p>
          <div className="flex items-center gap-6">
            <Link to="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/auth" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
