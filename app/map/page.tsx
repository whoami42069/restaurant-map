'use client';

import { useEffect, useMemo } from 'react';
import { useStore } from '@/app/store/useStore';
import MapContainer from '@/app/components/Map/MapContainer';
import MapStyleSelector from '@/app/components/Map/MapStyleSelector';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import RestaurantDetail from '@/app/components/Cards/RestaurantDetail';
import LocationButton from '@/app/components/UI/LocationButton';
import CompareFloatingButton from '@/app/components/UI/CompareFloatingButton';
import restaurantsData from '@/public/data/restaurants.json';
import { Restaurant } from '@/app/types/restaurant';

export default function MapPage() {
  const { restaurants, setRestaurants, filters, userLocation } = useStore();

  // Load restaurants on mount
  useEffect(() => {
    setRestaurants(restaurantsData as Restaurant[]);
  }, [setRestaurants]);

  // Filter restaurants based on current filters
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          restaurant.name.toLowerCase().includes(searchLower) ||
          restaurant.city.toLowerCase().includes(searchLower) ||
          restaurant.country.toLowerCase().includes(searchLower) ||
          restaurant.cuisine.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // List filter
      if (filters.lists.length > 0) {
        if (restaurant.list === 'both') {
          // Show if any of the selected lists match
        } else if (!filters.lists.includes(restaurant.list)) {
          return false;
        }
      }

      // Cuisine filter
      if (filters.cuisines.length > 0) {
        if (!filters.cuisines.includes(restaurant.cuisine)) return false;
      }

      // Country filter
      if (filters.countries.length > 0) {
        if (!filters.countries.includes(restaurant.country)) return false;
      }

      // Ranking tier filter
      if (filters.rankingTier !== 'all') {
        const tierLimits: Record<string, number> = {
          'top-10': 10,
          'top-25': 25,
          'top-50': 50,
          'top-100': 100,
        };
        const limit = tierLimits[filters.rankingTier];
        if (limit && restaurant.rank > limit) return false;
      }

      // Distance filter
      if (filters.maxDistance !== null && userLocation) {
        const R = 6371;
        const dLat = ((restaurant.coordinates.lat - userLocation.lat) * Math.PI) / 180;
        const dLon = ((restaurant.coordinates.lng - userLocation.lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLocation.lat * Math.PI) / 180) *
            Math.cos((restaurant.coordinates.lat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        if (distance > filters.maxDistance) return false;
      }

      return true;
    });
  }, [restaurants, filters, userLocation]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-bg-primary pt-14">
      {/* Sidebar */}
      <Sidebar restaurants={restaurants} filteredRestaurants={filteredRestaurants} />

      {/* Map */}
      <div className="h-full w-full">
        <MapContainer restaurants={filteredRestaurants} />
        <MapStyleSelector />
        <LocationButton />
      </div>

      {/* Restaurant Detail Panel */}
      <RestaurantDetail />

      {/* Compare Floating Button */}
      <CompareFloatingButton />
    </main>
  );
}
