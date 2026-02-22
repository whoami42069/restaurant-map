'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, TrendingUp, Star, Sparkles } from 'lucide-react';
import { Restaurant } from '@/app/types/restaurant';
import AwardBadges from '@/app/components/UI/AwardBadges';
import { cn, getCountryFlag } from '@/app/lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
  variant?: 'default' | 'climber' | 'new-entry';
}

function RestaurantCard({ restaurant, variant = 'default' }: RestaurantCardProps) {
  const flag = getCountryFlag(restaurant.countryCode);

  const variantIcons = {
    default: null,
    climber: <TrendingUp className="w-3.5 h-3.5 text-green-500" />,
    'new-entry': <Star className="w-3.5 h-3.5 text-blue-500" />,
  };

  return (
    <Link
      href={`/map?restaurant=${restaurant.id}`}
      className="flex-shrink-0 w-64 glass-card overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer group"
    >
      {/* Image Placeholder */}
      <div className="h-32 bg-gradient-to-br from-accent/10 via-purple-500/10 to-blue-500/10 relative">
        {/* Rank Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-surface/80 backdrop-blur-sm flex items-center gap-1.5">
          <span className="text-sm font-bold text-text-primary">#{restaurant.rank}</span>
          {variantIcons[variant]}
        </div>

        {/* Awards */}
        {restaurant.awards && restaurant.awards.length > 0 && (
          <div className="absolute top-2 right-2">
            <AwardBadges awards={restaurant.awards} compact maxDisplay={2} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        <h4 className="font-semibold text-text-primary truncate group-hover:text-accent transition-colors">
          {restaurant.name}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <MapPin className="w-3 h-3" />
          <span className="truncate">
            {flag} {restaurant.city}, {restaurant.country}
          </span>
        </div>
        <p className="text-xs text-text-muted">{restaurant.cuisine}</p>
      </div>
    </Link>
  );
}

interface TrendingCarouselProps {
  title: string;
  icon: React.ReactNode;
  restaurants: Restaurant[];
  variant?: 'default' | 'climber' | 'new-entry';
  className?: string;
}

export default function TrendingCarousel({
  title,
  icon,
  restaurants,
  variant = 'default',
  className,
}: TrendingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (restaurants.length === 0) return null;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
}

// Pre-configured carousels
interface CategoryCarouselsProps {
  restaurants: Restaurant[];
}

export function CategoryCarousels({ restaurants }: CategoryCarouselsProps) {
  // Trending - Top 10
  const trending = restaurants.slice(0, 10);

  // Climbers - Restaurants with highest-climber award
  const climbers = restaurants.filter((r) =>
    r.awards?.some((a) => a.type === 'highest-climber')
  ).slice(0, 10);

  // New Entries - Restaurants with highest-new-entry award
  const newEntries = restaurants.filter((r) =>
    r.awards?.some((a) => a.type === 'highest-new-entry')
  ).slice(0, 10);

  return (
    <div className="space-y-6">
      <TrendingCarousel
        title="Trending"
        icon={<Sparkles className="w-5 h-5 text-orange-500" />}
        restaurants={trending}
      />

      {climbers.length > 0 && (
        <TrendingCarousel
          title="Highest Climbers"
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          restaurants={climbers}
          variant="climber"
        />
      )}

      {newEntries.length > 0 && (
        <TrendingCarousel
          title="New Entries"
          icon={<Star className="w-5 h-5 text-blue-500" />}
          restaurants={newEntries}
          variant="new-entry"
        />
      )}
    </div>
  );
}
