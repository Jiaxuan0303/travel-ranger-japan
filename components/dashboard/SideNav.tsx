'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { id: 'home', label: 'Home', icon: '🏠', href: '/dashboard' },
  { id: 'cities', label: 'Cities', icon: '🌆', href: '/cities' },
  { id: 'skills', label: 'Skills', icon: '⭐', href: '/skills' },
  { id: 'badges', label: 'Badges', icon: '🏅', href: '/profile' },
  { id: 'aitools', label: 'AI Tools', icon: '🤖', href: '/profile' },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-1 bg-slate-950/70 backdrop-blur-md rounded-2xl px-2 py-3 border border-slate-800/60 shadow-lg shadow-black/30"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {navItems.map((item, i) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href));

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
          >
            <Link
              href={item.href}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-300 relative overflow-hidden
                ${
                  isActive
                    ? 'bg-slate-800/80 border border-slate-600/50'
                    : 'border border-transparent hover:bg-slate-800/50'
                }
              `}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/0 to-violet-500/0 group-hover:from-violet-500/5 group-hover:via-violet-500/10 group-hover:to-violet-500/5 transition-all duration-500" />

              <span className="text-lg relative z-10">{item.icon}</span>
              <span
                className={`
                  text-xs font-medium relative z-10 transition-colors duration-300
                  ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}
                `}
                style={{ fontFamily: "'DotGothic16', monospace" }}
              >
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-violet-400 rounded-r"
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </motion.nav>
  );
}
