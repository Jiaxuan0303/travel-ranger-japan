export type CityId = 'tokyo' | 'kyoto' | 'osaka' | 'kamakura';

export const CITY_IDS: CityId[] = ['tokyo', 'osaka', 'kyoto', 'kamakura'];

export interface UnlockCondition {
  minLevel: number;
  requiredSkills: string[];
  requiredCities: CityId[];
}

export interface Landmark {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  lat: number;
  lng: number;
}

export interface City {
  id: CityId;
  name: string;
  nameJa: string;
  subtitle: string;
  description: string;
  color: string;           // Tailwind color class for theming
  emoji: string;
  unlockCondition: UnlockCondition | null;
  landmarks: Landmark[];
  totalQuests: number;
}

export interface PlayerCityProgress {
  cityId: CityId;
  unlocked: boolean;
  completionPercent: number;
  questsCompleted: string[];
  landmarksVisited: string[];
}
