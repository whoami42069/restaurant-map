'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { Restaurant } from '@/app/types/restaurant';
import { useStore } from '@/app/store/useStore';
import { MAP_STYLES } from '@/app/lib/mapStyles';

interface MapClientProps {
  restaurants: Restaurant[];
}

const createCustomIcon = (restaurant: Restaurant, isSelected: boolean) => {
  const color = restaurant.list === 'worlds-50-best'
    ? '#f59e0b'
    : restaurant.list === 'la-liste'
      ? '#3b82f6'
      : '#10b981';

  const size = isSelected ? 40 : 30;
  const borderWidth = isSelected ? 3 : 2;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: ${borderWidth}px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${isSelected ? '14px' : '11px'};
        transition: all 0.2s ease;
        ${isSelected ? 'transform: scale(1.2); z-index: 1000;' : ''}
      ">
        ${restaurant.rank <= 50 ? restaurant.rank : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export default function MapClient({ restaurants }: MapClientProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const {
    mapStyle,
    mapCenter,
    mapZoom,
    selectedRestaurant,
    setSelectedRestaurant,
    setMapCenter,
    setMapZoom,
    userLocation
  } = useStore();

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map('map', {
      center: mapCenter,
      zoom: mapZoom,
      zoomControl: false,
    });

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer
    const styleConfig = MAP_STYLES[mapStyle];
    tileLayerRef.current = L.tileLayer(styleConfig.url, {
      attribution: styleConfig.attribution,
      maxZoom: 19,
    }).addTo(map);

    // Create marker cluster group
    markersRef.current = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let size = 'small';
        if (count > 10) size = 'medium';
        if (count > 25) size = 'large';

        return L.divIcon({
          html: `<div class="cluster-icon cluster-${size}"><span>${count}</span></div>`,
          className: 'custom-cluster',
          iconSize: L.point(40, 40),
        });
      },
    });

    map.addLayer(markersRef.current);

    // Track map movement
    map.on('moveend', () => {
      const center = map.getCenter();
      setMapCenter([center.lat, center.lng]);
      setMapZoom(map.getZoom());
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update tile layer when style changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    const styleConfig = MAP_STYLES[mapStyle];
    mapRef.current.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(styleConfig.url, {
      attribution: styleConfig.attribution,
      maxZoom: 19,
    }).addTo(mapRef.current);
  }, [mapStyle]);

  // Update markers when restaurants change
  useEffect(() => {
    if (!markersRef.current) return;

    markersRef.current.clearLayers();

    restaurants.forEach((restaurant) => {
      const isSelected = selectedRestaurant?.id === restaurant.id;
      const marker = L.marker(
        [restaurant.coordinates.lat, restaurant.coordinates.lng],
        { icon: createCustomIcon(restaurant, isSelected) }
      );

      marker.bindPopup(`
        <div class="popup-content">
          <h3 class="font-bold text-lg">${restaurant.name}</h3>
          <p class="text-sm text-gray-600">${restaurant.city}, ${restaurant.country}</p>
          <p class="text-sm">${restaurant.cuisine}</p>
          <p class="text-xs mt-1 font-medium" style="color: ${
            restaurant.list === 'worlds-50-best' ? '#f59e0b' :
            restaurant.list === 'la-liste' ? '#3b82f6' : '#10b981'
          }">
            #${restaurant.rank} ${restaurant.list === 'worlds-50-best' ? "World's 50 Best" :
            restaurant.list === 'la-liste' ? 'La Liste' : 'Both Lists'}
          </p>
        </div>
      `, { className: 'custom-popup' });

      marker.on('click', () => {
        setSelectedRestaurant(restaurant);
      });

      markersRef.current?.addLayer(marker);
    });
  }, [restaurants, selectedRestaurant, setSelectedRestaurant]);

  // Pan to selected restaurant
  useEffect(() => {
    if (selectedRestaurant && mapRef.current) {
      mapRef.current.flyTo(
        [selectedRestaurant.coordinates.lat, selectedRestaurant.coordinates.lng],
        14,
        { duration: 1 }
      );
    }
  }, [selectedRestaurant]);

  // Add user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    const userMarker = L.circleMarker(
      [userLocation.lat, userLocation.lng],
      {
        radius: 8,
        fillColor: '#3b82f6',
        fillOpacity: 1,
        color: 'white',
        weight: 3,
      }
    ).addTo(mapRef.current);

    // Add accuracy circle
    const accuracyCircle = L.circle(
      [userLocation.lat, userLocation.lng],
      {
        radius: userLocation.accuracy,
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        color: '#3b82f6',
        weight: 1,
      }
    ).addTo(mapRef.current);

    return () => {
      mapRef.current?.removeLayer(userMarker);
      mapRef.current?.removeLayer(accuracyCircle);
    };
  }, [userLocation]);

  return <div id="map" className="w-full h-full" />;
}
