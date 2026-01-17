/**
 * Rebalance Calculator
 * Utility functions for calculating rebalance amounts and projections
 */

import type { CurrentAllocation, AllocationWithAmounts } from './types';

/**
 * Generate unique suggestion ID
 */
export function generateSuggestionId(): string {
  return `rebal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convert allocation percentages to amounts
 */
export function calculateAllocationAmounts(
  allocation: CurrentAllocation,
  totalValue: number
): AllocationWithAmounts {
  return {
    ...allocation,
    totalValue,
    optionsAmount: Math.floor((allocation.options * totalValue) / 100),
    lpAmount: Math.floor((allocation.lp * totalValue) / 100),
    stakingAmount: Math.floor((allocation.staking * totalValue) / 100),
  };
}

/**
 * Calculate the new allocation after a rebalance move
 */
export function calculateNewAllocation(
  current: CurrentAllocation,
  fromKey: keyof CurrentAllocation,
  toKey: keyof CurrentAllocation,
  percentageToMove: number
): CurrentAllocation {
  const newAllocation = { ...current };

  newAllocation[fromKey] = Math.max(0, current[fromKey] - percentageToMove);
  newAllocation[toKey] = Math.min(100, current[toKey] + percentageToMove);

  return newAllocation;
}

/**
 * Calculate estimated annual yield gain from rebalance
 * @param totalValue Total portfolio value
 * @param apyGain Percentage APY gain (e.g., 0.5 = 0.5%)
 * @returns Annual yield gain in same units as totalValue
 */
export function calculateAnnualGain(totalValue: number, apyGain: number): number {
  return (totalValue * apyGain) / 100;
}

/**
 * Calculate estimated monthly yield gain from rebalance
 */
export function calculateMonthlyGain(totalValue: number, apyGain: number): number {
  return calculateAnnualGain(totalValue, apyGain) / 12;
}

/**
 * Calculate estimated daily yield gain from rebalance
 */
export function calculateDailyGain(totalValue: number, apyGain: number): number {
  return calculateAnnualGain(totalValue, apyGain) / 365;
}

/**
 * Calculate break-even days considering gas costs
 * @param dailyGain Daily yield gain
 * @param gasCost Gas cost in same units
 * @returns Days to break even, or Infinity if never
 */
export function calculateBreakEvenDays(dailyGain: number, gasCost: number): number {
  if (dailyGain <= 0) return Infinity;
  return Math.ceil(gasCost / dailyGain);
}

/**
 * Format IDRX amount for display
 * IDRX uses 2 decimal places
 */
export function formatIDRX(amount: number | bigint): string {
  const numAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  const formatted = (numAmount / 100).toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `Rp ${formatted}`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format APY change for display with direction indicator
 */
export function formatAPYChange(currentAPY: number, newAPY: number): string {
  const change = newAPY - currentAPY;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

/**
 * Validate that allocation percentages sum to 100
 */
export function validateAllocation(allocation: CurrentAllocation): boolean {
  const sum = allocation.options + allocation.lp + allocation.staking;
  return Math.abs(sum - 100) < 0.01; // Allow small floating point errors
}

/**
 * Normalize allocation to ensure it sums to 100
 */
export function normalizeAllocation(allocation: CurrentAllocation): CurrentAllocation {
  const sum = allocation.options + allocation.lp + allocation.staking;

  if (sum === 0) {
    // Default to balanced if all zero
    return { options: 40, lp: 40, staking: 20 };
  }

  return {
    options: Math.round((allocation.options / sum) * 100),
    lp: Math.round((allocation.lp / sum) * 100),
    staking: 100 - Math.round((allocation.options / sum) * 100) - Math.round((allocation.lp / sum) * 100),
  };
}

/**
 * Calculate the minimum move amount based on percentage and total value
 */
export function calculateMinimumMove(
  totalValue: number,
  minPercentage: number = 5
): number {
  return Math.floor((totalValue * minPercentage) / 100);
}

/**
 * Estimate gas cost for rebalance transaction
 * Returns estimated cost in IDRX equivalent
 */
export function estimateGasCost(): number {
  // Base gas estimate: ~150,000 gas for rebalance
  // At ~0.01 gwei on Base, this is negligible
  // But we estimate conservatively for UI purposes
  const estimatedUSD = 0.5; // $0.50 estimated
  const idrxPerUSD = 15700; // ~1 USD = 15,700 IDR
  return Math.ceil(estimatedUSD * idrxPerUSD * 100); // In IDRX with 2 decimals
}

/**
 * Calculate time since last rebalance
 */
export function timeSinceLastRebalance(lastRebalanceTimestamp: number | null): string {
  if (!lastRebalanceTimestamp) return 'Never';

  const now = Date.now();
  const diff = now - lastRebalanceTimestamp;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Calculate projected portfolio value after N days with given APY
 */
export function projectPortfolioValue(
  currentValue: number,
  apy: number,
  days: number
): number {
  const dailyRate = apy / 100 / 365;
  return currentValue * Math.pow(1 + dailyRate, days);
}

/**
 * Compare two allocations and return the differences
 */
export function compareAllocations(
  current: CurrentAllocation,
  suggested: CurrentAllocation
): {
  options: number;
  lp: number;
  staking: number;
  totalChange: number;
} {
  const optionsDiff = suggested.options - current.options;
  const lpDiff = suggested.lp - current.lp;
  const stakingDiff = suggested.staking - current.staking;

  return {
    options: optionsDiff,
    lp: lpDiff,
    staking: stakingDiff,
    totalChange: Math.abs(optionsDiff) + Math.abs(lpDiff) + Math.abs(stakingDiff),
  };
}
