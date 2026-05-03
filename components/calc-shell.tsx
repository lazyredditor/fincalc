'use client';
import Link from 'next/link';
import { createContext, useContext, useState } from 'react';
import { CALCULATORS, bySlug } from '@/lib/catalog';
import { AdSlot } from './ad-slot';

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar' },
  { code: 'INR', label: 'Indian Rupee' },
  { code: 'GBP', label: 'British Pound' },
  { code: 'EUR', label: 'Euro' },
  { code: 'SGD', label: 'Singapore Dollar' },
  { code: 'AUD', label: 'Australian Dollar' },
];

const CurrencyContext = createContext<string>('USD');
export const useCurrency = () => useContext(CurrencyContext);

type Props = {
  slug: string;
  children: React.ReactNode;
};

export function CalcShell({ slug, children }: Props) {
  const meta = bySlug(slug)!;
  const [currency, setCurrency] = useState(
    meta.region === 'India' ? 'INR' :
    meta.region === 'UK' ? 'GBP' :
    meta.region === 'US' ? 'USD' :
    meta.region === 'EU' ? 'EUR' : 'USD'
  );

  const related = CALCULATORS.filter(c => c.category === meta.category && c.slug !== meta.slug).slice(0, 5);
  const catLabel = meta.category === 'Invest' ? 'Investing' : meta.category === 'Retire' ? 'Retirement' : meta.category === 'Loan' ? 'Loans' : 'Regional';

  return (
    <CurrencyContext.Provider value={currency}>
      {/* Top leaderboard ad */}
      <div className="border-b hairline bg-sand-50/40">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-4">
          <AdSlot size="leaderboard" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-10">
        <div className="flex items-baseline gap-3 text-[10px] uppercase tracking-[0.22em] text-mauve-500 mb-3">
          <Link href="/" className="hover:text-onyx">Home</Link>
          <span>/</span>
          <Link href="/all/" className="hover:text-onyx">{catLabel}</Link>
          {meta.region !== 'Global' && (<><span>/</span><span>{meta.region}</span></>)}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl md:text-6xl tracking-tightest leading-[0.95]">
              {meta.title}
            </h1>
            <p className="mt-3 text-mauve-700 text-base leading-relaxed">{meta.blurb}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="label">Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent border-b border-onyx/30 px-2 py-1 text-sm font-mono focus:outline-none focus:border-onyx"
            >
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
          </div>
        </div>

        <div className="rise">{children}</div>

        <div className="mt-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className="label mb-4">Related</div>
            <div className="grid sm:grid-cols-2 gap-px bg-onyx/10 border hairline">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/calculators/${r.slug}/`}
                  className="bg-paper p-5 hover:bg-sand-50 transition group"
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="font-display text-xl tracking-tight">{r.title}</div>
                    <span className="text-mauve-400 group-hover:translate-x-0.5 transition">→</span>
                  </div>
                  <p className="text-sm text-mauve-600">{r.blurb}</p>
                </Link>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 flex flex-col items-center gap-6">
            <AdSlot size="rectangle" />
            <div className="text-center">
              <div className="label mb-2">Disclaimer</div>
              <p className="text-xs text-mauve-600 leading-relaxed max-w-[300px]">
                Outputs are model projections at the assumptions you set. Real-world returns,
                taxes and fees vary. Not financial advice.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </CurrencyContext.Provider>
  );
}
