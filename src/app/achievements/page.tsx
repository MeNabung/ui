'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { motion } from 'motion/react';
import { Header } from '@/components/Header';
import { RequireWallet } from '@/components/RequireWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGamification } from '@/lib/gamification';
import { FadeUp } from '@/components/motion';
import { cn } from '@/lib/utils';
import {
  FlameIcon,
  CheckIcon,
  TrophyIcon,
  StarIcon,
  getMissionIcon,
  getBadgeIcon,
} from '@/components/icons/GamificationIcons';
import type { GamificationData, Mission as UIMission, Badge as UIBadge } from '@/components/Gamification/types';

// Map gamification hook state to UI component props
function mapGamificationToUI(
  state: ReturnType<typeof useGamification>['state'],
  isNewCheckIn: boolean
): GamificationData {
  const missions: UIMission[] = state.missions.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    icon: m.icon,
    progress: m.progress,
    requirement: m.requirement,
    completed: m.completed,
  }));

  const badges: UIBadge[] = state.badges.map((b) => ({
    id: b.id,
    name: b.name,
    description: b.name,
    icon: b.icon,
    earned: b.earnedAt !== null,
    earnedAt: b.earnedAt || undefined,
  }));

  return {
    streak: state.streak.currentStreak,
    isNewCheckIn,
    missions,
    badges,
    totalPoints: state.streak.totalCheckIns * 10 + missions.filter((m) => m.completed).length * 50,
  };
}

export default function AchievementsPage() {
  const { isConnected } = useAccount();
  const { state: gamificationState, checkIn } = useGamification();
  const [isNewCheckIn, setIsNewCheckIn] = useState(false);

  useEffect(() => {
    if (isConnected) {
      const result = checkIn();
      setIsNewCheckIn(result.streakUpdated);
    }
  }, [isConnected, checkIn]);

  const data = mapGamificationToUI(gamificationState, isNewCheckIn);
  const completedMissions = data.missions.filter((m) => m.completed).length;
  const earnedBadges = data.badges.filter((b) => b.earned).length;

  return (
    <RequireWallet>
      <main className="min-h-dvh bg-cream">
        <Header />
        <div className="h-14 sm:h-16" />
        {isConnected && <div className="h-12 md:hidden" />}

        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <FadeUp className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <TrophyIcon className="size-5 text-gold-dark" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold text-teal">
                    Achievements
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Track your progress and earn rewards
                  </p>
                </div>
              </div>
              {(data.totalPoints ?? 0) > 0 && (
                <div className="text-right flex items-center gap-2">
                  <StarIcon className="size-5 text-gold" />
                  <div>
                    <p className="text-2xl font-bold text-gold tabular-nums">{data.totalPoints}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              )}
            </div>
          </FadeUp>

          {/* Streak Card */}
          <FadeUp className="mb-6">
            <Card className="bg-gradient-to-r from-terracotta/10 to-gold/10 border-terracotta/20">
              <CardContent className="py-6">
                <div className="flex items-center justify-center gap-4">
                  <motion.div
                    className="size-14 rounded-2xl bg-terracotta/10 flex items-center justify-center"
                    animate={isNewCheckIn ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <FlameIcon className="size-7 text-terracotta" />
                  </motion.div>
                  <div className="text-center">
                    <motion.p
                      className="text-4xl font-bold text-terracotta tabular-nums"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {data.streak}
                    </motion.p>
                    <p className="text-sm text-muted-foreground">
                      {data.streak === 1 ? 'day streak' : 'days streak'}
                    </p>
                  </div>
                </div>
                {data.streak > 0 && (
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    {data.streak >= 7 ? 'You\'re on fire! Keep going!' : data.streak >= 3 ? 'Nice streak! Keep it up!' : 'Come back tomorrow to grow your streak!'}
                  </p>
                )}
              </CardContent>
            </Card>
          </FadeUp>

          {/* Missions */}
          <FadeUp className="mb-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-lg text-teal">
                    Missions
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {completedMissions}/{data.missions.length} completed
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.missions.map((mission, index) => {
                  const progressPercent = Math.min((mission.progress / mission.requirement) * 100, 100);
                  const MissionIcon = getMissionIcon(mission.id);
                  return (
                    <motion.div
                      key={mission.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border',
                        mission.completed
                          ? 'bg-teal/5 border-teal/20'
                          : 'bg-white border-border'
                      )}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className={cn(
                        'size-10 rounded-xl flex items-center justify-center',
                        mission.completed ? 'bg-teal/10' : 'bg-cream'
                      )}>
                        {mission.completed ? (
                          <CheckIcon className="size-5 text-teal" />
                        ) : (
                          <MissionIcon className="size-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'font-medium text-sm',
                          mission.completed ? 'text-teal' : 'text-foreground'
                        )}>
                          {mission.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {mission.description}
                        </p>
                        {!mission.completed && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1.5 bg-cream-dark rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-teal rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {mission.progress}/{mission.requirement}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </FadeUp>

          {/* Badges */}
          <FadeUp>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-lg text-teal">
                    Badges
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {earnedBadges}/{data.badges.length} earned
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {data.badges.map((badge, index) => {
                    const BadgeIcon = getBadgeIcon(badge.id);
                    return (
                      <motion.div
                        key={badge.id}
                        className="flex flex-col items-center gap-1.5"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
                      >
                        <div className={cn(
                          'size-12 rounded-xl flex items-center justify-center border-2',
                          badge.earned
                            ? 'bg-gold/10 border-gold/30'
                            : 'bg-muted/30 border-border opacity-40 grayscale'
                        )}>
                          <BadgeIcon className={cn(
                            'size-5',
                            badge.earned ? 'text-gold-dark' : 'text-muted-foreground'
                          )} />
                        </div>
                        <p className={cn(
                          'text-[10px] text-center leading-tight',
                          badge.earned ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                          {badge.name}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </FadeUp>

          {/* Back to Dashboard */}
          <FadeUp className="mt-6 text-center">
            <Button asChild variant="outline" className="text-teal border-teal hover:bg-teal/5">
              <Link href="/dashboard">
                <ArrowLeftIcon className="mr-2 size-4" />
                Back to Dashboard
              </Link>
            </Button>
          </FadeUp>
        </div>
      </main>
    </RequireWallet>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
