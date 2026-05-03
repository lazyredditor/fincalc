'use client';
import { useMemo, useState } from 'react';
import { SliderInput } from '@/components/inputs';
import { Stat } from '@/components/result';
import { AmortChart, SplitDonut } from '@/components/charts';
import { loanSummary, amortYearly, fmtMoney } from '@/lib/finance';
import { useCurrency } from '@/components/calc-shell';

type Props = {
  defaults?: { principal?: number; rate?: number; years?: number };
  principalLabel?: string;
  principalMax?: number;
  rateMax?: number;
  yearsMax?: number;
};

export function LoanCalc({
  defaults = {},
  principalLabel = 'Loan amount',
  principalMax = 10_000_000,
  rateMax = 20,
  yearsMax = 35,
}: Props) {
  const currency = useCurrency();
  const [principal, setPrincipal] = useState(defaults.principal ?? 500_000);
  const [rate, setRate] = useState(defaults.rate ?? 8.5);
  const [years, setYears] = useState(defaults.years ?? 20);

  const { monthly, totalPayment, totalInterest, schedule } = useMemo(() => {
    const s = loanSummary(principal, rate, years);
    return { ...s, schedule: amortYearly(principal, rate, years) };
  }, [principal, rate, years]);

  return (
    <div className="grid lg:grid-cols-12 gap-px bg-onyx/10 border hairline">
      <div className="lg:col-span-5 bg-paper p-6 lg:p-8">
        <div className="label mb-4">Inputs</div>
        <SliderInput
          label={principalLabel}
          value={principal} onChange={setPrincipal}
          min={10_000} max={principalMax} step={5_000}
          format={(v) => fmtMoney(v, currency)}
        />
        <SliderInput
          label="Interest rate"
          value={rate} onChange={setRate}
          min={1} max={rateMax} step={0.05}
          suffix="%"
          format={(v) => v.toFixed(2)}
        />
        <SliderInput
          label="Tenure"
          value={years} onChange={setYears}
          min={1} max={yearsMax} step={1}
          suffix="yr"
        />
      </div>

      <div className="lg:col-span-7 bg-paper">
        <div className="grid grid-cols-3 gap-px bg-onyx/10">
          <Stat label="Monthly EMI" value={fmtMoney(monthly, currency)} highlight />
          <Stat label="Total interest" value={fmtMoney(totalInterest, currency)} />
          <Stat label="Total payment" value={fmtMoney(totalPayment, currency)} />
        </div>
        <div className="grid lg:grid-cols-3 gap-px bg-onyx/10">
          <div className="lg:col-span-2 bg-paper p-5">
            <div className="label mb-2">Amortisation</div>
            <AmortChart data={schedule} currency={currency} />
          </div>
          <div className="bg-paper p-5">
            <div className="label mb-2">Principal vs interest</div>
            <SplitDonut
              data={[
                { name: 'Principal', value: principal },
                { name: 'Interest', value: totalInterest },
              ]}
              currency={currency}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
