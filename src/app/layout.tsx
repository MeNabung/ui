import type { Metadata } from 'next';
import './globals.css';
import '@coinbase/onchainkit/styles.css';
import { Providers } from './providers';

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
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
