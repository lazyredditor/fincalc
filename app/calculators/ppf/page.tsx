import { CalcShell } from '@/components/calc-shell';
import { SipStyleCalc } from '@/components/calcs/sip-style';
import { bySlug } from '@/lib/catalog';
const slug = 'ppf';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return (
    <CalcShell slug={slug}>
      <SipStyleCalc
        contributionLabel="Monthly contribution (max ₹12,500)"
        rateLabel="PPF rate"
        monthlyMax={12_500}
        rateMax={9}
        yearsMax={50}
        defaults={{ monthly: 12_500, rate: 7.1, years: 15 }}
      />
    </CalcShell>
  );
}
