import { motion } from 'framer-motion';

function FloatingOrb({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: string; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-20"
      style={{ left: x, top: y, width: size, height: size, background: color }}
      animate={{
        y: [0, -30, 0],
        scale: [1, 1.1, 1],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{ duration: 6, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(168 80% 50% / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(168 80% 50% / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

function AnimatedLines() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(168 80% 50%)" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(168 80% 50%)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(260 70% 60%)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(260 70% 60%)" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(260 70% 60%)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="hsl(168 80% 50%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.line
        x1="0%" y1="30%" x2="100%" y2="70%"
        stroke="url(#lineGrad1)" strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      <motion.line
        x1="100%" y1="20%" x2="0%" y2="80%"
        stroke="url(#lineGrad2)" strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
      />
      <motion.circle
        cx="50%" cy="50%" r="200"
        fill="none" stroke="hsl(168 80% 50% / 0.05)" strokeWidth="1"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
      <motion.circle
        cx="50%" cy="50%" r="320"
        fill="none" stroke="hsl(260 70% 60% / 0.04)" strokeWidth="1"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.6 }}
      />
    </svg>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <GridPattern />
      <AnimatedLines />
      <FloatingOrb delay={0} x="10%" y="20%" size="400px" color="hsl(168 80% 50%)" />
      <FloatingOrb delay={2} x="70%" y="60%" size="350px" color="hsl(260 70% 60%)" />
      <FloatingOrb delay={4} x="50%" y="10%" size="250px" color="hsl(200 80% 55%)" />
      <FloatingOrb delay={1} x="80%" y="15%" size="200px" color="hsl(168 80% 50%)" />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent, hsl(var(--background)))',
      }} />
    </div>
  );
}
