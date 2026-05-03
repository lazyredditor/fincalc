import type { Metadata } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fincalc.betterapp.org'),
  title: {
    default: 'Fincalc — Financial Calculators by betterapp.org',
    template: '%s · Fincalc',
  },
  description:
    'A clean, fast suite of financial calculators — SIP, SWP, EMI, retirement, mortgages, ISAs, 401(k) and more. Built open-source for betterapp.org.',
  keywords: [
    'SIP calculator', 'SWP calculator', 'EMI calculator', 'mortgage calculator',
    'retirement calculator', '401k calculator', 'ISA calculator', 'PPF calculator',
    'compound interest', 'inflation calculator', 'betterapp',
  ],
  openGraph: {
    title: 'Fincalc — Financial Calculators',
    description: 'Clean, fast calculators for investors worldwide.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans text-onyx min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
