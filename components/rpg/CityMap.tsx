'use client';

import { CITY_IDS } from '@/lib/types';
import { CityCard } from './CityCard';

export function CityMap() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {CITY_IDS.map((cityId, i) => (
        <CityCard key={cityId} cityId={cityId} index={i} />
      ))}
    </div>
  );
}
