# Fincalc — Financial Calculators

A clean, compact suite of 20 financial calculators. Open-source contribution to **[betterapp.org](https://betterapp.org)**.

Built with Next.js (static export) + Tailwind. Hosts on Cloudflare Pages with zero server runtime.

## What's inside

**Investing** — SIP · SWP · Lumpsum · Step-up SIP · Goal SIP · CAGR · Compound Interest · Fixed Deposit · Inflation
**Loans** — EMI · Home Loan · Car Loan · Loan Prepayment
**Retirement** — Retirement Planner · NPS (India) · 401(k) (US) · Roth IRA (US)
**Regional** — UK Mortgage · Stocks & Shares ISA (UK) · PPF (India)

Currency switcher (USD / INR / GBP / EUR / SGD / AUD) on every page.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build static site

```bash
npm run build      # outputs to ./out
```

The `out/` directory is the entire site — drop it on Cloudflare Pages, S3, GitHub Pages, anywhere static.

## Deploy to Cloudflare Pages

**Via Dashboard:** Connect this repo. Build command `npm run build`, output dir `out`.

**Direct upload:** Run `npm run build` locally, then upload `./out` via Wrangler:

```bash
npx wrangler pages deploy ./out --project-name fincalc
```

## Ad slots

Three Google Ads placements are wired (`components/ad-slot.tsx`):

- Leaderboard (728×90) under the nav on every page
- Rectangle (300×250) sidebar on every calculator
- Mobile responsive variant

Replace the `<AdSlot>` placeholder with your AdSense `<ins>` snippet when ready.

## Theme

Onyx · Mauve · Desert Sand — the betterapp.org palette. Fraunces (display) + Inter (body) + JetBrains Mono (numbers).

## License

MIT.
