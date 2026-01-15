'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { motion } from 'motion/react';
import { WalletConnect } from '@/components/WalletConnect';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/quiz', label: 'Risk Quiz' },
  { href: '/chat', label: 'AI Advisor' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/achievements', label: 'Achievements' },
];

export function Header() {
  const pathname = usePathname();
  const { isConnected } = useAccount();
  // Track if this is the initial mount to prevent re-animation on page changes
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Mark as animated after initial mount
    const timer = setTimeout(() => setHasAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-fixed bg-white/90 backdrop-blur-sm border-b border-border safe-top">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="size-8 sm:size-9 bg-teal rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-display font-bold text-base sm:text-lg">M</span>
              </div>
              {/* Decorative dot */}
              <motion.div
                className="absolute -top-0.5 -right-0.5 size-2 sm:size-2.5 bg-gold rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-teal text-base sm:text-lg leading-tight">
                MeNabung
              </span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight tracking-wide hidden xs:block">
                AI DeFi Advisor
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - only show when connected */}
          {isConnected && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'text-teal'
                        : 'text-muted-foreground hover:text-foreground hover:bg-cream'
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-cream-dark rounded-lg -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Wallet Connect */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isConnected && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-cream rounded-full">
                <span className="size-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Connected</span>
              </div>
            )}
            <WalletConnect />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isConnected && (
          <div className="md:hidden flex items-center gap-1.5 pb-2.5 -mx-1 overflow-x-auto scrollbar-none">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap transition-colors flex-shrink-0',
                    isActive
                      ? 'bg-teal text-white'
                      : 'bg-cream text-muted-foreground active:bg-cream-dark'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
