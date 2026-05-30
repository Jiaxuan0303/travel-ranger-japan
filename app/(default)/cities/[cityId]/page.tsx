import { CityId } from '@/lib/types';
import { CityDetailContent } from './CityDetailContent';

export function generateStaticParams() {
  return [
    { cityId: 'tokyo' },
    { cityId: 'osaka' },
    { cityId: 'kyoto' },
    { cityId: 'kamakura' },
  ];
}

export default function CityDetailPage({ params }: { params: { cityId: string } }) {
  return <CityDetailContent cityId={params.cityId as CityId} />;
}
