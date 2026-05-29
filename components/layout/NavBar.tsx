'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: '面板', icon: '🏠' },
  { href: '/cities', label: '城市', icon: '🌆' },
  { href: '/skills', label: '技能', icon: '⭐' },
  { href: '/quests', label: '任务', icon: '📜' },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/60 safe-area-bottom">
      <div className="max-w-2xl mx-auto px-4 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'text-indigo-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
