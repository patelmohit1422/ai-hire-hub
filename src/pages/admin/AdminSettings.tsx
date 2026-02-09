import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Settings, Bell, Globe, Lock, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SettingField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'toggle' | 'number';
  value: string;
}

interface SettingSection {
  icon: React.ReactNode;
  title: string;
  fields: SettingField[];
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value');

      if (error) {
        console.error('Settings fetch error:', error);
        setLoading(false);
        return;
      }

      const map: Record<string, string> = {};
      (data || []).forEach(s => {
        // Parse JSON value, strip quotes from strings
        try {
          const parsed = JSON.parse(JSON.stringify(s.value));
          map[s.key] = typeof parsed === 'string' ? parsed : String(parsed);
        } catch {
          map[s.key] = String(s.value);
        }
      });
      setSettings(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function updateSetting(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  async function saveSettings() {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        const jsonValue = isNaN(Number(value)) 
          ? (value === 'true' || value === 'false' ? JSON.parse(value) : value)
          : Number(value);
          
        await supabase
          .from('system_settings')
          .update({ value: jsonValue as any })
          .eq('key', key);
      }
      toast.success('Settings saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  const getValue = (key: string, fallback: string = '') => settings[key] ?? fallback;

  const sections: SettingSection[] = [
    {
      icon: <Globe size={18} />,
      title: 'General',
      fields: [
        { key: 'platform_name', label: 'Platform Name', value: getValue('platform_name', 'HireAI'), type: 'text' },
        { key: 'support_email', label: 'Support Email', value: getValue('support_email', 'support@hireai.com'), type: 'email' },
      ],
    },
    {
      icon: <Bell size={18} />,
      title: 'Notifications',
      fields: [
        { key: 'email_notifications', label: 'Email Notifications', value: getValue('email_notifications', 'true'), type: 'toggle' },
        { key: 'new_application_alerts', label: 'New Application Alerts', value: getValue('new_application_alerts', 'true'), type: 'toggle' },
      ],
    },
    {
      icon: <Lock size={18} />,
      title: 'Security',
      fields: [
        { key: 'two_factor_auth', label: 'Two-Factor Auth', value: getValue('two_factor_auth', 'false'), type: 'toggle' },
        { key: 'session_timeout', label: 'Session Timeout (min)', value: getValue('session_timeout', '30'), type: 'number' },
        { key: 'ai_interview_enabled', label: 'AI Interview Feature', value: getValue('ai_interview_enabled', 'true'), type: 'toggle' },
      ],
    },
    {
      icon: <Settings size={18} />,
      title: 'Scoring & Interview',
      fields: [
        { key: 'default_question_time', label: 'Default Time per Question (sec)', value: getValue('default_question_time', '120'), type: 'number' },
        { key: 'max_questions', label: 'Max Questions per Interview', value: getValue('max_questions', '10'), type: 'number' },
        { key: 'resume_weight', label: 'Resume Weight (%)', value: getValue('resume_weight', '40'), type: 'number' },
        { key: 'interview_weight', label: 'Interview Weight (%)', value: getValue('interview_weight', '60'), type: 'number' },
      ],
    },
  ];

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">System Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Configure platform behavior</p>
          </div>
          <motion.button
            whileHover={{ scale: saving ? 1 : 1.03 }}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            disabled={saving}
            onClick={saveSettings}
            className="px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : (
              <><CheckCircle size={16} /> Save Settings</>
            )}
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
          {sections.map((section, i) => (
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
                  <div key={field.key}>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{field.label}</label>
                    {field.type === 'toggle' ? (
                      <div className="flex items-center gap-2">
                        <div
                          onClick={() => updateSetting(field.key, field.value === 'true' ? 'false' : 'true')}
                          className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${field.value === 'true' ? 'bg-primary' : 'bg-muted'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-foreground mt-0.5 transition-transform ${field.value === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="text-sm text-muted-foreground">{field.value === 'true' ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) => updateSetting(field.key, e.target.value)}
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
