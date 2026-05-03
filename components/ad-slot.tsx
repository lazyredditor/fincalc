type AdSlotProps = {
  size: 'leaderboard' | 'rectangle' | 'mobile';
  label?: string;
  className?: string;
};

const dims = {
  leaderboard: 'h-[90px] max-w-[728px]',
  rectangle: 'h-[250px] w-[300px]',
  mobile: 'h-[100px] w-full',
};

export function AdSlot({ size, label = 'Advertisement', className = '' }: AdSlotProps) {
  return (
    <div
      className={`relative mx-auto border hairline-strong bg-sand-50 flex items-center justify-center ${dims[size]} ${className}`}
      data-ad-slot={size}
      aria-label="Ad placement"
    >
      <div className="absolute top-1 left-2 text-[8px] uppercase tracking-[0.22em] text-mauve-500">
        {label}
      </div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-mauve-400">
        {size === 'rectangle' ? '300 × 250' : size === 'leaderboard' ? '728 × 90' : 'responsive'}
      </div>
    </div>
  );
}
