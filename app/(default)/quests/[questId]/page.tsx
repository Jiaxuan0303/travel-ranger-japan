import { allQuests } from '@/data/quests';
import { QuestDetailContent } from './QuestDetailContent';

export function generateStaticParams() {
  return allQuests.map((q) => ({ questId: q.id }));
}

export default function QuestDetailPage({ params }: { params: { questId: string } }) {
  return <QuestDetailContent questId={params.questId} />;
}
