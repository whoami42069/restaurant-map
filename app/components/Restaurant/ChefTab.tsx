'use client';

import { ChefHat, ExternalLink, Award } from 'lucide-react';
import { Restaurant } from '@/app/types/restaurant';
import { cn } from '@/app/lib/utils';

interface ChefTabProps {
  restaurant: Restaurant;
  className?: string;
}

export default function ChefTab({ restaurant, className }: ChefTabProps) {
  const chef = restaurant.chef;
  const pastryChef = restaurant.pastryChef;

  if (!chef && !pastryChef) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
        <ChefHat className="w-12 h-12 text-text-muted mb-4" />
        <p className="text-text-secondary">Chef information not available</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Head Chef */}
      {chef && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            Head Chef
          </h3>

          <div className="flex items-start gap-4">
            {/* Chef Photo Placeholder */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
              {chef.photo ? (
                <img
                  src={chef.photo}
                  alt={chef.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <ChefHat className="w-8 h-8 text-accent" />
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-lg font-semibold text-text-primary">
                {chef.name}
              </h4>

              {chef.background && (
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                  {chef.background}
                </p>
              )}
            </div>
          </div>

          {/* Other Restaurants */}
          {chef.otherRestaurants && chef.otherRestaurants.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                Other Restaurants
              </h4>
              <div className="flex flex-wrap gap-2">
                {chef.otherRestaurants.map((name, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-surface-secondary text-text-secondary text-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pastry Chef */}
      {pastryChef && (
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Pastry Chef
          </h3>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-text-primary font-medium">{pastryChef}</span>
          </div>
        </div>
      )}

      {/* Signature Dishes */}
      {restaurant.signatureDishes && restaurant.signatureDishes.length > 0 && (
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Signature Dishes
          </h3>

          <div className="space-y-2">
            {restaurant.signatureDishes.map((dish, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-text-primary"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-sm">{dish}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
