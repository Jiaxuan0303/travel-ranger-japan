'use client';

import { SkillTree } from '@/components/rpg/SkillTree';
import { PageTransition } from '@/components/animation';

export default function SkillsPage() {
  return (
    <PageTransition>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-100">技能树</h1>
        <p className="text-sm text-slate-500 mt-1">
          解锁技能以探索更多城市内容
        </p>
      </div>
      <SkillTree />
    </PageTransition>
  );
}
