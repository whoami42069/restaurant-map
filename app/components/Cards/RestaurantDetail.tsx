'use client';

import { X, Heart, GitCompare, MapPin, Phone, Mail, Globe, Navigation, Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/app/store/useStore';
import { getCountryFlag, cn, generateShareUrl, copyToClipboard } from '@/app/lib/utils';
import { calculateDistance, formatDistance } from '@/app/lib/distance';

export default function RestaurantDetail() {
  const {
    selectedRestaurant,
    setSelectedRestaurant,
    detailPanelOpen,
    setDetailPanelOpen,
    userLocation,
    favorites,
    addFavorite,
    removeFavorite,
    compareList,
    addToCompare,
    removeFromCompare,
    visited,
    markVisited,
    unmarkVisited,
    wishlist,
    addToWishlist,
    removeFromWishlist
  } = useStore();

  const [copied, setCopied] = useState<string | null>(null);

  if (!selectedRestaurant || !detailPanelOpen) return null;

  const isFavorite = favorites.some(f => f.restaurantId === selectedRestaurant.id);
  const isComparing = compareList.includes(selectedRestaurant.id);
  const isVisited = visited.some(v => v.restaurantId === selectedRestaurant.id);
  const isInWishlist = wishlist.some(w => w.restaurantId === selectedRestaurant.id);

  const distance = userLocation
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        selectedRestaurant.coordinates.lat,
        selectedRestaurant.coordinates.lng
      )
    : null;

  const handleCopy = async (text: string, type: string) => {
    await copyToClipboard(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = async () => {
    const shareUrl = generateShareUrl(selectedRestaurant.id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedRestaurant.name,
          text: `Check out ${selectedRestaurant.name} - ${selectedRestaurant.city}, ${selectedRestaurant.country}`,
          url: shareUrl,
        });
      } catch {
        await handleCopy(shareUrl, 'share');
      }
    } else {
      await handleCopy(shareUrl, 'share');
    }
  };

  const getDirectionsUrl = () => {
    const { lat, lng } = selectedRestaurant.coordinates;
    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      return `maps://maps.apple.com/?daddr=${lat},${lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[400px] z-[1001] bg-bg-secondary border-l border-border shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-br from-accent/20 to-accent/5">
        <button
          onClick={() => {
            setDetailPanelOpen(false);
            setSelectedRestaurant(null);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-bg-secondary/80 backdrop-blur-sm
                     text-text-secondary hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              'w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold text-white',
              selectedRestaurant.list === 'worlds-50-best' ? 'bg-amber-500' :
              selectedRestaurant.list === 'la-liste' ? 'bg-blue-500' : 'bg-emerald-500'
            )}>
              {selectedRestaurant.rank}
            </span>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              selectedRestaurant.list === 'worlds-50-best' ? 'bg-amber-500/20 text-amber-400' :
              selectedRestaurant.list === 'la-liste' ? 'bg-blue-500/20 text-blue-400' :
              'bg-emerald-500/20 text-emerald-400'
            )}>
              {selectedRestaurant.list === 'worlds-50-best' ? "World's 50 Best" :
               selectedRestaurant.list === 'la-liste' ? 'La Liste' : 'Both Lists'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-text-primary">{selectedRestaurant.name}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 h-[calc(100%-8rem)] overflow-y-auto">
        {/* Location */}
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-text-secondary mt-0.5" />
          <div>
            <p className="text-text-primary">
              {getCountryFlag(selectedRestaurant.countryCode)} {selectedRestaurant.city}, {selectedRestaurant.country}
            </p>
            <p className="text-sm text-text-secondary">{selectedRestaurant.cuisine} cuisine</p>
            {distance && (
              <p className="text-sm text-accent mt-1">{formatDistance(distance)} from your location</p>
            )}
          </div>
        </div>

        {/* Score for La Liste */}
        {selectedRestaurant.score && (
          <div className="glass-card p-4">
            <p className="text-sm text-text-secondary mb-1">La Liste Score</p>
            <p className="text-3xl font-bold text-accent">{selectedRestaurant.score.toFixed(2)}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => isFavorite ? removeFavorite(selectedRestaurant.id) : addFavorite(selectedRestaurant.id)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg transition-colors',
              isFavorite ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-text-secondary hover:bg-white/10'
            )}
          >
            <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
            <span className="text-xs">Favorite</span>
          </button>
          <button
            onClick={() => isComparing ? removeFromCompare(selectedRestaurant.id) : addToCompare(selectedRestaurant.id)}
            disabled={!isComparing && compareList.length >= 3}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg transition-colors',
              isComparing ? 'bg-accent/20 text-accent' : 'bg-white/5 text-text-secondary hover:bg-white/10',
              !isComparing && compareList.length >= 3 && 'opacity-50 cursor-not-allowed'
            )}
          >
            <GitCompare className="w-5 h-5" />
            <span className="text-xs">Compare</span>
          </button>
          <button
            onClick={() => isVisited ? unmarkVisited(selectedRestaurant.id) : markVisited(selectedRestaurant.id)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg transition-colors',
              isVisited ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-text-secondary hover:bg-white/10'
            )}
          >
            <Check className="w-5 h-5" />
            <span className="text-xs">Visited</span>
          </button>
          <button
            onClick={() => isInWishlist ? removeFromWishlist(selectedRestaurant.id) : addToWishlist(selectedRestaurant.id)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg transition-colors',
              isInWishlist ? 'bg-purple-500/20 text-purple-500' : 'bg-white/5 text-text-secondary hover:bg-white/10'
            )}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-xs">Wishlist</span>
          </button>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-secondary uppercase">Contact</h3>

          {selectedRestaurant.website && (
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-text-secondary" />
                <a
                  href={selectedRestaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline truncate max-w-[200px]"
                >
                  {selectedRestaurant.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              </div>
              <button
                onClick={() => handleCopy(selectedRestaurant.website!, 'website')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied === 'website' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-secondary" />}
              </button>
            </div>
          )}

          {selectedRestaurant.phone && (
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-text-secondary" />
                <a href={`tel:${selectedRestaurant.phone}`} className="text-text-primary hover:text-accent">
                  {selectedRestaurant.phone}
                </a>
              </div>
              <button
                onClick={() => handleCopy(selectedRestaurant.phone!, 'phone')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied === 'phone' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-secondary" />}
              </button>
            </div>
          )}

          {selectedRestaurant.email && (
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-text-secondary" />
                <a href={`mailto:${selectedRestaurant.email}`} className="text-text-primary hover:text-accent truncate max-w-[200px]">
                  {selectedRestaurant.email}
                </a>
              </div>
              <button
                onClick={() => handleCopy(selectedRestaurant.email!, 'email')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied === 'email' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-secondary" />}
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            <Navigation className="w-5 h-5" />
            Get Directions
          </a>
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-text-primary rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            {copied === 'share' ? 'Link Copied!' : 'Share Restaurant'}
          </button>
        </div>

        {/* Description */}
        {selectedRestaurant.description && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary uppercase mb-2">About</h3>
            <p className="text-text-primary text-sm leading-relaxed">
              {selectedRestaurant.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
