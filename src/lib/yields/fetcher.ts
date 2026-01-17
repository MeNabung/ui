/**
 * Unified Yield Fetcher
 * Fetches and aggregates yield data from all strategies
 */

import { fetchThetanutsAPY, getMockThetanutsAPY } from './thetanuts';
import { fetchAerodromeAPY, getMockAerodromeAPY } from './aerodrome';
import { fetchStakingAPY, getMockStakingAPY } from './staking';
import {
  StrategyYields,
  YieldSnapshot,
  YieldChange,
  YieldComparison,
  StrategyKey,
  YieldData,
  SIGNIFICANT_CHANGE_THRESHOLD,
  YIELD_CACHE_TTL,
} from './types';

// In-memory cache for yield data
let cachedYields: YieldSnapshot | null = null;
let previousYields: StrategyYields | null = null;

/**
 * Fetch all strategy yields in parallel
 * Uses caching to avoid excessive API calls
 */
export async function fetchAllYields(forceRefresh = false): Promise<YieldSnapshot> {
  // Check cache validity
  if (!forceRefresh && cachedYields && !cachedYields.isStale) {
    const age = Date.now() - cachedYields.timestamp;
    if (age < YIELD_CACHE_TTL) {
      return cachedYields;
    }
  }

  // Store previous yields for comparison
  if (cachedYields) {
    previousYields = cachedYields.yields;
  }

  // Fetch all yields in parallel
  const [thetanuts, aerodrome, staking] = await Promise.all([
    fetchThetanutsAPY(),
    fetchAerodromeAPY(),
    fetchStakingAPY(),
  ]);

  const snapshot: YieldSnapshot = {
    yields: {
      thetanuts,
      aerodrome,
      staking,
    },
    timestamp: Date.now(),
    isStale: false,
  };

  // Update cache
  cachedYields = snapshot;

  return snapshot;
}

/**
 * Get mock yields for all strategies (for demo/testing)
 */
export function getMockYields(): YieldSnapshot {
  return {
    yields: {
      thetanuts: getMockThetanutsAPY(),
      aerodrome: getMockAerodromeAPY(),
      staking: getMockStakingAPY(),
    },
    timestamp: Date.now(),
    isStale: false,
  };
}

/**
 * Compare current yields with previous yields to detect changes
 */
export function compareYields(
  current: StrategyYields,
  previous: StrategyYields | null,
  threshold = SIGNIFICANT_CHANGE_THRESHOLD
): YieldComparison {
  if (!previous) {
    return {
      changes: [],
      hasSignificantChange: false,
      mostSignificantChange: null,
      timestamp: Date.now(),
    };
  }

  const changes: YieldChange[] = [];
  const strategies: StrategyKey[] = ['thetanuts', 'aerodrome', 'staking'];

  for (const strategy of strategies) {
    const prevApy = previous[strategy].apy;
    const currApy = current[strategy].apy;
    const absoluteChange = currApy - prevApy;
    const percentageChange = prevApy !== 0 ? absoluteChange / prevApy : 0;

    const change: YieldChange = {
      strategy,
      previousApy: prevApy,
      currentApy: currApy,
      absoluteChange,
      percentageChange,
      direction: absoluteChange > 0.01 ? 'up' : absoluteChange < -0.01 ? 'down' : 'stable',
    };

    changes.push(change);
  }

  // Find most significant change
  const significantChanges = changes.filter(
    (c) => Math.abs(c.absoluteChange) >= threshold
  );

  const mostSignificant = significantChanges.length > 0
    ? significantChanges.reduce((max, c) =>
        Math.abs(c.absoluteChange) > Math.abs(max.absoluteChange) ? c : max
      )
    : null;

  return {
    changes,
    hasSignificantChange: significantChanges.length > 0,
    mostSignificantChange: mostSignificant,
    timestamp: Date.now(),
  };
}

/**
 * Get the cached previous yields for comparison
 */
export function getPreviousYields(): StrategyYields | null {
  return previousYields;
}

/**
 * Calculate weighted average APY based on allocation
 */
export function calculateWeightedAPY(
  yields: StrategyYields,
  allocation: { thetanuts: number; aerodrome: number; staking: number }
): number {
  const totalPercent = allocation.thetanuts + allocation.aerodrome + allocation.staking;

  if (totalPercent === 0) return 0;

  const weightedSum =
    (yields.thetanuts.apy * allocation.thetanuts) +
    (yields.aerodrome.apy * allocation.aerodrome) +
    (yields.staking.apy * allocation.staking);

  return Number((weightedSum / totalPercent).toFixed(2));
}

/**
 * Find the optimal allocation based on current yields and risk profile
 */
export function findOptimalAllocation(
  yields: StrategyYields,
  riskProfile: 'conservative' | 'balanced' | 'aggressive'
): { thetanuts: number; aerodrome: number; staking: number } {
  // Risk constraints for each profile
  const constraints = {
    conservative: {
      maxOptions: 30,    // Max 30% in options
      maxLP: 40,         // Max 40% in LP
      minStaking: 30,    // Min 30% in staking
    },
    balanced: {
      maxOptions: 50,
      maxLP: 50,
      minStaking: 15,
    },
    aggressive: {
      maxOptions: 70,
      maxLP: 60,
      minStaking: 5,
    },
  };

  const constraint = constraints[riskProfile];

  // Sort strategies by APY
  const ranked = [
    { key: 'thetanuts' as StrategyKey, apy: yields.thetanuts.apy },
    { key: 'aerodrome' as StrategyKey, apy: yields.aerodrome.apy },
    { key: 'staking' as StrategyKey, apy: yields.staking.apy },
  ].sort((a, b) => b.apy - a.apy);

  // Simple allocation: favor higher APY within constraints
  const allocation = { thetanuts: 0, aerodrome: 0, staking: constraint.minStaking };
  let remaining = 100 - constraint.minStaking;

  for (const { key } of ranked) {
    if (key === 'staking') continue; // Already allocated minimum

    const max = key === 'thetanuts' ? constraint.maxOptions : constraint.maxLP;
    const toAllocate = Math.min(remaining, max);
    allocation[key] = toAllocate;
    remaining -= toAllocate;

    if (remaining <= 0) break;
  }

  // Distribute any remaining to staking
  if (remaining > 0) {
    allocation.staking += remaining;
  }

  return allocation;
}

/**
 * Calculate potential APY gain from rebalancing
 */
export function calculateRebalanceGain(
  currentYields: StrategyYields,
  currentAllocation: { thetanuts: number; aerodrome: number; staking: number },
  suggestedAllocation: { thetanuts: number; aerodrome: number; staking: number }
): number {
  const currentAPY = calculateWeightedAPY(currentYields, currentAllocation);
  const newAPY = calculateWeightedAPY(currentYields, suggestedAllocation);
  return Number((newAPY - currentAPY).toFixed(2));
}

/**
 * Format APY for display
 */
export function formatAPY(apy: number): string {
  return `${apy.toFixed(2)}%`;
}

/**
 * Format yield change for display
 */
export function formatYieldChange(change: YieldChange): string {
  const sign = change.direction === 'up' ? '+' : '';
  const emoji = change.direction === 'up' ? '📈' : change.direction === 'down' ? '📉' : '➖';
  return `${emoji} ${sign}${change.absoluteChange.toFixed(2)}% (${formatAPY(change.currentApy)})`;
}

/**
 * Clear the yield cache (useful for testing)
 */
export function clearYieldCache(): void {
  cachedYields = null;
  previousYields = null;
}

/**
 * Set previous yields manually (for testing rebalance suggestions)
 */
export function setPreviousYieldsForTesting(yields: StrategyYields): void {
  previousYields = yields;
}
