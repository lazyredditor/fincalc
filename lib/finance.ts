// Pure financial functions — all amounts in the user's chosen currency, rates as percentages.

export function fmtMoney(n: number, code: string = 'USD', maximumFractionDigits = 0): string {
  if (!isFinite(n)) return '—';
  const symbols: Record<string, string> = { USD: '$', INR: '₹', GBP: '£', EUR: '€', SGD: 'S$', AUD: 'A$' };
  const sym = symbols[code] ?? '';
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  return `${sign}${sym}${abs.toLocaleString('en-US', { maximumFractionDigits, minimumFractionDigits: 0 })}`;
}

export function fmtCompact(n: number, code: string = 'USD'): string {
  if (!isFinite(n)) return '—';
  const symbols: Record<string, string> = { USD: '$', INR: '₹', GBP: '£', EUR: '€', SGD: 'S$', AUD: 'A$' };
  const sym = symbols[code] ?? '';
  return `${sym}${Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(n)}`;
}

// SIP — future value of a monthly investment over n months at annual rate r%.
export function sipFutureValue(monthly: number, annualRate: number, years: number) {
  const n = Math.round(years * 12);
  const i = annualRate / 100 / 12;
  if (i === 0) return monthly * n;
  return monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
}

// Step-up SIP: contribution increases by stepPct% every year.
export function stepUpSipFV(monthly: number, annualRate: number, years: number, stepPct: number) {
  const i = annualRate / 100 / 12;
  let fv = 0;
  let m = monthly;
  for (let y = 0; y < years; y++) {
    // FV at end of this year, then compound to final.
    const yearFV = m * ((Math.pow(1 + i, 12) - 1) / (i || 1)) * (1 + i);
    const remaining = (years - y - 1) * 12;
    fv += yearFV * Math.pow(1 + i, remaining);
    m *= 1 + stepPct / 100;
  }
  return fv;
}

// Lumpsum / compound interest. compoundsPerYear: 1, 4, 12, 365.
export function compound(principal: number, annualRate: number, years: number, compoundsPerYear = 1) {
  const r = annualRate / 100;
  return principal * Math.pow(1 + r / compoundsPerYear, compoundsPerYear * years);
}

// SWP: starting corpus, monthly withdrawal, annual return. Returns balance schedule + lasted months.
export function swpSchedule(corpus: number, monthly: number, annualRate: number, years: number) {
  const months = Math.round(years * 12);
  const i = annualRate / 100 / 12;
  const balances: number[] = [];
  let bal = corpus;
  let lasted = months;
  for (let m = 1; m <= months; m++) {
    bal = bal * (1 + i) - monthly;
    balances.push(Math.max(bal, 0));
    if (bal <= 0 && lasted === months) lasted = m;
  }
  return { balances, lasted, finalBalance: Math.max(bal, 0) };
}

// EMI — flat amortising loan.
export function emi(principal: number, annualRate: number, years: number) {
  const n = Math.round(years * 12);
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function loanSummary(principal: number, annualRate: number, years: number) {
  const monthly = emi(principal, annualRate, years);
  const totalPayment = monthly * Math.round(years * 12);
  const totalInterest = totalPayment - principal;
  return { monthly, totalPayment, totalInterest };
}

// Amortisation schedule — yearly aggregation for charting.
export function amortYearly(principal: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = Math.round(years * 12);
  const m = emi(principal, annualRate, years);
  let bal = principal;
  const out: { year: number; principal: number; interest: number; balance: number }[] = [];
  let yp = 0, yi = 0;
  for (let k = 1; k <= n; k++) {
    const interest = bal * r;
    const principalPay = m - interest;
    bal -= principalPay;
    yp += principalPay; yi += interest;
    if (k % 12 === 0 || k === n) {
      out.push({ year: Math.ceil(k / 12), principal: yp, interest: yi, balance: Math.max(bal, 0) });
      yp = 0; yi = 0;
    }
  }
  return out;
}

// SIP series for chart — invested vs value, year by year.
export function sipYearlySeries(monthly: number, annualRate: number, years: number, stepPct = 0) {
  const i = annualRate / 100 / 12;
  const out: { year: number; invested: number; value: number }[] = [];
  let invested = 0, value = 0, m = monthly;
  for (let y = 1; y <= years; y++) {
    for (let k = 0; k < 12; k++) {
      value = (value + m) * (1 + i);
      invested += m;
    }
    out.push({ year: y, invested: Math.round(invested), value: Math.round(value) });
    m *= 1 + stepPct / 100;
  }
  return out;
}

// Goal SIP — monthly required to reach target FV at annual rate over years.
export function goalSip(target: number, annualRate: number, years: number) {
  const n = Math.round(years * 12);
  const i = annualRate / 100 / 12;
  if (i === 0) return target / n;
  return target / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
}

// CAGR
export function cagr(initial: number, final: number, years: number) {
  if (initial <= 0 || years <= 0) return 0;
  return (Math.pow(final / initial, 1 / years) - 1) * 100;
}

// Inflation-adjusted future cost
export function inflateValue(present: number, inflationPct: number, years: number) {
  return present * Math.pow(1 + inflationPct / 100, years);
}

// Real return (Fisher)
export function realReturn(nominalPct: number, inflationPct: number) {
  return ((1 + nominalPct / 100) / (1 + inflationPct / 100) - 1) * 100;
}

// Loan prepayment: lump prepayment at month k. Returns interest saved and tenure reduction.
export function prepaymentImpact(principal: number, annualRate: number, years: number, prepay: number, atMonth: number) {
  const r = annualRate / 100 / 12;
  const m = emi(principal, annualRate, years);
  const total = Math.round(years * 12);

  // baseline interest
  let bal = principal, interestBase = 0;
  for (let k = 1; k <= total; k++) {
    const i = bal * r;
    interestBase += i;
    bal = bal - (m - i);
  }

  // with prepayment, keep EMI same, reduce tenure
  bal = principal; let interestNew = 0; let monthsTaken = 0;
  for (let k = 1; k <= total * 2; k++) {
    if (k === atMonth) bal -= prepay;
    if (bal <= 0) { monthsTaken = k - 1; break; }
    const i = bal * r;
    interestNew += i;
    bal = bal - (m - i);
    monthsTaken = k;
    if (bal <= 0) { break; }
  }
  const interestSaved = Math.max(interestBase - interestNew, 0);
  const monthsSaved = Math.max(total - monthsTaken, 0);
  return { interestSaved, monthsSaved, newTenureMonths: monthsTaken };
}
