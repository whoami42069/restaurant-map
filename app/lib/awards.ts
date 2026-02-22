import { AwardType } from '@/app/types/restaurant';

export interface AwardConfig {
  type: AwardType;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string; // Lucide icon name
}

export const AWARD_CONFIGS: Record<AwardType, AwardConfig> = {
  'highest-climber': {
    type: 'highest-climber',
    label: 'Highest Climber',
    shortLabel: 'Climber',
    description: 'Biggest rise in rankings this year',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    icon: 'TrendingUp',
  },
  'highest-new-entry': {
    type: 'highest-new-entry',
    label: 'Highest New Entry',
    shortLabel: 'New Entry',
    description: 'Best new entrant to the list',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    icon: 'Star',
  },
  'one-to-watch': {
    type: 'one-to-watch',
    label: 'One To Watch',
    shortLabel: 'Watch',
    description: 'Emerging restaurant to keep an eye on',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    icon: 'Eye',
  },
  'sustainable': {
    type: 'sustainable',
    label: 'Sustainable Restaurant',
    shortLabel: 'Sustainable',
    description: 'Recognized for environmental responsibility',
    color: '#059669',
    bgColor: 'rgba(5, 150, 105, 0.15)',
    icon: 'Leaf',
  },
  'best-female-chef': {
    type: 'best-female-chef',
    label: "Best Female Chef",
    shortLabel: 'Female Chef',
    description: 'Restaurant with award-winning female chef',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    icon: 'Award',
  },
  'best-pastry-chef': {
    type: 'best-pastry-chef',
    label: 'Best Pastry Chef',
    shortLabel: 'Pastry',
    description: 'Outstanding pastry program',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    icon: 'Cake',
  },
  'art-of-hospitality': {
    type: 'art-of-hospitality',
    label: 'Art of Hospitality',
    shortLabel: 'Hospitality',
    description: 'Excellence in service and guest experience',
    color: '#6366f1',
    bgColor: 'rgba(99, 102, 241, 0.15)',
    icon: 'Heart',
  },
  'chefs-choice': {
    type: 'chefs-choice',
    label: "Chefs' Choice",
    shortLabel: "Chefs'",
    description: 'Voted by fellow chefs',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    icon: 'ChefHat',
  },
  'icon': {
    type: 'icon',
    label: 'Icon Award',
    shortLabel: 'Icon',
    description: 'Lifetime achievement in culinary arts',
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    icon: 'Crown',
  },
  'best-of-the-best': {
    type: 'best-of-the-best',
    label: 'Best of the Best',
    shortLabel: 'Best',
    description: 'Hall of Fame - Former #1 restaurants',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    icon: 'Trophy',
  },
};

// Get all award types
export const ALL_AWARD_TYPES = Object.keys(AWARD_CONFIGS) as AwardType[];

// Get award config by type
export function getAwardConfig(type: AwardType): AwardConfig {
  return AWARD_CONFIGS[type];
}

// Get color for award badge
export function getAwardColor(type: AwardType): string {
  return AWARD_CONFIGS[type]?.color || '#6b7280';
}

// Get background color for award badge
export function getAwardBgColor(type: AwardType): string {
  return AWARD_CONFIGS[type]?.bgColor || 'rgba(107, 114, 128, 0.15)';
}

// Sort awards by importance (for display)
const AWARD_PRIORITY: Record<AwardType, number> = {
  'best-of-the-best': 1,
  'icon': 2,
  'highest-new-entry': 3,
  'highest-climber': 4,
  'sustainable': 5,
  'one-to-watch': 6,
  'chefs-choice': 7,
  'art-of-hospitality': 8,
  'best-female-chef': 9,
  'best-pastry-chef': 10,
};

export function sortAwardsByPriority(awards: AwardType[]): AwardType[] {
  return [...awards].sort((a, b) => (AWARD_PRIORITY[a] || 99) - (AWARD_PRIORITY[b] || 99));
}
