import { CalcShell } from '@/components/calc-shell';
import { FourOhOneKCalc } from '@/components/calcs/four-oh-one-k';
import { bySlug } from '@/lib/catalog';
const slug = '401k';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return <CalcShell slug={slug}><FourOhOneKCalc /></CalcShell>;
}
