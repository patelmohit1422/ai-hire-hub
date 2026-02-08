import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Lock } from 'lucide-react';

export default function RecruiterSettings() {
  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your recruiter profile and preferences</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
          {[
            { icon: <User size={18} />, title: 'Profile', fields: [
              { label: 'Full Name', value: 'Sarah Recruiter', type: 'text' },
              { label: 'Company', value: 'TechCorp Inc.', type: 'text' },
              { label: 'Email', value: 'sarah@techcorp.com', type: 'email' },
            ]},
            { icon: <Bell size={18} />, title: 'Notifications', fields: [
              { label: 'New Application Alerts', value: 'enabled', type: 'toggle' },
              { label: 'Interview Reminders', value: 'enabled', type: 'toggle' },
            ]},
          ].map((section, i) => (
            <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2 text-primary">{section.icon} {section.title}</h3>
              <div className="space-y-4">
                {section.fields.map(f => (
                  <div key={f.label}>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{f.label}</label>
                    {f.type === 'toggle' ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-5 rounded-full cursor-pointer ${f.value === 'enabled' ? 'bg-primary' : 'bg-muted'}`}>
                          <div className={`w-4 h-4 rounded-full bg-foreground mt-0.5 transition-transform ${f.value === 'enabled' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="text-sm text-muted-foreground capitalize">{f.value}</span>
                      </div>
                    ) : (
                      <input type={f.type} defaultValue={f.value} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
