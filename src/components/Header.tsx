'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { motion } from 'motion/react';
import { WalletConnect } from '@/components/WalletConnect';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/chat', label: 'AI Advisor' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/achievements', label: 'Achievements' },
];

export function Header() {
  const pathname = usePathname();
  const { isConnected } = useAccount();

  return (
    <header className="fixed top-0 left-0 right-0 z-fixed bg-white/90 backdrop-blur-sm border-b border-border safe-top">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 sm:h-16">
          {/* Logo - Left */}
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
            <span className="font-display font-semibold text-teal text-base sm:text-lg">
              MeNabung
            </span>
          </Link>

          {/* Desktop Navigation - Center (only when connected) */}
          {isConnected && (
            <div className="hidden md:flex items-center gap-1 mx-auto">
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

          {/* Spacer when not connected */}
          {!isConnected && <div className="flex-1" />}

          {/* Right side: Risk Quiz + Connect */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {isConnected && (
              <Link
                href="/quiz"
                className={cn(
                  'hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                  pathname === '/quiz'
                    ? 'bg-gold/10 text-gold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-cream'
                )}
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                'px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors',
                pathname === '/quiz'
                  ? 'bg-gold text-white'
                  : 'bg-cream text-muted-foreground active:bg-cream-dark'
              )}
            >
              Quiz
            </Link>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors',
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
