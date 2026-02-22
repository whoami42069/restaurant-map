'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Restaurant, AwardType } from '@/app/types/restaurant';
import { AWARD_CONFIGS, ALL_AWARD_TYPES, getAwardConfig } from '@/app/lib/awards';
import AwardBadge from '@/app/components/UI/AwardBadge';
import { cn } from '@/app/lib/utils';

interface AwardShowcaseProps {
  restaurants: Restaurant[];
  className?: string;
}

export default function AwardShowcase({ restaurants, className }: AwardShowcaseProps) {
  // Get award counts
  const awardCounts = ALL_AWARD_TYPES.reduce(
    (acc, type) => {
      const count = restaurants.filter((r) =>
        r.awards?.some((a) => a.type === type)
      ).length;
      if (count > 0) {
        acc[type] = count;
      }
      return acc;
    },
    {} as Record<AwardType, number>
  );

  const awardTypes = Object.keys(awardCounts) as AwardType[];

  if (awardTypes.length === 0) {
    // Show placeholder awards if no data yet
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <span>🏅</span> Award Winners
          </h2>
          <Link
            href="/awards"
            className="text-sm text-accent hover:text-accent/80 flex items-center gap-1"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ALL_AWARD_TYPES.slice(0, 5).map((type) => {
            const config = getAwardConfig(type);
            return (
              <Link
                key={type}
                href={`/awards?type=${type}`}
                className="glass-card p-3 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform"
              >
                <AwardBadge award={type} size="lg" />
                <span className="text-xs text-text-secondary text-center">
                  {config.shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <span>🏅</span> Award Winners
        </h2>
        <Link
          href="/awards"
          className="text-sm text-accent hover:text-accent/80 flex items-center gap-1"
        >
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {awardTypes.slice(0, 10).map((type) => {
          const config = getAwardConfig(type);
          const count = awardCounts[type];

          return (
            <Link
              key={type}
              href={`/awards?type=${type}`}
              className="glass-card p-3 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              <AwardBadge award={type} size="lg" />
              <span className="text-xs text-text-secondary text-center">
                {config.shortLabel}
              </span>
              <span className="text-[10px] text-text-muted">
                {count} restaurant{count !== 1 ? 's' : ''}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
