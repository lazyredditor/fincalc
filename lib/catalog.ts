export type Region = 'Global' | 'India' | 'US' | 'UK' | 'EU' | 'APAC';

export type CalcMeta = {
  slug: string;
  title: string;
  short: string;
  blurb: string;
  category: 'Invest' | 'Loan' | 'Retire' | 'Region';
  region: Region;
};

export const CALCULATORS: CalcMeta[] = [
  // Invest
  { slug: 'sip',           title: 'SIP Calculator',              short: 'SIP',          blurb: 'Project the future value of a Systematic Investment Plan.',           category: 'Invest', region: 'Global' },
  { slug: 'swp',           title: 'SWP Calculator',              short: 'SWP',          blurb: 'Plan systematic withdrawals from a corpus and see how long it lasts.', category: 'Invest', region: 'Global' },
  { slug: 'lumpsum',       title: 'Lumpsum Calculator',          short: 'Lumpsum',      blurb: 'Compound a one-time investment over time.',                            category: 'Invest', region: 'Global' },
  { slug: 'step-up-sip',   title: 'Step-up SIP',                 short: 'Step-up',      blurb: 'Annual increase in your SIP contributions, compounded.',               category: 'Invest', region: 'Global' },
  { slug: 'goal-sip',      title: 'Goal-based SIP',              short: 'Goal',         blurb: 'Reverse-solve the SIP needed to hit a future target.',                 category: 'Invest', region: 'Global' },
  { slug: 'cagr',          title: 'CAGR Calculator',             short: 'CAGR',         blurb: 'Compound Annual Growth Rate between two values.',                       category: 'Invest', region: 'Global' },
  { slug: 'compound-interest', title: 'Compound Interest',       short: 'Compound',     blurb: 'Daily, monthly, quarterly or yearly compounding.',                      category: 'Invest', region: 'Global' },
  { slug: 'fd',            title: 'Fixed Deposit',               short: 'FD',           blurb: 'Maturity for bank fixed deposits with chosen compounding.',             category: 'Invest', region: 'Global' },
  { slug: 'inflation',     title: 'Inflation Calculator',        short: 'Inflation',    blurb: 'See the future cost of today’s money.',                            category: 'Invest', region: 'Global' },
  // Loan
  { slug: 'emi',           title: 'EMI Calculator',              short: 'EMI',          blurb: 'Equated Monthly Installment for any loan.',                              category: 'Loan',   region: 'Global' },
  { slug: 'home-loan',     title: 'Home Loan',                   short: 'Home Loan',    blurb: 'EMI, total interest and amortisation for a home loan.',                  category: 'Loan',   region: 'Global' },
  { slug: 'car-loan',      title: 'Car Loan',                    short: 'Car Loan',     blurb: 'EMI and interest cost for an auto loan.',                                category: 'Loan',   region: 'Global' },
  { slug: 'loan-prepayment', title: 'Loan Prepayment',           short: 'Prepay',       blurb: 'Interest saved and tenure shortened by a part-payment.',                category: 'Loan',   region: 'Global' },
  // Retire
  { slug: 'retirement',    title: 'Retirement Calculator',       short: 'Retirement',   blurb: 'Corpus needed and SIP required for a comfortable retirement.',          category: 'Retire', region: 'Global' },
  { slug: 'nps',           title: 'NPS Calculator',              short: 'NPS',          blurb: 'National Pension System maturity and pension projection.',               category: 'Retire', region: 'India' },
  { slug: '401k',          title: '401(k) Calculator',           short: '401(k)',       blurb: 'Employee + employer contributions compounded to retirement.',           category: 'Retire', region: 'US' },
  { slug: 'roth-ira',      title: 'Roth IRA',                    short: 'Roth IRA',     blurb: 'Tax-free retirement growth with annual contribution limits.',           category: 'Retire', region: 'US' },
  // Region
  { slug: 'uk-mortgage',   title: 'UK Mortgage',                 short: 'UK Mortgage',  blurb: 'Repayment mortgage with British amortisation conventions.',              category: 'Region', region: 'UK' },
  { slug: 'isa',           title: 'Stocks & Shares ISA',         short: 'ISA',          blurb: 'Tax-free UK investment account with the £20k allowance.',                category: 'Region', region: 'UK' },
  { slug: 'ppf',           title: 'PPF Calculator',              short: 'PPF',          blurb: '15-year Public Provident Fund maturity in India.',                       category: 'Region', region: 'India' },
];

export const CATEGORIES: { id: CalcMeta['category']; label: string }[] = [
  { id: 'Invest', label: 'Investing' },
  { id: 'Loan',   label: 'Loans' },
  { id: 'Retire', label: 'Retirement' },
  { id: 'Region', label: 'Regional' },
];

export function bySlug(slug: string) {
  return CALCULATORS.find((c) => c.slug === slug);
}
