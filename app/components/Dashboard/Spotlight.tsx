'use client';

import Link from 'next/link';
import { MapPin, ExternalLink, Trophy } from 'lucide-react';
import { Restaurant } from '@/app/types/restaurant';
import AwardBadges from '@/app/components/UI/AwardBadges';
import { getCountryFlag } from '@/app/lib/utils';

interface SpotlightProps {
  restaurant: Restaurant;
  className?: string;
}

export default function Spotlight({ restaurant, className }: SpotlightProps) {
  const flag = getCountryFlag(restaurant.countryCode);

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-text-primary">Spotlight</h2>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Hero Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-accent/20 via-purple-500/20 to-blue-500/20 relative">
          {/* Rank Badge */}
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-lg">#{restaurant.rank}</span>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />

          {/* Content */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-text-primary mb-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-2 text-text-secondary">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {flag} {restaurant.city}, {restaurant.country}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 space-y-3">
          {/* Chef */}
          {restaurant.chef?.name && (
            <p className="text-sm text-text-secondary">
              Chef: <span className="text-text-primary font-medium">{restaurant.chef.name}</span>
            </p>
          )}

          {/* Cuisine */}
          <p className="text-sm text-text-secondary">
            Cuisine: <span className="text-text-primary font-medium">{restaurant.cuisine}</span>
          </p>

          {/* Awards */}
          {restaurant.awards && restaurant.awards.length > 0 && (
            <AwardBadges awards={restaurant.awards} size="sm" showLabels maxDisplay={3} />
          )}

          {/* Description */}
          {restaurant.description && (
            <p className="text-sm text-text-secondary line-clamp-2">
              {restaurant.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Link
              href="/map"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              View on Map
            </Link>
            {restaurant.website && (
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 rounded-lg bg-surface-secondary text-text-primary text-sm font-medium hover:bg-surface-tertiary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
