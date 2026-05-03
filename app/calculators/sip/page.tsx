import { CalcShell } from '@/components/calc-shell';
import { SipStyleCalc } from '@/components/calcs/sip-style';
import { bySlug } from '@/lib/catalog';
const slug = 'sip';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return (
    <CalcShell slug={slug}>
      <SipStyleCalc defaults={{ monthly: 10000, rate: 12, years: 15 }} />
    </CalcShell>
  );
}
