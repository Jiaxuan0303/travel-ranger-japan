'use client';

interface ProgressBarProps {
  value: number;      // 0-100
  max?: number;       // default 100
  color?: string;     // Tailwind gradient, e.g. "from-amber-400 to-orange-500"
  size?: 'sm' | 'md';
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = 'from-indigo-400 to-purple-500',
  size = 'md',
  showLabel = true,
  label,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const h = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          {label && <span>{label}</span>}
          {showLabel && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={`w-full ${h} bg-slate-700/60 rounded-full overflow-hidden`}>
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
