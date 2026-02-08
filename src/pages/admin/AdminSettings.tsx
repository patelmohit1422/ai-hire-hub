import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Settings, Bell, Globe, Lock } from 'lucide-react';

export default function AdminSettings() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">System Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure platform behavior</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
          {[
            { icon: <Globe size={18} />, title: 'General', fields: [
              { label: 'Platform Name', value: 'HireAI', type: 'text' },
              { label: 'Support Email', value: 'support@hireai.com', type: 'email' },
            ]},
            { icon: <Bell size={18} />, title: 'Notifications', fields: [
              { label: 'Email Notifications', value: 'enabled', type: 'toggle' },
              { label: 'New Application Alerts', value: 'enabled', type: 'toggle' },
            ]},
            { icon: <Lock size={18} />, title: 'Security', fields: [
              { label: 'Two-Factor Auth', value: 'disabled', type: 'toggle' },
              { label: 'Session Timeout (min)', value: '30', type: 'text' },
            ]},
            { icon: <Settings size={18} />, title: 'Interview Settings', fields: [
              { label: 'Default Time per Question (sec)', value: '120', type: 'text' },
              { label: 'Max Questions per Interview', value: '10', type: 'text' },
            ]},
          ].map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2 text-primary">
                {section.icon} {section.title}
              </h3>
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.label}>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{field.label}</label>
                    {field.type === 'toggle' ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${field.value === 'enabled' ? 'bg-primary' : 'bg-muted'}`}>
                          <div className={`w-4 h-4 rounded-full bg-foreground mt-0.5 transition-transform ${field.value === 'enabled' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="text-sm text-muted-foreground capitalize">{field.value}</span>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        defaultValue={field.value}
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
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
