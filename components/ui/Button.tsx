'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variants: Record<string, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg',
  secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600',
  ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-xl font-medium transition-all duration-200 active:scale-95 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
