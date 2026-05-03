import Link from 'next/link';
import { CALCULATORS, CATEGORIES } from '@/lib/catalog';

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-onyx-900 text-paper">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-16">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="font-display text-3xl tracking-tightest">fincalc</div>
            <p className="mt-3 text-sm text-sand-200/70 leading-relaxed max-w-sm">
              Open-source financial calculators. Compact, ad-supported, no signups, no
              tracking beyond Google Ads. A contribution to{' '}
              <a href="https://betterapp.org" className="underline underline-offset-4 text-sand-200">
                betterapp.org
              </a>
              .
            </p>
            <div className="mt-6 text-[10px] uppercase tracking-[0.22em] text-mauve-300">
              MIT License · Built 2026
            </div>
          </div>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="md:col-span-2">
              <div className="text-[10px] uppercase tracking-[0.22em] text-sand-400 mb-3">
                {cat.label}
              </div>
              <ul className="space-y-1.5 text-sm">
                {CALCULATORS.filter((c) => c.category === cat.id).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/calculators/${c.slug}/`} className="text-sand-100/80 hover:text-paper transition">
                      {c.short}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-paper/10 flex flex-wrap items-center justify-between gap-4 text-xs text-mauve-300">
          <div>
            Numbers are projections, not guarantees. Always verify with a licensed advisor.
          </div>
          <div className="flex gap-5">
            <a href="https://github.com/" className="hover:text-paper">GitHub</a>
            <a href="https://betterapp.org" className="hover:text-paper">betterapp.org</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
