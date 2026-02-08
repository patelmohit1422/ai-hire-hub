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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-glow transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-display font-bold text-foreground mt-1">{value}</p>
          {change && (
            <p className={`text-xs mt-1 font-medium ${
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {change}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
