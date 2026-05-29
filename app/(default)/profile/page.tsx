'use client';

import { usePlayer, useQuests } from '@/hooks/usePlayer';
import { PageTransition } from '@/components/animation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { xpProgressPercent } from '@/data/constants';
import { CITY_IDS } from '@/lib/types';

export default function ProfilePage() {
  const { player, dispatch } = usePlayer();
  const { quests } = useQuests();
  const xpPct = xpProgressPercent(player.xp);

  const handleReset = () => {
    if (confirm('确定要重新开始吗？所有数据将丢失。')) {
      dispatch({ type: 'RESET_GAME' });
    }
  };

  return (
    <PageTransition>
      {/* 玩家信息 */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500/20 flex items-center justify-center text-4xl mb-3">
          🎒
        </div>
        <h2 className="text-lg font-bold text-slate-100">{player.title}</h2>
        <p className="text-slate-500 text-sm">Lv.{player.level}</p>
      </div>

      {/* 统计 */}
      <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">冒险统计</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: '任务完成', value: quests.completed.length },
          { label: '视频观看', value: player.totalVideosWatched },
          { label: '技能解锁', value: quests.completed.length }, // from store
          { label: '可用技能点', value: player.skillPoints },
        ].map((stat) => (
          <Card key={stat.label} hover={false} className="text-center">
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* 入坑日期 */}
      <Card hover={false} className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">加入日期</span>
          <span className="text-slate-200 text-sm">
            {new Date(player.joinDate).toLocaleDateString('zh-CN')}
          </span>
        </div>
      </Card>

      {/* 重置 */}
      <Button
        variant="danger"
        size="sm"
        onClick={handleReset}
        className="w-full"
      >
        重新开始
      </Button>
    </PageTransition>
  );
}
