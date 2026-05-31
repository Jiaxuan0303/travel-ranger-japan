import { MiniGame, Quest } from '@/lib/types';

type QuestDraft = Omit<Quest, 'lessonCards' | 'miniGame'> &
  Partial<Pick<Quest, 'lessonCards' | 'miniGame'>>;

const hotspotGame = (
  instruction: string,
  background: string,
  labels: [string, number, number, string?][],
  imageUrl?: string,
): MiniGame => ({
  type: 'hotspot',
  instruction,
  background,
  imageUrl,
  hotspots: labels.map(([label, x, y, explanation], index) => ({
    id: `spot-${index + 1}`,
    label,
    x,
    y,
    explanation,
  })),
});

const sortGame = (
  instruction: string,
  labels: [string, string?][]
): MiniGame => ({
  type: 'sort',
  instruction,
  items: labels.map(([label, explanation], index) => ({
    id: `step-${index + 1}`,
    label,
    correctOrder: index + 1,
    explanation,
  })),
});

const jigsawGame = (
  instruction: string,
  imageUrl: string,
  gridSize: number = 4,
): MiniGame => ({
  type: 'jigsaw',
  instruction,
  imageUrl,
  gridSize,
});

const miniGamesByQuestId: Record<string, MiniGame> = {
  'quest-tokyo-1': hotspotGame('找出涩谷十字路口的 3 个关键地标。', '涩谷十字路口', [
    ['巨型霓虹广告屏', 68, 20, 'QFRONT 大厦的巨型屏幕是涩谷最醒目的地标，时刻播放着最新广告。'],
    ['十字路口斑马线人潮', 50, 52, '绿灯亮起时，来自多个方向的人潮瞬间涌向路面，形成涩谷最经典的画面。'],
    ['忠犬八公像入口', 22, 78, '位于车站广场旁的八公像是东京最受欢迎的集合地点，也是涩谷温暖的象征。'],
  ], '/images/landmarks/shibuya.jpg'),
  'quest-tokyo-2': hotspotGame('在浅草寺区域找出 3 个文化元素。', '浅草寺', [
    ['雷门大红灯笼', 50, 40, '高悬在雷门中央的巨型红灯笼上写着「风雷神门」，是浅草寺最经典的标志。'],
    ['五重塔', 80, 20, '朱红色的五重塔矗立在寺院右侧，是浅草寺建筑群中最高的建筑。'],
    ['宝藏门大提灯', 50, 72, '穿过仲见世商店街后，宝藏门上的大提灯引领你进入本堂参拜区。'],
  ], '/images/landmarks/asakusa.jpg'),
  'quest-tokyo-3': sortGame('把一兰拉面的用餐流程排成正确顺序。', [
    ['在点餐机购买餐券'],
    ['进入隔间座位'],
    ['填写口味偏好单'],
    ['递交餐券并等待上餐'],
    ['开始用餐'],
  ]),
  'quest-tokyo-4': sortGame('把日语问候放到合适的使用顺序。', [
    ['早上见面说「おはようございます」'],
    ['白天见面说「こんにちは」'],
    ['表达感谢说「ありがとうございます」'],
    ['分别时说「さようなら」'],
  ]),
  'quest-tokyo-5': sortGame('按时间线整理江户到东京的变化。', [
    ['德川家康建立江户幕府'],
    ['江户成为政治中心'],
    ['明治维新后改称东京'],
    ['皇居保留在旧江户城区域'],
  ]),
  'quest-tokyo-6': sortGame('按山手线常见环游顺序排列站点。', [
    ['东京站'],
    ['秋叶原'],
    ['上野'],
    ['池袋'],
    ['新宿'],
    ['涩谷'],
  ]),
  'quest-osaka-1': sortGame('按大阪城历史线索排序。', [
    ['丰臣秀吉开始修建大阪城'],
    ['大阪城成为权力象征'],
    ['战乱中多次损毁'],
    ['现代天守阁重建并开放参观'],
  ]),
  'quest-osaka-2': hotspotGame('在道顿堀找出 3 个招牌地标。', '道顿堀', [
    ['格力高跑男霓虹牌', 70, 25, '奔跑人影的巨型霓虹看板是道顿堀最具标志性的广告牌，已延续数十年。'],
    ['蟹道乐大螃蟹招牌', 30, 28, '巨大的机械螃蟹招牌横跨建筑外墙，蟹腿会动，是道顿堀最有趣的打卡点。'],
    ['运河水面霓虹倒影', 50, 78, '道顿堀川的水面倒映两岸霓虹灯光，是大阪夜景最迷人的一幕。'],
  ], '/images/landmarks/dotonbori.jpg'),
  'quest-osaka-3': sortGame('把关西腔表达和含义排成学习顺序。', [
    ['おおきに：谢谢'],
    ['なんでやねん：吐槽或反问'],
    ['めっちゃ：非常'],
    ['まいど：熟人之间的招呼'],
  ]),
  'quest-osaka-4': sortGame('把新干线乘车流程排成正确顺序。', [
    ['购买车票或预约座位'],
    ['进站并确认站台'],
    ['找到车厢和座位'],
    ['放好行李'],
    ['到站后按指示出站'],
  ]),
  'quest-osaka-5': sortGame('规划大阪一日游的合理路线。', [
    ['上午参观大阪城'],
    ['中午前往黑门市场用餐'],
    ['下午逛日本桥或心斋桥'],
    ['夜晚在道顿堀看霓虹和吃小吃'],
  ]),
  'quest-kyoto-1': hotspotGame('在伏见稻荷找出 3 个神社元素。', '伏见稻荷大社', [
    ['千本鸟居长廊', 50, 44, '朱红色的鸟居一个接一个排列成隧道般的走廊，延伸至稻荷山顶，是京都最震撼的景观之一。'],
    ['守护狐狸石像', 20, 76, '叼着稻穗的狐狸石像蹲守在参道两旁，狐狸是稻荷大神的使者。'],
    ['鸟居奉纳者铭文', 72, 40, '每座鸟居背后都刻有奉纳者的名字和日期，记录着企业与个人的祈愿。'],
  ], '/images/landmarks/fushimi.jpg'),
  'quest-kyoto-2': sortGame('按茶道体验流程排序。', [
    ['进入茶室前整理仪容'],
    ['欣赏茶具与茶室布置'],
    ['品尝和菓子'],
    ['接过茶碗并转动'],
    ['安静品尝抹茶'],
  ]),
  'quest-kyoto-3': sortGame('按一汁三菜的餐桌构成排序。', [
    ['米饭放在左前方'],
    ['汤品放在右前方'],
    ['主菜放在后方'],
    ['两道副菜补充口味和营养'],
  ]),
  'quest-kyoto-4': sortGame('按平安京相关历史顺序排列。', [
    ['迁都平安京'],
    ['贵族文化发展'],
    ['文学与和歌繁荣'],
    ['京都成为千年古都象征'],
  ]),
  'quest-kyoto-5': sortGame('把和服类型与场合按正式程度排序。', [
    ['浴衣：夏日祭典等休闲场合'],
    ['小纹：日常外出'],
    ['访问着：半正式拜访'],
    ['振袖：未婚女性正式礼装'],
  ]),
  'quest-kyoto-6': sortGame('按清酒入门品鉴流程排序。', [
    ['观察酒标和类型'],
    ['闻香气'],
    ['小口品尝'],
    ['记录口感和适合搭配的料理'],
  ]),
  'quest-kamakura-1': hotspotGame('在镰仓大佛区域找出 3 个观察点。', '镰仓大佛', [
    ['阿弥陀佛庄严面相', 50, 26, '大佛微闭的双眼与柔和的嘴角弧度，传递出镰仓时代佛教艺术的宁静与慈悲。'],
    ['青铜手印结定印', 50, 54, '大佛双手结「定印」，手心向上叠放腿上，代表禅定与智慧，是阿弥陀佛的经典手势。'],
    ['莲花宝座', 50, 80, '莲花座承托着121吨的青铜佛像，花瓣雕刻精细，象征净土世界的清净庄严。'],
  ], '/images/landmarks/daibutsu.jpg'),
  'quest-kamakura-2': sortGame('按江之电从藤泽到镰仓的经典路线排序。', [
    ['藤泽'],
    ['江之岛'],
    ['镰仓高校前'],
    ['长谷'],
    ['镰仓'],
  ]),
  'quest-kamakura-3': sortGame('按镰仓幕府相关历史线排序。', [
    ['源赖朝势力崛起'],
    ['建立镰仓幕府'],
    ['武士政治成为时代特征'],
    ['镰仓留下众多武家文化遗迹'],
  ]),
  'quest-kamakura-4': sortGame('按坐禅体验的准备流程排序。', [
    ['进入寺院保持安静'],
    ['调整坐姿和呼吸'],
    ['将注意力放回当下'],
    ['结束后合掌致意'],
  ]),
  'quest-tokyo-7': jigsawGame('将涩谷十字街头的画面拼回完整照片，感受世界最繁忙路口的每个角落。', '/images/puzzles/shibuya-puzzle.png'),
  'quest-tokyo-8': jigsawGame('将浅草寺的画面拼回完整照片，在拼合中记住每一处文化细节。', '/images/puzzles/asakusa-puzzle.png'),
  'quest-osaka-6': jigsawGame('将道顿堀的画面拼回完整照片，把大阪的美食霓虹重新点亮。', '/images/puzzles/dotonbori-puzzle.png'),
  'quest-kyoto-7': jigsawGame('将伏见稻荷大社的画面拼回完整照片，在朱红鸟居中穿越千年时光。', '/images/puzzles/fushimi-puzzle.png'),
  'quest-kamakura-5': jigsawGame('将镰仓大佛的画面拼回完整照片，感受青铜佛像的庄严与禅意。', '/images/puzzles/daibutsu-puzzle.png'),
};

function buildLessonCards(quest: QuestDraft) {
  const firstQuestion = quest.quiz?.[0]?.question;
  return [
    {
      title: '任务背景',
      content: quest.description,
    },
    {
      title: '观察重点',
      content: firstQuestion
        ? `挑战前先记住这个问题：${firstQuestion}`
        : '挑战前先抓住地点、礼仪、路线或表达方式中的关键线索。',
    },
    {
      title: '通关提示',
      content: '小游戏不会锁死失败，先尝试，再根据反馈调整答案。',
      tip: '完成小游戏后才会结算 XP 和技能点。',
    },
  ];
}

function enhanceQuest(quest: QuestDraft): Quest {
  return {
    ...quest,
    lessonCards: quest.lessonCards ?? buildLessonCards(quest),
    miniGame:
      quest.miniGame ??
      miniGamesByQuestId[quest.id] ??
      sortGame('把任务知识点按合理顺序排列。', [
        ['阅读任务背景'],
        ['识别文化线索'],
        ['完成挑战'],
      ]),
  };
}

const tokyoQuestDrafts: QuestDraft[] = [
  {
    id: 'quest-tokyo-1',
    title: '涉谷十字路口：世界上最忙的马路',
    description: '跟随镜头感受涉谷十字路口的脉搏，了解它的历史与周边地标。',
    cityId: 'tokyo',
    videoUrl: 'https://www.youtube.com/watch?v=sample1',
    durationSec: 180,
    xpReward: 100,
    skillRewardIds: ['tokyo-transport-1'],
    difficulty: 1,
    quiz: [
      {
        question: '涩谷十字路口每天大约有多少人通过？',
        options: ['10万人', '25万人', '50万人', '100万人'],
        correctIndex: 2,
      },
      {
        question: '涩谷站前广场的著名雕像是什么？',
        options: ['龙', '忠犬八公', '武士', '招财猫'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quest-tokyo-2',
    title: '浅草寺巡礼：东京最古老的寺庙',
    description: '从雷门到五重塔，深度探索浅草寺的历史与文化。',
    cityId: 'tokyo',
    videoUrl: 'https://www.youtube.com/watch?v=sample2',
    durationSec: 240,
    xpReward: 150,
    skillRewardIds: ['tokyo-culture-1'],
    difficulty: 1,
    quiz: [
      {
        question: '浅草寺供奉的是哪一尊观音？',
        options: ['千手观音', '圣观音', '十一面观音', '如意轮观音'],
        correctIndex: 1,
      },
      {
        question: '雷门上悬挂的巨大灯笼上写着什么？',
        options: ['浅草', '风雷神门', '雷门', '金龙山'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quest-tokyo-3',
    title: '一兰拉面体验：吃面也有仪式感',
    description: '探索日本拉面文化，从自助点餐机到隔间用餐的独特体验。',
    cityId: 'tokyo',
    videoUrl: 'https://www.youtube.com/watch?v=sample3',
    durationSec: 150,
    xpReward: 120,
    skillRewardIds: ['tokyo-food-1'],
    difficulty: 1,
    quiz: [
      {
        question: '一兰拉面来自日本哪里？',
        options: ['东京', '福冈', '大阪', '札幌'],
        correctIndex: 1,
      },
      {
        question: '日本人在吃面时发出声音表示什么？',
        options: ['不礼貌', '好吃', '太烫了', '催促上菜'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quest-tokyo-4',
    title: '学习日语问候：第一句话',
    description: '跟日本老师学习日常问候语，让你的东京之旅更加亲切。',
    cityId: 'tokyo',
    videoUrl: 'https://www.youtube.com/watch?v=sample4',
    durationSec: 300,
    xpReward: 200,
    skillRewardIds: ['tokyo-language-1'],
    difficulty: 2,
    quiz: [
      {
        question: '「ありがとうございます」是什么意思？',
        options: ['你好', '谢谢', '再见', '对不起'],
        correctIndex: 1,
      },
      {
        question: '早上见面应该说？',
        options: ['こんばんは', 'こんにちは', 'おはようございます', 'おやすみ'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'quest-tokyo-5',
    title: '江户城探秘：幕府的中心',
    description: '走进皇居（旧江户城），了解德川幕府的兴衰与东京的变迁。',
    cityId: 'tokyo',
    videoUrl: 'https://www.youtube.com/watch?v=sample5',
    durationSec: 360,
    xpReward: 250,
    skillRewardIds: ['tokyo-history-1'],
    difficulty: 2,
    quiz: [
      {
        question: '江户幕府的第一代将军是？',
        options: ['织田信长', '丰臣秀吉', '德川家康', '源赖朝'],
        correctIndex: 2,
      },
      {
        question: '江户时代持续了多少年？',
        options: ['约150年', '约260年', '约400年', '约500年'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quest-tokyo-6',
    title: '山手线环游：东京交通大挑战',
    description: '深入了解山手线29站的每一站特色，成为东京交通达人。',
    cityId: 'tokyo',
    videoUrl: 'https://www.youtube.com/watch?v=sample6',
    durationSec: 420,
    xpReward: 300,
    skillRewardIds: ['tokyo-transport-2', 'tokyo-language-2'],
    difficulty: 3,
    quiz: [
      {
        question: '山手线共有多少个车站？',
        options: ['20站', '25站', '29站', '35站'],
        correctIndex: 2,
      },
      {
        question: '以下哪个不是山手线的车站？',
        options: ['新宿', '东京', '难波', '上野'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'quest-tokyo-7',
    title: '涩谷拼图：拼出十字路口',
    description: '将涩谷十字街头的照片拼回完整画面，在拼合中感受世界最繁忙路口的每一个角落。',
    cityId: 'tokyo',
    durationSec: 240,
    xpReward: 220,
    skillRewardIds: ['tokyo-transport-2'],
    difficulty: 2,
    quiz: [
      {
        question: '涩谷十字路口是世界第几繁忙的步行路口？',
        options: ['第一', '第二', '第三', '第五'],
        correctIndex: 0,
      },
      {
        question: '涩谷的「スクランブル交差点」在日语中怎么读？',
        options: ['Sukuranburu kōsaten', 'Shibuya kōsaten', 'Sukuranburu kōsaten', 'Shibuya sukuranburu'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'quest-tokyo-8',
    title: '浅草寺拼图：拼出古寺之美',
    description: '将浅草寺的照片拼回完整画面，在每一块碎片中感受江户下町的传统文化。',
    cityId: 'tokyo',
    durationSec: 240,
    xpReward: 220,
    skillRewardIds: ['tokyo-culture-1'],
    difficulty: 2,
    quiz: [
      {
        question: '浅草寺的正式名称是什么？',
        options: ['金龙山浅草寺', '风雷神门寺', '浅草观音寺', '金龙山观音院'],
        correctIndex: 0,
      },
      {
        question: '浅草寺创建于哪个世纪？',
        options: ['5世纪', '7世纪', '9世纪', '12世纪'],
        correctIndex: 1,
      },
    ],
  },
];

const osakaQuestDrafts: QuestDraft[] = [
  {
    id: 'quest-osaka-1',
    title: '大阪城：丰臣秀吉的梦想之城',
    description: '登上大阪城天守阁，了解战国时代的辉煌与悲剧。',
    cityId: 'osaka',
    videoUrl: 'https://www.youtube.com/watch?v=sample7',
    durationSec: 300,
    xpReward: 200,
    skillRewardIds: ['osaka-history-1'],
    difficulty: 2,
    quiz: [
      {
        question: '大阪城是谁下令建造的？',
        options: ['德川家康', '织田信长', '丰臣秀吉', '源赖朝'],
        correctIndex: 2,
      },
      {
        question: '现在的天守阁是原建筑吗？',
        options: ['是的，原物', '不是，是后来重建的'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quest-osaka-2',
    title: '道顿堀美食探险',
    description: '从章鱼烧到炸串，吃遍大阪B级美食一条街。',
    cityId: 'osaka',
    videoUrl: 'https://www.youtube.com/watch?v=sample8',
    durationSec: 240,
    xpReward: 180,
    skillRewardIds: ['osaka-food-1'],
    difficulty: 1,
    quiz: [
      {
        question: '大阪名物「串カツ」的吃法规则是什么？',
        options: ['先吃肉再吃菜', '不能蘸两次酱', '必须趁冷吃', '要搭配米饭'],
        correctIndex: 1,
      },
      {
        question: '道顿堀最著名的广告牌是什么？',
        options: ['蟹道乐', '格力高跑男', '金龙拉面', '章鱼烧太郎'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quest-osaka-3',
    title: '关西腔入门：大阪人的语言魅力',
    description: '学习关西方言的基本表达，感受大阪人的热情与幽默。',
    cityId: 'osaka',
    videoUrl: 'https://www.youtube.com/watch?v=sample9',
    durationSec: 270,
    xpReward: 220,
    skillRewardIds: ['osaka-language-1'],
    difficulty: 2,
    quiz: [
      {
        question: '关西腔的「おおきに」是什么意思？',
        options: ['你好', '谢谢', '好吃', '再见'],
        correctIndex: 1,
      },
      {
        question: '「なんでやねん」在大阪话中表达什么情绪？',
        options: ['开心', '悲伤', '吐槽/反问', '打招呼'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'quest-osaka-4',
    title: '新干线启蒙：从东京飞向大阪',
    description: '完整的新干线体验指南：购票、进站、座位、行李放置。',
    cityId: 'osaka',
    videoUrl: 'https://www.youtube.com/watch?v=sample10',
    durationSec: 200,
    xpReward: 180,
    skillRewardIds: ['osaka-transport-1'],
    difficulty: 2,
    quiz: [
      {
        question: '新干线从东京到大阪大约需要多长时间？',
        options: ['1.5小时', '2.5小时', '3.5小时', '4.5小时'],
        correctIndex: 1,
      },
      {
        question: '新干线的车票包含哪两部分？',
        options: ['乘车券+特急券', '基础券+座位券', '入场券+乘车券', '日券+周券'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'quest-osaka-5',
    title: '大阪终极挑战：一日通关计划',
    description: '规划一条完美的大阪一日游路线，涵盖美食、历史、购物。',
    cityId: 'osaka',
    videoUrl: 'https://www.youtube.com/watch?v=sample11',
    durationSec: 360,
    xpReward: 280,
    skillRewardIds: [],
    difficulty: 3,
    quiz: [
      {
        question: '以下哪个区域以电子产品和动漫闻名？',
        options: ['心斋桥', '日本桥', '梅田', '天王寺'],
        correctIndex: 1,
      },
      {
        question: '大阪环球影城位于哪个区域？',
        options: ['港区', '此花区', '中央区', '浪速区'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quest-osaka-6',
    title: '道顿堀拼图：拼出美食霓虹',
    description: '将道顿堀的夜景照片拼回完整画面，把大阪美食街的霓虹灯光重新点亮。',
    cityId: 'osaka',
    durationSec: 240,
    xpReward: 220,
    skillRewardIds: ['osaka-food-1'],
    difficulty: 2,
    quiz: [
      {
        question: '道顿堀的名字来源于什么？',
        options: ['一个人名', '一条运河的名字', '一种食物', '一个将军'],
        correctIndex: 1,
      },
      {
        question: '道顿堀最有名的美食之一是？',
        options: ['寿司', '章鱼烧', '天妇罗', '寿喜烧'],
        correctIndex: 1,
      },
    ],
  },
];

const kyotoQuestDrafts: QuestDraft[] = [
  {
    id: 'quest-kyoto-1',
    title: '千本鸟居：穿越朱红色的时光隧道',
    description: '在伏见稻荷大社的千本鸟居中穿行，感受神域的神秘。',
    cityId: 'kyoto',
    videoUrl: 'https://www.youtube.com/watch?v=sample12',
    durationSec: 240,
    xpReward: 200,
    skillRewardIds: ['kyoto-culture-1'],
    difficulty: 1,
    quiz: [
      {
        question: '伏见稻荷大社供奉的主神是？',
        options: ['天照大神', '稻荷大神', '月读命', '素盏鸣尊'],
        correctIndex: 1,
      },
      {
        question: '鸟居通常是什么颜色？',
        options: ['黑色', '金色', '朱红色', '白色'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'quest-kyoto-2',
    title: '抹茶与侘寂：茶道心灵之旅',
    description: '体验日本茶道，理解「一期一会」的哲学内涵。',
    cityId: 'kyoto',
    videoUrl: 'https://www.youtube.com/watch?v=sample13',
    durationSec: 300,
    xpReward: 250,
    skillRewardIds: ['kyoto-culture-1'],
    difficulty: 2,
    quiz: [
      {
        question: '茶道精神「和敬清寂」中「寂」的含义是？',
        options: ['寂静', '寂寞', '内心的平静', '孤独之美'],
        correctIndex: 2,
      },
      {
        question: '茶道中使用的主要器具叫什么？',
        options: ['铁壶', '茶碗', '砂铫', '盖碗'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quest-kyoto-3',
    title: '和食精髓：一汁三菜',
    description: '深度了解日本料理的基本构成与餐桌礼仪。',
    cityId: 'kyoto',
    videoUrl: 'https://www.youtube.com/watch?v=sample14',
    durationSec: 270,
    xpReward: 220,
    skillRewardIds: ['kyoto-food-1'],
    difficulty: 2,
    quiz: [
      {
        question: '「一汁三菜」指的是什么？',
        options: [
          '一道汤+三道菜',
          '一种酱汁+三种菜',
          '一顿饭+三份甜点',
          '一个主菜+三个配菜',
        ],
        correctIndex: 0,
      },
      {
        question: '吃和食时，米饭应该放在哪个位置？',
        options: ['中间', '左前方', '右前方', '最后面'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quest-kyoto-4',
    title: '平安京物语：千年古都的诞生',
    description: '回到1200年前，了解平安京的建都历程与贵族文化。',
    cityId: 'kyoto',
    videoUrl: 'https://www.youtube.com/watch?v=sample15',
    durationSec: 360,
    xpReward: 280,
    skillRewardIds: ['kyoto-history-1'],
    difficulty: 3,
    quiz: [
      {
        question: '平安京是模仿中国哪个城市建设？',
        options: ['北京', '南京', '长安', '洛阳'],
        correctIndex: 2,
      },
      {
        question: '平安京的建都年份是？',
        options: ['710年', '794年', '894年', '1185年'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quest-kyoto-5',
    title: '和服试穿：从访问着到振袖',
    description: '了解和服的种类、穿着场合与背后的文化含义。',
    cityId: 'kyoto',
    videoUrl: 'https://www.youtube.com/watch?v=sample16',
    durationSec: 300,
    xpReward: 230,
    skillRewardIds: ['kyoto-culture-2'],
    difficulty: 2,
    quiz: [
      {
        question: '未婚女性在正式场合穿的和服叫什么？',
        options: ['留袖', '振袖', '访问着', '浴衣'],
        correctIndex: 1,
      },
      {
        question: '和服腰带「带」的结法叫什么？',
        options: ['蝴蝶结', '太鼓结', '平结', '花结'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quest-kyoto-6',
    title: '日本酒品鉴：从大吟酿到纯米',
    description: '认识清酒的种类、酿造工艺与品尝方法。',
    cityId: 'kyoto',
    videoUrl: 'https://www.youtube.com/watch?v=sample17',
    durationSec: 330,
    xpReward: 260,
    skillRewardIds: ['kyoto-food-2', 'osaka-language-1'],
    difficulty: 3,
    quiz: [
      {
        question: '大吟酿的精米步合（精米率）必须低于多少？',
        options: ['70%', '60%', '50%', '40%'],
        correctIndex: 2,
      },
      {
        question: '「纯米酒」的含义是？',
        options: ['只用了米和水', '不添加酿造用酒精', '只用一种米', '纯手工酿造'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quest-kyoto-7',
    title: '伏见稻荷拼图：拼出千本鸟居',
    description: '将伏见稻荷大社的照片拼回完整画面，在朱红色的鸟居长廊中穿越千年时光。',
    cityId: 'kyoto',
    durationSec: 240,
    xpReward: 230,
    skillRewardIds: ['kyoto-culture-2'],
    difficulty: 2,
    quiz: [
      {
        question: '伏见稻荷大社的千本鸟居大约有多少座？',
        options: ['约100座', '约1000座', '约5000座', '约1万座'],
        correctIndex: 3,
      },
      {
        question: '稻荷神社的使者动物是什么？',
        options: ['猫', '狗', '狐狸', '鹿'],
        correctIndex: 2,
      },
    ],
  },
];

const kamakuraQuestDrafts: QuestDraft[] = [
  {
    id: 'quest-kamakura-1',
    title: '镰仓大佛：青铜中的禅意',
    description: '走近高德院镰仓大佛，感受日本第二大佛的庄严与历史。',
    cityId: 'kamakura',
    videoUrl: 'https://www.youtube.com/watch?v=sample18',
    durationSec: 240,
    xpReward: 200,
    skillRewardIds: ['kamakura-history-1'],
    difficulty: 2,
    quiz: [
      {
        question: '镰仓大佛的高度约是多少？',
        options: ['8米', '13.35米', '18米', '25米'],
        correctIndex: 1,
      },
      {
        question: '镰仓大佛原本是在室内还是室外？',
        options: ['室内', '室外'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'quest-kamakura-2',
    title: '江之电：海岸线上的电车之旅',
    description: '乘坐百年历史的江之岛电铁，感受海街的浪漫与悠闲。',
    cityId: 'kamakura',
    videoUrl: 'https://www.youtube.com/watch?v=sample19',
    durationSec: 220,
    xpReward: 180,
    skillRewardIds: ['kamakura-transport-1'],
    difficulty: 1,
    quiz: [
      {
        question: '江之电的起点和终点分别是？',
        options: ['镰仓→藤泽', '藤泽→镰仓', '镰仓→江之岛', '大船→镰仓'],
        correctIndex: 1,
      },
      {
        question: '《灌篮高手》的经典路口出现在哪个站附近？',
        options: ['长谷站', '极乐寺站', '镰仓高校前站', '腰越站'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'quest-kamakura-3',
    title: '武士道：镰仓幕府的诞生',
    description: '了解源赖朝建立镰仓幕府的历史，武士时代的开端。',
    cityId: 'kamakura',
    videoUrl: 'https://www.youtube.com/watch?v=sample20',
    durationSec: 300,
    xpReward: 250,
    skillRewardIds: ['kamakura-history-1'],
    difficulty: 3,
    quiz: [
      {
        question: '日本第一个武家政权叫什么？',
        options: ['江户幕府', '室町幕府', '镰仓幕府', '丰臣政权'],
        correctIndex: 2,
      },
      {
        question: '源赖朝被称为日本历史上第一个什么？',
        options: ['天皇', '将军', '征夷大将军', '太政大臣'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'quest-kamakura-4',
    title: '禅寺冥想：武士的心灵修行',
    description: '在镰仓的建长寺体验坐禅，了解禅宗对武士文化的影响。',
    cityId: 'kamakura',
    videoUrl: 'https://www.youtube.com/watch?v=sample21',
    durationSec: 280,
    xpReward: 240,
    skillRewardIds: ['kamakura-culture-1'],
    difficulty: 3,
    quiz: [
      {
        question: '日本临济宗的本山是镰仓哪座寺院？',
        options: ['圆觉寺', '建长寺', '鹤冈八幡宫', '长谷寺'],
        correctIndex: 1,
      },
      {
        question: '坐禅时身体应该保持什么状态？',
        options: ['完全放松', '挺直但放松', '紧绷', '随意'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quest-kamakura-5',
    title: '镰仓大佛拼图：拼出青铜禅意',
    description: '将镰仓大佛的照片拼回完整画面，感受高德院青铜佛像的庄严与千年禅意。',
    cityId: 'kamakura',
    durationSec: 240,
    xpReward: 230,
    skillRewardIds: ['kamakura-history-1'],
    difficulty: 2,
    quiz: [
      {
        question: '镰仓大佛的材质是什么？',
        options: ['铁', '青铜', '黄金', '石材'],
        correctIndex: 1,
      },
      {
        question: '镰仓大佛位于哪座寺院内？',
        options: ['建长寺', '圆觉寺', '高德院', '长谷寺'],
        correctIndex: 2,
      },
    ],
  },
];

export const tokyoQuests: Quest[] = tokyoQuestDrafts.map(enhanceQuest);
export const osakaQuests: Quest[] = osakaQuestDrafts.map(enhanceQuest);
export const kyotoQuests: Quest[] = kyotoQuestDrafts.map(enhanceQuest);
export const kamakuraQuests: Quest[] = kamakuraQuestDrafts.map(enhanceQuest);

export const allQuests: Quest[] = [
  ...tokyoQuests,
  ...osakaQuests,
  ...kyotoQuests,
  ...kamakuraQuests,
];

export const questsById: Record<string, Quest> = Object.fromEntries(
  allQuests.map((q) => [q.id, q])
);

export const questsByCity: Record<string, Quest[]> = {
  tokyo: tokyoQuests,
  osaka: osakaQuests,
  kyoto: kyotoQuests,
  kamakura: kamakuraQuests,
};
