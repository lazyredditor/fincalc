import Link from 'next/link';
import { CALCULATORS, CATEGORIES } from '@/lib/catalog';
import { AdSlot } from '@/components/ad-slot';

export default function Home() {
  const featured = ['sip', 'emi', 'retirement', 'compound-interest', '401k', 'uk-mortgage'];
  return (
    <>
      {/* Hero */}
      <section className="border-b hairline">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="label mb-6">Open-source · betterapp.org</div>
              <h1 className="font-display tracking-tightest leading-[0.92] text-[clamp(3rem,8vw,7rem)]">
                Money,<br />
                <span className="italic text-mauve-500">measured.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg text-mauve-700 leading-relaxed">
                A compact suite of financial calculators — for SIPs and SWPs, mortgages and retirement,
                401(k)s and ISAs. No signup. No tracking. Just numbers, fast.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/calculators/sip/" className="btn btn-primary">Run a SIP →</Link>
                <Link href="/all/" className="btn btn-ghost">Browse all 20</Link>
              </div>
            </div>
            <div className="lg:col-span-4 lg:pl-10 lg:border-l hairline">
              <div className="grid grid-cols-3 gap-px bg-onyx/10">
                <Stat n="20" l="Calculators" />
                <Stat n="6" l="Currencies" />
                <Stat n="0" l="Trackers" />
              </div>
              <div className="mt-6 text-xs text-mauve-600 leading-relaxed">
                Built for India, the US, the UK and beyond. Pure client-side maths,
                hosted as static pages on Cloudflare. Source on GitHub.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad */}
      <div className="border-b hairline bg-sand-50/40">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-4">
          <AdSlot size="leaderboard" />
        </div>
      </div>

      {/* Featured */}
      <section className="max-w-[1400px] mx-auto px-5 lg:px-8 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-4xl tracking-tightest">Most reached for</h2>
          <Link href="/all/" className="text-xs uppercase tracking-[0.18em] underline underline-offset-4">All calculators →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-onyx/10 border hairline">
          {featured.map((slug, idx) => {
            const c = CALCULATORS.find((x) => x.slug === slug)!;
            return (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}/`}
                className="group bg-paper p-7 hover:bg-onyx hover:text-paper transition relative"
              >
                <div className="text-[10px] uppercase tracking-[0.22em] text-mauve-500 group-hover:text-sand-300 mb-4">
                  No. {String(idx + 1).padStart(2, '0')} · {c.region}
                </div>
                <div className="font-display text-3xl tracking-tightest mb-2">{c.title}</div>
                <p className="text-sm text-mauve-700 group-hover:text-sand-200/80 leading-relaxed">{c.blurb}</p>
                <div className="mt-6 text-xs uppercase tracking-[0.18em] flex items-center gap-2">
                  Open <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* By category */}
      <section className="max-w-[1400px] mx-auto px-5 lg:px-8 py-16 border-t hairline">
        <h2 className="font-display text-4xl tracking-tightest mb-10">By category</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-baseline justify-between mb-3 pb-2 border-b hairline-strong">
                <div className="font-display text-2xl tracking-tightest">{cat.label}</div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-mauve-500">
                  {CALCULATORS.filter(c => c.category === cat.id).length}
                </span>
              </div>
              <ul className="grid-lines">
                {CALCULATORS.filter(c => c.category === cat.id).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/calculators/${c.slug}/`} className="flex items-baseline justify-between py-2.5 group">
                      <span className="text-onyx group-hover:underline underline-offset-4">{c.short}</span>
                      {c.region !== 'Global' && (
                        <span className="text-[9px] uppercase tracking-[0.22em] text-mauve-500">{c.region}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Why / Marketing */}
      <section className="bg-onyx-900 text-paper">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="label !text-sand-300 mb-4">Manifesto</div>
              <h2 className="font-display text-5xl tracking-tightest leading-[0.95]">
                Calculators<br />
                <span className="italic text-sand-300">should respect you.</span>
              </h2>
            </div>
            <div className="space-y-6 text-base text-sand-200/80 leading-relaxed">
              <p>
                Every other calculator site buries the answer under banners, popups,
                cookie walls and SEO essays. We don't. Inputs on the left, answer on the right,
                a single ad slot to keep the lights on.
              </p>
              <p>
                The maths is open-source so you can audit it. The numbers are projections, never
                guarantees — finance is messy, but the arithmetic doesn't have to be.
              </p>
              <div className="flex gap-4">
                <Link href="/all/" className="btn bg-paper text-onyx hover:bg-sand-200">All calculators</Link>
                <a href="https://betterapp.org" className="btn border border-paper/30 hover:border-paper">betterapp.org</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="bg-paper p-5">
      <div className="font-display text-4xl tabular tracking-tightest">{n}</div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-mauve-500 mt-1">{l}</div>
    </div>
  );
}
