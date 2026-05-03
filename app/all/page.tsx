import Link from 'next/link';
import { CALCULATORS, CATEGORIES } from '@/lib/catalog';
import { AdSlot } from '@/components/ad-slot';

export const metadata = {
  title: 'All calculators',
  description: 'Browse all 20 financial calculators in the Fincalc suite.',
};

export default function AllPage() {
  return (
    <>
      <div className="border-b hairline bg-sand-50/40">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-4">
          <AdSlot size="leaderboard" />
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-12">
        <div className="label mb-4">Index</div>
        <h1 className="font-display text-6xl tracking-tightest leading-[0.92]">All calculators.</h1>
        <p className="mt-4 max-w-xl text-mauve-700 text-lg">Twenty calculators across investing, loans, retirement and regional accounts.</p>

        <div className="mt-16 space-y-16">
          {CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-baseline justify-between mb-6 pb-3 border-b hairline-strong">
                <h2 className="font-display text-3xl tracking-tightest">{cat.label}</h2>
                <span className="text-[10px] uppercase tracking-[0.22em] text-mauve-500">
                  {CALCULATORS.filter((c) => c.category === cat.id).length} tools
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-onyx/10 border hairline">
                {CALCULATORS.filter((c) => c.category === cat.id).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/calculators/${c.slug}/`}
                    className="bg-paper p-6 hover:bg-sand-50 transition group"
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="font-display text-2xl tracking-tightest">{c.title}</div>
                      <span className="text-[9px] uppercase tracking-[0.22em] text-mauve-500">{c.region}</span>
                    </div>
                    <p className="text-sm text-mauve-600">{c.blurb}</p>
                    <div className="mt-4 text-xs uppercase tracking-[0.18em] text-mauve-700 group-hover:text-onyx">
                      Open →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
