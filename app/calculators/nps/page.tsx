import { CalcShell } from '@/components/calc-shell';
import { SipStyleCalc } from '@/components/calcs/sip-style';
import { bySlug } from '@/lib/catalog';
const slug = 'nps';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return (
    <CalcShell slug={slug}>
      <SipStyleCalc
        contributionLabel="Monthly contribution"
        rateLabel="Expected return (Tier-I mix)"
        yearsLabel="Years until retirement"
        rateMax={14}
        monthlyMax={150_000}
        yearsMax={42}
        defaults={{ monthly: 5000, rate: 10, years: 30 }}
      />
    </CalcShell>
  );
}
