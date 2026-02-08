import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Brain, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for trying out the platform',
    features: ['5 AI Interviews/month', 'Basic Resume Parsing', 'Email Support', '1 Job Posting', 'Basic Analytics'],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$49',
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
  return (
    <div className="min-h-screen bg-gradient-hero py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Nav */}
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50 glass-strong"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Brain size={18} className="text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">HireAI</span>
            </Link>
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
          </div>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16 pt-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Simple, Transparent <span className="text-gradient-primary">Pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Choose the plan that fits your hiring needs. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
                plan.popular
                  ? 'border-primary/40 bg-card shadow-glow'
                  : 'border-border bg-card shadow-card hover:shadow-glow'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-display font-bold text-lg text-foreground">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.desc}</p>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth?mode=register">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                      : 'border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {plan.cta} <ArrowRight size={16} />
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
