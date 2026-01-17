/**
 * Rebalance Component Types
 */

import type { RebalanceSuggestion, RebalanceAnalysis, CurrentAllocation } from '@/lib/rebalance';

export interface RebalanceCardProps {
  /** Current user allocation */
  currentAllocation: CurrentAllocation;
  /** Total portfolio value in IDRX (with 2 decimals) */
  totalValue: number;
  /** User's risk profile */
  riskProfile: 'conservative' | 'balanced' | 'aggressive';
  /** Callback when user wants to rebalance */
  onRebalance?: (suggestion: RebalanceSuggestion) => void;
  /** Callback when user dismisses a suggestion */
  onDismiss?: (suggestionId: string) => void;
  /** Whether to show in compact mode */
  compact?: boolean;
  /** Additional className */
  className?: string;
}

export interface RebalanceModalProps {
  /** The suggestion being executed */
  suggestion: RebalanceSuggestion;
  /** Analysis data for context */
  analysis: RebalanceAnalysis;
  /** Total portfolio value */
  totalValue: number;
  /** Whether modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Confirm rebalance callback */
  onConfirm: () => void;
  /** Transaction pending state */
  isPending?: boolean;
  /** Transaction confirming state */
  isConfirming?: boolean;
  /** Transaction hash if submitted */
  txHash?: string;
}

export interface YieldComparisonProps {
  /** Current yields from all strategies */
  yields: {
    thetanuts: number;
    aerodrome: number;
    staking: number;
  };
  /** Previous yields for comparison (optional) */
  previousYields?: {
    thetanuts: number;
    aerodrome: number;
    staking: number;
  };
  /** Current allocation percentages */
  allocation: CurrentAllocation;
  /** Show detailed breakdown */
  detailed?: boolean;
  /** Additional className */
  className?: string;
}

export interface RebalanceHistoryProps {
  /** Maximum entries to show */
  limit?: number;
  /** Additional className */
  className?: string;
}

export interface YieldBadgeProps {
  /** APY value */
  apy: number;
  /** Previous APY for change indication */
  previousApy?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}
