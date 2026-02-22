'use client';

import { Crosshair, Loader2 } from 'lucide-react';
import { useGeolocation } from '@/app/hooks/useGeolocation';
import { useStore } from '@/app/store/useStore';
import { cn } from '@/app/lib/utils';

export default function LocationButton() {
  const { requestLocation, isLocating } = useGeolocation();
  const { userLocation } = useStore();

  return (
    <button
      onClick={requestLocation}
      disabled={isLocating}
      className={cn(
        'absolute bottom-24 right-4 z-[1000] p-3 rounded-full shadow-lg transition-all duration-200',
        'glass-card hover:bg-white/10',
        userLocation && 'ring-2 ring-accent',
        isLocating && 'animate-pulse'
      )}
      title={userLocation ? 'Update location' : 'Get my location'}
    >
      {isLocating ? (
        <Loader2 className="w-5 h-5 text-accent animate-spin" />
      ) : (
        <Crosshair className={cn('w-5 h-5', userLocation ? 'text-accent' : 'text-text-primary')} />
      )}
    </button>
  );
}
