# CLAUDE.md - Project Context for Claude Code

## Project Summary
Restaurant Map is a Next.js 15 application that displays an interactive world map of top-rated restaurants from "The World's 50 Best Restaurants" and "La Liste Top 100" rankings. It features filtering, analytics, comparison tools, and personal collections.

## Tech Stack
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 with CSS variables for theming
- **Maps:** Leaflet + react-leaflet (OpenStreetMap tiles, no API key needed)
- **Charts:** Recharts
- **State Management:** Zustand with persist middleware
- **Icons:** Lucide React
- **Theming:** next-themes (dark/light mode)

## Key Architecture Decisions

### Map Integration
- Leaflet requires dynamic imports (`ssr: false`) to avoid window/document errors
- Map components are in `app/components/Map/`
- MapClient.tsx contains the actual Leaflet code, MapContainer.tsx wraps it with dynamic import

### State Management
- Single Zustand store at `app/store/useStore.ts`
- Persists favorites, visited, wishlist, compareList, and mapStyle to localStorage
- Filter state is not persisted (resets on refresh)

### Theming
- Uses next-themes with `attribute="class"`
- Default theme is dark
- Theme toggle requires `mounted` state check to avoid hydration mismatch

### Data
- Restaurant data is static JSON at `public/data/restaurants.json`
- 89 restaurants with geocoded coordinates
- Each restaurant has: id, rank, name, city, country, countryCode, cuisine, coordinates, list, website, phone, email, score

## File Structure
```
app/
├── page.tsx                    # Main map page (client component)
├── analytics/page.tsx          # Analytics dashboard with charts
├── compare/page.tsx            # Side-by-side comparison
├── layout.tsx                  # Root layout with ThemeProvider
├── globals.css                 # Tailwind + custom CSS variables
├── components/
│   ├── Map/
│   │   ├── MapClient.tsx       # Leaflet map implementation
│   │   ├── MapContainer.tsx    # Dynamic import wrapper
│   │   └── MapStyleSelector.tsx
│   ├── Sidebar/
│   │   ├── Sidebar.tsx         # Main sidebar with tabs
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   └── RestaurantList.tsx
│   ├── Cards/
│   │   └── RestaurantDetail.tsx
│   ├── Layout/
│   │   └── Header.tsx          # Navigation + theme toggle
│   └── UI/
│       ├── LocationButton.tsx
│       └── CompareFloatingButton.tsx
├── hooks/
│   └── useGeolocation.ts
├── store/
│   └── useStore.ts             # Zustand store
├── lib/
│   ├── utils.ts                # cn(), getCountryFlag(), etc.
│   ├── distance.ts             # Haversine formula
│   └── mapStyles.ts            # Map tile configurations
└── types/
    └── restaurant.ts           # TypeScript interfaces
```

## Common Patterns

### Client Components
Most components are client components (`'use client'`) due to:
- Leaflet requiring browser APIs
- Zustand store usage
- Event handlers and interactivity

### Hydration Safety
When using values that differ between server/client (like theme):
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
// Only render dynamic content after mounted
```

### Map Style Configuration
```typescript
// lib/mapStyles.ts
export const MAP_STYLES = {
  dark: { url: 'https://{s}.basemaps.cartocdn.com/dark_all/...', ... },
  satellite: { url: 'https://server.arcgisonline.com/...', ... },
  terrain: { url: 'https://{s}.tile.opentopomap.org/...', ... },
  minimal: { url: 'https://{s}.basemaps.cartocdn.com/light_all/...', ... },
};
```

### Distance Calculation
Uses Haversine formula in `lib/distance.ts`:
```typescript
calculateDistance(lat1, lon1, lat2, lon2) // Returns km
formatDistance(km) // Returns "X km" or "X m"
```

## Build Notes
- Turbopack is default in Next.js 16
- `next.config.ts` sets `turbopack.root` to handle non-ASCII path characters
- Recharts warnings during build about chart dimensions are expected (SSR context)

## Deployment
- GitHub: https://github.com/whoami42069/restaurant-map
- Vercel: https://restaurant-map-phi.vercel.app
- Auto-deploys on push to master branch

## Development
```bash
npm run dev -- -p 3002  # Dev server (port 3002 if 3000 is busy)
npm run build           # Production build
npm run lint            # ESLint
```
