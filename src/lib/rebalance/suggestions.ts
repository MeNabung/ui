/**
 * Rebalance Suggestions
 * Generate and manage user-friendly rebalance suggestions
 */

import type { StrategyYields, YieldChange } from '@/lib/yields';
import { STRATEGY_NAMES, formatAPY } from '@/lib/yields';
import type { RiskLevel } from '@/lib/ai/types';
import type {
  RebalanceSuggestion,
  RebalanceAnalysis,
  RebalanceHistory,
  CurrentAllocation,
} from './types';
import { formatIDRX, formatPercentage } from './calculator';

// Local storage key for suggestion state
const DISMISSED_SUGGESTIONS_KEY = 'menabung_dismissed_suggestions';
const REBALANCE_HISTORY_KEY = 'menabung_rebalance_history';

/**
 * Generate a user-friendly notification message for yield change
 */
export function generateYieldChangeNotification(change: YieldChange): string {
  const strategyName = STRATEGY_NAMES[change.strategy];
  const arrow = change.direction === 'up' ? '↑' : '↓';
  const direction = change.direction === 'up' ? 'increased' : 'decreased';
  const percentChange = Math.abs(change.percentageChange * 100).toFixed(0);

  return `${arrow} ${strategyName} APY ${direction} by ${percentChange}%! ` +
    `Now at ${formatAPY(change.currentApy)} (was ${formatAPY(change.previousApy)}).`;
}

/**
 * Generate a compelling call-to-action for rebalancing
 */
export function generateRebalanceCTA(analysis: RebalanceAnalysis): {
  headline: string;
  subtext: string;
  urgency: 'low' | 'medium' | 'high';
} {
  const { apyGain, suggestions, shouldRebalance } = analysis;

  if (!shouldRebalance || suggestions.length === 0) {
    return {
      headline: 'Portfolio Optimized',
      subtext: 'Your current allocation is earning great yields.',
      urgency: 'low',
    };
  }

  // Determine urgency based on APY gain
  const urgency = apyGain > 2 ? 'high' : apyGain > 1 ? 'medium' : 'low';

  const topSuggestion = suggestions[0];
  const gainFormatted = `+${apyGain.toFixed(2)}%`;

  if (urgency === 'high') {
    return {
      headline: `Big Opportunity: ${gainFormatted} APY`,
      subtext: `LP yields jumped! Move funds from ${STRATEGY_NAMES[topSuggestion.fromStrategy]} to maximize returns.`,
      urgency,
    };
  }

  if (urgency === 'medium') {
    return {
      headline: `Optimize: ${gainFormatted} APY`,
      subtext: `Yields changed. Rebalance to earn more with ${STRATEGY_NAMES[topSuggestion.toStrategy]}.`,
      urgency,
    };
  }

  return {
    headline: `Small Gain: ${gainFormatted} APY`,
    subtext: 'Minor yield changes detected. Consider rebalancing when convenient.',
    urgency,
  };
}

/**
 * Generate detailed explanation of a rebalance suggestion
 */
export function generateSuggestionExplanation(
  suggestion: RebalanceSuggestion,
  totalValue: number
): {
  title: string;
  description: string;
  impact: string[];
  warnings: string[];
} {
  const fromName = STRATEGY_NAMES[suggestion.fromStrategy];
  const toName = STRATEGY_NAMES[suggestion.toStrategy];
  const amount = formatIDRX(suggestion.amount);
  const percentage = formatPercentage(suggestion.percentageToMove);

  const title = `Move ${percentage} to ${toName}`;

  const description =
    `Move ${amount} (${percentage}) from ${fromName} to ${toName}. ` +
    suggestion.reason;

  const impact: string[] = [
    `Expected APY improvement: +${suggestion.potentialGain.toFixed(2)}%`,
    `Annual gain: ~${formatIDRX(Number(suggestion.amount) * suggestion.potentialGain / 100)}`,
  ];

  const warnings: string[] = [];

  if (suggestion.riskImpact === 'higher') {
    warnings.push(`This move increases portfolio risk (${toName} is more volatile)`);
  }

  if (suggestion.percentageToMove > 15) {
    warnings.push('Large rebalance - consider doing it in smaller steps');
  }

  if (suggestion.confidence < 0.6) {
    warnings.push('Moderate confidence - yields may change again soon');
  }

  return { title, description, impact, warnings };
}

/**
 * Format suggestion for AI chat context
 */
export function formatSuggestionForChat(analysis: RebalanceAnalysis): string {
  if (!analysis.shouldRebalance) {
    return `Your portfolio is well-balanced. Current APY: ${formatAPY(analysis.currentAPY)}.`;
  }

  const { suggestions, currentAPY, potentialAPY, apyGain } = analysis;

  let message = `I noticed some yield changes that could benefit your portfolio!\n\n`;
  message += `Current APY: ${formatAPY(currentAPY)}\n`;
  message += `Potential APY: ${formatAPY(potentialAPY)} (+${apyGain.toFixed(2)}%)\n\n`;

  if (suggestions.length > 0) {
    message += `Suggested moves:\n`;
    for (const suggestion of suggestions) {
      const fromName = STRATEGY_NAMES[suggestion.fromStrategy];
      const toName = STRATEGY_NAMES[suggestion.toStrategy];
      message += `• Move ${formatPercentage(suggestion.percentageToMove)} from ${fromName} to ${toName}\n`;
    }
    message += `\nWant me to help you rebalance?`;
  }

  return message;
}

/**
 * Save dismissed suggestion ID to local storage
 */
export function dismissSuggestion(suggestionId: string): void {
  if (typeof window === 'undefined') return;

  const dismissed = getDismissedSuggestions();
  dismissed.add(suggestionId);

  // Keep only last 50 dismissed suggestions
  const arr = Array.from(dismissed).slice(-50);
  localStorage.setItem(DISMISSED_SUGGESTIONS_KEY, JSON.stringify(arr));
}

/**
 * Get set of dismissed suggestion IDs
 */
export function getDismissedSuggestions(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const stored = localStorage.getItem(DISMISSED_SUGGESTIONS_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored));
  } catch {
    return new Set();
  }
}

/**
 * Filter out dismissed suggestions
 */
export function filterDismissedSuggestions(
  suggestions: RebalanceSuggestion[]
): RebalanceSuggestion[] {
  const dismissed = getDismissedSuggestions();
  return suggestions.filter((s) => !dismissed.has(s.id));
}

/**
 * Save rebalance to history
 */
export function saveRebalanceHistory(history: RebalanceHistory): void {
  if (typeof window === 'undefined') return;

  const histories = getRebalanceHistory();
  histories.push(history);

  // Keep only last 20 rebalances
  const trimmed = histories.slice(-20);
  localStorage.setItem(REBALANCE_HISTORY_KEY, JSON.stringify(trimmed));
}

/**
 * Get rebalance history
 */
export function getRebalanceHistory(): RebalanceHistory[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(REBALANCE_HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Calculate total gains from rebalance history
 */
export function calculateHistoricalGains(histories: RebalanceHistory[]): {
  totalGain: number;
  avgGain: number;
  successRate: number;
} {
  if (histories.length === 0) {
    return { totalGain: 0, avgGain: 0, successRate: 0 };
  }

  const completed = histories.filter((h) => h.execution.status === 'completed');
  const totalGain = completed.reduce((sum, h) => sum + h.actualGain, 0);
  const avgGain = totalGain / completed.length || 0;
  const successRate = completed.length / histories.length;

  return { totalGain, avgGain, successRate };
}

/**
 * Generate summary of rebalance history for display
 */
export function generateHistorySummary(histories: RebalanceHistory[]): string {
  const { totalGain, avgGain, successRate } = calculateHistoricalGains(histories);

  if (histories.length === 0) {
    return "You haven't done any rebalances yet.";
  }

  const successPercent = (successRate * 100).toFixed(0);
  const gainStr = totalGain >= 0 ? `+${totalGain.toFixed(2)}%` : `${totalGain.toFixed(2)}%`;

  return `${histories.length} rebalances • ${successPercent}% success • ${gainStr} total APY gain`;
}

/**
 * Get risk-appropriate messaging for a suggestion
 */
export function getRiskMessage(
  riskImpact: 'lower' | 'same' | 'higher',
  userRiskProfile: RiskLevel
): string | null {
  if (riskImpact === 'higher' && userRiskProfile === 'conservative') {
    return 'Warning: This increases risk beyond your conservative profile.';
  }

  if (riskImpact === 'lower' && userRiskProfile === 'aggressive') {
    return 'Note: This reduces risk - you could consider more aggressive options.';
  }

  return null;
}

/**
 * Check if user should be notified about rebalance opportunity
 */
export function shouldNotifyUser(
  analysis: RebalanceAnalysis,
  lastNotificationTime: number | null,
  cooldownHours: number = 4
): boolean {
  if (!analysis.shouldRebalance) return false;

  // Don't notify if gain is too small
  if (analysis.apyGain < 0.5) return false;

  // Respect cooldown period
  if (lastNotificationTime) {
    const hoursSinceLast = (Date.now() - lastNotificationTime) / (1000 * 60 * 60);
    if (hoursSinceLast < cooldownHours) return false;
  }

  return true;
}
