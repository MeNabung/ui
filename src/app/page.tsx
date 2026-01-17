"use client";

import Link from "next/link";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Header } from "@/components/Header";
import {
  motion,
  FadeUp,
  BouncyCard,
  BouncyStagger,
  PopScale,
  WiggleOnHover,
  bouncyFadeUpVariants,
} from "@/components/motion";
import {
  HeroDecorations,
  DotGridPattern,
  FloatingCircle,
  FloatingSquare,
  FloatingPlus,
  FloatingTriangle,
} from "@/components/GeometricDecorations";

// Animated icons from hover.dev
import AnimatedLockIcon from "@/components/ui/lock-icon";
import AnimatedShieldCheck from "@/components/ui/shield-check";
import AnimatedRocketIcon from "@/components/ui/rocket-icon";
import AnimatedCpuIcon from "@/components/ui/cpu-icon";
import AnimatedGlobeIcon from "@/components/ui/globe-icon";
import AnimatedCoinBitcoinIcon from "@/components/ui/coin-bitcoin-icon";
import AnimatedSparklesIcon from "@/components/ui/sparkles-icon";
import AnimatedBatteryChargingIcon from "@/components/ui/battery-charging-icon";
import AnimatedFocusIcon from "@/components/ui/focus-icon";

// SVG Icons as components
function BrainIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
}

function SproutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" />
    </svg>
  );
}

function TrendingUpIcon({ className }: { className?: string }) {
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
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function CoinsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
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
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Marquee keywords with icon components
const marqueeItems = [
  { text: "IDRX Stablecoin", Icon: AnimatedCoinBitcoinIcon },
  { text: "AI-Powered", Icon: AnimatedCpuIcon },
  { text: "Base L2", Icon: AnimatedBatteryChargingIcon },
  { text: "Auto-Compound", Icon: AnimatedSparklesIcon },
  { text: "Non-Custodial", Icon: AnimatedLockIcon },
  { text: "Staking Rewards", Icon: AnimatedSparklesIcon },
  { text: "Options Vault", Icon: AnimatedFocusIcon },
  { text: "Liquidity Pool", Icon: AnimatedGlobeIcon },
];

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-dvh bg-cream overflow-hidden">
      {/* Animated Header */}
      <Header />

      {/* Hero Section - Playful Geometric Style */}
      <section className="relative min-h-[90vh] pt-16">
        {/* Geometric Decorations */}
        <HeroDecorations />

        <div className="relative z-base max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content - 7 columns with bouncy entrance */}
            <BouncyStagger className="lg:col-span-7 space-y-6">
              <motion.div variants={bouncyFadeUpVariants} className="space-y-5">
                {/* Playful badge */}
                <motion.div
                  className="inline-flex items-center gap-2 bg-gold/10 border-2 border-gold px-4 py-2 rounded-full"
                  style={{ boxShadow: '3px 3px 0px var(--gold-dark)' }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                >
                  <SparkleIcon className="w-4 h-4 text-gold" />
                  <span className="text-gold font-semibold text-sm">
                    DeFi Savings Made Simple
                  </span>
                </motion.div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-teal-dark leading-[1.1] text-balance">
                  Grow Your{" "}
                  <span className="text-gold">IDRX</span>{" "}
                  with{" "}
                  <span className="relative inline-block squiggle-underline">
                    AI-Powered
                  </span>{" "}
                  Savings
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-xl text-pretty">
                  MeNabung is your smart DeFi savings advisor on <strong className="text-teal">Base</strong>.
                  Get personalized strategies to maximize your IDRX returns through staking, liquidity pools, and options vaults.
                </p>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                variants={bouncyFadeUpVariants}
                className="flex flex-wrap gap-6 py-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center">
                    <TrendingUpIcon className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-teal-dark tabular-nums">4-15%</div>
                    <div className="text-xs text-muted-foreground">APY Range</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                    <CoinsIcon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-teal-dark">3</div>
                    <div className="text-xs text-muted-foreground">DeFi Strategies</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-terracotta/10 rounded-lg flex items-center justify-center">
                    <ZapIcon className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-teal-dark">Base L2</div>
                    <div className="text-xs text-muted-foreground">Low Gas Fees</div>
                  </div>
                </div>
              </motion.div>

              {/* CTA Section - Candy Buttons */}
              <motion.div
                variants={bouncyFadeUpVariants}
                className="flex flex-col sm:flex-row gap-4 pt-2"
              >
                {isConnected ? (
                  <>
                    <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        asChild
                        size="lg"
                        className="bg-teal hover:bg-teal-dark text-white px-8 h-12 btn-candy font-semibold"
                      >
                        <Link href="/chat">
                          Chat with AI Advisor
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-12 border-2 border-teal text-teal hover:bg-teal/5 btn-candy"
                        style={{ boxShadow: '3px 3px 0px var(--teal-dark)' }}
                      >
                        <Link href="/quiz">Take Risk Quiz</Link>
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground py-2">
                    Connect your wallet above to start saving
                  </p>
                )}
              </motion.div>

              {/* Trust Indicators - Playful Pills */}
              <motion.div
                variants={bouncyFadeUpVariants}
                className="flex flex-wrap items-center gap-3 pt-4"
              >
                <motion.div
                  className="flex items-center gap-2 bg-white border-2 border-teal/20 px-3 py-1.5 rounded-full"
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <LockIcon className="w-4 h-4 text-teal" />
                  <span className="text-sm font-medium text-teal-dark">
                    Non-custodial
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 bg-white border-2 border-teal/20 px-3 py-1.5 rounded-full"
                  whileHover={{ scale: 1.05, rotate: -1 }}
                >
                  <span className="text-sm font-medium text-teal">
                    Built on Base
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 bg-white border-2 border-teal/20 px-3 py-1.5 rounded-full"
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    Powered by IDRX
                  </span>
                </motion.div>
              </motion.div>
            </BouncyStagger>

            {/* Right Content - 5 columns - Playful Card */}
            <PopScale className="lg:col-span-5">
              <div className="relative">
                {/* Main Card - Tilted with hard shadow */}
                <motion.div
                  initial={{ rotate: -2 }}
                  whileHover={{ rotate: 0, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="bg-white border-2 border-teal-dark card-playful card-playful-tilted">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <WiggleOnHover>
                          <div className="w-12 h-12 bg-teal rounded-xl flex items-center justify-center" style={{ boxShadow: '2px 2px 0px var(--teal-dark)' }}>
                            <SproutIcon className="w-6 h-6 text-white" />
                          </div>
                        </WiggleOnHover>
                        <motion.span
                          className="text-xs font-bold text-white bg-gold px-3 py-1.5 rounded-full"
                          style={{ boxShadow: '2px 2px 0px var(--gold-dark)' }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Live Preview
                        </motion.span>
                      </div>
                      <CardTitle className="text-teal-dark font-display text-xl pt-3">
                        Your Savings Dashboard
                      </CardTitle>
                      <CardDescription className="text-pretty">
                        See how your IDRX grows with smart DeFi strategies
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Balance Display */}
                      <div className="bg-cream-dark border-2 border-teal/10 rounded-xl p-4">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-muted-foreground">
                            Total Savings
                          </span>
                          <span className="text-2xl font-display font-bold text-teal-dark tabular-nums">
                            0
                          </span>
                        </div>
                        <div className="text-right text-sm text-muted-foreground font-medium">
                          IDRX
                        </div>
                      </div>

                      {/* Strategy Allocation Preview */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-medium">
                            Default: Balanced
                          </span>
                          <span className="font-bold text-gold">~10% APY</span>
                        </div>
                        <div className="flex gap-1 h-3">
                          <motion.div
                            className="bg-teal rounded-l-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "40%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                          />
                          <motion.div
                            className="bg-gold"
                            initial={{ width: 0 }}
                            whileInView={{ width: "40%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                          />
                          <motion.div
                            className="bg-terracotta rounded-r-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "20%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Staking 40%</span>
                          <span>LP 40%</span>
                          <span>Options 20%</span>
                        </div>
                      </div>

                      {/* Stats Row - Playful Cards */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <motion.div
                          className="text-center p-3 bg-teal/10 border-2 border-teal/30 rounded-xl"
                          whileHover={{ scale: 1.02, rotate: 1 }}
                        >
                          <div className="text-lg font-display font-bold text-teal tabular-nums">
                            0
                          </div>
                          <div className="text-xs font-medium text-muted-foreground">IDRX Earned</div>
                        </motion.div>
                        <motion.div
                          className="text-center p-3 bg-gold/10 border-2 border-gold/30 rounded-xl"
                          whileHover={{ scale: 1.02, rotate: -1 }}
                        >
                          <div className="text-lg font-display font-bold text-gold tabular-nums">
                            🔥 0
                          </div>
                          <div className="text-xs font-medium text-muted-foreground">
                            Day Streak
                          </div>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Floating decorative elements around card */}
                <FloatingSquare
                  size={40}
                  color="gold"
                  rotate
                  className="-top-6 -right-6"
                  delay={0.3}
                />
                <FloatingCircle
                  size={60}
                  color="terracotta"
                  variant="filled"
                  className="-bottom-4 -left-4"
                  delay={0.8}
                />
                <FloatingTriangle
                  size={25}
                  color="teal"
                  className="bottom-20 -right-8"
                  delay={1.2}
                />
              </div>
            </PopScale>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-6 bg-teal-dark border-y-4 border-teal overflow-hidden">
        <div className="marquee">
          <div className="marquee-content">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white font-semibold whitespace-nowrap">
                <item.Icon size={20} color="currentColor" strokeWidth={2} />
                <span>{item.text}</span>
                <span className="text-gold mx-4">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Playful Cards */}
      <section className="py-24 bg-white relative overflow-hidden">
        <DotGridPattern className="opacity-30" />
        <FloatingCircle size={150} color="teal" variant="outline" className="top-10 -left-20" delay={0} />
        <FloatingSquare size={60} color="gold" rotate className="bottom-20 right-10" delay={1} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 bg-teal/10 border-2 border-teal px-4 py-2 rounded-full mb-6"
              style={{ boxShadow: '3px 3px 0px var(--teal-dark)' }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <span className="text-teal font-semibold text-sm">
                Why MeNabung?
              </span>
            </motion.div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-teal-dark text-balance">
              Smart Savings Made Simple
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed for Indonesian users who want to grow their IDRX with confidence
            </p>
          </FadeUp>

          <BouncyStagger className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BrainIcon className="w-6 h-6" />}
              title="AI-Powered Advisor"
              description="Chat in Bahasa Indonesia to get personalized DeFi strategies based on your risk profile and savings goals"
              color="teal"
              delay={0}
            />
            <FeatureCard
              icon={<SproutIcon className="w-6 h-6" />}
              title="Auto-Compound Returns"
              description="Your IDRX earnings automatically reinvest across staking, liquidity pools, and options vaults"
              color="gold"
              delay={0.1}
            />
            <FeatureCard
              icon={<ShieldIcon className="w-6 h-6" />}
              title="Your Keys, Your Crypto"
              description="100% non-custodial. We never hold your funds. Connect your wallet and stay in control"
              color="terracotta"
              delay={0.2}
            />
          </BouncyStagger>
        </div>
      </section>

      {/* Strategies Section - NEW */}
      <section className="py-24 bg-cream relative overflow-hidden">
        <DotGridPattern />
        <FloatingPlus size={30} color="terracotta" className="top-20 left-[10%]" delay={0} />
        <FloatingCircle size={80} color="gold" variant="outline" className="bottom-20 right-[15%]" delay={1} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 bg-terracotta/10 border-2 border-terracotta px-4 py-2 rounded-full mb-6"
              style={{ boxShadow: '3px 3px 0px var(--terracotta)' }}
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              <span className="text-terracotta font-semibold text-sm">
                DeFi Strategies
              </span>
            </motion.div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-teal-dark text-balance">
              Choose Your Risk Profile
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI recommends the best allocation based on your goals and risk tolerance
            </p>
          </FadeUp>

          <BouncyStagger className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <StrategyCard
              name="Conservative"
              icon={<AnimatedShieldCheck size={32} color="var(--teal)" strokeWidth={2} />}
              apy="4-6%"
              description="Prioritize capital preservation with stable staking rewards"
              allocation={[
                { name: "Staking", pct: 70, color: "bg-teal" },
                { name: "LP", pct: 20, color: "bg-gold" },
                { name: "Options", pct: 10, color: "bg-terracotta" },
              ]}
              delay={0}
            />
            <StrategyCard
              name="Balanced"
              icon={<AnimatedFocusIcon size={32} color="var(--gold)" strokeWidth={2} />}
              apy="6-10%"
              description="Mix of stability and growth for steady returns"
              allocation={[
                { name: "Staking", pct: 40, color: "bg-teal" },
                { name: "LP", pct: 40, color: "bg-gold" },
                { name: "Options", pct: 20, color: "bg-terracotta" },
              ]}
              featured
              delay={0.1}
            />
            <StrategyCard
              name="Aggressive"
              icon={<AnimatedRocketIcon size={32} color="var(--terracotta)" strokeWidth={2} />}
              apy="10-15%"
              description="Maximize returns with higher exposure to options vaults"
              allocation={[
                { name: "Staking", pct: 10, color: "bg-teal" },
                { name: "LP", pct: 30, color: "bg-gold" },
                { name: "Options", pct: 60, color: "bg-terracotta" },
              ]}
              delay={0.2}
            />
          </BouncyStagger>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <DotGridPattern className="opacity-20" />
        <FloatingPlus size={30} color="gold" className="top-20 right-[20%]" delay={0} />
        <FloatingCircle size={100} color="teal" variant="outline" className="bottom-10 left-10" delay={1.5} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 bg-gold/10 border-2 border-gold px-4 py-2 rounded-full mb-6"
              style={{ boxShadow: '3px 3px 0px var(--gold-dark)' }}
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              <span className="text-gold font-semibold text-sm">
                How It Works
              </span>
            </motion.div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-teal-dark text-balance">
              Start Growing in 3 Steps
            </h2>
          </FadeUp>

          <BouncyStagger className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <StepCard
              step={1}
              icon={<WalletIcon className="w-6 h-6" />}
              title="Connect Wallet"
              description="Link your Base-compatible wallet like Coinbase Wallet or MetaMask"
            />
            <StepCard
              step={2}
              icon={<MessageIcon className="w-6 h-6" />}
              title="Chat with AI"
              description="Tell our AI your savings goals and risk preferences in Bahasa or English"
            />
            <StepCard
              step={3}
              icon={<ChartIcon className="w-6 h-6" />}
              title="Watch It Grow"
              description="Track your IDRX growth on the dashboard and earn badges along the way"
            />
          </BouncyStagger>
        </div>
      </section>

      {/* CTA Section - Playful */}
      <section className="py-24 bg-teal relative overflow-hidden">
        {/* Geometric decorations */}
        <FloatingCircle size={200} color="gold" variant="outline" className="top-0 -right-20 opacity-20" delay={0} />
        <FloatingSquare size={80} color="gold" className="-bottom-10 left-10 opacity-20" delay={1} />
        <FloatingPlus size={40} color="gold" className="top-20 left-[30%] opacity-30" delay={2} />
        <FloatingTriangle size={30} color="gold" direction="down" className="bottom-32 right-[20%] opacity-25" delay={1.5} />

        <FadeUp className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 border-2 border-white/30 px-4 py-2 rounded-full mb-6"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <SparkleIcon className="w-4 h-4 text-gold" />
            <span className="text-white font-semibold text-sm">
              Start Now
            </span>
          </motion.div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            Ready to Grow Your IDRX?
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto text-pretty text-white/90">
            Join MeNabung and let AI help you build wealth with smart DeFi strategies.
            Your keys, your crypto, your future.
          </p>
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isConnected ? (
              <Button
                asChild
                size="lg"
                className="bg-white text-teal hover:bg-cream px-8 h-14 text-lg font-bold btn-candy btn-candy-light"
              >
                <Link href="/chat">
                  Start Saving Now
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-white text-teal hover:bg-cream px-8 h-14 text-lg font-bold btn-candy btn-candy-light cursor-default"
                onClick={() => document.querySelector<HTMLButtonElement>('[data-testid="ockConnectButton"]')?.click()}
              >
                Connect Wallet to Start
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            )}
          </motion.div>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="bg-teal-dark py-8 sm:py-12 px-4">
        <FadeUp className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <motion.div
              className="flex items-center gap-2.5"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src="/images/logo.png"
                alt="MeNabung"
                width={40}
                height={40}
                className="size-10"
              />
              <span className="font-display font-semibold text-xl text-white">
                MeNabung
              </span>
            </motion.div>
            {/* Stack vertically on mobile, horizontal on sm+ */}
            <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-6 text-xs sm:text-sm text-white/70">
              <span>Built on Base</span>
              <span className="hidden sm:block w-1.5 h-1.5 bg-gold rounded-full" />
              <span>Powered by AI</span>
              <span className="hidden sm:block w-1.5 h-1.5 bg-gold rounded-full" />
              <span>Your Keys, Your Crypto</span>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10 text-center">
            <p className="text-xs sm:text-sm text-white/50">
              {new Date().getFullYear()} MeNabung. Empowering Indonesian savers through decentralized finance.
            </p>
          </div>
        </FadeUp>
      </footer>
    </main>
  );
}

// Feature Card Component - Playful Style
function FeatureCard({
  icon,
  title,
  description,
  color = 'teal',
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: 'teal' | 'gold' | 'terracotta';
  delay?: number;
}) {
  const colorMap = {
    teal: {
      bg: 'bg-teal',
      shadow: 'var(--teal-dark)',
    },
    gold: {
      bg: 'bg-gold',
      shadow: 'var(--gold-dark)',
    },
    terracotta: {
      bg: 'bg-terracotta',
      shadow: 'var(--terracotta)',
    },
  };

  return (
    <BouncyCard delay={delay}>
      <motion.div
        whileHover={{ y: -4, rotate: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="bg-white border-2 border-teal-dark h-full card-playful">
          <CardHeader>
            <WiggleOnHover>
              <div
                className={`w-14 h-14 ${colorMap[color].bg} rounded-xl flex items-center justify-center text-white mb-3`}
                style={{ boxShadow: `3px 3px 0px ${colorMap[color].shadow}` }}
              >
                {icon}
              </div>
            </WiggleOnHover>
            <CardTitle className="font-display text-xl text-teal-dark">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-pretty">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </BouncyCard>
  );
}

// Strategy Card Component - NEW
function StrategyCard({
  name,
  icon,
  apy,
  description,
  allocation,
  featured = false,
  delay = 0,
}: {
  name: string;
  icon: React.ReactNode;
  apy: string;
  description: string;
  allocation: { name: string; pct: number; color: string }[];
  featured?: boolean;
  delay?: number;
}) {
  return (
    <BouncyCard delay={delay}>
      <motion.div
        whileHover={{ y: -6, scale: featured ? 1.02 : 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={featured ? "relative" : ""}
      >
        {featured && (
          <motion.div
            className="absolute -top-4 -right-4 bg-gold text-white text-xs font-bold px-3 py-1.5 rounded-full rotate-12"
            style={{ boxShadow: '2px 2px 0px var(--gold-dark)' }}
            animate={{ rotate: [12, 15, 12] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Popular
          </motion.div>
        )}
        <Card className={`bg-white border-2 h-full ${featured ? 'border-gold shadow-hard-gold' : 'border-teal-dark card-playful'}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              {icon}
              <span className="text-sm font-bold text-gold bg-gold/10 px-3 py-1 rounded-full">
                {apy} APY
              </span>
            </div>
            <CardTitle className="font-display text-xl text-teal-dark pt-2">
              {name}
            </CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Allocation Bar */}
            <div className="flex gap-0.5 h-4 rounded-full overflow-hidden border-2 border-teal/20">
              {allocation.map((item, i) => (
                <motion.div
                  key={item.name}
                  className={`${item.color} ${i === 0 ? 'rounded-l-full' : ''} ${i === allocation.length - 1 ? 'rounded-r-full' : ''}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                />
              ))}
            </div>
            {/* Allocation Labels */}
            <div className="space-y-1">
              {allocation.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-semibold text-teal-dark">{item.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </BouncyCard>
  );
}

// Step Card Component - Playful Style
function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div variants={bouncyFadeUpVariants} className="text-center space-y-4">
      <div className="relative inline-flex">
        <motion.div
          className="w-20 h-20 bg-white border-2 border-teal-dark rounded-2xl flex items-center justify-center text-teal shadow-hard"
          whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          {icon}
        </motion.div>
        <motion.div
          className="absolute -top-3 -right-3 w-8 h-8 bg-gold border-2 border-gold-dark rounded-full flex items-center justify-center"
          style={{ boxShadow: '2px 2px 0px var(--gold-dark)' }}
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3 + step * 0.1,
            type: "spring",
            stiffness: 400,
            damping: 10,
          }}
        >
          <span className="text-white font-bold text-sm">{step}</span>
        </motion.div>
      </div>
      <h3 className="font-display text-xl font-semibold text-teal-dark text-balance">
        {title}
      </h3>
      <p className="text-muted-foreground text-pretty max-w-xs mx-auto">
        {description}
      </p>
    </motion.div>
  );
}
