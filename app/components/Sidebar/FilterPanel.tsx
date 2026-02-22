'use client';

import { useStore } from '@/app/store/useStore';
import { Restaurant, RankingTier } from '@/app/types/restaurant';
import { getUniqueValues, cn } from '@/app/lib/utils';
import { Check, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  restaurants: Restaurant[];
}

export default function FilterPanel({ restaurants }: FilterPanelProps) {
  const { filters, setFilters, resetFilters } = useStore();

  const cuisines = getUniqueValues(restaurants, 'cuisine');
  const countries = getUniqueValues(restaurants, 'country');
  const lists: { value: 'worlds-50-best' | 'la-liste'; label: string }[] = [
    { value: 'worlds-50-best', label: "World's 50 Best" },
    { value: 'la-liste', label: 'La Liste' },
  ];

  const tiers: { value: RankingTier; label: string }[] = [
    { value: 'all', label: 'All Rankings' },
    { value: 'top-10', label: 'Top 10' },
    { value: 'top-25', label: 'Top 25' },
    { value: 'top-50', label: 'Top 50' },
    { value: 'top-100', label: 'Top 100' },
  ];

  const toggleListFilter = (value: 'worlds-50-best' | 'la-liste') => {
    const current = filters.lists;
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilters({ lists: updated });
  };

  const toggleArrayFilter = (
    key: 'cuisines' | 'countries',
    value: string
  ) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilters({ [key]: updated });
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary
                     hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Filters
        </button>
      </div>

      {/* Lists Filter */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Lists</h3>
        <div className="space-y-2">
          {lists.map((list) => (
            <button
              key={list.value}
              onClick={() => toggleListFilter(list.value)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all',
                filters.lists.includes(list.value)
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-bg-primary text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'
              )}
            >
              <span className="text-sm">{list.label}</span>
              {filters.lists.includes(list.value) && (
                <Check className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Ranking Tier */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Ranking</h3>
        <div className="flex flex-wrap gap-2">
          {tiers.map((tier) => (
            <button
              key={tier.value}
              onClick={() => setFilters({ rankingTier: tier.value })}
              className={cn(
                'px-3 py-1.5 text-sm rounded-full transition-all',
                filters.rankingTier === tier.value
                  ? 'bg-accent text-white'
                  : 'bg-bg-primary text-text-secondary hover:text-text-primary hover:bg-white/5'
              )}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cuisines */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Cuisines ({filters.cuisines.length} selected)
        </h3>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => toggleArrayFilter('cuisines', cuisine)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-full transition-all',
                filters.cuisines.includes(cuisine)
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-bg-primary text-text-secondary hover:text-text-primary border border-border'
              )}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Countries */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Countries ({filters.countries.length} selected)
        </h3>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => toggleArrayFilter('countries', country)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-full transition-all',
                filters.countries.includes(country)
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-bg-primary text-text-secondary hover:text-text-primary border border-border'
              )}
            >
              {country}
            </button>
          ))}
        </div>
      </div>

      {/* Distance Filter */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Max Distance: {filters.maxDistance ? `${filters.maxDistance} km` : 'Any'}
        </h3>
        <input
          type="range"
          min="0"
          max="20000"
          step="100"
          value={filters.maxDistance || 20000}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setFilters({ maxDistance: value === 20000 ? null : value });
          }}
          className="w-full h-2 bg-bg-primary rounded-lg appearance-none cursor-pointer
                     accent-accent"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>0 km</span>
          <span>20,000 km</span>
        </div>
      </div>
    </div>
  );
}
