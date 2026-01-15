'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount, useBalance } from 'wagmi';
import { useRouter } from 'next/navigation';
import { WalletConnect } from '@/components/WalletConnect';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import {
  motion,
  FadeUp,
  StaggerContainer,
  AnimatedCard,
  AnimatedNumber,
  FloatingElement,
  fadeUpVariants,
} from '@/components/motion';

// Mock data for demonstration
const PORTFOLIO_DATA = {
  totalValue: 15847250,
  totalYield: 8.42,
  strategies: [
    {
      id: 'thetanuts',
      name: 'Thetanuts Options',
      value: 6338900,
      allocation: 40,
      apy: 12.5,
      status: 'active',
    },
    {
      id: 'aerodrome',
      name: 'Aerodrome LP',
      value: 4754175,
      allocation: 30,
      apy: 7.8,
      status: 'active',
    },
    {
      id: 'staking',
      name: 'IDRX Staking',
      value: 4754175,
      allocation: 30,
      apy: 5.2,
      status: 'active',
    },
  ],
  recentActivity: [
    {
      id: 1,
      type: 'deposit',
      amount: 5000000,
      timestamp: '2024-01-15T10:30:00Z',
      strategy: 'Thetanuts Options',
    },
    {
      id: 2,
      type: 'yield',
      amount: 125000,
      timestamp: '2024-01-14T08:00:00Z',
      strategy: 'Aerodrome LP',
    },
    {
      id: 3,
      type: 'rebalance',
      amount: 0,
      timestamp: '2024-01-13T14:15:00Z',
      strategy: 'Portfolio',
    },
    {
      id: 4,
      type: 'deposit',
      amount: 3000000,
      timestamp: '2024-01-12T09:45:00Z',
      strategy: 'IDRX Staking',
    },
  ],
};

// Growth stages based on portfolio size
function getGrowthStage(totalValue: number): number {
  if (totalValue < 1000000) return 1;
  if (totalValue < 5000000) return 2;
  if (totalValue < 10000000) return 3;
  if (totalValue < 25000000) return 4;
  return 5;
}

// Animated Progress Bar Component
function AnimatedProgress({ value, delay = 0 }: { value: number; delay?: number }) {
  const [isInView, setIsInView] = useState(false);

  return (
    <motion.div
      className="bg-primary/20 relative h-2 w-full overflow-hidden rounded-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsInView(true)}
    >
      <motion.div
        className="bg-primary h-full rounded-full"
        initial={{ width: 0 }}
        animate={isInView ? { width: `${value}%` } : { width: 0 }}
        transition={{
          duration: 0.8,
          delay: delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />
    </motion.div>
  );
}

// SVG Plant Illustration Component with subtle animation
function GardenPlant({ stage }: { stage: number }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full max-w-[180px] mx-auto"
      aria-label={`Growth stage ${stage} of 5`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Pot */}
      <path
        d="M60 160 L70 190 L130 190 L140 160 Z"
        fill="var(--terracotta)"
        className="text-terracotta"
      />
      <path
        d="M55 155 L145 155 L145 165 L55 165 Z"
        fill="var(--terracotta)"
        className="text-terracotta"
      />
      <ellipse cx="100" cy="155" rx="45" ry="8" fill="var(--teal-dark)" opacity="0.3" />

      {/* Soil */}
      <ellipse cx="100" cy="155" rx="40" ry="6" fill="#5D4037" />

      {/* Stage 1: Seedling */}
      {stage >= 1 && (
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <path
            d="M100 155 L100 140"
            stroke="var(--teal)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <motion.ellipse
            cx="100"
            cy="135"
            rx="8"
            ry="6"
            fill="var(--teal)"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.g>
      )}

      {/* Stage 2: Small plant */}
      {stage >= 2 && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <path
            d="M100 140 L100 120"
            stroke="var(--teal)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <motion.g
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '100px 130px' }}
          >
            <path
              d="M100 130 Q85 125 80 115"
              stroke="var(--teal)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse cx="78" cy="112" rx="10" ry="7" fill="var(--teal)" />
          </motion.g>
          <motion.g
            animate={{ rotate: [2, -2, 2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{ transformOrigin: '100px 130px' }}
          >
            <path
              d="M100 130 Q115 125 120 115"
              stroke="var(--teal)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse cx="122" cy="112" rx="10" ry="7" fill="var(--teal)" />
          </motion.g>
        </motion.g>
      )}

      {/* Stage 3: Growing tree */}
      {stage >= 3 && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <path
            d="M100 120 L100 90"
            stroke="var(--teal)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <motion.g
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '100px 100px' }}
          >
            <path
              d="M100 100 Q75 95 65 80"
              stroke="var(--teal)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse cx="62" cy="77" rx="12" ry="9" fill="var(--teal)" />
          </motion.g>
          <motion.g
            animate={{ rotate: [1, -1, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            style={{ transformOrigin: '100px 100px' }}
          >
            <path
              d="M100 100 Q125 95 135 80"
              stroke="var(--teal)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse cx="138" cy="77" rx="12" ry="9" fill="var(--teal)" />
          </motion.g>
        </motion.g>
      )}

      {/* Stage 4: Mature tree */}
      {stage >= 4 && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <path
            d="M100 90 L100 60"
            stroke="var(--teal)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <motion.g
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="100" cy="50" r="25" fill="var(--teal)" />
            <circle cx="80" cy="60" r="18" fill="var(--teal)" />
            <circle cx="120" cy="60" r="18" fill="var(--teal)" />
          </motion.g>
          {/* Gold coins/fruits with shimmer */}
          <motion.circle
            cx="90"
            cy="45"
            r="6"
            fill="var(--gold)"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="110"
            cy="50"
            r="5"
            fill="var(--gold)"
            animate={{ opacity: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.circle
            cx="95"
            cy="58"
            r="4"
            fill="var(--gold)"
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
        </motion.g>
      )}

      {/* Stage 5: Flourishing tree with abundant fruits */}
      {stage >= 5 && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.g
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="75" cy="45" r="15" fill="var(--teal)" />
            <circle cx="125" cy="45" r="15" fill="var(--teal)" />
            <circle cx="100" cy="35" r="20" fill="var(--teal)" />
          </motion.g>
          {/* More gold fruits with staggered shimmer */}
          <motion.circle
            cx="70"
            cy="42"
            r="5"
            fill="var(--gold)"
            animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="130"
            cy="42"
            r="5"
            fill="var(--gold)"
            animate={{ opacity: [1, 0.8, 1], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />
          <motion.circle
            cx="100"
            cy="30"
            r="6"
            fill="var(--gold)"
            animate={{ opacity: [0.9, 1, 0.9], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
          <motion.circle
            cx="115"
            cy="38"
            r="4"
            fill="var(--gold)"
            animate={{ opacity: [0.85, 1, 0.85], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
          <motion.circle
            cx="85"
            cy="38"
            r="4"
            fill="var(--gold)"
            animate={{ opacity: [1, 0.85, 1], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          />
          <motion.circle
            cx="105"
            cy="55"
            r="5"
            fill="var(--gold)"
            animate={{ opacity: [0.9, 1, 0.9], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </motion.g>
      )}
    </motion.svg>
  );
}

// Icon components
function DepositIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20M2 12h20" />
    </svg>
  );
}

function WithdrawIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20M2 12h20" transform="rotate(45 12 12)" />
    </svg>
  );
}

function RebalanceIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function StrategyIcon({ type }: { type: string }) {
  if (type === 'thetanuts') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    );
  }
  if (type === 'aerodrome') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function ActivityIcon({ type }: { type: string }) {
  if (type === 'deposit') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    );
  }
  if (type === 'yield') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

function formatIDRX(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { data: balance } = useBalance({
    address,
  });

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  const growthStage = getGrowthStage(PORTFOLIO_DATA.totalValue);

  return (
    <div className="min-h-dvh bg-cream">
      {/* Animated Header */}
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 pt-24">
        {/* Welcome Section */}
        <FadeUp className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-teal text-balance">
                Portfolio Overview
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track your IDRX investments and garden growth
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Native Balance</p>
              <p className="text-lg font-semibold text-foreground tabular-nums">
                {balance
                  ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
                  : 'Loading...'}
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Portfolio Overview Card */}
          <FadeUp className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl text-teal">
                  Total Portfolio Value
                </CardTitle>
                <CardDescription>Your IDRX holdings across all strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                  <div>
                    <p className="text-4xl font-bold text-teal tabular-nums">
                      <AnimatedNumber value={PORTFOLIO_DATA.totalValue} duration={1.2} />
                    </p>
                    <p className="text-muted-foreground">IDRX</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      <Badge className="bg-teal text-primary-foreground">
                        +{PORTFOLIO_DATA.totalYield}% APY
                      </Badge>
                    </motion.div>
                  </div>
                </div>

                {/* Strategy Allocation Breakdown with Animated Progress */}
                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">
                    Strategy Allocation
                  </p>
                  {PORTFOLIO_DATA.strategies.map((strategy, index) => (
                    <div key={strategy.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{strategy.name}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {strategy.allocation}%
                        </span>
                      </div>
                      <AnimatedProgress value={strategy.allocation} delay={0.2 + index * 0.15} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeUp>

          {/* Garden Growth Visualization */}
          <FadeUp>
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg text-teal">
                  Garden Growth
                </CardTitle>
                <CardDescription>Stage {growthStage} of 5</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <FloatingElement delay={0.5}>
                  <div className="w-full aspect-square max-w-[200px] flex items-center justify-center">
                    <GardenPlant stage={growthStage} />
                  </div>
                </FloatingElement>
                <motion.p
                  className="text-sm text-muted-foreground text-center mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {growthStage < 5
                    ? 'Keep growing your portfolio to reach the next stage'
                    : 'Your garden is flourishing'}
                </motion.p>
              </CardContent>
            </Card>
          </FadeUp>
        </div>

        {/* Strategy Cards with Stagger */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {PORTFOLIO_DATA.strategies.map((strategy) => (
            <AnimatedCard key={strategy.id}>
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <motion.div
                      className="w-10 h-10 rounded-lg bg-cream-dark flex items-center justify-center text-teal"
                      whileHover={{ rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <StrategyIcon type={strategy.id} />
                    </motion.div>
                    <Badge variant="outline" className="text-teal border-teal">
                      {strategy.status}
                    </Badge>
                  </div>
                  <CardTitle className="font-display text-base text-foreground mt-3">
                    {strategy.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-teal tabular-nums">
                    <AnimatedNumber value={strategy.value} duration={1} />
                  </p>
                  <p className="text-sm text-muted-foreground">IDRX</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">APY</span>
                      <span className="text-sm font-semibold text-gold tabular-nums">
                        {strategy.apy}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </StaggerContainer>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <FadeUp className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg text-teal">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full justify-start gap-3 bg-teal hover:bg-teal-light transition-colors">
                    <DepositIcon />
                    Deposit IDRX
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 text-teal border-teal hover:bg-cream-dark transition-colors"
                  >
                    <WithdrawIcon />
                    Withdraw
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 text-teal border-teal hover:bg-cream-dark transition-colors"
                  >
                    <RebalanceIcon />
                    Rebalance Portfolio
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </FadeUp>

          {/* Recent Activity */}
          <FadeUp className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg text-teal">
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest transactions and yields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PORTFOLIO_DATA.recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === 'deposit'
                              ? 'bg-teal/10 text-teal'
                              : activity.type === 'yield'
                              ? 'bg-gold/10 text-gold'
                              : 'bg-cream-dark text-muted-foreground'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ActivityIcon type={activity.type} />
                        </motion.div>
                        <div>
                          <p className="text-sm font-medium text-foreground capitalize">
                            {activity.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.strategy}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.amount > 0 && (
                          <p
                            className={`text-sm font-semibold tabular-nums ${
                              activity.type === 'yield' ? 'text-gold' : 'text-foreground'
                            }`}
                          >
                            {activity.type === 'yield' ? '+' : ''}
                            {formatIDRX(activity.amount)} IDRX
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeUp>
        </div>
      </main>
    </div>
  );
}
