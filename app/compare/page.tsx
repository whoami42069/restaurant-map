'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, X, Plus, MapPin, Phone, Mail, Globe, Navigation, Star } from 'lucide-react';
import { useStore } from '@/app/store/useStore';
import { Restaurant } from '@/app/types/restaurant';
import { getCountryFlag, cn } from '@/app/lib/utils';
import { calculateDistance, formatDistance } from '@/app/lib/distance';
import restaurantsData from '@/public/data/restaurants.json';

export default function ComparePage() {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    restaurants,
    setRestaurants,
    userLocation
  } = useStore();

  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    if (restaurants.length === 0) {
      setRestaurants(restaurantsData as Restaurant[]);
    }
  }, [restaurants.length, setRestaurants]);

  const compareRestaurants = restaurants.filter(r => compareList.includes(r.id));

  const getDistance = (restaurant: Restaurant) => {
    if (!userLocation) return null;
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      restaurant.coordinates.lat,
      restaurant.coordinates.lng
    );
  };

  const getDirectionsUrl = (restaurant: Restaurant) => {
    const { lat, lng } = restaurant.coordinates;
    const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      return `maps://maps.apple.com/?daddr=${lat},${lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-text-primary">Compare Restaurants</h1>
          </div>
          {compareList.length > 0 && (
            <button
              onClick={clearCompare}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {compareList.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Plus className="w-10 h-10 text-text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">No restaurants to compare</h2>
            <p className="text-text-secondary mb-6">Add restaurants from the map to compare them side by side</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Map
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compareRestaurants.map((restaurant) => {
              const distance = getDistance(restaurant);

              return (
                <div key={restaurant.id} className="glass-card overflow-hidden">
                  {/* Header */}
                  <div className="relative h-32 bg-gradient-to-br from-accent/20 to-accent/5 p-4">
                    <button
                      onClick={() => removeFromCompare(restaurant.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-bg-secondary/80 backdrop-blur-sm
                                 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          'w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold text-white',
                          restaurant.list === 'worlds-50-best' ? 'bg-amber-500' :
                          restaurant.list === 'la-liste' ? 'bg-blue-500' : 'bg-emerald-500'
                        )}>
                          {restaurant.rank}
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
                      <h2 className="text-lg font-bold text-text-primary truncate">{restaurant.name}</h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-4">
                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-text-primary">
                          {getCountryFlag(restaurant.countryCode)} {restaurant.city}
                        </p>
                        <p className="text-sm text-text-secondary">{restaurant.country}</p>
                      </div>
                    </div>

                    {/* Cuisine */}
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-text-secondary flex-shrink-0" />
                      <span className="text-text-primary">{restaurant.cuisine}</span>
                    </div>

                    {/* Score */}
                    {restaurant.score && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-text-secondary mb-1">La Liste Score</p>
                        <p className="text-2xl font-bold text-accent">{restaurant.score.toFixed(2)}</p>
                      </div>
                    )}

                    {/* Distance */}
                    {distance && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-text-secondary mb-1">Distance from you</p>
                        <p className="text-lg font-semibold text-text-primary">{formatDistance(distance)}</p>
                      </div>
                    )}

                    {/* Contact */}
                    <div className="space-y-2">
                      {restaurant.phone && (
                        <a
                          href={`tel:${restaurant.phone}`}
                          className="flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Phone className="w-4 h-4 text-text-secondary" />
                          <span className="text-sm text-text-primary truncate">{restaurant.phone}</span>
                        </a>
                      )}
                      {restaurant.email && (
                        <a
                          href={`mailto:${restaurant.email}`}
                          className="flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Mail className="w-4 h-4 text-text-secondary" />
                          <span className="text-sm text-text-primary truncate">{restaurant.email}</span>
                        </a>
                      )}
                      {restaurant.website && (
                        <a
                          href={restaurant.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Globe className="w-4 h-4 text-text-secondary" />
                          <span className="text-sm text-accent truncate">
                            {restaurant.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </span>
                        </a>
                      )}
                    </div>

                    {/* Directions */}
                    <a
                      href={getDirectionsUrl(restaurant)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </a>
                  </div>
                </div>
              );
            })}

            {/* Add More Card */}
            {compareList.length < 3 && (
              <Link
                href="/"
                className="glass-card flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border hover:border-accent/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-text-secondary" />
                </div>
                <p className="text-text-secondary">Add another restaurant</p>
                <p className="text-xs text-text-secondary mt-1">({3 - compareList.length} remaining)</p>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
