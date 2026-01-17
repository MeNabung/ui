'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { STRATEGY_NAMES } from '@/lib/yields';
import type { YieldComparisonProps } from './types';

// SVG Icons for strategies
const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const DropletIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/**
 * YieldComparison - Visual comparison of strategy yields
 * Shows current APY with optional change indicators
 */
export function YieldComparison({
  yields,
  previousYields,
  allocation,
  detailed = false,
  className,
}: YieldComparisonProps) {
  const strategies = [
    { key: 'thetanuts' as const, allocKey: 'options' as const, Icon: TrendingUpIcon },
    { key: 'aerodrome' as const, allocKey: 'lp' as const, Icon: DropletIcon },
    { key: 'staking' as const, allocKey: 'staking' as const, Icon: LockIcon },
  ];

  // Calculate weighted APY
  const weightedAPY =
    (yields.thetanuts * allocation.options +
      yields.aerodrome * allocation.lp +
      yields.staking * allocation.staking) / 100;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Strategy yields */}
      <div className="grid grid-cols-3 gap-2">
        {strategies.map(({ key, allocKey, Icon }, index) => {
          const apy = yields[key];
          const prevApy = previousYields?.[key];
          const change = prevApy ? apy - prevApy : null;
          const alloc = allocation[allocKey];

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'p-2.5 rounded-lg border transition-colors',
                alloc > 0 ? 'bg-white border-border' : 'bg-muted/30 border-transparent'
              )}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="size-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  {STRATEGY_NAMES[key].split(' ')[0]}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold font-display text-foreground">
                  {apy.toFixed(1)}%
                </span>
                {change !== null && Math.abs(change) > 0.1 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      'text-[10px] font-medium',
                      change > 0 ? 'text-green-600' : 'text-red-500'
                    )}
                  >
                    {change > 0 ? '+' : ''}{change.toFixed(1)}%
                  </motion.span>
                )}
              </div>

              {detailed && (
                <div className="mt-1 text-[10px] text-muted-foreground">
                  {alloc}% allocated
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Weighted APY */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-muted-foreground">Your Weighted APY</span>
        <span className="text-sm font-semibold text-teal">
          {weightedAPY.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

/**
 * YieldBadge - Small inline APY indicator
 */
export function YieldBadge({
  apy,
  previousApy,
  size = 'md',
  className,
}: {
  apy: number;
  previousApy?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const change = previousApy ? apy - previousApy : null;
  const isUp = change && change > 0.1;
  const isDown = change && change < -0.1;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        isUp && 'bg-green-50 text-green-700',
        isDown && 'bg-red-50 text-red-600',
        !isUp && !isDown && 'bg-teal/10 text-teal',
        sizeClasses[size],
        className
      )}
    >
      {isUp && '↑'}
      {isDown && '↓'}
      {apy.toFixed(1)}%
    </span>
  );
}
