/**
 * Yields Module
 * Unified exports for yield fetching and monitoring
 */

// Types
export type {
  YieldData,
  StrategyYields,
  YieldSnapshot,
  YieldChange,
  YieldComparison,
  StrategyKey,
} from './types';

export {
  STRATEGY_NAMES,
  STRATEGY_DESCRIPTIONS,
  BASELINE_APYS,
  SIGNIFICANT_CHANGE_THRESHOLD,
  YIELD_REFRESH_INTERVAL,
  YIELD_CACHE_TTL,
} from './types';

// Fetcher functions
export {
  fetchAllYields,
  getMockYields,
  compareYields,
  getPreviousYields,
  calculateWeightedAPY,
  findOptimalAllocation,
  calculateRebalanceGain,
  formatAPY,
  formatYieldChange,
  clearYieldCache,
  setPreviousYieldsForTesting,
} from './fetcher';

// Strategy-specific exports
export { fetchThetanutsAPY, getMockThetanutsAPY, calculateDailyYield, calculateMonthlyYield } from './thetanuts';
export { fetchAerodromeAPY, getMockAerodromeAPY, estimateImpermanentLoss, calculateNetAPYAfterIL } from './aerodrome';
export { fetchStakingAPY, getMockStakingAPY, calculateCompoundRewards, calculateSimpleRewards, estimateDoublingTime } from './staking';
