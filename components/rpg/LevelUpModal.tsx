'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '@/hooks/usePlayer';
import { usePlayer } from '@/hooks/usePlayer';
import { Modal } from '@/components/ui/Modal';

export function LevelUpModal() {
  const { ui, dispatch } = useUI();
  const { player } = usePlayer();

  const onClose = () => {
    dispatch({ type: 'DISMISS_LEVELUP' });
  };

  return (
    <Modal open={ui.showLevelUp} onClose={onClose}>
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">升级了！</h2>
        <p className="text-slate-400 mb-1">
          <span className="text-amber-400 font-bold">+{ui.levelsGained}</span> 级提升
        </p>
        <p className="text-lg text-slate-300 mb-6">
          当前等级 <span className="text-white font-bold">Lv.{player.level}</span>
        </p>
        <p className="text-sm text-indigo-400">{player.title}</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          继续冒险
        </button>
      </div>
    </Modal>
  );
}
