import { motion } from 'framer-motion';

function FloatingShape({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: string; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(80px)',
        opacity: 0.12,
      }}
      animate={{
        y: [0, -20, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function SubtleGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.025]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground) / 0.4) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground) / 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <SubtleGrid />
      <FloatingShape delay={0} x="5%" y="20%" size="500px" color="hsl(162 50% 45%)" />
      <FloatingShape delay={3} x="65%" y="55%" size="400px" color="hsl(252 40% 55%)" />
      <FloatingShape delay={5} x="45%" y="5%" size="300px" color="hsl(190 45% 48%)" />
      
      {/* Radial fade to background */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent, hsl(var(--background)))',
      }} />
    </div>
  );
}
