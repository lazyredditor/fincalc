import { CalcShell } from '@/components/calc-shell';
import { RetirementCalc } from '@/components/calcs/misc';
import { bySlug } from '@/lib/catalog';
const slug = 'retirement';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return <CalcShell slug={slug}><RetirementCalc /></CalcShell>;
}
