import { CalcShell } from '@/components/calc-shell';
import { SwpCalc } from '@/components/calcs/swp';
import { bySlug } from '@/lib/catalog';
const slug = 'swp';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return <CalcShell slug={slug}><SwpCalc /></CalcShell>;
}
