'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronRight } from 'lucide-react';
import { Restaurant, RegionType } from '@/app/types/restaurant';
import AwardBadges from '@/app/components/UI/AwardBadges';
import { cn, getCountryFlag } from '@/app/lib/utils';

const REGIONS: { id: RegionType | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '🌍' },
  { id: 'global', label: 'Global', emoji: '🏆' },
  { id: 'asia', label: 'Asia', emoji: '🌏' },
  { id: 'latam', label: 'LATAM', emoji: '🌎' },
  { id: 'mena', label: 'MENA', emoji: '🕌' },
  { id: 'north-america', label: 'N. America', emoji: '🗽' },
];

interface RegionTabsProps {
  restaurants: Restaurant[];
  className?: string;
}

export default function RegionTabs({ restaurants, className }: RegionTabsProps) {
  const [activeRegion, setActiveRegion] = useState<RegionType | 'all'>('all');

  const filteredRestaurants =
    activeRegion === 'all'
      ? restaurants
      : restaurants.filter((r) => r.region === activeRegion);

  const displayRestaurants = filteredRestaurants.slice(0, 6);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <span>🌍</span> Browse by Region
        </h2>
        <Link
          href="/map"
          className="text-sm text-accent hover:text-accent/80 flex items-center gap-1"
        >
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Region Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
        {REGIONS.map((region) => (
          <button
            key={region.id}
            onClick={() => setActiveRegion(region.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeRegion === region.id
                ? 'bg-accent text-white'
                : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
            )}
          >
            <span>{region.emoji}</span>
            <span>{region.label}</span>
          </button>
        ))}
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayRestaurants.map((restaurant) => {
          const flag = getCountryFlag(restaurant.countryCode);

          return (
            <Link
              key={restaurant.id}
              href={`/map?restaurant=${restaurant.id}`}
              className="glass-card p-3 flex items-start gap-3 hover:bg-surface-secondary/50 transition-colors group"
            >
              {/* Rank */}
              <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-accent">
                  #{restaurant.rank}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                  {restaurant.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-0.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">
                    {flag} {restaurant.city}
                  </span>
                </div>
                {restaurant.awards && restaurant.awards.length > 0 && (
                  <div className="mt-1.5">
                    <AwardBadges awards={restaurant.awards} compact maxDisplay={2} />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filteredRestaurants.length > 6 && (
        <div className="mt-4 text-center">
          <Link
            href={`/map?region=${activeRegion}`}
            className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80"
          >
            View all {filteredRestaurants.length} restaurants
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
