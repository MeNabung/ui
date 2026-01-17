/**
 * Rebalance Types
 * Types for rebalancing logic and suggestions
 */

import type { StrategyKey } from '@/lib/yields';
import type { RiskLevel, StrategyAllocation } from '@/lib/ai/types';

export interface CurrentAllocation {
  /** Options vault percentage (0-100) */
  options: number;
  /** LP position percentage (0-100) */
  lp: number;
  /** Staking percentage (0-100) */
  staking: number;
}

export interface AllocationWithAmounts extends CurrentAllocation {
  /** Total value in IDRX */
  totalValue: number;
  /** Amount in options vault */
  optionsAmount: number;
  /** Amount in LP position */
  lpAmount: number;
  /** Amount in staking */
  stakingAmount: number;
}

export interface RebalanceSuggestion {
  /** Unique ID for this suggestion */
  id: string;
  /** Source strategy to move from */
  fromStrategy: StrategyKey;
  /** Target strategy to move to */
  toStrategy: StrategyKey;
  /** Amount to move (in IDRX) */
  amount: bigint;
  /** Percentage of portfolio to move */
  percentageToMove: number;
  /** Human-readable reason for the suggestion */
  reason: string;
  /** Potential APY gain from this rebalance */
  potentialGain: number;
  /** Impact on portfolio risk */
  riskImpact: 'lower' | 'same' | 'higher';
  /** Confidence score (0-1) */
  confidence: number;
  /** Timestamp when this suggestion was generated */
  timestamp: number;
  /** Whether this suggestion has been dismissed by user */
  dismissed: boolean;
}

export interface RebalanceAnalysis {
  /** Current allocation */
  currentAllocation: CurrentAllocation;
  /** Suggested optimal allocation */
  suggestedAllocation: CurrentAllocation;
  /** Current weighted APY */
  currentAPY: number;
  /** Potential APY after rebalance */
  potentialAPY: number;
  /** APY improvement */
  apyGain: number;
  /** Generated rebalance suggestions */
  suggestions: RebalanceSuggestion[];
  /** Whether rebalancing is recommended */
  shouldRebalance: boolean;
  /** Primary reason for recommendation */
  primaryReason: string;
  /** Analysis timestamp */
  timestamp: number;
}

export interface RebalanceConfig {
  /** Minimum APY gain to suggest rebalance (default: 0.5%) */
  minAPYGain: number;
  /** Minimum amount to move (in IDRX, default: 100,000) */
  minMoveAmount: number;
  /** Maximum percentage to move in single rebalance (default: 25%) */
  maxMovePercentage: number;
  /** Consider gas costs threshold (in USD equivalent) */
  gasThreshold: number;
  /** Risk profile for optimization */
  riskProfile: RiskLevel;
}

export interface RebalanceExecution {
  /** Suggestion being executed */
  suggestion: RebalanceSuggestion;
  /** Transaction hash (once submitted) */
  txHash?: string;
  /** Execution status */
  status: 'pending' | 'simulating' | 'waiting_approval' | 'executing' | 'completed' | 'failed';
  /** Error message if failed */
  error?: string;
  /** Estimated gas cost */
  estimatedGas?: bigint;
  /** Actual gas used */
  actualGas?: bigint;
  /** Timestamp when execution started */
  startedAt: number;
  /** Timestamp when execution completed */
  completedAt?: number;
}

export interface RebalanceHistory {
  /** Executed rebalance */
  execution: RebalanceExecution;
  /** Allocation before rebalance */
  beforeAllocation: CurrentAllocation;
  /** Allocation after rebalance */
  afterAllocation: CurrentAllocation;
  /** APY before rebalance */
  beforeAPY: number;
  /** APY after rebalance */
  afterAPY: number;
  /** Actual gain achieved */
  actualGain: number;
}

/** Default rebalance configuration */
export const DEFAULT_REBALANCE_CONFIG: RebalanceConfig = {
  minAPYGain: 0.5,           // 0.5% minimum gain
  minMoveAmount: 1_00,       // 1 IDRX minimum (2 decimals) - lowered for demo
  maxMovePercentage: 25,     // Max 25% of portfolio per rebalance
  gasThreshold: 5,           // $5 max gas cost
  riskProfile: 'balanced',
};

/** Strategy to adapter mapping */
export const STRATEGY_TO_ADAPTER: Record<StrategyKey, 'options' | 'lp' | 'staking'> = {
  thetanuts: 'options',
  aerodrome: 'lp',
  staking: 'staking',
};

/** Human-readable strategy action descriptions */
export const STRATEGY_ACTIONS: Record<StrategyKey, { enter: string; exit: string }> = {
  thetanuts: {
    enter: 'Deposit into Options Vault',
    exit: 'Withdraw from Options Vault',
  },
  aerodrome: {
    enter: 'Add to LP Position',
    exit: 'Remove from LP Position',
  },
  staking: {
    enter: 'Stake IDRX',
    exit: 'Unstake IDRX',
  },
};
