'use client';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

export function Badge({ children, color = 'bg-indigo-500/20 text-indigo-400' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${color}`}
    >
      {children}
    </span>
  );
}
