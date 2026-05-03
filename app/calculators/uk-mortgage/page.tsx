import { CalcShell } from '@/components/calc-shell';
import { LoanCalc } from '@/components/calcs/loan';
import { bySlug } from '@/lib/catalog';
const slug = 'uk-mortgage';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return (
    <CalcShell slug={slug}>
      <LoanCalc principalLabel="Mortgage amount" principalMax={2_000_000} rateMax={12} yearsMax={40} defaults={{ principal: 250_000, rate: 5.25, years: 25 }} />
    </CalcShell>
  );
}
