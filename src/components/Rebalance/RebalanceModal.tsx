'use client';

import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  formatIDRX,
  formatPercentage,
  calculateAnnualGain,
  calculateMonthlyGain,
  estimateGasCost,
  calculateBreakEvenDays,
  calculateDailyGain,
} from '@/lib/rebalance';
import { STRATEGY_NAMES, STRATEGY_DESCRIPTIONS } from '@/lib/yields';
import type { RebalanceModalProps } from './types';

// SVG Icons
const ArrowUpFromLineIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 9-6-6-6 6" />
    <path d="M12 3v14" />
    <path d="M5 21h14" />
  </svg>
);

const ArrowDownToLineIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v14" />
    <path d="m6 13 6 6 6-6" />
    <path d="M5 21h14" />
  </svg>
);

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/**
 * RebalanceModal - Confirmation modal for rebalancing
 * Shows simulation, warnings, and transaction status
 */
export function RebalanceModal({
  suggestion,
  analysis,
  totalValue,
  isOpen,
  onClose,
  onConfirm,
  isPending,
  isConfirming,
  txHash,
}: RebalanceModalProps) {
  const fromName = STRATEGY_NAMES[suggestion.fromStrategy];
  const toName = STRATEGY_NAMES[suggestion.toStrategy];
  const fromDesc = STRATEGY_DESCRIPTIONS[suggestion.fromStrategy];
  const toDesc = STRATEGY_DESCRIPTIONS[suggestion.toStrategy];

  // Calculate projections
  const annualGain = calculateAnnualGain(totalValue, suggestion.potentialGain);
  const monthlyGain = calculateMonthlyGain(totalValue, suggestion.potentialGain);
  const dailyGain = calculateDailyGain(totalValue, suggestion.potentialGain);
  const gasCost = estimateGasCost();
  const breakEvenDays = calculateBreakEvenDays(dailyGain, gasCost);

  const isProcessing = isPending || isConfirming;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[15%] z-50 mx-auto max-w-md"
          >
            <div className="bg-cream rounded-xl shadow-xl border border-border overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal/10 to-gold/10 px-5 py-4 border-b border-border">
                <h2 className="text-lg font-display font-semibold text-foreground">
                  Confirm Rebalance
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Review the changes before confirming
                </p>
              </div>

              {/* Content */}
              <div className="px-5 py-4 space-y-4">
                {/* Move visualization */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 text-center p-3 bg-white rounded-lg border border-border">
                    <div className="flex justify-center mb-1">
                      <ArrowUpFromLineIcon className="size-6 text-muted-foreground" />
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">From</div>
                    <div className="font-medium text-sm mt-0.5">{fromName}</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <motion.svg
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="size-5 text-teal"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </motion.svg>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatIDRX(suggestion.amount)}
                    </div>
                  </div>

                  <div className="flex-1 text-center p-3 bg-teal/5 rounded-lg border border-teal/20">
                    <div className="flex justify-center mb-1">
                      <ArrowDownToLineIcon className="size-6 text-teal" />
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">To</div>
                    <div className="font-medium text-sm mt-0.5 text-teal">{toName}</div>
                  </div>
                </div>

                {/* Projections */}
                <div className="bg-white rounded-lg border border-border p-3 space-y-2">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Projected Gains
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">APY Improvement</div>
                      <div className="text-sm font-semibold text-green-600">
                        +{suggestion.potentialGain.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Annual Gain</div>
                      <div className="text-sm font-semibold text-foreground">
                        ~{formatIDRX(annualGain)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Monthly Gain</div>
                      <div className="text-sm font-semibold text-foreground">
                        ~{formatIDRX(monthlyGain)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Break-even</div>
                      <div className="text-sm font-semibold text-foreground">
                        {breakEvenDays < 365 ? `${breakEvenDays} days` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warnings */}
                {suggestion.riskImpact === 'higher' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 border border-amber-200 rounded-lg p-3"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangleIcon className="size-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Risk Level Increase
                        </p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          Moving to {toName} increases your portfolio risk.
                          This is outside your {analysis.currentAllocation ? 'current' : ''} profile constraints.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Gas estimate */}
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>Estimated gas cost</span>
                  <span>~{formatIDRX(gasCost)}</span>
                </div>

                {/* Transaction status */}
                {txHash && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-teal/5 border border-teal/20 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      {isConfirming ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="size-4 border-2 border-teal border-t-transparent rounded-full"
                        />
                      ) : (
                        <CheckIcon className="size-4 text-teal" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-teal">
                          {isConfirming ? 'Confirming...' : 'Transaction Submitted'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {txHash}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 bg-cream-dark border-t border-border flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isPending && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="mr-2 size-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  )}
                  {isPending ? 'Waiting...' : isConfirming ? 'Confirming...' : 'Confirm Rebalance'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
