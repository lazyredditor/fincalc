import { CalcShell } from '@/components/calc-shell';
import { SipStyleCalc } from '@/components/calcs/sip-style';
import { bySlug } from '@/lib/catalog';
const slug = 'isa';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return (
    <CalcShell slug={slug}>
      <SipStyleCalc
        contributionLabel="Monthly contribution"
        rateLabel="Expected return"
        monthlyMax={1666}
        rateMax={12}
        yearsMax={40}
        defaults={{ monthly: 500, rate: 7, years: 20 }}
      />
    </CalcShell>
  );
}
