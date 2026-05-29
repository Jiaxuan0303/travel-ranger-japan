'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExpBar } from '@/components/rpg/ExpBar';
import { usePlayer } from '@/hooks/usePlayer';

export function Header() {
  const { player } = usePlayer();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🗾</span>
            <span className="font-bold text-slate-100">Travel Ranger</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="text-amber-400">{player.title}</span>
          </Link>
        </div>
        <ExpBar />
      </div>
    </header>
  );
}
