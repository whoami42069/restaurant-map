'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MapPin, ChevronLeft, Filter, X } from 'lucide-react';
import { useStore } from '@/app/store/useStore';
import AwardBadge from '@/app/components/UI/AwardBadge';
import AwardBadges from '@/app/components/UI/AwardBadges';
import { ALL_AWARD_TYPES, getAwardConfig, AWARD_CONFIGS } from '@/app/lib/awards';
import { AwardType, Restaurant } from '@/app/types/restaurant';
import { cn, getCountryFlag } from '@/app/lib/utils';
import restaurantsData from '@/public/data/restaurants.json';

function AwardsContent() {
  const searchParams = useSearchParams();
  const { restaurants, setRestaurants } = useStore();
  const [selectedAward, setSelectedAward] = useState<AwardType | null>(
    (searchParams.get('type') as AwardType) || null
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Load restaurants on mount
  useEffect(() => {
    if (restaurants.length === 0) {
      setRestaurants(restaurantsData as Restaurant[]);
    }
  }, [restaurants.length, setRestaurants]);

  // Get all years with awards
  const awardYears = useMemo(() => {
    const years = new Set<number>();
    restaurants.forEach((r) => {
      r.awards?.forEach((a) => years.add(a.year));
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [restaurants]);

  // Get award winners
  const awardWinners = useMemo(() => {
    return restaurants.filter((r) => {
      if (!r.awards || r.awards.length === 0) return false;

      if (selectedAward) {
        const hasAward = r.awards.some(
          (a) =>
            a.type === selectedAward &&
            (selectedYear ? a.year === selectedYear : true)
        );
        if (!hasAward) return false;
      }

      if (selectedYear && !selectedAward) {
        const hasAwardInYear = r.awards.some((a) => a.year === selectedYear);
        if (!hasAwardInYear) return false;
      }

      return true;
    });
  }, [restaurants, selectedAward, selectedYear]);

  // Get award counts
  const awardCounts = useMemo(() => {
    const counts: Record<AwardType, number> = {} as Record<AwardType, number>;
    ALL_AWARD_TYPES.forEach((type) => {
      counts[type] = restaurants.filter((r) =>
        r.awards?.some(
          (a) =>
            a.type === type && (selectedYear ? a.year === selectedYear : true)
        )
      ).length;
    });
    return counts;
  }, [restaurants, selectedYear]);

  const clearFilters = () => {
    setSelectedAward(null);
    setSelectedYear(null);
  };

  return (
    <main className="min-h-screen bg-bg-primary pt-14 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              href="/"
              className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1 mb-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-text-primary">
              Awards Encyclopedia
            </h1>
            <p className="text-text-secondary mt-1">
              Explore special recognition and achievements
            </p>
          </div>

          {(selectedAward || selectedYear) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>

        {/* Year Filter */}
        {awardYears.length > 0 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
            <span className="text-sm text-text-secondary flex-shrink-0">
              Year:
            </span>
            <button
              onClick={() => setSelectedYear(null)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                !selectedYear
                  ? 'bg-accent text-white'
                  : 'bg-surface-secondary text-text-secondary hover:text-text-primary'
              )}
            >
              All
            </button>
            {awardYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  selectedYear === year
                    ? 'bg-accent text-white'
                    : 'bg-surface-secondary text-text-secondary hover:text-text-primary'
                )}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {/* Award Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
          {ALL_AWARD_TYPES.map((type) => {
            const config = getAwardConfig(type);
            const count = awardCounts[type];
            const isSelected = selectedAward === type;

            return (
              <button
                key={type}
                onClick={() => setSelectedAward(isSelected ? null : type)}
                className={cn(
                  'glass-card p-4 flex flex-col items-center gap-2 transition-all',
                  isSelected
                    ? 'ring-2 ring-accent scale-105'
                    : 'hover:scale-102'
                )}
              >
                <AwardBadge award={type} size="lg" />
                <span className="text-xs text-text-primary font-medium text-center">
                  {config.shortLabel}
                </span>
                <span className="text-[10px] text-text-muted">
                  {count} winner{count !== 1 ? 's' : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Award Description */}
        {selectedAward && (
          <div className="glass-card p-4 mb-6 flex items-start gap-4">
            <AwardBadge award={selectedAward} size="lg" showLabel />
            <div>
              <h3 className="font-semibold text-text-primary">
                {AWARD_CONFIGS[selectedAward].label}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {AWARD_CONFIGS[selectedAward].description}
              </p>
            </div>
          </div>
        )}

        {/* Award Winners */}
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {selectedAward
            ? `${AWARD_CONFIGS[selectedAward].label} Winners`
            : 'All Award Winners'}
          {selectedYear && ` (${selectedYear})`}
          <span className="text-text-secondary font-normal ml-2">
            ({awardWinners.length})
          </span>
        </h2>

        {awardWinners.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-text-secondary">
              No award winners found with the current filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {awardWinners.map((restaurant) => {
              const flag = getCountryFlag(restaurant.countryCode);

              return (
                <Link
                  key={restaurant.id}
                  href={`/map?restaurant=${restaurant.id}`}
                  className="glass-card p-4 hover:bg-surface-secondary/50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    {/* Rank */}
                    <div className="w-12 h-12 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-accent">
                        #{restaurant.rank}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-text-primary truncate group-hover:text-accent transition-colors">
                        {restaurant.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-sm text-text-secondary mt-0.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {flag} {restaurant.city}, {restaurant.country}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        {restaurant.cuisine}
                      </p>
                    </div>
                  </div>

                  {/* Awards */}
                  {restaurant.awards && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <AwardBadges
                        awards={restaurant.awards}
                        size="sm"
                        showLabels
                        maxDisplay={4}
                      />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function AwardsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-bg-primary pt-14 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-secondary rounded w-48 mb-4"></div>
            <div className="h-4 bg-surface-secondary rounded w-64 mb-6"></div>
            <div className="grid grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-24 bg-surface-secondary rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    }>
      <AwardsContent />
    </Suspense>
  );
}
