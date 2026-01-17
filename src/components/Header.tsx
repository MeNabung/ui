"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { WalletConnect } from "@/components/WalletConnect";
import { cn } from "@/lib/utils";
import { fetchAllYields } from "@/lib/yields";
import { analyzeRebalance, filterDismissedSuggestions } from "@/lib/rebalance";
import { getStrategy, getRiskProfile } from "@/lib/strategy-storage";

const navLinks = [
  { href: "/chat", label: "AI Advisor" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/achievements", label: "Achievements" },
];

export function Header() {
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const [hasRebalanceOpportunity, setHasRebalanceOpportunity] = useState(false);
  const isMountedRef = useRef(true);

  // Check for rebalance opportunities
  useEffect(() => {
    isMountedRef.current = true;

    async function checkRebalance() {
      if (!isConnected) return false;

      try {
        const strategy = getStrategy();
        if (!strategy) return false;

        const snapshot = await fetchAllYields();
        const allocation = {
          options: strategy.allocation.options,
          lp: strategy.allocation.lp,
          staking: strategy.allocation.staking,
        };

        // Use a reasonable estimate for total value (will be more accurate on dashboard)
        const result = analyzeRebalance(
          allocation,
          snapshot.yields,
          1000, // 10 IDRX minimum check (2 decimals)
          { riskProfile: getRiskProfile() }
        );

        const activeSuggestions = filterDismissedSuggestions(result.suggestions);
        return result.shouldRebalance && activeSuggestions.length > 0;
      } catch (error) {
        console.error('Failed to check rebalance:', error);
        return false;
      }
    }

    // Initial check
    checkRebalance().then((hasOpportunity) => {
      if (isMountedRef.current) {
        setHasRebalanceOpportunity(hasOpportunity);
      }
    });

    // Re-check every 5 minutes
    const interval = setInterval(() => {
      checkRebalance().then((hasOpportunity) => {
        if (isMountedRef.current) {
          setHasRebalanceOpportunity(hasOpportunity);
        }
      });
    }, 5 * 60 * 1000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [isConnected]);

  return (
    <header className="fixed top-0 left-0 right-0 z-fixed bg-white/90 backdrop-blur-sm border-b border-border safe-top">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 sm:h-16">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/images/logo.png"
                alt="MeNabung"
                width={36}
                height={36}
                className="size-8 sm:size-9"
                priority
              />
            </motion.div>
            <span className="font-display font-semibold text-teal text-lg sm:text-xl">
              MeNabung
            </span>
          </Link>

          {/* Desktop Navigation - Center (only when connected) */}
          {isConnected && (
            <div className="hidden md:flex items-center gap-1 mx-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const showBadge = link.href === '/dashboard' && hasRebalanceOpportunity;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "text-teal"
                        : "text-muted-foreground hover:text-foreground hover:bg-cream",
                    )}
                  >
                    {link.label}
                    {/* Notification badge for rebalance opportunity */}
                    <AnimatePresence>
                      {showBadge && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 size-2.5 bg-gold rounded-full"
                        >
                          <motion.span
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-gold rounded-full opacity-50"
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-cream-dark rounded-lg -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Spacer when not connected */}
          {!isConnected && <div className="flex-1" />}

          {/* Right side: Mini-App + Risk Quiz + Connect */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Mini-App Link */}
            <a
              href="https://menabung-miniapp.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <span className="hidden sm:inline">Mini-App</span>
            </a>
            {isConnected && (
              <Link
                href="/quiz"
                className={cn(
                  "hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                  pathname === "/quiz"
                    ? "bg-gold/10 text-gold"
                    : "text-muted-foreground hover:text-foreground hover:bg-cream",
                )}
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
                Quiz
              </Link>
            )}
            <WalletConnect />
          </div>
        </div>

        {/* Mobile Navigation - Bottom bar style */}
        {isConnected && (
          <div className="md:hidden flex items-center justify-center gap-1 pb-2 -mx-1">
            <Link
              href="/quiz"
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors",
                pathname === "/quiz"
                  ? "bg-gold text-white"
                  : "bg-cream text-muted-foreground active:bg-cream-dark",
              )}
            >
              Quiz
            </Link>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const showBadge = link.href === '/dashboard' && hasRebalanceOpportunity;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-teal text-white"
                      : "bg-cream text-muted-foreground active:bg-cream-dark",
                  )}
                >
                  {link.label}
                  {/* Mobile notification badge */}
                  <AnimatePresence>
                    {showBadge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 size-2 bg-gold rounded-full"
                      />
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
