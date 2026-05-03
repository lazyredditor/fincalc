import Link from 'next/link';
import { CALCULATORS, CATEGORIES } from '@/lib/catalog';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur border-b hairline">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-baseline gap-2">
            <Link href="/" className="font-display text-2xl tracking-tightest leading-none">fincalc</Link>
            <a
              href="https://betterapp.org"
              target="_blank"
              rel="noopener"
              className="text-[10px] uppercase tracking-[0.22em] text-mauve-600 hover:text-onyx transition"
            >
              by betterapp
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-xs">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="group relative">
                <button className="px-3 py-2 uppercase tracking-[0.18em] text-mauve-700 hover:text-onyx transition">
                  {cat.label}
                </button>
                <div className="absolute right-0 top-full pt-1 w-72 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition">
                  <div className="bg-paper border hairline-strong shadow-[0_8px_30px_rgba(26,22,20,0.08)]">
                    <div className="p-4 border-b hairline">
                      <div className="label">{cat.label}</div>
                    </div>
                    <ul>
                      {CALCULATORS.filter((c) => c.category === cat.id).map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/calculators/${c.slug}/`}
                            className="flex items-center justify-between px-4 py-2.5 hover:bg-sand-100 border-t hairline first:border-t-0 transition"
                          >
                            <span className="font-display text-base">{c.title}</span>
                            {c.region !== 'Global' && (
                              <span className="text-[9px] uppercase tracking-[0.2em] text-mauve-500">
                                {c.region}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/all/" className="ml-2 px-3 py-2 uppercase tracking-[0.18em] border-l hairline-strong">
              All →
            </Link>
          </nav>
          <Link
            href="/all/"
            className="md:hidden text-xs uppercase tracking-[0.18em] underline underline-offset-4"
          >
            All
          </Link>
        </div>
      </div>
    </header>
  );
}
