'use client';

import { CITY_IDS } from '@/lib/types';
import { usePlayer } from '@/hooks/usePlayer';
import { CityMap } from '@/components/rpg/CityMap';
import { PageTransition } from '@/components/animation';

export default function CitiesPage() {
  const { player } = usePlayer();

  return (
    <PageTransition>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-100">城市地图</h1>
        <p className="text-sm text-slate-500 mt-1">
          完成技能学习与任务，解锁新的城市
        </p>
      </div>
      <CityMap />
    </PageTransition>
  );
}
