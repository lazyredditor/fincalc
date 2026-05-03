import { CalcShell } from '@/components/calc-shell';
import { PrepaymentCalc } from '@/components/calcs/misc';
import { bySlug } from '@/lib/catalog';
const slug = 'loan-prepayment';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return <CalcShell slug={slug}><PrepaymentCalc /></CalcShell>;
}
