import { allSkills } from '@/data/skills';
import { SkillDetailContent } from './SkillDetailContent';

export function generateStaticParams() {
  return allSkills.map((s) => ({ id: s.id }));
}

export default function SkillDetailPage({ params }: { params: { id: string } }) {
  return <SkillDetailContent skillId={params.id} />;
}
