'use client';

import { useCallback } from 'react';
import { useStore } from '@/app/store/useStore';

export function useGeolocation() {
  const { setUserLocation, setIsLocating, isLocating } = useStore();

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, [setUserLocation, setIsLocating]);

  return { requestLocation, isLocating };
}
