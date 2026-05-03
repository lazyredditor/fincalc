'use client';
import { useMemo, useState } from 'react';
import { SliderInput, SelectInput } from '@/components/inputs';
import { Stat } from '@/components/result';
import { GrowthChart, SplitDonut } from '@/components/charts';
import { compound, fmtMoney } from '@/lib/finance';
import { useCurrency } from '@/components/calc-shell';

const FREQ = { yearly: 1, halfYearly: 2, quarterly: 4, monthly: 12, daily: 365 };

export function LumpsumCalc({ defaultFreq = 'yearly' }: { defaultFreq?: keyof typeof FREQ }) {
  const currency = useCurrency();
  const [principal, setPrincipal] = useState(100_000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(10);
  const [freq, setFreq] = useState<keyof typeof FREQ>(defaultFreq);

  const { fv, gain, series } = useMemo(() => {
    const cpy = FREQ[freq];
    const fv = compound(principal, rate, years, cpy);
    const series: { year: number; invested: number; value: number }[] = [];
    for (let y = 1; y <= years; y++) {
      series.push({ year: y, invested: principal, value: Math.round(compound(principal, rate, y, cpy)) });
    }
    return { fv, gain: fv - principal, series };
  }, [principal, rate, years, freq]);

  return (
    <div className="grid lg:grid-cols-12 gap-px bg-onyx/10 border hairline">
      <div className="lg:col-span-5 bg-paper p-6 lg:p-8">
        <div className="label mb-4">Inputs</div>
        <SliderInput label="Principal" value={principal} onChange={setPrincipal} min={1_000} max={50_000_000} step={1_000} format={(v) => fmtMoney(v, currency)} />
        <SliderInput label="Annual interest rate" value={rate} onChange={setRate} min={1} max={25} step={0.1} suffix="%" format={(v) => v.toFixed(1)} />
        <SliderInput label="Time period" value={years} onChange={setYears} min={1} max={50} step={1} suffix="yr" />
        <SelectInput
          label="Compounding"
          value={freq}
          onChange={(v) => setFreq(v as keyof typeof FREQ)}
          options={[
            { value: 'yearly', label: 'Yearly' },
            { value: 'halfYearly', label: 'Half-Yr' },
            { value: 'quarterly', label: 'Quarterly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'daily', label: 'Daily' },
          ]}
        />
      </div>
      <div className="lg:col-span-7 bg-paper">
        <div className="grid grid-cols-3 gap-px bg-onyx/10">
          <Stat label="Principal" value={fmtMoney(principal, currency)} />
          <Stat label="Interest earned" value={fmtMoney(gain, currency)} />
          <Stat label="Maturity" value={fmtMoney(fv, currency)} highlight />
        </div>
        <div className="grid lg:grid-cols-3 gap-px bg-onyx/10">
          <div className="lg:col-span-2 bg-paper p-5">
            <div className="label mb-2">Compounding curve</div>
            <GrowthChart data={series} currency={currency} />
          </div>
          <div className="bg-paper p-5">
            <div className="label mb-2">Composition</div>
            <SplitDonut data={[{ name: 'Principal', value: principal }, { name: 'Interest', value: gain }]} currency={currency} />
          </div>
        </div>
      </div>
    </div>
  );
}
