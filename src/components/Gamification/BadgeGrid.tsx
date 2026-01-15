'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { Badge } from './types';

interface BadgeGridProps {
  badges: Badge[];
}

// Compact horizontal badge display
export function BadgeGrid({ badges }: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Complete missions to earn badges!
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          className={cn(
            'size-8 rounded-lg flex items-center justify-center text-sm',
            'border transition-all',
            badge.earned
              ? 'bg-gold/10 border-gold/30'
              : 'bg-muted/50 border-border opacity-40 grayscale'
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
          title={badge.name}
        >
          {badge.icon}
        </motion.div>
      ))}
    </div>
  );
}
