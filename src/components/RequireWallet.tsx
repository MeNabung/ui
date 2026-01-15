'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { WalletConnect } from '@/components/WalletConnect';
import { FadeUp } from '@/components/motion';

interface RequireWalletProps {
  children: React.ReactNode;
}

export function RequireWallet({ children }: RequireWalletProps) {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();

  // Show loading state while checking connection
  if (isConnecting) {
    return (
      <main className="min-h-dvh bg-cream">
        <Header />
        <div className="h-14 sm:h-16" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="size-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  // Show connect prompt if not connected
  if (!isConnected) {
    return (
      <main className="min-h-dvh bg-cream">
        <Header />
        <div className="h-14 sm:h-16" />
        <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
          <FadeUp>
            <div className="text-center space-y-6">
              <div className="size-16 mx-auto bg-teal/10 rounded-2xl flex items-center justify-center">
                <WalletIcon className="size-8 text-teal" />
              </div>
              <div className="space-y-2">
                <h1 className="font-display text-2xl font-semibold text-teal-dark">
                  Connect Your Wallet
                </h1>
                <p className="text-muted-foreground text-pretty">
                  Please connect your wallet to access this feature.
                </p>
              </div>
              <WalletConnect />
            </div>
          </FadeUp>
        </div>
      </main>
    );
  }

  return <>{children}</>;
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
