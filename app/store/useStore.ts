import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Restaurant, FilterState, UserLocation, MapStyle, CollectionItem } from '@/app/types/restaurant';

interface AppState {
  // Restaurants
  restaurants: Restaurant[];
  setRestaurants: (restaurants: Restaurant[]) => void;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;

  // Filters
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // User Location
  userLocation: UserLocation | null;
  setUserLocation: (location: UserLocation | null) => void;
  isLocating: boolean;
  setIsLocating: (isLocating: boolean) => void;

  // Map
  mapStyle: MapStyle;
  setMapStyle: (style: MapStyle) => void;
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
  mapZoom: number;
  setMapZoom: (zoom: number) => void;

  // Compare
  compareList: string[];
  addToCompare: (restaurantId: string) => void;
  removeFromCompare: (restaurantId: string) => void;
  clearCompare: () => void;

  // Collections
  favorites: CollectionItem[];
  addFavorite: (restaurantId: string) => void;
  removeFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;

  visited: CollectionItem[];
  markVisited: (restaurantId: string, notes?: string, rating?: number) => void;
  unmarkVisited: (restaurantId: string) => void;
  isVisited: (restaurantId: string) => boolean;

  wishlist: CollectionItem[];
  addToWishlist: (restaurantId: string, priority?: 'low' | 'medium' | 'high') => void;
  removeFromWishlist: (restaurantId: string) => void;
  isInWishlist: (restaurantId: string) => boolean;

  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  detailPanelOpen: boolean;
  setDetailPanelOpen: (open: boolean) => void;
}

const defaultFilters: FilterState = {
  search: '',
  lists: [],
  cuisines: [],
  countries: [],
  rankingTier: 'all',
  maxDistance: null,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Restaurants
      restaurants: [],
      setRestaurants: (restaurants) => set({ restaurants }),
      selectedRestaurant: null,
      setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant, detailPanelOpen: !!restaurant }),

      // Filters
      filters: defaultFilters,
      setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      resetFilters: () => set({ filters: defaultFilters }),

      // User Location
      userLocation: null,
      setUserLocation: (location) => set({ userLocation: location }),
      isLocating: false,
      setIsLocating: (isLocating) => set({ isLocating }),

      // Map
      mapStyle: 'dark',
      setMapStyle: (style) => set({ mapStyle: style }),
      mapCenter: [30, 0],
      setMapCenter: (center) => set({ mapCenter: center }),
      mapZoom: 2,
      setMapZoom: (zoom) => set({ mapZoom: zoom }),

      // Compare
      compareList: [],
      addToCompare: (restaurantId) => set((state) => {
        if (state.compareList.length >= 3) return state;
        if (state.compareList.includes(restaurantId)) return state;
        return { compareList: [...state.compareList, restaurantId] };
      }),
      removeFromCompare: (restaurantId) => set((state) => ({
        compareList: state.compareList.filter(id => id !== restaurantId)
      })),
      clearCompare: () => set({ compareList: [] }),

      // Collections
      favorites: [],
      addFavorite: (restaurantId) => set((state) => {
        if (state.favorites.some(f => f.restaurantId === restaurantId)) return state;
        return {
          favorites: [...state.favorites, { restaurantId, addedAt: new Date().toISOString() }]
        };
      }),
      removeFavorite: (restaurantId) => set((state) => ({
        favorites: state.favorites.filter(f => f.restaurantId !== restaurantId)
      })),
      isFavorite: (restaurantId) => get().favorites.some(f => f.restaurantId === restaurantId),

      visited: [],
      markVisited: (restaurantId, notes, rating) => set((state) => {
        const existing = state.visited.find(v => v.restaurantId === restaurantId);
        if (existing) {
          return {
            visited: state.visited.map(v =>
              v.restaurantId === restaurantId
                ? { ...v, notes, rating, visitedAt: new Date().toISOString() }
                : v
            )
          };
        }
        return {
          visited: [...state.visited, {
            restaurantId,
            addedAt: new Date().toISOString(),
            visitedAt: new Date().toISOString(),
            notes,
            rating
          }]
        };
      }),
      unmarkVisited: (restaurantId) => set((state) => ({
        visited: state.visited.filter(v => v.restaurantId !== restaurantId)
      })),
      isVisited: (restaurantId) => get().visited.some(v => v.restaurantId === restaurantId),

      wishlist: [],
      addToWishlist: (restaurantId, priority = 'medium') => set((state) => {
        if (state.wishlist.some(w => w.restaurantId === restaurantId)) return state;
        return {
          wishlist: [...state.wishlist, { restaurantId, addedAt: new Date().toISOString(), priority }]
        };
      }),
      removeFromWishlist: (restaurantId) => set((state) => ({
        wishlist: state.wishlist.filter(w => w.restaurantId !== restaurantId)
      })),
      isInWishlist: (restaurantId) => get().wishlist.some(w => w.restaurantId === restaurantId),

      // UI
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      detailPanelOpen: false,
      setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),
    }),
    {
      name: 'restaurant-map-storage',
      partialize: (state) => ({
        mapStyle: state.mapStyle,
        favorites: state.favorites,
        visited: state.visited,
        wishlist: state.wishlist,
        compareList: state.compareList,
      }),
    }
  )
);
