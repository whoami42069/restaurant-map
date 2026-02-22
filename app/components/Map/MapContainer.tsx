'use client';

import dynamic from 'next/dynamic';
import { Restaurant } from '@/app/types/restaurant';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

interface MapContainerProps {
  restaurants: Restaurant[];
}

export default function MapContainer({ restaurants }: MapContainerProps) {
  return (
    <div className="w-full h-full relative">
      <MapClient restaurants={restaurants} />
    </div>
  );
}
