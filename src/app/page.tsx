"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { WalletConnect } from "@/components/WalletConnect";
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
} from "@/components/GeometricDecorations";

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

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-dvh bg-cream overflow-hidden">
      {/* Animated Header */}
      <Header />

      {/* Hero Section - Playful Geometric Style */}
      <section className="relative min-h-dvh pt-16">
        {/* Geometric Decorations */}
        <HeroDecorations />

        <div className="relative z-base max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content - 7 columns with bouncy entrance */}
            <BouncyStagger className="lg:col-span-7 space-y-8">
              <motion.div variants={bouncyFadeUpVariants} className="space-y-6">
                {/* Playful badge */}
                <motion.div
                  className="inline-flex items-center gap-2 bg-gold/10 border-2 border-gold px-4 py-2 rounded-full shadow-hard-sm"
                  style={{ boxShadow: '3px 3px 0px var(--gold-dark)' }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                >
                  <SparkleIcon className="w-4 h-4 text-gold" />
                  <span className="text-gold font-semibold text-sm">
                    AI-Powered DeFi Savings
                  </span>
                </motion.div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-teal-dark leading-tight text-balance">
                  Grow Your Wealth with{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">Intelligent</span>
                    <motion.span
                      className="absolute -bottom-2 left-0 w-full h-3 bg-gold/30 -z-0"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      style={{ originX: 0 }}
                    />
                  </span>{" "}
                  Savings
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-xl text-pretty">
                  MeNabung combines AI-driven strategy with decentralized
                  finance to help Indonesian users grow their IDRX savings
                  automatically and securely.
                </p>
              </motion.div>

              {/* CTA Section - Candy Buttons */}
              <motion.div
                variants={bouncyFadeUpVariants}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                {isConnected ? (
                  <>
                    <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        asChild
                        size="lg"
                        className="bg-teal hover:bg-teal-dark text-white px-8 h-12 btn-candy"
                      >
                        <Link href="/chat">
                          Start Saving
                          <ArrowRightIcon className="w-4 h-4 ml-1" />
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
                        <Link href="/dashboard">View Dashboard</Link>
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Connect your wallet to begin your savings journey
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Trust Indicators - Playful Pills */}
              <motion.div
                variants={bouncyFadeUpVariants}
                className="flex flex-wrap items-center gap-3 pt-6"
              >
                <motion.div
                  className="flex items-center gap-2 bg-white border-2 border-teal/20 px-3 py-1.5 rounded-full"
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <ShieldIcon className="w-4 h-4 text-teal" />
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
                          <div className="w-12 h-12 bg-teal rounded-xl flex items-center justify-center shadow-hard-sm" style={{ boxShadow: '2px 2px 0px var(--teal-dark)' }}>
                            <SproutIcon className="w-6 h-6 text-white" />
                          </div>
                        </WiggleOnHover>
                        <motion.span
                          className="text-xs font-bold text-white bg-gold px-3 py-1.5 rounded-full shadow-hard-sm"
                          style={{ boxShadow: '2px 2px 0px var(--gold-dark)' }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Growing
                        </motion.span>
                      </div>
                      <CardTitle className="text-teal-dark font-display text-xl pt-3">
                        Your Financial Garden
                      </CardTitle>
                      <CardDescription className="text-pretty">
                        Watch your savings flourish with AI optimization
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Mock Data Display */}
                      <div className="bg-cream-dark border-2 border-teal/10 rounded-xl p-4">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-muted-foreground">
                            Total Savings
                          </span>
                          <span className="text-2xl font-display font-bold text-teal-dark tabular-nums">
                            12,450,000
                          </span>
                        </div>
                        <div className="text-right text-sm text-muted-foreground font-medium">
                          IDRX
                        </div>
                      </div>

                      {/* Progress Bar - Playful */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-medium">
                            Monthly Goal
                          </span>
                          <span className="font-bold text-teal">78%</span>
                        </div>
                        <div className="h-3 bg-cream-dark border-2 border-teal/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-teal rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "78%" }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              delay: 0.5,
                              ease: [0.34, 1.56, 0.64, 1], // Bouncy ease
                            }}
                          />
                        </div>
                      </div>

                      {/* Stats Row - Playful Cards */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <motion.div
                          className="text-center p-3 bg-gold/10 border-2 border-gold/30 rounded-xl"
                          whileHover={{ scale: 1.02, rotate: 1 }}
                        >
                          <div className="text-xl font-display font-bold text-gold tabular-nums">
                            +8.2%
                          </div>
                          <div className="text-xs font-medium text-muted-foreground">APY</div>
                        </motion.div>
                        <motion.div
                          className="text-center p-3 bg-teal/10 border-2 border-teal/30 rounded-xl"
                          whileHover={{ scale: 1.02, rotate: -1 }}
                        >
                          <div className="text-xl font-display font-bold text-teal tabular-nums">
                            14
                          </div>
                          <div className="text-xs font-medium text-muted-foreground">
                            Days Active
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
              </div>
            </PopScale>
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
              className="inline-flex items-center gap-2 bg-teal/10 border-2 border-teal px-4 py-2 rounded-full shadow-hard-sm mb-6"
              style={{ boxShadow: '3px 3px 0px var(--teal-dark)' }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <span className="text-teal font-semibold text-sm">
                Features
              </span>
            </motion.div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-teal-dark text-balance">
              Smart Savings Made Simple
            </h2>
          </FadeUp>

          <BouncyStagger className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BrainIcon className="w-6 h-6" />}
              title="AI-Powered Advisor"
              description="Receive personalized recommendations based on your financial goals and risk tolerance"
              color="teal"
              delay={0}
            />
            <FeatureCard
              icon={<SproutIcon className="w-6 h-6" />}
              title="Auto-Compound Returns"
              description="Your savings automatically reinvest, maximizing your growth potential over time"
              color="gold"
              delay={0.1}
            />
            <FeatureCard
              icon={<ShieldIcon className="w-6 h-6" />}
              title="Secure and Transparent"
              description="Non-custodial design means you always maintain full control of your funds"
              color="terracotta"
              delay={0.2}
            />
          </BouncyStagger>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-cream relative overflow-hidden">
        <DotGridPattern />
        <FloatingPlus size={30} color="gold" className="top-20 right-[20%]" delay={0} />
        <FloatingCircle size={100} color="teal" variant="outline" className="bottom-10 left-10" delay={1.5} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 bg-gold/10 border-2 border-gold px-4 py-2 rounded-full shadow-hard-sm mb-6"
              style={{ boxShadow: '3px 3px 0px var(--gold-dark)' }}
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              <span className="text-gold font-semibold text-sm">
                How It Works
              </span>
            </motion.div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-teal-dark text-balance">
              Three Steps to Financial Growth
            </h2>
          </FadeUp>

          <BouncyStagger className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <StepCard
              step={1}
              icon={<WalletIcon className="w-6 h-6" />}
              title="Connect Your Wallet"
              description="Link your Base-compatible wallet securely to get started with MeNabung"
            />
            <StepCard
              step={2}
              icon={<MessageIcon className="w-6 h-6" />}
              title="Define Your Goals"
              description="Chat with our AI advisor to set your savings targets and risk preferences"
            />
            <StepCard
              step={3}
              icon={<ChartIcon className="w-6 h-6" />}
              title="Watch Your Growth"
              description="Your AI advisor optimizes your strategy while you track your progress"
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

        <FadeUp className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 border-2 border-white/30 px-4 py-2 rounded-full mb-6"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <SparkleIcon className="w-4 h-4 text-gold" />
            <span className="text-white font-semibold text-sm">
              Start Today
            </span>
          </motion.div>

          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-6 text-balance">
            Ready to Grow Your Savings?
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto text-pretty text-white/90">
            Join MeNabung today and let AI-powered strategies help you build
            wealth in the Indonesian digital economy.
          </p>
          {isConnected ? (
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-teal hover:bg-cream px-8 h-12 font-semibold btn-candy btn-candy-light"
              >
                <Link href="/chat">
                  Start Your Journey
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <WalletConnect variant="light" />
            </motion.div>
          )}
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
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-hard-sm" style={{ boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
                <span className="text-teal font-display font-bold text-lg">M</span>
              </div>
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
              {new Date().getFullYear()} MeNabung. Empowering Indonesian savers
              through decentralized finance.
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
      border: 'border-teal-dark',
      shadow: 'var(--teal-dark)',
      iconBg: 'bg-teal/10',
    },
    gold: {
      bg: 'bg-gold',
      border: 'border-gold-dark',
      shadow: 'var(--gold-dark)',
      iconBg: 'bg-gold/10',
    },
    terracotta: {
      bg: 'bg-terracotta',
      border: 'border-terracotta',
      shadow: 'var(--terracotta)',
      iconBg: 'bg-terracotta/10',
    },
  };

  return (
    <BouncyCard delay={delay}>
      <motion.div
        whileHover={{ y: -4, rotate: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className={`bg-white border-2 border-teal-dark h-full card-playful`}>
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
          className="absolute -top-3 -right-3 w-8 h-8 bg-gold border-2 border-gold-dark rounded-full flex items-center justify-center shadow-hard-sm"
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
