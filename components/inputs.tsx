'use client';
import { useId } from 'react';

type SliderProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  format?: (v: number) => string;
};

export function SliderInput({ label, value, onChange, min, max, step = 1, prefix, suffix, format }: SliderProps) {
  const id = useId();
  const display = format ? format(value) : value.toLocaleString('en-US');
  return (
    <div className="py-4 border-b hairline">
      <div className="flex items-baseline justify-between mb-1.5">
        <label htmlFor={id} className="label">{label}</label>
        <div className="flex items-baseline gap-1">
          {prefix && <span className="text-xs text-mauve-600">{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            value={display}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9.\-]/g, '');
              const n = parseFloat(cleaned);
              if (!isNaN(n)) onChange(Math.min(Math.max(n, min), max));
            }}
            className="text-right font-display text-xl tabular w-32 bg-transparent border-b border-transparent focus:border-onyx focus:outline-none"
          />
          {suffix && <span className="text-xs text-mauve-600">{suffix}</span>}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="range w-full"
      />
      <div className="flex justify-between text-[10px] text-mauve-500 font-mono mt-1">
        <span>{format ? format(min) : min.toLocaleString()}</span>
        <span>{format ? format(max) : max.toLocaleString()}</span>
      </div>
    </div>
  );
}

type SelectProps<T extends string> = {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
};

export function SelectInput<T extends string>({ label, value, onChange, options }: SelectProps<T>) {
  return (
    <div className="py-4 border-b hairline">
      <div className="label mb-2">{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-2.5 py-1.5 text-xs uppercase tracking-[0.14em] border transition ${
              value === opt.value
                ? 'bg-onyx text-paper border-onyx'
                : 'border-onyx/15 hover:border-onyx/50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
