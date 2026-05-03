import { CalcShell } from '@/components/calc-shell';
import { LumpsumCalc } from '@/components/calcs/lumpsum';
import { bySlug } from '@/lib/catalog';
const slug = 'fd';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return <CalcShell slug={slug}><LumpsumCalc defaultFreq="quarterly" /></CalcShell>;
}
