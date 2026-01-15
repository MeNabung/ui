'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAccount, useDisconnect, useEnsName, useEnsAvatar } from 'wagmi';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import { Avatar, Name, Address, Identity } from '@coinbase/onchainkit/identity';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// Icons
function DashboardIcon({ className }: { className?: string }) {
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
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function LogOutIcon({ className }: { className?: string }) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// Format address for display
function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Generate Dicebear avatar URL from address
function getDicebearAvatar(address: string, size: number = 32): string {
  // Using "thumbs" style for friendly, unique avatars
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${address}&size=${size}&backgroundColor=0D4F4F,C4A35A,B85C38`;
}

interface WalletConnectProps {
  variant?: 'default' | 'light';
}

export function WalletConnect({ variant = 'default' }: WalletConnectProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Copy address to clipboard
  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Not connected - use OnchainKit's ConnectWallet which triggers the modal
  if (!isConnected) {
    const buttonClasses = variant === 'light'
      ? '!bg-white hover:!bg-cream !text-teal font-medium !px-5 !py-2.5 !rounded-xl transition-all duration-200 !shadow-sm hover:!shadow-md !border-0'
      : '!bg-teal hover:!bg-teal-light !text-white font-medium !px-5 !py-2.5 !rounded-xl transition-all duration-200 !shadow-sm hover:!shadow-md !border-0';

    return (
      <Wallet>
        <ConnectWallet className={buttonClasses}>
          <span className="text-sm">Connect Wallet</span>
        </ConnectWallet>
      </Wallet>
    );
  }

  // Connected state with custom dropdown
  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-2 rounded-xl transition-all duration-200',
          'bg-teal hover:bg-teal-light text-white',
          'shadow-sm hover:shadow-md cursor-pointer',
          isOpen && 'bg-teal-light shadow-md'
        )}
        whileTap={{ scale: 0.98 }}
      >
        {/* Avatar - Dicebear */}
        <img
          src={address ? getDicebearAvatar(address, 28) : ''}
          alt="Avatar"
          className="size-7 rounded-full ring-2 ring-white/20 bg-cream"
        />

        {/* Address - hidden on mobile */}
        <span className="hidden sm:inline text-sm font-medium">
          {address ? formatAddress(address) : ''}
        </span>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="size-4 opacity-70" />
        </motion.div>
      </motion.button>

      {/* Custom Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 z-50"
          >
            <div className="bg-white rounded-xl shadow-card-hover border border-border overflow-hidden">
              {/* Identity Section */}
              <div className="p-4 bg-cream-dark border-b border-border">
                <div className="flex items-center gap-3">
                  {/* Large Avatar - Dicebear */}
                  <img
                    src={address ? getDicebearAvatar(address, 48) : ''}
                    alt="Avatar"
                    className="size-12 rounded-full ring-2 ring-teal/20 flex-shrink-0 bg-cream"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Name/Label */}
                    <p className="font-medium text-foreground truncate">
                      Your Wallet
                    </p>
                    {/* Address with copy */}
                    <button
                      onClick={copyAddress}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-teal transition-colors group cursor-pointer"
                    >
                      <span className="font-mono">
                        {address ? formatAddress(address) : ''}
                      </span>
                      <motion.div
                        initial={false}
                        animate={{ scale: copied ? 1.2 : 1 }}
                        transition={{ duration: 0.15 }}
                      >
                        {copied ? (
                          <CheckIcon className="size-3.5 text-teal" />
                        ) : (
                          <CopyIcon className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </motion.div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-cream transition-colors cursor-pointer"
                >
                  <DashboardIcon className="size-5 text-teal" />
                  <span className="font-medium">Dashboard</span>
                </Link>

                <button
                  onClick={() => {
                    disconnect();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/5 transition-colors cursor-pointer border-t border-border"
                >
                  <LogOutIcon className="size-5" />
                  <span className="font-medium">Disconnect</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WalletIdentity() {
  const { address } = useAccount();

  if (!address) return null;

  return (
    <div className="flex items-center gap-3 bg-cream-dark rounded-lg px-4 py-2">
      <img
        src={getDicebearAvatar(address, 32)}
        alt="Avatar"
        className="size-8 rounded-full bg-cream"
      />
      <div>
        <p className="font-medium text-foreground text-sm">
          {formatAddress(address)}
        </p>
      </div>
    </div>
  );
}
