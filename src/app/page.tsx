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
  StaggerContainer,
  AnimatedCard,
  AnimatedButton,
  FloatingElement,
  fadeUpVariants,
} from "@/components/motion";

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

// Batik Pattern SVG Component
function BatikPatternBg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="batik-diamond"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 0L60 30L30 60L0 30z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.08"
          />
          <circle
            cx="30"
            cy="30"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.06"
          />
          <circle
            cx="30"
            cy="30"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            opacity="0.04"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#batik-diamond)" />
    </svg>
  );
}

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-dvh bg-cream">
      {/* Animated Header */}
      <Header />

      {/* Hero Section - Asymmetric Layout */}
      <section className="relative min-h-dvh pt-16 overflow-hidden">
        {/* Batik Pattern Background */}
        <div className="absolute inset-0 text-teal">
          <BatikPatternBg className="w-full h-full" />
        </div>

        {/* Decorative Elements - Organic shapes with floating animation */}
        <FloatingElement
          delay={0}
          className="absolute top-32 right-0 w-96 h-96 bg-gold/5 organic-blob"
        />
        <FloatingElement
          delay={1.5}
          className="absolute bottom-0 left-0 w-80 h-80 bg-teal/5 organic-blob"
        />

        <div className="relative z-base max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content - 7 columns with staggered entrance */}
            <StaggerContainer className="lg:col-span-7 space-y-8">
              <motion.div variants={fadeUpVariants} className="space-y-6">
                <p className="text-gold font-medium tracking-wide uppercase text-sm">
                  AI-Powered DeFi Savings
                </p>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-teal-dark leading-tight text-balance">
                  Grow Your Wealth with Intelligent Savings
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-xl text-pretty">
                  MeNabung combines AI-driven strategy with decentralized
                  finance to help Indonesian users grow their IDRX savings
                  automatically and securely.
                </p>
              </motion.div>

              {/* CTA Section */}
              <motion.div
                variants={fadeUpVariants}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                {isConnected ? (
                  <>
                    <AnimatedButton>
                      <Button
                        asChild
                        size="lg"
                        className="bg-teal hover:bg-teal-dark text-white px-8 h-12"
                      >
                        <Link href="/chat">
                          Start Saving
                          <ArrowRightIcon className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </AnimatedButton>
                    <AnimatedButton>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-12 border-teal text-teal hover:bg-teal/5"
                      >
                        <Link href="/dashboard">View Dashboard</Link>
                      </Button>
                    </AnimatedButton>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Connect your wallet to begin your savings journey
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={fadeUpVariants}
                className="flex flex-wrap items-center gap-6 pt-6 border-t border-border"
              >
                <div className="flex items-center gap-2">
                  <ShieldIcon className="w-5 h-5 text-teal" />
                  <span className="text-sm text-muted-foreground">
                    Non-custodial
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-teal">
                    Built on Base
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Powered by IDRX
                  </span>
                </div>
              </motion.div>
            </StaggerContainer>

            {/* Right Content - 5 columns - Illustration Card */}
            <FadeUp className="lg:col-span-5">
              <div className="relative">
                {/* Main Card */}
                <Card className="shadow-card border-border bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center">
                        <SproutIcon className="w-5 h-5 text-teal" />
                      </div>
                      <span className="text-xs font-medium text-gold bg-gold/10 px-2.5 py-1 rounded-full">
                        Growing
                      </span>
                    </div>
                    <CardTitle className="text-teal-dark font-display text-lg pt-3">
                      Your Financial Garden
                    </CardTitle>
                    <CardDescription className="text-pretty">
                      Watch your savings flourish with AI optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Mock Data Display */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-muted-foreground">
                          Total Savings
                        </span>
                        <span className="text-2xl font-display font-semibold text-teal-dark tabular-nums">
                          12,450,000
                        </span>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        IDRX
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Monthly Goal
                        </span>
                        <span className="font-medium text-teal">78%</span>
                      </div>
                      <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-teal rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: "78%" }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1,
                            delay: 0.5,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center p-3 bg-cream rounded-lg">
                        <div className="text-lg font-display font-semibold text-gold tabular-nums">
                          +8.2%
                        </div>
                        <div className="text-xs text-muted-foreground">APY</div>
                      </div>
                      <div className="text-center p-3 bg-cream rounded-lg">
                        <div className="text-lg font-display font-semibold text-teal tabular-nums">
                          14
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Days Active
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating decorative element */}
                <FloatingElement
                  delay={0.5}
                  className="absolute -top-4 -right-4 w-24 h-24 bg-gold/10 rounded-2xl -z-10"
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <p className="text-gold font-medium tracking-wide uppercase text-sm mb-3">
              Features
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-teal-dark text-balance">
              Smart Savings Made Simple
            </h2>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BrainIcon className="w-6 h-6" />}
              title="AI-Powered Advisor"
              description="Receive personalized recommendations based on your financial goals and risk tolerance"
            />
            <FeatureCard
              icon={<SproutIcon className="w-6 h-6" />}
              title="Auto-Compound Returns"
              description="Your savings automatically reinvest, maximizing your growth potential over time"
            />
            <FeatureCard
              icon={<ShieldIcon className="w-6 h-6" />}
              title="Secure and Transparent"
              description="Non-custodial design means you always maintain full control of your funds"
            />
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-cream relative">
        {/* Subtle pattern */}
        <div className="absolute inset-0 text-teal opacity-50">
          <BatikPatternBg className="w-full h-full" />
        </div>

        <div className="relative z-base max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <p className="text-gold font-medium tracking-wide uppercase text-sm mb-3">
              How It Works
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-teal-dark text-balance">
              Three Steps to Financial Growth
            </h2>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <StepCard
              step={1}
              icon={<WalletIcon className="w-5 h-5" />}
              title="Connect Your Wallet"
              description="Link your Base-compatible wallet securely to get started with MeNabung"
            />
            <StepCard
              step={2}
              icon={<MessageIcon className="w-5 h-5" />}
              title="Define Your Goals"
              description="Chat with our AI advisor to set your savings targets and risk preferences"
            />
            <StepCard
              step={3}
              icon={<ChartIcon className="w-5 h-5" />}
              title="Watch Your Growth"
              description="Your AI advisor optimizes your strategy while you track your progress"
            />
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-teal relative overflow-hidden">
        {/* Decorative elements with floating animation */}
        <FloatingElement
          delay={0}
          className="absolute top-0 right-0 w-64 h-64 bg-teal-light/20 organic-blob"
        />
        <FloatingElement
          delay={2}
          className="absolute bottom-0 left-0 w-48 h-48 bg-gold/10 organic-blob"
        />

        <FadeUp className="relative z-base max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-6 text-balance">
            Ready to Grow Your Savings?
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto text-pretty text-white">
            Join MeNabung today and let AI-powered strategies help you build
            wealth in the Indonesian digital economy.
          </p>
          {isConnected ? (
            <AnimatedButton className="inline-block">
              <Button
                asChild
                size="lg"
                className="bg-white text-teal hover:bg-cream px-8 h-12"
              >
                <Link href="/chat">
                  Start Your Journey
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </AnimatedButton>
          ) : (
            <AnimatedButton className="inline-block">
              <WalletConnect variant="light" />
            </AnimatedButton>
          )}
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="bg-teal-dark py-8 sm:py-12 px-4">
        <FadeUp className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-semibold">M</span>
              </div>
              <span className="font-display font-semibold text-lg text-white">
                MeNabung
              </span>
            </div>
            {/* Stack vertically on mobile, horizontal on sm+ */}
            <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-6 text-xs sm:text-sm text-white/70">
              <span>Built on Base</span>
              <span className="hidden sm:block w-1 h-1 bg-white/30 rounded-full" />
              <span>Powered by AI</span>
              <span className="hidden sm:block w-1 h-1 bg-white/30 rounded-full" />
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

// Feature Card Component with AnimatedCard wrapper
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <AnimatedCard>
      <Card className="shadow-card border-border h-full">
        <CardHeader>
          <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center text-teal mb-2">
            {icon}
          </div>
          <CardTitle className="font-display text-xl text-teal-dark">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-pretty">{description}</p>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}

// Step Card Component with FadeUp animation
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
    <motion.div variants={fadeUpVariants} className="text-center space-y-4">
      <div className="relative inline-flex">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-card flex items-center justify-center text-teal">
          {icon}
        </div>
        <motion.div
          className="absolute -top-2 -right-2 w-7 h-7 bg-gold rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3 + step * 0.1,
            type: "spring",
            stiffness: 400,
            damping: 15,
          }}
        >
          <span className="text-white font-semibold text-sm">{step}</span>
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
