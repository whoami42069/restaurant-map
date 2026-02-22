export interface Restaurant {
  id: string;
  rank: number;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  cuisine: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  coordinates: {
    lat: number;
    lng: number;
  };
  list: 'worlds-50-best' | 'la-liste' | 'both';
  score?: number;
  description?: string;
}

export interface FilterState {
  search: string;
  lists: ('worlds-50-best' | 'la-liste')[];
  cuisines: string[];
  countries: string[];
  rankingTier: 'all' | 'top-10' | 'top-25' | 'top-50' | 'top-100';
  maxDistance: number | null;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

export type MapStyle = 'dark' | 'satellite' | 'terrain' | 'minimal';

export type RankingTier = 'all' | 'top-10' | 'top-25' | 'top-50' | 'top-100';

export interface CollectionItem {
  restaurantId: string;
  addedAt: string;
  notes?: string;
  visitedAt?: string;
  rating?: number;
  priority?: 'low' | 'medium' | 'high';
}
