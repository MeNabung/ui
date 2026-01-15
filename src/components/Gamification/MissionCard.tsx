'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { Mission } from './types';

interface MissionCardProps {
  mission: Mission;
  onClaim?: () => void;
}

// Compact mission card - single row with icon, title, and progress
export function MissionCard({ mission, onClaim }: MissionCardProps) {
  const progressPercent = Math.min((mission.progress / mission.requirement) * 100, 100);

  return (
    <motion.div
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg border transition-colors',
        mission.completed
          ? 'bg-teal/5 border-teal/20'
          : 'bg-white border-border hover:border-teal/30'
      )}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Icon */}
      <div className={cn(
        'flex-shrink-0 size-8 rounded-md flex items-center justify-center text-sm',
        mission.completed ? 'bg-teal/10' : 'bg-cream'
      )}>
        {mission.completed ? '\u2713' : mission.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-xs font-medium truncate',
          mission.completed ? 'text-teal' : 'text-foreground'
        )}>
          {mission.title}
        </p>
        {!mission.completed && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex-1 h-1 bg-cream-dark rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-teal rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {mission.progress}/{mission.requirement}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
