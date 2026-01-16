'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useChainId } from 'wagmi';
import { base } from 'wagmi/chains';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '@/components/Header';
import { RequireWallet } from '@/components/RequireWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FadeUp, AnimatedButton } from '@/components/motion';
import { cn } from '@/lib/utils';
import {
  useIDRXBalance,
  useIDRXAllowance,
  useApproveIDRX,
  useDeposit,
  useSetStrategy,
  formatIDRX,
  parseIDRXInput,
  isContractDeployed,
  IDRX_DECIMALS,
} from '@/lib/contracts';
import { formatUnits, parseUnits } from 'viem';

// Strategy allocations based on risk profile
const STRATEGY_ALLOCATIONS = {
  conservative: { options: 20, lp: 30, staking: 50 },
  balanced: { options: 40, lp: 40, staking: 20 },
  aggressive: { options: 50, lp: 35, staking: 15 },
};

type RiskProfile = keyof typeof STRATEGY_ALLOCATIONS;

// Strategy info with APY
const STRATEGY_INFO = [
  { key: 'options', name: 'Thetanuts Options', iconType: 'target', apy: 8, color: 'text-teal' },
  { key: 'lp', name: 'Aerodrome LP', iconType: 'droplet', apy: 12, color: 'text-gold-dark' },
  { key: 'staking', name: 'IDRX Staking', iconType: 'lock', apy: 15, color: 'text-terracotta' },
];

// Icons
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function StrategyIcon({ type, className }: { type: string; className?: string }) {
  if (type === 'target') {
    return (
      <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }
  if (type === 'droplet') {
    return (
      <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
      </svg>
    );
  }
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function DepositPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // Form state
  const [amount, setAmount] = useState('');
  const [riskProfile, setRiskProfile] = useState<RiskProfile>('balanced');
  const [step, setStep] = useState<'input' | 'approve' | 'deposit' | 'success'>('input');

  // Contract hooks
  const { data: balanceData, refetch: refetchBalance } = useIDRXBalance(address);
  const { data: allowanceData, refetch: refetchAllowance } = useIDRXAllowance(address);
  const {
    approve,
    isPending: isApproving,
    isConfirming: isApproveConfirming,
    isSuccess: isApproveSuccess,
    error: approveError,
  } = useApproveIDRX();
  const {
    deposit,
    isPending: isDepositing,
    isConfirming: isDepositConfirming,
    isSuccess: isDepositSuccess,
    error: depositError,
  } = useDeposit();
  const { setStrategy } = useSetStrategy();

  // Load saved risk profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('riskProfile') as RiskProfile | null;
    if (saved && STRATEGY_ALLOCATIONS[saved]) {
      setRiskProfile(saved);
    }
  }, []);

  // Format balance for display
  const formattedBalance = useMemo(() => {
    if (!balanceData) return '0';
    return formatUnits(balanceData, IDRX_DECIMALS);
  }, [balanceData]);

  // Check if amount needs approval
  const needsApproval = useMemo(() => {
    if (!amount || !allowanceData) return true;
    try {
      const amountInWei = parseUnits(parseIDRXInput(amount), IDRX_DECIMALS);
      return allowanceData < amountInWei;
    } catch {
      return true;
    }
  }, [amount, allowanceData]);

  // Calculate strategy breakdown
  const allocation = STRATEGY_ALLOCATIONS[riskProfile];
  const strategyBreakdown = useMemo(() => {
    const parsedAmount = parseFloat(parseIDRXInput(amount)) || 0;
    return STRATEGY_INFO.map((strategy) => ({
      ...strategy,
      percentage: allocation[strategy.key as keyof typeof allocation],
      amount: (parsedAmount * allocation[strategy.key as keyof typeof allocation]) / 100,
    }));
  }, [amount, allocation]);

  // Calculate weighted APY
  const weightedAPY = useMemo(() => {
    return strategyBreakdown.reduce(
      (total, strategy) => total + (strategy.apy * strategy.percentage) / 100,
      0
    ).toFixed(1);
  }, [strategyBreakdown]);

  // Handle approval success - move to deposit step
  useEffect(() => {
    if (isApproveSuccess) {
      // Wait for allowance to be refetched before moving to deposit step
      refetchAllowance().then(() => {
        setStep('deposit');
      });
    }
  }, [isApproveSuccess, refetchAllowance]);

  // Handle deposit success
  useEffect(() => {
    if (isDepositSuccess) {
      refetchBalance();
      setStep('success');
    }
  }, [isDepositSuccess, refetchBalance]);

  const handleMaxClick = () => {
    setAmount(formattedBalance);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.,]/g, '');
    setAmount(value);
  };

  const handleApprove = async () => {
    try {
      setStep('approve');
      await approve(parseIDRXInput(amount));
    } catch (err) {
      console.error('Approval failed:', err);
      setStep('input');
    }
  };

  const handleDeposit = async () => {
    try {
      const cleanAmount = parseIDRXInput(amount);

      // Check if strategy needs to be set (only if user has no position yet)
      // Strategy is already set on first deposit via contract default
      // So we just deposit directly
      await deposit(cleanAmount);
    } catch (err) {
      console.error('Deposit failed:', err);
    }
  };

  const isValidAmount = () => {
    if (!amount) return false;
    const parsed = parseFloat(parseIDRXInput(amount));
    const balance = parseFloat(formattedBalance);
    return parsed > 0 && parsed <= balance;
  };

  const isContractsDeployed = isContractDeployed(chainId);
  const isWrongNetwork = chainId !== base.id;

  // Success state
  if (step === 'success') {
    return (
      <RequireWallet>
        <div className="min-h-dvh bg-cream">
          <Header />
          <main className="max-w-2xl mx-auto px-4 py-8 pt-24">
            <FadeUp>
              <Card className="shadow-card">
                <CardContent className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-teal/10 flex items-center justify-center"
                  >
                    <CheckIcon className="w-10 h-10 text-teal" />
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold text-teal mb-2">
                    Deposit Successful!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Your IDRX is now growing across {strategyBreakdown.length} strategies.
                  </p>
                  <div className="bg-cream-dark rounded-lg p-4 mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Amount Deposited</p>
                    <p className="text-2xl font-bold text-teal tabular-nums">
                      {formatIDRX(parseIDRXInput(amount))} IDRX
                    </p>
                    <p className="text-sm text-gold-dark mt-1">Est. APY: {weightedAPY}%</p>
                  </div>
                  <AnimatedButton>
                    <Button
                      onClick={() => router.push('/dashboard')}
                      className="w-full bg-teal hover:bg-teal-light text-white h-12"
                    >
                      View Dashboard
                    </Button>
                  </AnimatedButton>
                </CardContent>
              </Card>
            </FadeUp>
          </main>
        </div>
      </RequireWallet>
    );
  }

  return (
    <RequireWallet>
      <div className="min-h-dvh bg-cream">
        <Header />
        <main className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pt-20 sm:pt-24">
          <FadeUp>
            <Card className="shadow-card">
              <CardHeader className="px-4 sm:px-6 pb-2">
                <CardTitle className="font-display text-xl sm:text-2xl text-teal">
                  Deposit IDRX
                </CardTitle>
                <CardDescription>
                  Start growing your savings across multiple yield strategies
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 px-4 sm:px-6">
                {/* Network warning */}
                {isWrongNetwork && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-terracotta/10 border border-terracotta/30 rounded-lg p-3"
                  >
                    <p className="text-sm text-terracotta">
                      Please switch to Base network to deposit
                    </p>
                  </motion.div>
                )}

                {/* Balance display */}
                <div className="bg-cream-dark rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Your IDRX Balance</span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {formatIDRX(formattedBalance)} IDRX
                    </span>
                  </div>
                </div>

                {/* Amount input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Amount to deposit
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className="pr-20 h-14 text-xl tabular-nums"
                      disabled={isApproving || isApproveConfirming || isDepositing || isDepositConfirming}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleMaxClick}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-teal hover:text-teal-dark"
                    >
                      MAX
                    </Button>
                  </div>
                </div>

                {/* Risk profile selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Your Strategy
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['conservative', 'balanced', 'aggressive'] as const).map((profile) => (
                      <button
                        key={profile}
                        onClick={() => setRiskProfile(profile)}
                        disabled={isApproving || isDepositing}
                        className={cn(
                          'px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer',
                          riskProfile === profile
                            ? 'border-teal bg-teal/10 text-teal'
                            : 'border-border bg-white hover:border-teal/50'
                        )}
                      >
                        {profile.charAt(0).toUpperCase() + profile.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strategy breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">
                      Strategy Allocation
                    </span>
                    <Badge className="bg-gold/10 text-gold-dark border-0">
                      Est. APY: {weightedAPY}%
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {strategyBreakdown.map((strategy, index) => (
                      <motion.div
                        key={strategy.key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-cream-dark rounded-lg p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <StrategyIcon type={strategy.iconType} className={strategy.color} />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {strategy.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {strategy.apy}% APY
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn('text-lg font-semibold tabular-nums', strategy.color)}>
                            {strategy.percentage}%
                          </p>
                          {amount && (
                            <p className="text-xs text-muted-foreground tabular-nums">
                              {formatIDRX(strategy.amount)} IDRX
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3 pt-2">
                  <AnimatePresence mode="wait">
                    {step !== 'deposit' && needsApproval ? (
                      <motion.div
                        key="approve"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <AnimatedButton>
                          <Button
                            onClick={handleApprove}
                            disabled={
                              !isValidAmount() ||
                              isApproving ||
                              isApproveConfirming ||
                              isWrongNetwork ||
                              !isContractsDeployed
                            }
                            className="w-full bg-gold hover:bg-gold/90 text-white h-12 font-medium"
                          >
                            {isApproving || isApproveConfirming ? (
                              <span className="flex items-center gap-2">
                                <LoadingSpinner />
                                {isApproveConfirming ? 'Confirming...' : 'Approving...'}
                              </span>
                            ) : (
                              'Approve IDRX'
                            )}
                          </Button>
                        </AnimatedButton>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="deposit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <AnimatedButton>
                          <Button
                            onClick={handleDeposit}
                            disabled={
                              !isValidAmount() ||
                              isDepositing ||
                              isDepositConfirming ||
                              isWrongNetwork ||
                              !isContractsDeployed
                            }
                            className="w-full bg-teal hover:bg-teal-light text-white h-12 font-medium"
                          >
                            {isDepositing || isDepositConfirming ? (
                              <span className="flex items-center gap-2">
                                <LoadingSpinner />
                                {isDepositConfirming ? 'Confirming...' : 'Depositing...'}
                              </span>
                            ) : (
                              'Deposit'
                            )}
                          </Button>
                        </AnimatedButton>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error display */}
                  {(approveError || depositError) && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-destructive text-center"
                    >
                      {approveError?.message || depositError?.message}
                    </motion.p>
                  )}
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Not financial advice. DYOR. Smart contract risks apply.
                </p>
              </CardContent>
            </Card>
          </FadeUp>
        </main>
      </div>
    </RequireWallet>
  );
}

function LoadingSpinner() {
  return (
    <motion.div
      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}
