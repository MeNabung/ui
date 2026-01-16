import type { Metadata } from 'next';
import { Fraunces, DM_Sans } from 'next/font/google';
import './globals.css';
import '@coinbase/onchainkit/styles.css';
import { Providers } from './providers';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'MeNabung - AI DeFi Advisor',
  description: 'Grow your IDRX automatically with AI-powered DeFi strategies on Base',
  keywords: ['DeFi', 'AI', 'IDRX', 'Base', 'Savings', 'Crypto'],
  openGraph: {
    title: 'MeNabung - AI DeFi Advisor',
    description: 'Grow your IDRX automatically with AI-powered DeFi strategies',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
