'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  streak: number;
  isNewCheckIn?: boolean;
  className?: string;
}

// Compact inline streak display - just "fire 1 day streak" in a small pill
export function StreakCounter({ streak, isNewCheckIn, className }: StreakCounterProps) {
  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
        streak > 0 ? 'bg-terracotta/10' : 'bg-muted',
        className
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        className="text-base"
        animate={isNewCheckIn ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {String.fromCodePoint(0x1f525)}
      </motion.span>
      <span className={cn(
        'text-sm font-semibold tabular-nums',
        streak > 0 ? 'text-terracotta' : 'text-muted-foreground'
      )}>
        {streak > 0 ? `${streak} day${streak > 1 ? 's' : ''}` : 'Start streak!'}
      </span>
    </motion.div>
  );
}
