'use client';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, Legend,
} from 'recharts';
import { fmtCompact } from '@/lib/finance';

const ONYX = '#1a1614';
const MAUVE = '#7d6b73';
const SAND = '#d4b78f';
const SAND_LIGHT = '#f6ecdb';

type AreaProps = {
  data: { year: number; invested: number; value: number }[];
  currency: string;
};

export function GrowthChart({ data, currency }: AreaProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ONYX} stopOpacity={0.85} />
              <stop offset="100%" stopColor={ONYX} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="gInv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SAND} stopOpacity={0.7} />
              <stop offset="100%" stopColor={SAND} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(26,22,20,0.06)" vertical={false} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} tickFormatter={(y) => `Y${y}`} />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => fmtCompact(v, currency)} width={50} />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Area type="monotone" dataKey="invested" stroke={SAND} strokeWidth={1.5} fill="url(#gInv)" />
          <Area type="monotone" dataKey="value" stroke={ONYX} strokeWidth={2} fill="url(#gValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BalanceChart({ data, currency }: { data: { year: number; balance: number }[]; currency: string; }) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gBal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ONYX} stopOpacity={0.7} />
              <stop offset="100%" stopColor={ONYX} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(26,22,20,0.06)" vertical={false} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} tickFormatter={(y) => `Y${y}`} />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => fmtCompact(v, currency)} width={50} />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Area type="monotone" dataKey="balance" stroke={ONYX} strokeWidth={2} fill="url(#gBal)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AmortChart({ data, currency }: {
  data: { year: number; principal: number; interest: number; balance: number }[];
  currency: string;
}) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="rgba(26,22,20,0.06)" vertical={false} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} tickFormatter={(y) => `Y${y}`} />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => fmtCompact(v, currency)} width={50} />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Legend wrapperStyle={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em' }} />
          <Bar dataKey="principal" stackId="a" fill={ONYX} />
          <Bar dataKey="interest" stackId="a" fill={SAND} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SplitDonut({ data, currency }: { data: { name: string; value: number }[]; currency: string }) {
  const colors = [ONYX, SAND, MAUVE];
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="relative h-[220px] w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90} startAngle={90} endAngle={-270} stroke="none">
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip currency={currency} />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-[10px] uppercase tracking-[0.22em] text-mauve-500">Total</div>
        <div className="font-display text-xl tabular">{fmtCompact(total, currency)}</div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, currency }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-onyx text-paper px-3 py-2 text-xs font-mono">
      {label !== undefined && <div className="text-sand-300 text-[10px] uppercase tracking-[0.18em] mb-1">Year {label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey ?? p.name} className="flex items-center gap-3">
          <span style={{ color: p.color ?? p.payload?.fill }}>●</span>
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto tabular">{fmtCompact(p.value, currency)}</span>
        </div>
      ))}
    </div>
  );
}
