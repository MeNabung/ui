'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { YieldComparison } from './YieldComparison';
import {
  analyzeRebalance,
  generateRebalanceCTA,
  formatIDRX,
  filterDismissedSuggestions,
  dismissSuggestion,
} from '@/lib/rebalance';
import { fetchAllYields, getMockYields, STRATEGY_NAMES } from '@/lib/yields';
import type { RebalanceCardProps } from './types';
import type { RebalanceSuggestion, RebalanceAnalysis } from '@/lib/rebalance';
import type { StrategyYields } from '@/lib/yields';

// SVG Icons
const RefreshCwIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

/**
 * RebalanceCard - Main rebalance suggestion card for dashboard
 * Fetches yields, analyzes rebalance opportunities, and displays suggestions
 */
export function RebalanceCard({
  currentAllocation,
  totalValue,
  riskProfile,
  onRebalance,
  onDismiss,
  compact = false,
  className,
}: RebalanceCardProps) {
  const [yields, setYields] = useState<StrategyYields | null>(null);
  const [analysis, setAnalysis] = useState<RebalanceAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<RebalanceSuggestion | null>(null);

  // Fetch yields and analyze on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const snapshot = await fetchAllYields();
        setYields(snapshot.yields);

        // Analyze rebalance opportunity
        const result = analyzeRebalance(
          currentAllocation,
          snapshot.yields,
          totalValue,
          { riskProfile }
        );

        // Filter dismissed suggestions
        result.suggestions = filterDismissedSuggestions(result.suggestions);

        setAnalysis(result);
      } catch (error) {
        console.error('Failed to fetch yields:', error);
        // Fallback to mock data
        const mockSnapshot = getMockYields();
        setYields(mockSnapshot.yields);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [currentAllocation, totalValue, riskProfile]);

  // Handle dismiss
  const handleDismiss = (suggestionId: string) => {
    dismissSuggestion(suggestionId);
    onDismiss?.(suggestionId);

    // Update local state
    if (analysis) {
      const updated = {
        ...analysis,
        suggestions: analysis.suggestions.filter((s) => s.id !== suggestionId),
      };
      setAnalysis(updated);
    }
  };

  // Handle rebalance click
  const handleRebalanceClick = (suggestion: RebalanceSuggestion) => {
    setSelectedSuggestion(suggestion);
    onRebalance?.(suggestion);
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardHeader className="pb-2">
          <div className="h-5 w-32 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-20 bg-muted rounded-lg" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!yields || !analysis) {
    return null;
  }

  const cta = generateRebalanceCTA(analysis);
  const hasSuggestions = analysis.suggestions.length > 0 && analysis.shouldRebalance;

  // Compact mode - just show notification badge
  if (compact && !hasSuggestions) {
    return null;
  }

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all',
        hasSuggestions && 'border-gold/50 shadow-md',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {hasSuggestions ? (
              <>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: 2, repeatDelay: 3 }}
                >
                  <RefreshCwIcon className="size-4 text-gold" />
                </motion.div>
                <span>Rebalance Opportunity</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="size-4 text-teal" />
                <span>Portfolio Optimized</span>
              </>
            )}
          </CardTitle>

          {hasSuggestions && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium',
                cta.urgency === 'high' && 'bg-terracotta/10 text-terracotta',
                cta.urgency === 'medium' && 'bg-gold/10 text-gold',
                cta.urgency === 'low' && 'bg-teal/10 text-teal'
              )}
            >
              {cta.urgency === 'high' ? 'Hot' : cta.urgency === 'medium' ? 'Suggested' : 'Optional'}
            </motion.div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Yield comparison */}
        <YieldComparison
          yields={{
            thetanuts: yields.thetanuts.apy,
            aerodrome: yields.aerodrome.apy,
            staking: yields.staking.apy,
          }}
          allocation={currentAllocation}
        />

        {/* Suggestions */}
        <AnimatePresence mode="popLayout">
          {hasSuggestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {/* CTA */}
              <div className="bg-gradient-to-r from-gold/5 to-teal/5 rounded-lg p-3 border border-gold/20">
                <p className="text-sm font-medium text-foreground">
                  {cta.headline}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cta.subtext}
                </p>
              </div>

              {/* Top suggestion */}
              {analysis.suggestions.slice(0, 1).map((suggestion) => (
                <SuggestionItem
                  key={suggestion.id}
                  suggestion={suggestion}
                  onRebalance={() => handleRebalanceClick(suggestion)}
                  onDismiss={() => handleDismiss(suggestion.id)}
                />
              ))}

              {/* APY improvement summary */}
              <div className="flex items-center justify-between text-sm px-1">
                <span className="text-muted-foreground">Potential APY</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {analysis.currentAPY.toFixed(2)}%
                  </span>
                  <ArrowRightIcon className="size-3 text-teal" />
                  <span className="font-semibold text-teal">
                    {analysis.potentialAPY.toFixed(2)}%
                  </span>
                  <span className="text-xs text-green-600 font-medium">
                    (+{analysis.apyGain.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No suggestions state */}
        {!hasSuggestions && (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              {analysis.primaryReason}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Current APY: <span className="font-medium text-teal">{analysis.currentAPY.toFixed(2)}%</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * SuggestionItem - Individual rebalance suggestion
 */
function SuggestionItem({
  suggestion,
  onRebalance,
  onDismiss,
}: {
  suggestion: RebalanceSuggestion;
  onRebalance: () => void;
  onDismiss: () => void;
}) {
  const fromName = STRATEGY_NAMES[suggestion.fromStrategy];
  const toName = STRATEGY_NAMES[suggestion.toStrategy];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white border border-border rounded-lg p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Move description */}
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-medium truncate">{fromName}</span>
            <ArrowRightIcon className="size-3 text-muted-foreground flex-shrink-0" />
            <span className="font-medium text-teal truncate">{toName}</span>
          </div>

          {/* Amount and percentage */}
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{formatIDRX(suggestion.amount)}</span>
            <span>•</span>
            <span>{suggestion.percentageToMove.toFixed(0)}% of portfolio</span>
          </div>

          {/* Gain indicator */}
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-xs text-green-600 font-medium">
              +{suggestion.potentialGain.toFixed(2)}% APY
            </span>
            {suggestion.riskImpact === 'higher' && (
              <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                Higher risk
              </span>
            )}
            {suggestion.riskImpact === 'lower' && (
              <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                Lower risk
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5">
          <Button
            size="sm"
            onClick={onRebalance}
            className="h-7 px-3 text-xs"
          >
            Rebalance
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
