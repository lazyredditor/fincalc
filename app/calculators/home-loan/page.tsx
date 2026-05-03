import { CalcShell } from '@/components/calc-shell';
import { LoanCalc } from '@/components/calcs/loan';
import { bySlug } from '@/lib/catalog';
const slug = 'home-loan';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return (
    <CalcShell slug={slug}>
      <LoanCalc principalLabel="Home loan amount" principalMax={50_000_000} defaults={{ principal: 5_000_000, rate: 8.5, years: 20 }} />
    </CalcShell>
  );
}
