import { CalcShell } from '@/components/calc-shell';
import { GoalSipCalc } from '@/components/calcs/misc';
import { bySlug } from '@/lib/catalog';
const slug = 'goal-sip';
export const metadata = { title: bySlug(slug)!.title, description: bySlug(slug)!.blurb };
export default function Page() {
  return <CalcShell slug={slug}><GoalSipCalc /></CalcShell>;
}
