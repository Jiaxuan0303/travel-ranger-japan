import { ParticleBackground } from '@/components/effects';
import { TopBar } from '@/components/dashboard';
import { SideNav } from '@/components/dashboard';
import { DevPanel } from '@/components/dev';

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <ParticleBackground />
      <TopBar />
      <SideNav />
      <main className="relative z-10 lg:ml-16 pt-4 pb-8">
        {children}
      </main>
      <DevPanel />
    </div>
  );
}
