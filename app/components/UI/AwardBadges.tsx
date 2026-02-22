'use client';

import { Award as AwardData, AwardType } from '@/app/types/restaurant';
import { sortAwardsByPriority } from '@/app/lib/awards';
import AwardBadge, { AwardIcon } from './AwardBadge';
import { cn } from '@/app/lib/utils';

interface AwardBadgesProps {
  awards: AwardData[];
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  showYears?: boolean;
  maxDisplay?: number;
  compact?: boolean;
  className?: string;
}

export default function AwardBadges({
  awards,
  size = 'md',
  showLabels = false,
  showYears = false,
  maxDisplay = 5,
  compact = false,
  className,
}: AwardBadgesProps) {
  if (!awards || awards.length === 0) return null;

  // Sort by priority and limit display
  const sortedTypes = sortAwardsByPriority(awards.map((a) => a.type));
  const uniqueTypes = [...new Set(sortedTypes)];
  const displayTypes = uniqueTypes.slice(0, maxDisplay);
  const remainingCount = uniqueTypes.length - displayTypes.length;

  // Find the most recent award for each type
  const getLatestAward = (type: AwardType): AwardData => {
    return awards
      .filter((a) => a.type === type)
      .sort((a, b) => b.year - a.year)[0];
  };

  if (compact) {
    // Compact mode - just icons in a row
    return (
      <div className={cn('flex items-center gap-0.5', className)}>
        {displayTypes.map((type) => (
          <AwardIcon key={type} type={type} size={12} />
        ))}
        {remainingCount > 0 && (
          <span className="text-[10px] text-text-secondary ml-0.5">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {displayTypes.map((type) => {
        const latestAward = getLatestAward(type);
        return (
          <AwardBadge
            key={type}
            award={latestAward}
            size={size}
            showLabel={showLabels}
            showYear={showYears}
          />
        );
      })}
      {remainingCount > 0 && (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-surface-secondary text-text-secondary font-medium',
            size === 'sm' ? 'h-5 px-1.5 text-[10px]' : '',
            size === 'md' ? 'h-6 px-2 text-xs' : '',
            size === 'lg' ? 'h-8 px-3 text-sm' : ''
          )}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
}

// Grid layout for award showcase
interface AwardGridProps {
  awards: AwardData[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function AwardGrid({ awards, columns = 3, className }: AwardGridProps) {
  if (!awards || awards.length === 0) return null;

  const colClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  // Group by type, show most recent year
  const awardsByType = awards.reduce(
    (acc, award) => {
      if (!acc[award.type] || acc[award.type].year < award.year) {
        acc[award.type] = award;
      }
      return acc;
    },
    {} as Record<AwardType, AwardData>
  );

  const sortedAwards = sortAwardsByPriority(
    Object.keys(awardsByType) as AwardType[]
  ).map((type) => awardsByType[type]);

  return (
    <div className={cn('grid gap-2', colClasses[columns], className)}>
      {sortedAwards.map((award) => (
        <AwardBadge
          key={award.type}
          award={award}
          size="md"
          showLabel
          showYear
          className="justify-center"
        />
      ))}
    </div>
  );
}
