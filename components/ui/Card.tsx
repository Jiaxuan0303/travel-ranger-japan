'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = true }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm p-5 ${
        hover ? 'hover:border-slate-600/70 hover:bg-slate-800/80 transition-all duration-300 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
