'use client';
import { useMemo, useState } from 'react';
import { SliderInput } from '@/components/inputs';
import { Stat } from '@/components/result';
import { GrowthChart } from '@/components/charts';
import { cagr, inflateValue, realReturn, goalSip, prepaymentImpact, sipFutureValue, fmtMoney, emi } from '@/lib/finance';
import { useCurrency } from '@/components/calc-shell';

export function CagrCalc() {
  const currency = useCurrency();
  const [initial, setInitial] = useState(100_000);
  const [final, setFinal] = useState(250_000);
  const [years, setYears] = useState(5);
  const value = useMemo(() => cagr(initial, final, years), [initial, final, years]);
  const absoluteReturn = ((final - initial) / initial) * 100;

  return (
    <div className="grid lg:grid-cols-12 gap-px bg-onyx/10 border hairline">
      <div className="lg:col-span-5 bg-paper p-6 lg:p-8">
        <div className="label mb-4">Inputs</div>
        <SliderInput label="Initial value" value={initial} onChange={setInitial} min={1_000} max={50_000_000} step={1_000} format={(v) => fmtMoney(v, currency)} />
        <SliderInput label="Final value" value={final} onChange={setFinal} min={1_000} max={50_000_000} step={1_000} format={(v) => fmtMoney(v, currency)} />
        <SliderInput label="Duration" value={years} onChange={setYears} min={1} max={40} step={1} suffix="yr" />
      </div>
      <div className="lg:col-span-7 bg-paper">
        <div className="grid grid-cols-2 gap-px bg-onyx/10">
          <Stat label="CAGR" value={`${value.toFixed(2)}%`} highlight />
          <Stat label="Absolute return" value={`${absoluteReturn.toFixed(2)}%`} />
        </div>
        <div className="bg-paper p-8">
          <p className="text-mauve-700 leading-relaxed text-sm">
            Your investment grew from <span className="font-display text-onyx text-base">{fmtMoney(initial, currency)}</span>{' '}
            to <span className="font-display text-onyx text-base">{fmtMoney(final, currency)}</span> over {years} year{years !== 1 ? 's' : ''}.
            That is a compound annual growth rate of{' '}
            <span className="font-display text-onyx text-base">{value.toFixed(2)}%</span> — meaning the same growth
            could have been achieved by earning {value.toFixed(2)}% every year, reinvested.
          </p>
        </div>
      </div>
    </div>
  );
}

export function InflationCalc() {
  const currency = useCurrency();
  const [present, setPresent] = useState(100_000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(20);
  const [nominal, setNominal] = useState(12);

  const future = useMemo(() => inflateValue(present, rate, years), [present, rate, years]);
  const real = useMemo(() => realReturn(nominal, rate), [nominal, rate]);
  const purchasing = useMemo(() => present / Math.pow(1 + rate / 100, years), [present, rate, years]);

  return (
    <div className="grid lg:grid-cols-12 gap-px bg-onyx/10 border hairline">
      <div className="lg:col-span-5 bg-paper p-6 lg:p-8">
        <div className="label mb-4">Inputs</div>
        <SliderInput label="Today's amount" value={present} onChange={setPresent} min={1_000} max={50_000_000} step={1_000} format={(v) => fmtMoney(v, currency)} />
        <SliderInput label="Inflation rate" value={rate} onChange={setRate} min={1} max={15} step={0.1} suffix="%" format={(v) => v.toFixed(1)} />
        <SliderInput label="Years from now" value={years} onChange={setYears} min={1} max={50} step={1} suffix="yr" />
        <SliderInput label="Nominal return on investments" value={nominal} onChange={setNominal} min={0} max={25} step={0.1} suffix="%" format={(v) => v.toFixed(1)} />
      </div>
      <div className="lg:col-span-7 bg-paper">
        <div className="grid grid-cols-3 gap-px bg-onyx/10">
          <Stat label="Future cost" value={fmtMoney(future, currency)} highlight />
          <Stat label="Today's purchasing power then" value={fmtMoney(purchasing, currency)} />
          <Stat label="Real return" value={`${real.toFixed(2)}%`} hint="Fisher equation" />
        </div>
        <div className="bg-paper p-8 text-sm text-mauve-700 leading-relaxed">
          What costs <span className="font-display text-onyx text-base">{fmtMoney(present, currency)}</span> today
          will cost <span className="font-display text-onyx text-base">{fmtMoney(future, currency)}</span> in {years} years
          at {rate.toFixed(1)}% average inflation. To preserve purchasing power, your portfolio needs to earn at least
          the inflation rate after taxes and fees.
        </div>
      </div>
    </div>
  );
}

export function GoalSipCalc() {
  const currency = useCurrency();
  const [target, setTarget] = useState(5_000_000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);
  const monthly = useMemo(() => goalSip(target, rate, years), [target, rate, years]);
  const series = useMemo(() => {
    const out: { year: number; invested: number; value: number }[] = [];
    for (let y = 1; y <= years; y++) {
      out.push({ year: y, invested: Math.round(monthly * y * 12), value: Math.round(sipFutureValue(monthly, rate, y)) });
    }
    return out;
  }, [monthly, rate, years]);

  return (
    <div className="grid lg:grid-cols-12 gap-px bg-onyx/10 border hairline">
      <div className="lg:col-span-5 bg-paper p-6 lg:p-8">
        <div className="label mb-4">Inputs</div>
        <SliderInput label="Target amount" value={target} onChange={setTarget} min={50_000} max={200_000_000} step={50_000} format={(v) => fmtMoney(v, currency)} />
        <SliderInput label="Expected return" value={rate} onChange={setRate} min={1} max={25} step={0.1} suffix="%" format={(v) => v.toFixed(1)} />
        <SliderInput label="Time available" value={years} onChange={setYears} min={1} max={40} step={1} suffix="yr" />
      </div>
      <div className="lg:col-span-7 bg-paper">
        <div className="grid grid-cols-3 gap-px bg-onyx/10">
          <Stat label="Monthly SIP needed" value={fmtMoney(monthly, currency)} highlight />
          <Stat label="Total invested" value={fmtMoney(monthly * years * 12, currency)} />
          <Stat label="Returns earned" value={fmtMoney(target - monthly * years * 12, currency)} />
        </div>
        <div className="bg-paper p-5">
          <div className="label mb-2">Path to goal</div>
          <GrowthChart data={series} currency={currency} />
        </div>
      </div>
    </div>
  );
}

export function PrepaymentCalc() {
  const currency = useCurrency();
  const [principal, setPrincipal] = useState(2_500_000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [prepay, setPrepay] = useState(200_000);
  const [atMonth, setAtMonth] = useState(24);

  const result = useMemo(() => prepaymentImpact(principal, rate, years, prepay, atMonth), [principal, rate, years, prepay, atMonth]);
  const monthlyEmi = useMemo(() => emi(principal, rate, years), [principal, rate, years]);

  return (
    <div className="grid lg:grid-cols-12 gap-px bg-onyx/10 border hairline">
      <div className="lg:col-span-5 bg-paper p-6 lg:p-8">
        <div className="label mb-4">Inputs</div>
        <SliderInput label="Loan amount" value={principal} onChange={setPrincipal} min={50_000} max={50_000_000} step={50_000} format={(v) => fmtMoney(v, currency)} />
        <SliderInput label="Interest rate" value={rate} onChange={setRate} min={1} max={20} step={0.05} suffix="%" format={(v) => v.toFixed(2)} />
        <SliderInput label="Tenure" value={years} onChange={setYears} min={1} max={35} step={1} suffix="yr" />
        <SliderInput label="Prepayment amount" value={prepay} onChange={setPrepay} min={1_000} max={principal / 2} step={5_000} format={(v) => fmtMoney(v, currency)} />
        <SliderInput label="After month" value={atMonth} onChange={setAtMonth} min={1} max={years * 12 - 1} step={1} suffix="mo" />
      </div>
      <div className="lg:col-span-7 bg-paper">
        <div className="grid grid-cols-3 gap-px bg-onyx/10">
          <Stat label="Original EMI" value={fmtMoney(monthlyEmi, currency)} hint="Unchanged" />
          <Stat label="Interest saved" value={fmtMoney(result.interestSaved, currency)} highlight />
          <Stat label="Tenure cut by" value={`${(result.monthsSaved / 12).toFixed(1)} yrs`} hint={`${result.monthsSaved} months`} />
        </div>
        <div className="bg-paper p-8 text-sm text-mauve-700 leading-relaxed">
          A one-time prepayment of <span className="font-display text-onyx text-base">{fmtMoney(prepay, currency)}</span>{' '}
          in month {atMonth} saves you <span className="font-display text-onyx text-base">{fmtMoney(result.interestSaved, currency)}</span>{' '}
          and shortens your loan by <span className="font-display text-onyx text-base">{(result.monthsSaved / 12).toFixed(1)} years</span>.
          Most lenders offer two prepayment treatments — reduce EMI or reduce tenure. This calculator assumes the latter, which saves more interest.
        </div>
      </div>
    </div>
  );
}

export function RetirementCalc() {
  const currency = useCurrency();
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [lifeExp, setLifeExp] = useState(85);
  const [monthlyExpense, setMonthlyExpense] = useState(50_000);
  const [inflation, setInflation] = useState(6);
  const [preReturn, setPreReturn] = useState(12);
  const [postReturn, setPostReturn] = useState(7);

  const result = useMemo(() => {
    const yearsToRetire = retireAge - age;
    const yearsInRetirement = lifeExp - retireAge;
    if (yearsToRetire <= 0 || yearsInRetirement <= 0) return null;
    const futureMonthly = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetire);
    // corpus = PV of monthly expenses through retirement at real return post-retirement
    const realPost = (1 + postReturn / 100) / (1 + inflation / 100) - 1;
    const months = yearsInRetirement * 12;
    const r = realPost / 12;
    const corpus = r === 0 ? futureMonthly * months : futureMonthly * (1 - Math.pow(1 + r, -months)) / r;
    // SIP needed
    const i = preReturn / 100 / 12;
    const n = yearsToRetire * 12;
    const sip = i === 0 ? corpus / n : corpus / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    return { yearsToRetire, yearsInRetirement, futureMonthly, corpus, sip };
  }, [age, retireAge, lifeExp, monthlyExpense, inflation, preReturn, postReturn]);

  return (
    <div className="grid lg:grid-cols-12 gap-px bg-onyx/10 border hairline">
      <div className="lg:col-span-5 bg-paper p-6 lg:p-8">
        <div className="label mb-4">Inputs</div>
        <SliderInput label="Current age" value={age} onChange={setAge} min={18} max={70} step={1} suffix="yr" />
        <SliderInput label="Retirement age" value={retireAge} onChange={setRetireAge} min={age + 1} max={75} step={1} suffix="yr" />
        <SliderInput label="Life expectancy" value={lifeExp} onChange={setLifeExp} min={retireAge + 1} max={100} step={1} suffix="yr" />
        <SliderInput label="Today's monthly expense" value={monthlyExpense} onChange={setMonthlyExpense} min={5_000} max={1_000_000} step={1_000} format={(v) => fmtMoney(v, currency)} />
        <SliderInput label="Inflation" value={inflation} onChange={setInflation} min={1} max={12} step={0.1} suffix="%" format={(v) => v.toFixed(1)} />
        <SliderInput label="Return — pre-retirement" value={preReturn} onChange={setPreReturn} min={4} max={20} step={0.1} suffix="%" format={(v) => v.toFixed(1)} />
        <SliderInput label="Return — post-retirement" value={postReturn} onChange={setPostReturn} min={2} max={12} step={0.1} suffix="%" format={(v) => v.toFixed(1)} />
      </div>
      <div className="lg:col-span-7 bg-paper">
        {result ? (
          <>
            <div className="grid grid-cols-3 gap-px bg-onyx/10">
              <Stat label="Future monthly expense" value={fmtMoney(result.futureMonthly, currency)} hint={`At age ${retireAge}`} />
              <Stat label="Corpus needed" value={fmtMoney(result.corpus, currency)} highlight />
              <Stat label="Monthly SIP from now" value={fmtMoney(result.sip, currency)} hint={`For ${result.yearsToRetire} yrs`} />
            </div>
            <div className="bg-paper p-8 text-sm text-mauve-700 leading-relaxed">
              In {result.yearsToRetire} years, the same lifestyle that costs you{' '}
              <span className="font-display text-onyx text-base">{fmtMoney(monthlyExpense, currency)}</span>/month today will cost{' '}
              <span className="font-display text-onyx text-base">{fmtMoney(result.futureMonthly, currency)}</span>/month. To fund {result.yearsInRetirement} years of retirement,
              you need a corpus of <span className="font-display text-onyx text-base">{fmtMoney(result.corpus, currency)}</span>.
              That requires a monthly investment of <span className="font-display text-onyx text-base">{fmtMoney(result.sip, currency)}</span> for the next {result.yearsToRetire} years.
            </div>
          </>
        ) : (
          <div className="p-8 text-mauve-600">Adjust ages so retirement age &gt; current age.</div>
        )}
      </div>
    </div>
  );
}
