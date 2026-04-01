// reusable stat card component for dashboard overview pages
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

export default function StatCard({ title, value, change, icon, trend = 'neutral', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-xl border border-border bg-card p-5 hover:border-primary/15 transition-colors duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1 tracking-tight">{value}</p>
          {change && (
            <p className={`text-xs mt-1 font-medium ${
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {change}
            </p>
          )}
        </div>
        <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}