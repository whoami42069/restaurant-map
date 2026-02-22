'use client';

import {
  TrendingUp,
  Star,
  Eye,
  Leaf,
  Award,
  Cake,
  Heart,
  ChefHat,
  Crown,
  Trophy,
  LucideIcon,
} from 'lucide-react';
import { AwardType, Award as AwardData } from '@/app/types/restaurant';
import { getAwardConfig, AwardConfig } from '@/app/lib/awards';
import { cn } from '@/app/lib/utils';

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  Star,
  Eye,
  Leaf,
  Award,
  Cake,
  Heart,
  ChefHat,
  Crown,
  Trophy,
};

interface AwardBadgeProps {
  award: AwardData | AwardType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showYear?: boolean;
  className?: string;
}

export default function AwardBadge({
  award,
  size = 'md',
  showLabel = false,
  showYear = false,
  className,
}: AwardBadgeProps) {
  const awardType = typeof award === 'string' ? award : award.type;
  const awardYear = typeof award === 'object' ? award.year : undefined;
  const config = getAwardConfig(awardType);
  const Icon = ICON_MAP[config.icon] || Award;

  const sizeClasses = {
    sm: 'h-5 px-1.5 text-[10px]',
    md: 'h-6 px-2 text-xs',
    lg: 'h-8 px-3 text-sm',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium transition-all',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
      }}
      title={`${config.label}${awardYear ? ` (${awardYear})` : ''}`}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && (
        <span className="whitespace-nowrap">
          {size === 'sm' ? config.shortLabel : config.label}
        </span>
      )}
      {showYear && awardYear && (
        <span className="opacity-75">{awardYear}</span>
      )}
    </div>
  );
}

// Compact icon-only badge for markers
interface AwardIconProps {
  type: AwardType;
  size?: number;
  className?: string;
}

export function AwardIcon({ type, size = 14, className }: AwardIconProps) {
  const config = getAwardConfig(type);
  const Icon = ICON_MAP[config.icon] || Award;

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full p-0.5',
        className
      )}
      style={{ backgroundColor: config.bgColor }}
      title={config.label}
    >
      <Icon style={{ width: size, height: size, color: config.color }} />
    </div>
  );
}
