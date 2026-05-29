'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push('/dashboard'), 2500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 1 }}
      >
        <motion.div
          className="text-8xl mb-6"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🗾
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Travel Ranger
        </h1>
        <p className="text-slate-400 text-lg">游侠养成计划</p>
        <motion.div
          className="mt-8 flex gap-1 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-500"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
