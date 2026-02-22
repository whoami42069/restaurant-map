// Award types for special recognition
export type AwardType =
  | 'highest-climber'
  | 'highest-new-entry'
  | 'one-to-watch'
  | 'sustainable'
  | 'best-female-chef'
  | 'best-pastry-chef'
  | 'art-of-hospitality'
  | 'chefs-choice'
  | 'icon'
  | 'best-of-the-best';

// Regional list identifiers
export type RegionType = 'global' | 'asia' | 'latam' | 'mena' | 'north-america';

// Award with year and optional sponsor
export interface Award {
  type: AwardType;
  year: number;
  sponsored?: string;
}

// Chef profile information
export interface ChefProfile {
  name: string;
  photo?: string;
  background?: string;
  otherRestaurants?: string[];
  relationToRestaurant?: string; // How chef founded/joined the restaurant
}

// Historical ranking entry
export interface RankingHistoryEntry {
  year: number;
  rank: number | null;
  list?: 'worlds-50-best' | 'asia' | 'latam' | 'mena' | 'north-america';
}

// Restaurant images
export interface RestaurantImages {
  hero?: string;
  dishes?: string[];
  interior?: string[];
}

// Social media links
export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface Restaurant {
  // Core identification
  id: string;
  rank: number;
  name: string;

  // Location
  city: string;
  country: string;
  countryCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };

  // Classification
  cuisine: string;
  list: 'worlds-50-best' | 'la-liste' | 'both';
  region?: RegionType;

  // Contact information
  website: string | null;
  phone: string | null;
  email: string | null;

  // La Liste score (if applicable)
  score?: number;

  // Extended information
  description?: string;
  yearOpened?: number;
  signatureDishes?: string[];

  // Chef & team
  chef?: ChefProfile;
  pastryChef?: string;

  // Media
  images?: RestaurantImages;
  socialMedia?: SocialMedia;

  // Awards & recognition
  awards?: Award[];

  // Historical data
  rankingHistory?: RankingHistoryEntry[];
  peakRank?: number;
  yearsInTop50?: number;

  // Career guidance for applicants
  applicantTips?: string[]; // 3-5 bullet points for job seekers
}

export interface FilterState {
  search: string;
  lists: ('worlds-50-best' | 'la-liste')[];
  cuisines: string[];
  countries: string[];
  regions: RegionType[];
  awards: AwardType[];
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
