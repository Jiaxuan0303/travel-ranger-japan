'use client';

import { useParams } from 'next/navigation';
import { CityId } from '@/lib/types';
import { useCity, useQuests } from '@/hooks/usePlayer';
import { PageTransition, SlideUp } from '@/components/animation';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { questsByCity } from '@/data/quests';
import Link from 'next/link';

export default function CityDetailPage() {
  const { cityId } = useParams<{ cityId: string }>();
  const { city, progress } = useCity(cityId as CityId);
  const { quests } = useQuests();

  if (!city || !progress) {
    return (
      <PageTransition>
        <div className="text-center py-20 text-slate-500">城市不存在</div>
      </PageTransition>
    );
  }

  const isUnlocked = progress.unlocked;
  const cityQuests = questsByCity[cityId] ?? [];

  return (
    <PageTransition>
      {/* 城市头图 */}
      <div
        className={`bg-gradient-to-br ${city.color} rounded-2xl p-6 mb-6 text-white`}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{city.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold">{city.name}</h1>
            <p className="text-white/70 text-sm">{city.nameJa}</p>
          </div>
        </div>
        <p className="text-white/80 text-sm">{city.description}</p>
        {isUnlocked && (
          <ProgressBar
            value={progress.completionPercent}
            color="from-white/40 to-white/70"
            size="sm"
          />
        )}
      </div>

      {/* 地标 */}
      <h2 className="text-lg font-bold text-slate-100 mb-3">📍 地标</h2>
      <div className="grid grid-cols-1 gap-3 mb-6">
        {city.landmarks.map((lm, i) => (
          <SlideUp key={lm.id} delay={i * 0.1}>
            <Card>
              <h3 className="font-medium text-slate-200">{lm.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{lm.nameJa}</p>
              <p className="text-sm text-slate-400 mt-2">{lm.description}</p>
            </Card>
          </SlideUp>
        ))}
      </div>

      {/* 任务列表 */}
      <h2 className="text-lg font-bold text-slate-100 mb-3">📜 城市任务</h2>
      <div className="space-y-3">
        {cityQuests.map((q) => {
          const done = quests.completed.includes(q.id);
          return (
            <Link key={q.id} href={done ? '#' : `/quests/${q.id}`}>
              <Card hover={!done} className={done ? 'opacity-50' : ''}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-200">{q.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{q.description}</p>
                  </div>
                  {done && <span className="text-emerald-400 ml-2">✓</span>}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {!isUnlocked && (
        <div className="text-center py-10">
          <p className="text-slate-600 text-lg mb-1">🔒</p>
          <p className="text-slate-500">尚未解锁此城市</p>
        </div>
      )}
    </PageTransition>
  );
}
