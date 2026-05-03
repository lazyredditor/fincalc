import { CalcShell } from '@/components/calc-shell';
import { LoanCalc } from '@/components/calcs/loan';
import { bySlug } from '@/lib/catalog';
const slug = 'emi';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return <CalcShell slug={slug}><LoanCalc defaults={{ principal: 500000, rate: 9, years: 5 }} /></CalcShell>;
}
