"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useRouter } from "next/navigation";
import { WalletConnect } from "@/components/WalletConnect";
import { RequireWallet } from "@/components/RequireWallet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { useGamification } from "@/lib/gamification";
import { FlameIcon, TrophyIcon } from "@/components/icons/GamificationIcons";
import {
  motion,
  FadeUp,
  StaggerContainer,
  AnimatedCard,
  AnimatedNumber,
  FloatingElement,
  fadeUpVariants,
} from "@/components/motion";
import {
  useUserPosition,
  useUserTotalBalance,
  usePositionBreakdown,
  useIDRXBalance,
  formatIDRX,
  isContractDeployed,
} from "@/lib/contracts";

// Strategy APY rates
const STRATEGY_APYS = {
  options: 8,
  lp: 12,
  staking: 15,
};

// Growth stages based on portfolio size (adjusted for real IDRX values)
function getGrowthStage(totalValue: number): number {
  if (totalValue < 10) return 1;      // < 10 IDRX
  if (totalValue < 100) return 2;     // < 100 IDRX
  if (totalValue < 500) return 3;     // < 500 IDRX
  if (totalValue < 1000) return 4;    // < 1000 IDRX
  return 5;                            // >= 1000 IDRX
}

// Animated Progress Bar Component
function AnimatedProgress({
  value,
  delay = 0,
}: {
  value: number;
  delay?: number;
}) {
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
      transition={{ duration: 0.6, ease: "easeOut" }}
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
      <ellipse
        cx="100"
        cy="155"
        rx="45"
        ry="8"
        fill="var(--teal-dark)"
        opacity="0.3"
      />

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
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "100px 130px" }}
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
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            style={{ transformOrigin: "100px 130px" }}
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
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "100px 100px" }}
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
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            style={{ transformOrigin: "100px 100px" }}
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
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="110"
            cy="50"
            r="5"
            fill="var(--gold)"
            animate={{ opacity: [1, 0.8, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
          <motion.circle
            cx="95"
            cy="58"
            r="4"
            fill="var(--gold)"
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
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
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="130"
            cy="42"
            r="5"
            fill="var(--gold)"
            animate={{ opacity: [1, 0.8, 1], scale: [1, 1.1, 1] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
          <motion.circle
            cx="100"
            cy="30"
            r="6"
            fill="var(--gold)"
            animate={{ opacity: [0.9, 1, 0.9], scale: [1, 1.1, 1] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          />
          <motion.circle
            cx="115"
            cy="38"
            r="4"
            fill="var(--gold)"
            animate={{ opacity: [0.85, 1, 0.85], scale: [1, 1.1, 1] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />
          <motion.circle
            cx="85"
            cy="38"
            r="4"
            fill="var(--gold)"
            animate={{ opacity: [1, 0.85, 1], scale: [1, 1.1, 1] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          />
          <motion.circle
            cx="105"
            cy="55"
            r="5"
            fill="var(--gold)"
            animate={{ opacity: [0.9, 1, 0.9], scale: [1, 1.1, 1] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
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
      <path d="M5 12h14" />
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

function SeedlingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 10a4 4 0 0 0 4-4V2H8v4a4 4 0 0 0 4 4Z" />
      <path d="M12 22v-6" />
      <path d="M12 13a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6Z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

function StrategyIcon({ type }: { type: string }) {
  if (type === "thetanuts") {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    );
  }
  if (type === "aerodrome") {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    );
  }
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}


export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address,
  });

  // Contract hooks - read real data when deployed
  const { data: idrxBalance } = useIDRXBalance(address);
  const { position } = useUserPosition(address);
  const { balance: vaultBalance } = useUserTotalBalance(address);
  const { breakdown } = usePositionBreakdown(address);

  // Check if contracts are deployed
  const contractsDeployed = isContractDeployed(chainId);

  // Check if user has any deposits
  const hasDeposits = position && parseFloat(position.totalDeposited) > 0;

  // Calculate portfolio data from contracts (real data only)
  const portfolioData = useMemo(() => {
    if (!contractsDeployed || !hasDeposits) {
      return null; // No data to show
    }

    const totalValue = parseFloat(vaultBalance);
    // Calculate weighted APY based on allocations (allocations are already percentages)
    const optionsApy = (position!.optionsAllocation / 100) * STRATEGY_APYS.options;
    const lpApy = (position!.lpAllocation / 100) * STRATEGY_APYS.lp;
    const stakingApy = (position!.stakingAllocation / 100) * STRATEGY_APYS.staking;
    const weightedApy = (optionsApy + lpApy + stakingApy).toFixed(1);

    return {
      totalValue: totalValue,
      totalYield: parseFloat(weightedApy),
      strategies: [
        {
          id: "thetanuts",
          name: "Thetanuts Options",
          value: breakdown ? parseFloat(breakdown.optionsValue) : totalValue * position!.optionsAllocation / 100,
          allocation: position!.optionsAllocation,
          apy: STRATEGY_APYS.options,
          status: "active" as const,
        },
        {
          id: "aerodrome",
          name: "Aerodrome LP",
          value: breakdown ? parseFloat(breakdown.lpValue) : totalValue * position!.lpAllocation / 100,
          allocation: position!.lpAllocation,
          apy: STRATEGY_APYS.lp,
          status: "active" as const,
        },
        {
          id: "staking",
          name: "IDRX Staking",
          value: breakdown ? parseFloat(breakdown.stakingValue) : totalValue * position!.stakingAllocation / 100,
          allocation: position!.stakingAllocation,
          apy: STRATEGY_APYS.staking,
          status: "active" as const,
        },
      ],
    };
  }, [contractsDeployed, hasDeposits, position, vaultBalance, breakdown]);

  // Gamification state
  const {
    state: gamificationState,
    checkIn,
    completeMission,
  } = useGamification();

  // Check-in on mount and complete first_steps mission
  useEffect(() => {
    if (isConnected) {
      checkIn();
      completeMission("first_steps");
    }
  }, [isConnected, checkIn, completeMission]);

  const growthStage = portfolioData ? getGrowthStage(portfolioData.totalValue) : 1;
  const streak = gamificationState.streak.currentStreak;
  const completedMissions = gamificationState.missions.filter(
    (m) => m.completed
  ).length;
  const totalMissions = gamificationState.missions.length;

  // Format IDRX balance for display
  const formattedIDRXBalance = useMemo(() => {
    if (idrxBalance) {
      return formatIDRX(Number(idrxBalance) / 100); // IDRX has 2 decimals
    }
    return "0";
  }, [idrxBalance]);

  return (
    <RequireWallet>
      <div className="min-h-dvh bg-cream">
        {/* Animated Header */}
        <Header />

        <main className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pt-28 sm:pt-24">
          {/* Welcome Section */}
          <FadeUp className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-teal text-balance">
                  Portfolio Overview
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Track IDRX growth
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-muted-foreground mb-0.5">
                  Wallet IDRX
                </p>
                <p className="text-base sm:text-lg font-semibold text-foreground tabular-nums">
                  {formattedIDRXBalance} IDRX
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Portfolio Overview Card */}
            <FadeUp className="lg:col-span-2">
              <Card>
                <CardHeader className="px-4 sm:px-6 pb-2 sm:pb-4">
                  <CardTitle className="font-display text-lg sm:text-xl text-teal">
                    Total Portfolio
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    IDRX across all strategies
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  {portfolioData ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div>
                          <p className="text-2xl sm:text-4xl font-bold text-teal tabular-nums">
                            <AnimatedNumber
                              value={portfolioData.totalValue}
                              duration={1.2}
                            />
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            IDRX
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                          >
                            <Badge className="bg-teal text-primary-foreground">
                              +{portfolioData.totalYield}% APY
                            </Badge>
                          </motion.div>
                        </div>
                      </div>

                      {/* Strategy Allocation Breakdown with Animated Progress */}
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-foreground">
                          Strategy Allocation
                        </p>
                        {portfolioData.strategies.map((strategy, index) => (
                          <div key={strategy.id} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-foreground">
                                {strategy.name}
                              </span>
                              <span className="text-muted-foreground tabular-nums">
                                {strategy.allocation}%
                              </span>
                            </div>
                            <AnimatedProgress
                              value={strategy.allocation}
                              delay={0.2 + index * 0.15}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream-dark flex items-center justify-center">
                        <SeedlingIcon className="w-8 h-8 text-teal" />
                      </div>
                      <p className="text-lg font-medium text-foreground mb-2">
                        No deposits yet
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start growing your IDRX by making your first deposit
                      </p>
                      <Link href="/deposit">
                        <Button className="bg-teal hover:bg-teal-light text-white">
                          Make First Deposit
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeUp>

            {/* Garden Growth Visualization */}
            <FadeUp>
              <Card>
                <CardHeader className="px-4 sm:px-6 pb-2 sm:pb-4">
                  <CardTitle className="font-display text-base sm:text-lg text-teal">
                    Garden Growth
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Stage {growthStage}/5
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center px-4 sm:px-6">
                  <FloatingElement delay={0.5}>
                    <div className="w-full aspect-square max-w-[160px] sm:max-w-[200px] flex items-center justify-center">
                      <GardenPlant stage={growthStage} />
                    </div>
                  </FloatingElement>
                  <motion.p
                    className="text-xs sm:text-sm text-muted-foreground text-center mt-3 sm:mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {growthStage < 5 ? "Keep growing!" : "Flourishing"}
                  </motion.p>
                </CardContent>
              </Card>
            </FadeUp>
          </div>

          {/* Strategy Cards with Stagger - Only show if user has deposits */}
          {portfolioData && (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {portfolioData.strategies.map((strategy) => (
                <AnimatedCard key={strategy.id}>
                  <Card className="h-full">
                    <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
                      <div className="flex items-center justify-between">
                        <motion.div
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cream-dark flex items-center justify-center text-teal"
                          whileHover={{ rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <StrategyIcon type={strategy.id} />
                        </motion.div>
                        <Badge
                          variant="outline"
                          className="text-teal border-teal text-[10px] sm:text-xs"
                        >
                          {strategy.status}
                        </Badge>
                      </div>
                      <CardTitle className="font-display text-sm sm:text-base text-foreground mt-2 sm:mt-3">
                        {strategy.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6">
                      <p className="text-xl sm:text-2xl font-bold text-teal tabular-nums">
                        <AnimatedNumber value={strategy.value} duration={1} />
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        IDRX
                      </p>
                      <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            APY
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-gold tabular-nums">
                            {strategy.apy}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
            ))}
          </StaggerContainer>
          )}

          {/* Quick Actions and Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Quick Actions */}
            <FadeUp className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader className="px-3 sm:px-6 pb-2 sm:pb-4">
                  <CardTitle className="font-display text-base sm:text-lg text-teal">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 sm:gap-3 px-3 sm:px-6">
                  <Link href="/deposit" className="block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button className="w-full justify-start gap-2 sm:gap-3 bg-teal hover:bg-teal-light transition-colors text-sm">
                        <DepositIcon />
                        Deposit
                      </Button>
                    </motion.div>
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 sm:gap-3 text-teal border-teal hover:bg-cream-dark transition-colors text-sm"
                      onClick={() => alert('Withdraw feature coming soon!')}
                    >
                      <WithdrawIcon />
                      Withdraw
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 sm:gap-3 text-teal border-teal hover:bg-cream-dark transition-colors text-sm"
                      onClick={() => alert('Rebalance feature coming soon!')}
                    >
                      <RebalanceIcon />
                      Rebalance
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </FadeUp>

            {/* Achievements Card */}
            <FadeUp className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader className="px-3 sm:px-6 pb-2 sm:pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-gold/10 flex items-center justify-center">
                        <TrophyIcon className="size-4 text-gold-dark" />
                      </div>
                      <CardTitle className="font-display text-base sm:text-lg text-teal">
                        Achievements
                      </CardTitle>
                    </div>
                    <Link href="/achievements">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-teal hover:text-teal-dark text-xs"
                      >
                        View all
                        <ArrowRightIcon className="ml-1 size-3" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <div className="flex items-center gap-6">
                    {/* Streak */}
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl bg-terracotta/10 flex items-center justify-center">
                        <FlameIcon className="size-6 text-terracotta" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-terracotta tabular-nums">
                          {streak}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          day streak
                        </p>
                      </div>
                    </div>
                    {/* Missions Progress */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground">
                          Missions
                        </p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {completedMissions}/{totalMissions}
                        </p>
                      </div>
                      <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-teal rounded-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (completedMissions / totalMissions) * 100
                            }%`,
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeUp>

            {/* AI Advisor Card */}
            <FadeUp>
              <Card>
                <CardHeader className="px-3 sm:px-6 pb-2 sm:pb-4">
                  <CardTitle className="font-display text-base sm:text-lg text-teal">
                    AI Advisor
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Get personalized advice
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <div className="text-center py-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-teal/10 flex items-center justify-center">
                      <SparklesIcon className="w-6 h-6 text-teal" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Chat with our AI to get personalized investment strategies
                    </p>
                    <Link href="/chat">
                      <Button
                        variant="outline"
                        className="text-teal border-teal hover:bg-cream-dark"
                      >
                        Start Chat
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          </div>
        </main>
      </div>
    </RequireWallet>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
