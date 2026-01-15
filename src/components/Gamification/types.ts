/**
 * Type definitions for gamification system
 */

export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  requirement: number;
  completed: boolean;
  claimed?: boolean;
  reward?: {
    type: 'badge' | 'points' | 'idrx';
    value: string | number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  isNew?: boolean;
}

export interface GamificationData {
  streak: number;
  isNewCheckIn?: boolean;
  missions: Mission[];
  badges: Badge[];
  totalPoints?: number;
}
