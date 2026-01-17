/**
 * Yield Data Types
 * Types for yield fetching and monitoring across strategies
 */

export interface YieldData {
  /** Current APY as a percentage (e.g., 12.5 means 12.5%) */
  apy: number;
  /** Timestamp when this data was fetched */
  timestamp: number;
  /** Source of the yield data */
  source: 'api' | 'subgraph' | 'contract' | 'mock';
}

export interface StrategyYields {
  /** Thetanuts Options vault APY */
  thetanuts: YieldData;
  /** Aerodrome LP APY */
  aerodrome: YieldData;
  /** Native staking APY */
  staking: YieldData;
}

export interface YieldSnapshot {
  /** All strategy yields at a point in time */
  yields: StrategyYields;
  /** When this snapshot was taken */
  timestamp: number;
  /** Whether this data is stale (> 5 minutes old) */
  isStale: boolean;
}

export interface YieldChange {
  /** Strategy that changed */
  strategy: 'thetanuts' | 'aerodrome' | 'staking';
  /** Previous APY */
  previousApy: number;
  /** Current APY */
  currentApy: number;
  /** Absolute change in APY */
  absoluteChange: number;
  /** Percentage change (e.g., 0.5 means 50% increase) */
  percentageChange: number;
  /** Direction of change */
  direction: 'up' | 'down' | 'stable';
}

export interface YieldComparison {
  /** Changes detected across strategies */
  changes: YieldChange[];
  /** Whether any significant change was detected (> threshold) */
  hasSignificantChange: boolean;
  /** The most significant change, if any */
  mostSignificantChange: YieldChange | null;
  /** Timestamp of comparison */
  timestamp: number;
}

export type StrategyKey = 'thetanuts' | 'aerodrome' | 'staking';

/** Human-readable strategy names */
export const STRATEGY_NAMES: Record<StrategyKey, string> = {
  thetanuts: 'Options Vault',
  aerodrome: 'LP Position',
  staking: 'Staking',
};

/** Strategy descriptions for UI */
export const STRATEGY_DESCRIPTIONS: Record<StrategyKey, string> = {
  thetanuts: 'Thetanuts covered call options',
  aerodrome: 'Aerodrome IDRX/USDC liquidity',
  staking: 'Native IDRX staking rewards',
};

/** Default/baseline APYs for comparison */
export const BASELINE_APYS: Record<StrategyKey, number> = {
  thetanuts: 8.0,
  aerodrome: 12.0,
  staking: 15.0,
};

/**
 * Demo mode APYs - creates obvious rebalancing opportunity
 * Aerodrome LP "spiked" to 22% - much higher than user's likely allocation
 */
export const DEMO_APYS: Record<StrategyKey, number> = {
  thetanuts: 7.5,   // Slightly lower than baseline
  aerodrome: 22.0,  // SPIKED! Much higher - triggers rebalance suggestion
  staking: 14.0,    // Normal
};

/** Whether to use demo mode APYs (set true for hackathon demos) */
export const USE_DEMO_MODE = true;

/** Threshold for considering a yield change significant (in percentage points) */
export const SIGNIFICANT_CHANGE_THRESHOLD = 2.0;

/** How often to refresh yield data (5 minutes) */
export const YIELD_REFRESH_INTERVAL = 5 * 60 * 1000;

/** Cache TTL for yield data (5 minutes) */
export const YIELD_CACHE_TTL = 5 * 60 * 1000;
