'use client';

import { motion } from 'motion/react';
import { MissionCard } from './MissionCard';
import type { Mission } from './types';

interface MissionListProps {
  missions: Mission[];
  onClaimMission?: (missionId: string) => void;
}

// Compact 2-column grid of missions
export function MissionList({ missions, onClaimMission }: MissionListProps) {
  // Sort: incomplete first, then completed
  const sortedMissions = [...missions].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  if (missions.length === 0) {
    return (
      <p className="text-xs text-muted-foreground text-center py-2">
        No missions available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {sortedMissions.map((mission, index) => (
        <motion.div
          key={mission.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <MissionCard
            mission={mission}
            onClaim={onClaimMission ? () => onClaimMission(mission.id) : undefined}
          />
        </motion.div>
      ))}
    </div>
  );
}
