/**
 * Rebalance Analyzer
 * Analyzes current allocation vs optimal and generates recommendations
 */

import type { StrategyYields, StrategyKey, YieldComparison } from '@/lib/yields';
import {
  calculateWeightedAPY,
  findOptimalAllocation,
  SIGNIFICANT_CHANGE_THRESHOLD,
  STRATEGY_NAMES,
} from '@/lib/yields';
import type { RiskLevel } from '@/lib/ai/types';
import type {
  CurrentAllocation,
  RebalanceAnalysis,
  RebalanceSuggestion,
  RebalanceConfig,
} from './types';
import { DEFAULT_REBALANCE_CONFIG } from './types';
import { generateSuggestionId } from './calculator';

/**
 * Map allocation format from UI (options/lp/staking) to yields format (thetanuts/aerodrome/staking)
 */
function mapAllocationToYields(allocation: CurrentAllocation): {
  thetanuts: number;
  aerodrome: number;
  staking: number;
} {
  return {
    thetanuts: allocation.options,
    aerodrome: allocation.lp,
    staking: allocation.staking,
  };
}

/**
 * Map allocation from yields format back to UI format
 */
function mapYieldsToAllocation(yields: {
  thetanuts: number;
  aerodrome: number;
  staking: number;
}): CurrentAllocation {
  return {
    options: yields.thetanuts,
    lp: yields.aerodrome,
    staking: yields.staking,
  };
}

/**
 * Analyze current allocation against yields and generate rebalance recommendations
 */
export function analyzeRebalance(
  currentAllocation: CurrentAllocation,
  currentYields: StrategyYields,
  totalValue: number,
  config: Partial<RebalanceConfig> = {}
): RebalanceAnalysis {
  const fullConfig: RebalanceConfig = { ...DEFAULT_REBALANCE_CONFIG, ...config };

  // Convert allocation format
  const currentYieldsFormat = mapAllocationToYields(currentAllocation);

  // Calculate current APY
  const currentAPY = calculateWeightedAPY(currentYields, currentYieldsFormat);

  // Find optimal allocation for risk profile
  const optimalYieldsFormat = findOptimalAllocation(currentYields, fullConfig.riskProfile);
  const suggestedAllocation = mapYieldsToAllocation(optimalYieldsFormat);

  // Calculate potential APY with optimal allocation
  const potentialAPY = calculateWeightedAPY(currentYields, optimalYieldsFormat);
  const apyGain = potentialAPY - currentAPY;

  // Generate rebalance suggestions
  const suggestions = generateRebalanceSuggestions(
    currentAllocation,
    suggestedAllocation,
    currentYields,
    totalValue,
    fullConfig
  );

  // Determine if rebalancing is worthwhile
  const shouldRebalance = apyGain >= fullConfig.minAPYGain && suggestions.length > 0;

  // Generate primary reason
  const primaryReason = generatePrimaryReason(
    suggestions,
    currentYields,
    apyGain,
    shouldRebalance
  );

  return {
    currentAllocation,
    suggestedAllocation,
    currentAPY,
    potentialAPY,
    apyGain,
    suggestions,
    shouldRebalance,
    primaryReason,
    timestamp: Date.now(),
  };
}

/**
 * Generate specific rebalance suggestions based on allocation differences
 */
function generateRebalanceSuggestions(
  current: CurrentAllocation,
  suggested: CurrentAllocation,
  yields: StrategyYields,
  totalValue: number,
  config: RebalanceConfig
): RebalanceSuggestion[] {
  const suggestions: RebalanceSuggestion[] = [];

  // Map strategy keys to allocation keys
  const strategyMap: { key: StrategyKey; currentKey: keyof CurrentAllocation }[] = [
    { key: 'thetanuts', currentKey: 'options' },
    { key: 'aerodrome', currentKey: 'lp' },
    { key: 'staking', currentKey: 'staking' },
  ];

  // Find strategies that should decrease and increase
  const decreasing: { key: StrategyKey; currentKey: keyof CurrentAllocation; diff: number }[] = [];
  const increasing: { key: StrategyKey; currentKey: keyof CurrentAllocation; diff: number }[] = [];

  for (const { key, currentKey } of strategyMap) {
    const diff = suggested[currentKey] - current[currentKey];
    if (diff < -1) {
      decreasing.push({ key, currentKey, diff: Math.abs(diff) });
    } else if (diff > 1) {
      increasing.push({ key, currentKey, diff });
    }
  }

  // Sort by largest difference first
  decreasing.sort((a, b) => b.diff - a.diff);
  increasing.sort((a, b) => b.diff - a.diff);

  // Generate suggestions by pairing decreasing with increasing strategies
  for (const from of decreasing) {
    for (const to of increasing) {
      // Calculate amount to move (limited by max percentage)
      const movePercentage = Math.min(
        from.diff,
        to.diff,
        config.maxMovePercentage
      );

      const moveAmount = Math.floor((totalValue * movePercentage) / 100);

      // Skip if below minimum amount
      if (moveAmount < config.minMoveAmount) continue;

      // Calculate APY gain for this specific move
      const fromApy = yields[from.key].apy;
      const toApy = yields[to.key].apy;
      const apyDiff = toApy - fromApy;

      // Only suggest if moving to higher yield
      if (apyDiff <= 0) continue;

      // Calculate weighted gain for this portion
      const portionGain = (apyDiff * movePercentage) / 100;

      // Determine risk impact
      const riskImpact = determineRiskImpact(from.key, to.key);

      const suggestion: RebalanceSuggestion = {
        id: generateSuggestionId(),
        fromStrategy: from.key,
        toStrategy: to.key,
        amount: BigInt(moveAmount),
        percentageToMove: movePercentage,
        reason: generateSuggestionReason(from.key, to.key, fromApy, toApy, movePercentage),
        potentialGain: Number(portionGain.toFixed(2)),
        riskImpact,
        confidence: calculateConfidence(apyDiff, movePercentage, riskImpact),
        timestamp: Date.now(),
        dismissed: false,
      };

      suggestions.push(suggestion);
    }
  }

  // Sort suggestions by potential gain (highest first)
  suggestions.sort((a, b) => b.potentialGain - a.potentialGain);

  // Limit to top 3 suggestions
  return suggestions.slice(0, 3);
}

/**
 * Determine risk impact of moving between strategies
 */
function determineRiskImpact(
  from: StrategyKey,
  to: StrategyKey
): 'lower' | 'same' | 'higher' {
  // Risk ranking: staking (lowest) < aerodrome < thetanuts (highest)
  const riskRank: Record<StrategyKey, number> = {
    staking: 1,
    aerodrome: 2,
    thetanuts: 3,
  };

  const fromRisk = riskRank[from];
  const toRisk = riskRank[to];

  if (toRisk > fromRisk) return 'higher';
  if (toRisk < fromRisk) return 'lower';
  return 'same';
}

/**
 * Generate human-readable reason for a suggestion
 */
function generateSuggestionReason(
  from: StrategyKey,
  to: StrategyKey,
  fromApy: number,
  toApy: number,
  percentage: number
): string {
  const fromName = STRATEGY_NAMES[from];
  const toName = STRATEGY_NAMES[to];
  const apyDiff = (toApy - fromApy).toFixed(1);

  return `Move ${percentage}% from ${fromName} (${fromApy.toFixed(1)}% APY) to ${toName} (${toApy.toFixed(1)}% APY) for +${apyDiff}% yield`;
}

/**
 * Calculate confidence score for a suggestion
 */
function calculateConfidence(
  apyDiff: number,
  movePercentage: number,
  riskImpact: 'lower' | 'same' | 'higher'
): number {
  let confidence = 0.5;

  // Higher APY difference = higher confidence
  if (apyDiff > 5) confidence += 0.3;
  else if (apyDiff > 3) confidence += 0.2;
  else if (apyDiff > 1) confidence += 0.1;

  // Smaller moves = higher confidence (less risky)
  if (movePercentage <= 10) confidence += 0.15;
  else if (movePercentage <= 15) confidence += 0.1;
  else if (movePercentage <= 20) confidence += 0.05;

  // Risk impact adjustment
  if (riskImpact === 'lower') confidence += 0.1;
  else if (riskImpact === 'higher') confidence -= 0.1;

  return Math.min(1, Math.max(0, confidence));
}

/**
 * Generate primary reason for rebalance recommendation
 */
function generatePrimaryReason(
  suggestions: RebalanceSuggestion[],
  yields: StrategyYields,
  apyGain: number,
  shouldRebalance: boolean
): string {
  if (!shouldRebalance) {
    return 'Your current allocation is well-optimized. No rebalancing needed.';
  }

  if (suggestions.length === 0) {
    return 'Yields have changed, but no beneficial rebalancing moves available.';
  }

  const topSuggestion = suggestions[0];
  const toYield = yields[topSuggestion.toStrategy].apy;

  return `${STRATEGY_NAMES[topSuggestion.toStrategy]} yields are up to ${toYield.toFixed(1)}%! ` +
    `Rebalancing could improve your APY by +${apyGain.toFixed(2)}%.`;
}

/**
 * Analyze yield changes and determine if they warrant a rebalance check
 */
export function shouldCheckRebalance(
  comparison: YieldComparison,
  threshold = SIGNIFICANT_CHANGE_THRESHOLD
): { shouldCheck: boolean; reason: string } {
  if (!comparison.hasSignificantChange) {
    return {
      shouldCheck: false,
      reason: 'No significant yield changes detected.',
    };
  }

  const change = comparison.mostSignificantChange;
  if (!change) {
    return {
      shouldCheck: false,
      reason: 'No yield data available for comparison.',
    };
  }

  const strategyName = STRATEGY_NAMES[change.strategy];
  const direction = change.direction === 'up' ? 'increased' : 'decreased';
  const changeStr = Math.abs(change.absoluteChange).toFixed(1);

  return {
    shouldCheck: true,
    reason: `${strategyName} APY ${direction} by ${changeStr}% (now ${change.currentApy.toFixed(1)}%).`,
  };
}
