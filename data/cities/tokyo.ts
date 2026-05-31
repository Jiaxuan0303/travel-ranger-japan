import { City, CityId } from '@/lib/types';

export const tokyo: City = {
  id: 'tokyo',
  name: '东京',
  nameJa: '東京',
  subtitle: '霓虹之心',
  description:
    '日本的首都，一座完美融合未来科技与传统文化的超级都市。从涉谷的十字路口到浅草的古老寺庙，每一个角落都有故事等待发掘。',
  color: 'from-rose-400 to-red-600',
  emoji: '🗼',
  unlockCondition: null,
  totalQuests: 1,
  landmarks: [],
};

export const osaka: City = {
  id: 'osaka',
  name: '大阪',
  nameJa: '大阪',
  subtitle: '天下厨房',
  description:
    '日本的厨房与欢笑之都。道顿堀的霓虹、大阪城的壮丽、还有热情豪爽的关西人。',
  color: 'from-orange-400 to-amber-600',
  emoji: '🏯',
  unlockCondition: {
    minLevel: 1,
    requiredSkills: [],
    requiredCities: [],
  },
  totalQuests: 1,
  landmarks: [],
};

export const kyoto: City = {
  id: 'kyoto',
  name: '京都',
  nameJa: '京都',
  subtitle: '千年古都',
  description:
    '日本的文化心脏，一千两百年的古都。千座神社、百座寺庙、茶道花道。',
  color: 'from-purple-400 to-indigo-600',
  emoji: '⛩️',
  unlockCondition: {
    minLevel: 1,
    requiredSkills: [],
    requiredCities: ['osaka' as CityId],
  },
  totalQuests: 1,
  landmarks: [],
};

export const kamakura: City = {
  id: 'kamakura',
  name: '镰仓',
  nameJa: '鎌倉',
  subtitle: '古都禅意',
  description:
    '日本第一个武家政权的发源地，山海之间的静谧古都。镰仓大佛、湘南海岸等你探索。',
  color: 'from-teal-400 to-cyan-600',
  emoji: '🗿',
  unlockCondition: {
    minLevel: 1,
    requiredSkills: [],
    requiredCities: ['kyoto' as CityId],
  },
  totalQuests: 1,
  landmarks: [],
};

export const cities: Record<CityId, City> = {
  tokyo,
  osaka,
  kyoto,
  kamakura,
};
