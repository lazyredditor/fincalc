'use client';
import { useMemo, useState } from 'react';
import { SliderInput } from '@/components/inputs';
import { Stat } from '@/components/result';
import { BalanceChart } from '@/components/charts';
import { swpSchedule, fmtMoney } from '@/lib/finance';
import { useCurrency } from '@/components/calc-shell';

export function SwpCalc() {
  const currency = useCurrency();
  const [corpus, setCorpus] = useState(1_000_000);
  const [monthly, setMonthly] = useState(8_000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);

  const { schedule, lasted, finalBalance, totalWithdrawn } = useMemo(() => {
    const s = swpSchedule(corpus, monthly, rate, years);
    const yearly: { year: number; balance: number }[] = [];
    for (let y = 1; y <= years; y++) {
      const idx = y * 12 - 1;
      yearly.push({ year: y, balance: s.balances[idx] ?? 0 });
    }
    return { schedule: yearly, lasted: s.lasted, finalBalance: s.finalBalance, totalWithdrawn: monthly * Math.min(s.lasted, years * 12) };
  }, [corpus, monthly, rate, years]);

  const lastedYears = (lasted / 12).toFixed(1);
  const exhausted = finalBalance <= 0;

  return (
    <div className="grid lg:grid-cols-12 gap-px bg-onyx/10 border hairline">
      <div className="lg:col-span-5 bg-paper p-6 lg:p-8">
        <div className="label mb-4">Inputs</div>
        <SliderInput label="Total investment" value={corpus} onChange={setCorpus} min={50_000} max={50_000_000} step={50_000} format={(v) => fmtMoney(v, currency)} />
        <SliderInput label="Withdrawal per month" value={monthly} onChange={setMonthly} min={500} max={500_000} step={500} format={(v) => fmtMoney(v, currency)} />
        <SliderInput label="Expected return" value={rate} onChange={setRate} min={1} max={20} step={0.1} suffix="%" format={(v) => v.toFixed(1)} />
        <SliderInput label="Time period" value={years} onChange={setYears} min={1} max={40} step={1} suffix="yr" />
      </div>
      <div className="lg:col-span-7 bg-paper">
        <div className="grid grid-cols-3 gap-px bg-onyx/10">
          <Stat label="Total withdrawn" value={fmtMoney(totalWithdrawn, currency)} />
          <Stat label={exhausted ? 'Exhausted in' : 'Final balance'} value={exhausted ? `${lastedYears} yrs` : fmtMoney(finalBalance, currency)} highlight />
          <Stat label="Monthly draw" value={fmtMoney(monthly, currency)} hint={`${(monthly * 12 / corpus * 100).toFixed(2)}% of corpus / yr`} />
        </div>
        <div className="bg-paper p-5">
          <div className="label mb-2">Corpus over time</div>
          <BalanceChart data={schedule} currency={currency} />
        </div>
      </div>
    </div>
  );
}
