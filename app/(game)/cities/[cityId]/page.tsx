import { CityId, CITY_IDS } from '@/lib/types';
import { CityPageContent } from '@/components/city/CityPageContent';

export function generateStaticParams() {
  return CITY_IDS.map((id) => ({ cityId: id }));
}

export default function CityPage({ params }: { params: { cityId: string } }) {
  return <CityPageContent cityId={params.cityId as CityId} />;
}
