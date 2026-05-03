import { CalcShell } from '@/components/calc-shell';
import { LoanCalc } from '@/components/calcs/loan';
import { bySlug } from '@/lib/catalog';
const slug = 'car-loan';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return (
    <CalcShell slug={slug}>
      <LoanCalc principalLabel="Car loan amount" principalMax={5_000_000} yearsMax={8} defaults={{ principal: 800_000, rate: 9.5, years: 5 }} />
    </CalcShell>
  );
}
