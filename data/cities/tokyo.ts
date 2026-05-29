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
  totalQuests: 6,
  landmarks: [
    {
      id: 'tokyo-shibuya',
      name: '涩谷十字路口',
      nameJa: '渋谷スクランブル交差点',
      description: '世界上最繁忙的十字路口，每分钟有上千人穿行而过。',
      lat: 35.6595,
      lng: 139.7004,
    },
    {
      id: 'tokyo-asakusa',
      name: '浅草寺',
      nameJa: '浅草寺',
      description: '东京最古老的寺庙，雷门大灯笼是东京的象征之一。',
      lat: 35.7148,
      lng: 139.7967,
    },
  ],
};

export const osaka: City = {
  id: 'osaka',
  name: '大阪',
  nameJa: '大阪',
  subtitle: '天下厨房',
  description:
    '日本的厨房与欢笑之都。道顿堀的霓虹、大阪城的壮丽、还有热情豪爽的关西人——大阪总能让你胃口大开、心情愉悦。',
  color: 'from-orange-400 to-amber-600',
  emoji: '🏯',
  unlockCondition: {
    minLevel: 5,
    requiredSkills: ['tokyo-language-1', 'tokyo-transport-1'],
    requiredCities: [],
  },
  totalQuests: 5,
  landmarks: [
    {
      id: 'osaka-castle',
      name: '大阪城',
      nameJa: '大阪城',
      description: '丰臣秀吉的居城，日本最著名的城堡之一。',
      lat: 34.6873,
      lng: 135.5259,
    },
    {
      id: 'osaka-dotonbori',
      name: '道顿堀',
      nameJa: '道頓堀',
      description: '大阪的美食中心，格力高广告牌是经典打卡地标。',
      lat: 34.6687,
      lng: 135.5013,
    },
  ],
};

export const kyoto: City = {
  id: 'kyoto',
  name: '京都',
  nameJa: '京都',
  subtitle: '千年古都',
  description:
    '日本的文化心脏，一千两百年的古都。千座神社、百座寺庙、茶道花道——京都是一本活的日本美学教科书。',
  color: 'from-purple-400 to-indigo-600',
  emoji: '⛩️',
  unlockCondition: {
    minLevel: 10,
    requiredSkills: ['osaka-food-1'],
    requiredCities: ['osaka'],
  },
  totalQuests: 6,
  landmarks: [
    {
      id: 'kyoto-fushimi',
      name: '伏见稻荷大社',
      nameJa: '伏見稲荷大社',
      description: '千本鸟居的所在地，通往神域的朱红色长廊。',
      lat: 34.9671,
      lng: 135.7727,
    },
    {
      id: 'kyoto-arashiyama',
      name: '岚山竹林',
      nameJa: '嵐山竹林',
      description: '高耸入云的竹林小径，风过竹叶的声音是日本百选音景之一。',
      lat: 35.017,
      lng: 135.671,
    },
  ],
};

export const kamakura: City = {
  id: 'kamakura',
  name: '镰仓',
  nameJa: '鎌倉',
  subtitle: '古都禅意',
  description:
    '日本第一个武家政权的发源地，山海之间的静谧古都。镰仓大佛、湘南海岸、《灌篮高手》的经典路口，都在等你。',
  color: 'from-teal-400 to-cyan-600',
  emoji: '🗿',
  unlockCondition: {
    minLevel: 15,
    requiredSkills: ['kyoto-culture-1', 'kyoto-history-1'],
    requiredCities: ['kyoto'],
  },
  totalQuests: 4,
  landmarks: [
    {
      id: 'kamakura-daibutsu',
      name: '镰仓大佛',
      nameJa: '鎌倉大仏',
      description: '高13.35米的青铜阿弥陀佛坐像，镰仓的象征。',
      lat: 35.3169,
      lng: 139.5357,
    },
    {
      id: 'kamakura-tsurugaoka',
      name: '鹤冈八幡宫',
      nameJa: '鶴岡八幡宮',
      description: '镰仓幕府的守护神社，武士之都的中心。',
      lat: 35.326,
      lng: 139.5563,
    },
  ],
};

export const cities: Record<CityId, City> = {
  tokyo,
  osaka,
  kyoto,
  kamakura,
};
