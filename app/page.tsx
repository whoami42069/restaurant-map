'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Map, BarChart3, GitCompare, Search } from 'lucide-react';
import { useStore } from '@/app/store/useStore';
import HeroStats from '@/app/components/Dashboard/HeroStats';
import Spotlight from '@/app/components/Dashboard/Spotlight';
import { CategoryCarousels } from '@/app/components/Dashboard/TrendingCarousel';
import RegionTabs from '@/app/components/Dashboard/RegionTabs';
import AwardShowcase from '@/app/components/Dashboard/AwardShowcase';
import restaurantsData from '@/public/data/restaurants.json';
import { Restaurant } from '@/app/types/restaurant';

export default function Dashboard() {
  const { restaurants, setRestaurants } = useStore();

  // Load restaurants on mount
  useEffect(() => {
    setRestaurants(restaurantsData as Restaurant[]);
  }, [setRestaurants]);

  // Get the #1 restaurant for spotlight
  const spotlightRestaurant = restaurants.find((r) => r.rank === 1) || restaurants[0];

  return (
    <main className="min-h-screen bg-bg-primary pt-14 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Hero Stats */}
        <section>
          <HeroStats restaurants={restaurants} className="hidden sm:grid" />
          {/* Mobile version - 3 columns */}
          <div className="grid grid-cols-3 gap-2 sm:hidden">
            <div className="glass-card p-3 text-center">
              <span className="text-xl font-bold text-text-primary">{restaurants.length}</span>
              <p className="text-[10px] text-text-secondary">Restaurants</p>
            </div>
            <div className="glass-card p-3 text-center">
              <span className="text-xl font-bold text-text-primary">
                {new Set(restaurants.map((r) => r.country)).size}
              </span>
              <p className="text-[10px] text-text-secondary">Countries</p>
            </div>
            <div className="glass-card p-3 text-center">
              <span className="text-xl font-bold text-text-primary">
                {new Set(restaurants.map((r) => r.cuisine)).size}
              </span>
              <p className="text-[10px] text-text-secondary">Cuisines</p>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Spotlight - Takes 1 column */}
          <div className="lg:col-span-1">
            {spotlightRestaurant && (
              <Spotlight restaurant={spotlightRestaurant} />
            )}
          </div>

          {/* Region Browse - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RegionTabs restaurants={restaurants} />
          </div>
        </div>

        {/* Trending Carousels */}
        <section>
          <CategoryCarousels restaurants={restaurants} />
        </section>

        {/* Award Showcase */}
        <section>
          <AwardShowcase restaurants={restaurants} />
        </section>

        {/* Quick Navigation */}
        <section className="hidden md:block">
          <div className="grid grid-cols-3 gap-4">
            <Link
              href="/map"
              className="glass-card p-4 flex items-center gap-4 hover:bg-surface-secondary/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
                <Map className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                  Interactive Map
                </h3>
                <p className="text-sm text-text-secondary">Explore locations worldwide</p>
              </div>
            </Link>

            <Link
              href="/analytics"
              className="glass-card p-4 flex items-center gap-4 hover:bg-surface-secondary/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                  Analytics
                </h3>
                <p className="text-sm text-text-secondary">Charts and statistics</p>
              </div>
            </Link>

            <Link
              href="/compare"
              className="glass-card p-4 flex items-center gap-4 hover:bg-surface-secondary/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
                <GitCompare className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                  Compare
                </h3>
                <p className="text-sm text-text-secondary">Side-by-side comparison</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
