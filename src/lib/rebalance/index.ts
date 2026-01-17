/**
 * Rebalance Module
 * Unified exports for rebalancing logic and suggestions
 */

// Types
export type {
  CurrentAllocation,
  AllocationWithAmounts,
  RebalanceSuggestion,
  RebalanceAnalysis,
  RebalanceConfig,
  RebalanceExecution,
  RebalanceHistory,
} from './types';

export {
  DEFAULT_REBALANCE_CONFIG,
  STRATEGY_TO_ADAPTER,
  STRATEGY_ACTIONS,
} from './types';

// Analyzer functions
export {
  analyzeRebalance,
  shouldCheckRebalance,
} from './analyzer';

// Calculator functions
export {
  generateSuggestionId,
  calculateAllocationAmounts,
  calculateNewAllocation,
  calculateAnnualGain,
  calculateMonthlyGain,
  calculateDailyGain,
  calculateBreakEvenDays,
  formatIDRX,
  formatPercentage,
  formatAPYChange,
  validateAllocation,
  normalizeAllocation,
  calculateMinimumMove,
  estimateGasCost,
  timeSinceLastRebalance,
  projectPortfolioValue,
  compareAllocations,
} from './calculator';

// Suggestion functions
export {
  generateYieldChangeNotification,
  generateRebalanceCTA,
  generateSuggestionExplanation,
  formatSuggestionForChat,
  dismissSuggestion,
  getDismissedSuggestions,
  filterDismissedSuggestions,
  saveRebalanceHistory,
  getRebalanceHistory,
  calculateHistoricalGains,
  generateHistorySummary,
  getRiskMessage,
  shouldNotifyUser,
} from './suggestions';
