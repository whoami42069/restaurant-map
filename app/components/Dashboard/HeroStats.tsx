'use client';

import { MapPin, Globe, ChefHat, Trophy, Utensils } from 'lucide-react';
import { Restaurant } from '@/app/types/restaurant';
import { cn } from '@/app/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color?: string;
}

function StatCard({ icon, value, label, color }: StatCardProps) {
  return (
    <div className="glass-card p-4 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform">
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          color || 'bg-accent/15'
        )}
      >
        {icon}
      </div>
      <span className="text-2xl font-bold text-text-primary">{value}</span>
      <span className="text-xs text-text-secondary text-center">{label}</span>
    </div>
  );
}

interface HeroStatsProps {
  restaurants: Restaurant[];
  className?: string;
}

export default function HeroStats({ restaurants, className }: HeroStatsProps) {
  // Calculate stats
  const totalRestaurants = restaurants.length;
  const uniqueCountries = new Set(restaurants.map((r) => r.country)).size;
  const uniqueCuisines = new Set(restaurants.map((r) => r.cuisine)).size;
  const uniqueRegions = new Set(restaurants.map((r) => r.region).filter(Boolean)).size || 5;
  const awardsCount = restaurants.reduce(
    (acc, r) => acc + (r.awards?.length || 0),
    0
  );

  const stats = [
    {
      icon: <Utensils className="w-5 h-5 text-accent" />,
      value: totalRestaurants,
      label: 'Restaurants',
      color: 'bg-accent/15',
    },
    {
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      value: uniqueRegions,
      label: 'Regions',
      color: 'bg-blue-500/15',
    },
    {
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      value: awardsCount || '10+',
      label: 'Award Types',
      color: 'bg-yellow-500/15',
    },
    {
      icon: <MapPin className="w-5 h-5 text-green-500" />,
      value: uniqueCountries,
      label: 'Countries',
      color: 'bg-green-500/15',
    },
    {
      icon: <ChefHat className="w-5 h-5 text-purple-500" />,
      value: uniqueCuisines,
      label: 'Cuisines',
      color: 'bg-purple-500/15',
    },
  ];

  return (
    <div className={cn('grid grid-cols-5 gap-3', className)}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          color={stat.color}
        />
      ))}
    </div>
  );
}
