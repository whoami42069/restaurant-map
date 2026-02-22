'use client';

import { Restaurant } from '@/app/types/restaurant';
import { useStore } from '@/app/store/useStore';
import { getCountryFlag, cn } from '@/app/lib/utils';
import { calculateDistance, formatDistance } from '@/app/lib/distance';
import { Heart, GitCompare, MapPin, ExternalLink } from 'lucide-react';

interface RestaurantListProps {
  restaurants: Restaurant[];
  emptyMessage?: string;
}

export default function RestaurantList({
  restaurants,
  emptyMessage = 'No restaurants found'
}: RestaurantListProps) {
  const {
    selectedRestaurant,
    setSelectedRestaurant,
    userLocation,
    favorites,
    addFavorite,
    removeFavorite,
    compareList,
    addToCompare,
    removeFromCompare
  } = useStore();

  const getDistance = (restaurant: Restaurant) => {
    if (!userLocation) return null;
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      restaurant.coordinates.lat,
      restaurant.coordinates.lng
    );
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (userLocation) {
      const distA = getDistance(a) || Infinity;
      const distB = getDistance(b) || Infinity;
      return distA - distB;
    }
    return a.rank - b.rank;
  });

  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <MapPin className="w-12 h-12 text-text-secondary mb-4" />
        <p className="text-text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {sortedRestaurants.map((restaurant) => {
        const isSelected = selectedRestaurant?.id === restaurant.id;
        const isFavorite = favorites.some(f => f.restaurantId === restaurant.id);
        const isComparing = compareList.includes(restaurant.id);
        const distance = getDistance(restaurant);

        return (
          <div
            key={restaurant.id}
            onClick={() => setSelectedRestaurant(restaurant)}
            className={cn(
              'p-4 border-b border-border cursor-pointer transition-all duration-200',
              'hover:bg-white/5',
              isSelected && 'bg-accent/10 border-l-4 border-l-accent'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Rank and Name */}
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      'flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold text-white',
                      restaurant.list === 'worlds-50-best' ? 'bg-amber-500' :
                      restaurant.list === 'la-liste' ? 'bg-blue-500' : 'bg-emerald-500'
                    )}
                  >
                    {restaurant.rank}
                  </span>
                  <h3 className="font-semibold text-text-primary truncate">
                    {restaurant.name}
                  </h3>
                </div>

                {/* Location */}
                <p className="text-sm text-text-secondary flex items-center gap-1">
                  <span>{getCountryFlag(restaurant.countryCode)}</span>
                  <span>{restaurant.city}, {restaurant.country}</span>
                </p>

                {/* Cuisine and List */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 bg-white/5 rounded-full text-text-secondary">
                    {restaurant.cuisine}
                  </span>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    restaurant.list === 'worlds-50-best' ? 'bg-amber-500/20 text-amber-400' :
                    restaurant.list === 'la-liste' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  )}>
                    {restaurant.list === 'worlds-50-best' ? "50 Best" :
                     restaurant.list === 'la-liste' ? 'La Liste' : 'Both'}
                  </span>
                </div>

                {/* Distance */}
                {distance && (
                  <p className="text-xs text-accent mt-2">
                    {formatDistance(distance)} away
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    isFavorite ? removeFavorite(restaurant.id) : addFavorite(restaurant.id);
                  }}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isFavorite ? 'text-red-500 bg-red-500/10' : 'text-text-secondary hover:text-red-500 hover:bg-red-500/10'
                  )}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    isComparing ? removeFromCompare(restaurant.id) : addToCompare(restaurant.id);
                  }}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isComparing ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-accent hover:bg-accent/10'
                  )}
                  title={isComparing ? 'Remove from compare' : 'Add to compare'}
                  disabled={!isComparing && compareList.length >= 3}
                >
                  <GitCompare className="w-4 h-4" />
                </button>
                {restaurant.website && (
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-colors"
                    title="Visit website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
