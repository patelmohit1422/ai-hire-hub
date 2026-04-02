import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Brain, ArrowRight, ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Perfect for trying out the platform',
    features: ['5 AI Interviews/month', 'Basic Resume Parsing', 'Email Support', '1 Job Posting', 'Basic Analytics'],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹3,999',
    period: '/month',
    desc: 'For growing teams and recruiters',
    features: ['Unlimited Interviews', 'Advanced Resume AI', 'Priority Support', '25 Job Postings', 'Full Analytics & Reports', 'Candidate Comparison', 'Team Collaboration'],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large organizations',
    features: ['Everything in Pro', 'Custom Scoring Rules', 'SSO & SAML Auth', 'Unlimited Postings', 'Dedicated Account Manager', 'API Access', 'Custom Integrations', 'SLA Guarantee'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Nav */}
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50 glass-strong"
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <ArrowLeft size={15} className="text-muted-foreground" />
              </button>
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Brain size={17} className="text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg text-foreground tracking-tight">HireAI</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            </div>
          </div>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16 pt-16"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Simple, transparent <span className="font-serif-display text-primary">pricing</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto">
            Choose the plan that fits your hiring needs. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`relative rounded-xl border p-7 flex flex-col transition-colors duration-300 ${
                plan.popular
                  ? 'border-primary/30 bg-card'
                  : 'border-border bg-card hover:border-primary/15'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-foreground">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground tracking-tight">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.desc}</p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check size={15} className="text-primary mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth?mode=register">
                <button
                  className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'border border-border text-foreground hover:bg-muted/60'
                  }`}
                >
                  {plan.cta} <ArrowRight size={14} />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
