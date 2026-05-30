'use client';

import { Header } from './Header';
import { NavBar } from './NavBar';
import { LevelUpModal } from '@/components/rpg/LevelUpModal';
import { ParticleBackground } from '@/components/effects/ParticleBackground';

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <ParticleBackground />
      <Header />
      <main className="max-w-2xl mx-auto px-4 pt-4 pb-24 relative z-10">
        {children}
      </main>
      <NavBar />
      <LevelUpModal />
    </div>
  );
}
