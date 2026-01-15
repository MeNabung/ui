'use client';

import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StreakCounter } from './StreakCounter';
import { MissionList } from './MissionList';
import { BadgeGrid } from './BadgeGrid';
import type { GamificationData } from './types';

interface GamificationPanelProps extends GamificationData {
  onClaimMission?: (missionId: string) => void;
  className?: string;
}

export function GamificationPanel({
  streak,
  isNewCheckIn,
  missions,
  badges,
  totalPoints,
  onClaimMission,
  className,
}: GamificationPanelProps) {
  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CardTitle className="font-display text-base text-teal">
              Progress
            </CardTitle>
            <StreakCounter streak={streak} isNewCheckIn={isNewCheckIn} />
          </div>
          {totalPoints !== undefined && totalPoints > 0 && (
            <span className="text-xs font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
              {totalPoints} pts
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {completedCount}/{missions.length} missions · {badges.filter(b => b.earned).length}/{badges.length} badges
        </p>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-3">
        {/* Missions Grid */}
        <MissionList missions={missions} onClaimMission={onClaimMission} />

        {/* Badges Row */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Badges</p>
          <BadgeGrid badges={badges} />
        </div>
      </CardContent>
    </Card>
  );
}
