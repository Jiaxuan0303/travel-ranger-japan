import { Quest } from '@/lib/types';
import { questsByCity } from '@/data/quests';

/** 计算任务奖励（按答题正确率加成） */
export function calcQuestReward(
  quest: Quest,
  correctCount: number
): { baseXp: number; bonusXp: number; totalXp: number } {
  const baseXp = quest.xpReward;
  const totalQuestions = quest.quiz.length;
  const correctRatio = totalQuestions > 0 ? correctCount / totalQuestions : 0;

  // 全对有 50% 加成
  const bonusXp =
    correctRatio === 1 ? Math.floor(baseXp * 0.5) : 0;
  const totalXp = baseXp + bonusXp;

  return { baseXp, bonusXp, totalXp };
}

/** 获取可解锁的技能（按城市/等级过滤） */
export function getQuestRewardSkills(quest: Quest): string[] {
  return quest.skillRewardIds;
}

/** 获取某一城市的任务列表 */
export function getQuestsForCity(cityId: string): Quest[] {
  return questsByCity[cityId] ?? [];
}
