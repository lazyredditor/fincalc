type ResultProps = {
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
};

export function Stat({ label, value, hint, highlight }: ResultProps) {
  return (
    <div className={`p-5 ${highlight ? 'bg-onyx text-paper' : ''}`}>
      <div className={`text-[10px] uppercase tracking-[0.22em] mb-2 ${highlight ? 'text-sand-300' : 'text-mauve-600'}`}>
        {label}
      </div>
      <div className={`font-display tabular leading-none tracking-tightest break-all ${highlight ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
        {value}
      </div>
      {hint && (
        <div className={`mt-2 text-xs ${highlight ? 'text-sand-200/70' : 'text-mauve-500'}`}>
          {hint}
        </div>
      )}
    </div>
  );
}
