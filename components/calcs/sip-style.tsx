'use client';
import { useMemo, useState } from 'react';
import { SliderInput } from '@/components/inputs';
import { Stat } from '@/components/result';
import { GrowthChart, SplitDonut } from '@/components/charts';
import { sipFutureValue, stepUpSipFV, sipYearlySeries, fmtMoney } from '@/lib/finance';
import { useCurrency } from '@/components/calc-shell';

type Props = {
  defaults?: { monthly?: number; rate?: number; years?: number; step?: number };
  showStepUp?: boolean;
  contributionLabel?: string;
  rateLabel?: string;
  yearsLabel?: string;
  rateMax?: number;
  monthlyMax?: number;
  yearsMax?: number;
};

export function SipStyleCalc({
  defaults = {},
  showStepUp = false,
  contributionLabel = 'Monthly investment',
  rateLabel = 'Expected return',
  yearsLabel = 'Time period',
  rateMax = 25,
  monthlyMax = 200000,
  yearsMax = 40,
}: Props) {
  const currency = useCurrency();
  const [monthly, setMonthly] = useState(defaults.monthly ?? 10000);
  const [rate, setRate] = useState(defaults.rate ?? 12);
  const [years, setYears] = useState(defaults.years ?? 15);
  const [step, setStep] = useState(defaults.step ?? 10);

  const { fv, invested, gain, series } = useMemo(() => {
    const series = sipYearlySeries(monthly, rate, years, showStepUp ? step : 0);
    const fv = showStepUp ? stepUpSipFV(monthly, rate, years, step) : sipFutureValue(monthly, rate, years);
    const invested = series.length ? series[series.length - 1].invested : 0;
    return { fv, invested, gain: fv - invested, series };
  }, [monthly, rate, years, step, showStepUp]);

  return (
    <div className="grid lg:grid-cols-12 gap-px bg-onyx/10 border hairline">
      <div className="lg:col-span-5 bg-paper p-6 lg:p-8">
        <div className="label mb-4">Inputs</div>
        <SliderInput
          label={contributionLabel}
          value={monthly} onChange={setMonthly}
          min={500} max={monthlyMax} step={500}
          format={(v) => fmtMoney(v, currency)}
        />
        <SliderInput
          label={rateLabel}
          value={rate} onChange={setRate}
          min={1} max={rateMax} step={0.1}
          suffix="%"
          format={(v) => v.toFixed(1)}
        />
        <SliderInput
          label={yearsLabel}
          value={years} onChange={setYears}
          min={1} max={yearsMax} step={1}
          suffix="yr"
        />
        {showStepUp && (
          <SliderInput
            label="Annual step-up"
            value={step} onChange={setStep}
            min={0} max={25} step={0.5}
            suffix="%"
            format={(v) => v.toFixed(1)}
          />
        )}
      </div>

      <div className="lg:col-span-7 bg-paper">
        <div className="grid grid-cols-3 gap-px bg-onyx/10">
          <Stat label="Invested" value={fmtMoney(invested, currency)} />
          <Stat label="Est. returns" value={fmtMoney(gain, currency)} hint={`${(rate).toFixed(1)}% / yr`} />
          <Stat label="Future value" value={fmtMoney(fv, currency)} highlight />
        </div>
        <div className="grid lg:grid-cols-3 gap-px bg-onyx/10">
          <div className="lg:col-span-2 bg-paper p-5">
            <div className="label mb-2">Growth over time</div>
            <GrowthChart data={series} currency={currency} />
          </div>
          <div className="bg-paper p-5">
            <div className="label mb-2">Composition</div>
            <SplitDonut
              data={[
                { name: 'Invested', value: invested },
                { name: 'Returns', value: gain },
              ]}
              currency={currency}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
