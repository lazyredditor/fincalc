'use client';
import { useMemo, useState } from 'react';
import { SliderInput } from '@/components/inputs';
import { Stat } from '@/components/result';
import { GrowthChart, SplitDonut } from '@/components/charts';
import { fmtMoney } from '@/lib/finance';
import { useCurrency } from '@/components/calc-shell';

export function FourOhOneKCalc() {
  const currency = useCurrency();
  const [salary, setSalary] = useState(80_000);
  const [contribPct, setContribPct] = useState(10);
  const [matchPct, setMatchPct] = useState(50);
  const [matchUpto, setMatchUpto] = useState(6);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(30);
  const [salaryGrowth, setSalaryGrowth] = useState(3);

  const { fv, totalEmployee, totalEmployer, series } = useMemo(() => {
    let bal = 0;
    let s = salary;
    let totalE = 0, totalEr = 0;
    const series: { year: number; invested: number; value: number }[] = [];
    const i = rate / 100 / 12;
    for (let y = 1; y <= years; y++) {
      const annualEmployee = (s * contribPct) / 100;
      const annualEr = Math.min(contribPct, matchUpto) / 100 * s * (matchPct / 100);
      const monthly = (annualEmployee + annualEr) / 12;
      for (let m = 0; m < 12; m++) bal = (bal + monthly) * (1 + i);
      totalE += annualEmployee; totalEr += annualEr;
      series.push({ year: y, invested: Math.round(totalE + totalEr), value: Math.round(bal) });
      s *= 1 + salaryGrowth / 100;
    }
    return { fv: bal, totalEmployee: totalE, totalEmployer: totalEr, series };
  }, [salary, contribPct, matchPct, matchUpto, rate, years, salaryGrowth]);

  return (
    <div className="grid lg:grid-cols-12 gap-px bg-onyx/10 border hairline">
      <div className="lg:col-span-5 bg-paper p-6 lg:p-8">
        <div className="label mb-4">Inputs</div>
        <SliderInput label="Annual salary" value={salary} onChange={setSalary} min={20_000} max={500_000} step={1_000} format={(v) => fmtMoney(v, currency)} />
        <SliderInput label="Your contribution" value={contribPct} onChange={setContribPct} min={1} max={50} step={0.5} suffix="%" format={(v) => v.toFixed(1)} />
        <SliderInput label="Employer match" value={matchPct} onChange={setMatchPct} min={0} max={200} step={5} suffix="%" />
        <SliderInput label="Match up to" value={matchUpto} onChange={setMatchUpto} min={0} max={20} step={0.5} suffix="% of salary" />
        <SliderInput label="Annual return" value={rate} onChange={setRate} min={2} max={15} step={0.1} suffix="%" format={(v) => v.toFixed(1)} />
        <SliderInput label="Salary growth" value={salaryGrowth} onChange={setSalaryGrowth} min={0} max={10} step={0.1} suffix="%" format={(v) => v.toFixed(1)} />
        <SliderInput label="Years to retirement" value={years} onChange={setYears} min={1} max={45} step={1} suffix="yr" />
      </div>
      <div className="lg:col-span-7 bg-paper">
        <div className="grid grid-cols-3 gap-px bg-onyx/10">
          <Stat label="You contributed" value={fmtMoney(totalEmployee, currency)} />
          <Stat label="Employer match" value={fmtMoney(totalEmployer, currency)} hint="Free money" />
          <Stat label="At retirement" value={fmtMoney(fv, currency)} highlight />
        </div>
        <div className="grid lg:grid-cols-3 gap-px bg-onyx/10">
          <div className="lg:col-span-2 bg-paper p-5">
            <div className="label mb-2">Growth</div>
            <GrowthChart data={series} currency={currency} />
          </div>
          <div className="bg-paper p-5">
            <div className="label mb-2">Sources</div>
            <SplitDonut
              data={[
                { name: 'You', value: totalEmployee },
                { name: 'Employer', value: totalEmployer },
                { name: 'Returns', value: Math.max(fv - totalEmployee - totalEmployer, 0) },
              ]}
              currency={currency}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
