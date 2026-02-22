'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, List, Heart, MapPin } from 'lucide-react';
import { useStore } from '@/app/store/useStore';
import { cn } from '@/app/lib/utils';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import RestaurantList from './RestaurantList';
import { Restaurant } from '@/app/types/restaurant';

interface SidebarProps {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
}

type TabType = 'list' | 'filters' | 'favorites';

export default function Sidebar({ restaurants, filteredRestaurants }: SidebarProps) {
  const { sidebarOpen, setSidebarOpen, favorites } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('list');

  const tabs: { id: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'list', label: 'Restaurants', icon: <List className="w-4 h-4" />, count: filteredRestaurants.length },
    { id: 'filters', label: 'Filters', icon: <Filter className="w-4 h-4" /> },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-4 h-4" />, count: favorites.length },
  ];

  const favoriteRestaurants = filteredRestaurants.filter(r =>
    favorites.some(f => f.restaurantId === r.id)
  );

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={cn(
          'fixed top-1/2 -translate-y-1/2 z-[600] glass-card p-2 transition-all duration-300',
          sidebarOpen ? 'left-[380px]' : 'left-0'
        )}
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-5 h-5 text-text-primary" />
        ) : (
          <ChevronRight className="w-5 h-5 text-text-primary" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-[380px] z-[500] transition-transform duration-300 ease-in-out',
          'bg-bg-secondary border-r border-border',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-xl font-bold text-text-primary">Restaurant Map</h1>
                <p className="text-xs text-text-secondary">World's Best Restaurants</p>
              </div>
            </div>
            <SearchBar />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={cn(
                    'px-1.5 py-0.5 text-xs rounded-full',
                    activeTab === tab.id ? 'bg-accent/20 text-accent' : 'bg-white/10'
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'list' && (
              <RestaurantList restaurants={filteredRestaurants} />
            )}
            {activeTab === 'filters' && (
              <FilterPanel restaurants={restaurants} />
            )}
            {activeTab === 'favorites' && (
              <RestaurantList restaurants={favoriteRestaurants} emptyMessage="No favorites yet" />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
