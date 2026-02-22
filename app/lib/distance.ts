/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  } else if (km < 100) {
    return `${km.toFixed(1)} km`;
  } else {
    return `${Math.round(km).toLocaleString()} km`;
  }
}

/**
 * Format distance for display with miles option
 */
export function formatDistanceWithUnit(km: number, useMiles = false): string {
  if (useMiles) {
    const miles = km * 0.621371;
    if (miles < 1) {
      return `${Math.round(miles * 5280)} ft`;
    } else if (miles < 100) {
      return `${miles.toFixed(1)} mi`;
    } else {
      return `${Math.round(miles).toLocaleString()} mi`;
    }
  }
  return formatDistance(km);
}
