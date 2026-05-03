import { CalcShell } from '@/components/calc-shell';
import { SipStyleCalc } from '@/components/calcs/sip-style';
import { bySlug } from '@/lib/catalog';
const slug = 'roth-ira';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return (
    <CalcShell slug={slug}>
      <SipStyleCalc
        contributionLabel="Monthly contribution"
        rateLabel="Expected market return"
        yearsLabel="Years until retirement"
        monthlyMax={583}
        rateMax={15}
        yearsMax={45}
        defaults={{ monthly: 583, rate: 8, years: 30 }}
      />
    </CalcShell>
  );
}
