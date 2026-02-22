'use client';

import { useState } from 'react';
import {
  X,
  Heart,
  GitCompare,
  MapPin,
  Phone,
  Mail,
  Globe,
  Navigation,
  Share2,
  Copy,
  Check,
  Info,
  ChefHat,
  Trophy,
  Map,
} from 'lucide-react';
import { useStore } from '@/app/store/useStore';
import { getCountryFlag, cn, generateShareUrl, copyToClipboard } from '@/app/lib/utils';
import { calculateDistance, formatDistance } from '@/app/lib/distance';
import AwardBadges from '@/app/components/UI/AwardBadges';
import { SimpleTabs } from '@/app/components/UI/TabBar';
import ChefTab from '@/app/components/Restaurant/ChefTab';
import AwardsTab from '@/app/components/Restaurant/AwardsTab';
import ImageGallery from '@/app/components/UI/ImageGallery';

const TABS = ['Overview', 'Chef', 'Careers', 'Awards', 'Location'];

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
    removeFromWishlist,
  } = useStore();

  const [activeTab, setActiveTab] = useState('Overview');
  const [copied, setCopied] = useState<string | null>(null);

  if (!selectedRestaurant || !detailPanelOpen) return null;

  const isFavorite = favorites.some((f) => f.restaurantId === selectedRestaurant.id);
  const isComparing = compareList.includes(selectedRestaurant.id);
  const isVisited = visited.some((v) => v.restaurantId === selectedRestaurant.id);
  const isInWishlist = wishlist.some((w) => w.restaurantId === selectedRestaurant.id);

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
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      return `maps://maps.apple.com/?daddr=${lat},${lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-[420px] z-[1100] bg-bg-secondary border-l border-border shadow-2xl overflow-hidden flex flex-col">
      {/* Header with Hero */}
      <div className="relative flex-shrink-0">
        {/* Hero Image or Gradient */}
        <div className="h-40 bg-gradient-to-br from-accent/20 via-purple-500/20 to-blue-500/20 relative">
          {selectedRestaurant.images?.hero && (
            <img
              src={selectedRestaurant.images.hero}
              alt={selectedRestaurant.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary to-transparent" />

          {/* Close Button */}
          <button
            onClick={() => {
              setDetailPanelOpen(false);
              setSelectedRestaurant(null);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-bg-secondary/80 backdrop-blur-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Quick Actions */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={() =>
                isFavorite
                  ? removeFavorite(selectedRestaurant.id)
                  : addFavorite(selectedRestaurant.id)
              }
              className={cn(
                'p-2 rounded-full backdrop-blur-sm transition-colors',
                isFavorite
                  ? 'bg-red-500/20 text-red-500'
                  : 'bg-bg-secondary/80 text-text-secondary hover:text-text-primary'
              )}
            >
              <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
            </button>
            <button
              onClick={() =>
                isComparing
                  ? removeFromCompare(selectedRestaurant.id)
                  : addToCompare(selectedRestaurant.id)
              }
              disabled={!isComparing && compareList.length >= 3}
              className={cn(
                'p-2 rounded-full backdrop-blur-sm transition-colors',
                isComparing
                  ? 'bg-accent/20 text-accent'
                  : 'bg-bg-secondary/80 text-text-secondary hover:text-text-primary',
                !isComparing && compareList.length >= 3 && 'opacity-50 cursor-not-allowed'
              )}
            >
              <GitCompare className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-bg-secondary/80 backdrop-blur-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="px-4 pb-3 -mt-12 relative">
          {/* Rank Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold text-white shadow-lg',
                selectedRestaurant.list === 'worlds-50-best'
                  ? 'bg-amber-500'
                  : selectedRestaurant.list === 'la-liste'
                    ? 'bg-blue-500'
                    : 'bg-emerald-500'
              )}
            >
              #{selectedRestaurant.rank}
            </span>
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                selectedRestaurant.list === 'worlds-50-best'
                  ? 'bg-amber-500/20 text-amber-400'
                  : selectedRestaurant.list === 'la-liste'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-emerald-500/20 text-emerald-400'
              )}
            >
              {selectedRestaurant.list === 'worlds-50-best'
                ? "World's 50 Best"
                : selectedRestaurant.list === 'la-liste'
                  ? 'La Liste'
                  : 'Both Lists'}
            </span>
          </div>

          <h2 className="text-xl font-bold text-text-primary">{selectedRestaurant.name}</h2>

          <div className="flex items-center gap-2 text-text-secondary text-sm mt-1">
            <MapPin className="w-4 h-4" />
            <span>
              {getCountryFlag(selectedRestaurant.countryCode)} {selectedRestaurant.city},{' '}
              {selectedRestaurant.country}
            </span>
          </div>

          <p className="text-text-muted text-sm mt-0.5">{selectedRestaurant.cuisine}</p>

          {/* Award Badges */}
          {selectedRestaurant.awards && selectedRestaurant.awards.length > 0 && (
            <div className="mt-2">
              <AwardBadges awards={selectedRestaurant.awards} size="sm" maxDisplay={4} />
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <SimpleTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} className="px-4" />

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            {/* Images Gallery */}
            {selectedRestaurant.images && (
              <ImageGallery images={selectedRestaurant.images} restaurantName={selectedRestaurant.name} />
            )}

            {/* Description */}
            {selectedRestaurant.description && (
              <div>
                <h3 className="text-sm font-semibold text-text-secondary uppercase mb-2">About</h3>
                <p className="text-text-primary text-sm leading-relaxed">
                  {selectedRestaurant.description}
                </p>
              </div>
            )}

            {/* La Liste Score */}
            {selectedRestaurant.score && (
              <div className="glass-card p-4">
                <p className="text-sm text-text-secondary mb-1">La Liste Score</p>
                <p className="text-3xl font-bold text-accent">
                  {selectedRestaurant.score.toFixed(2)}
                </p>
              </div>
            )}

            {/* Quick Info */}
            {selectedRestaurant.yearOpened && (
              <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <span className="text-text-secondary text-sm">Year Opened</span>
                <span className="text-text-primary font-medium">{selectedRestaurant.yearOpened}</span>
              </div>
            )}

            {/* Distance */}
            {distance && (
              <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <span className="text-text-secondary text-sm">Distance</span>
                <span className="text-accent font-medium">{formatDistance(distance)}</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Chef' && <ChefTab restaurant={selectedRestaurant} />}

        {activeTab === 'Careers' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-text-secondary uppercase mb-3">
                Tips for Job Applicants
              </h3>
              {selectedRestaurant.applicantTips && selectedRestaurant.applicantTips.length > 0 ? (
                <ul className="space-y-3">
                  {selectedRestaurant.applicantTips.map((tip, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-surface-secondary rounded-lg"
                    >
                      <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-accent/20 text-accent text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-text-primary text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <ChefHat className="w-12 h-12 mx-auto text-text-muted mb-3" />
                  <p className="text-text-secondary text-sm">
                    Career tips coming soon
                  </p>
                </div>
              )}
            </div>

            {selectedRestaurant.chef && (
              <div className="glass-card p-4">
                <h4 className="text-sm font-medium text-text-secondary mb-2">Working under</h4>
                <p className="text-text-primary font-semibold">{selectedRestaurant.chef.name}</p>
                {selectedRestaurant.description && (
                  <p className="text-text-muted text-sm mt-2 line-clamp-3">
                    {selectedRestaurant.description}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Awards' && <AwardsTab restaurant={selectedRestaurant} />}

        {activeTab === 'Location' && (
          <div className="space-y-4">
            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-secondary uppercase">Contact</h3>

              {selectedRestaurant.website && (
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
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
                    {copied === 'website' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-text-secondary" />
                    )}
                  </button>
                </div>
              )}

              {selectedRestaurant.phone && (
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-text-secondary" />
                    <a
                      href={`tel:${selectedRestaurant.phone}`}
                      className="text-text-primary hover:text-accent"
                    >
                      {selectedRestaurant.phone}
                    </a>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedRestaurant.phone!, 'phone')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copied === 'phone' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-text-secondary" />
                    )}
                  </button>
                </div>
              )}

              {selectedRestaurant.email && (
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-text-secondary" />
                    <a
                      href={`mailto:${selectedRestaurant.email}`}
                      className="text-text-primary hover:text-accent truncate max-w-[200px]"
                    >
                      {selectedRestaurant.email}
                    </a>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedRestaurant.email!, 'email')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copied === 'email' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-text-secondary" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Social Media */}
            {selectedRestaurant.socialMedia && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-secondary uppercase">Social Media</h3>
                <div className="flex gap-2">
                  {selectedRestaurant.socialMedia.instagram && (
                    <a
                      href={`https://instagram.com/${selectedRestaurant.socialMedia.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-surface-secondary rounded-lg text-text-primary hover:bg-surface-tertiary transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {selectedRestaurant.socialMedia.facebook && (
                    <a
                      href={selectedRestaurant.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-surface-secondary rounded-lg text-text-primary hover:bg-surface-tertiary transition-colors"
                    >
                      Facebook
                    </a>
                  )}
                  {selectedRestaurant.socialMedia.twitter && (
                    <a
                      href={`https://twitter.com/${selectedRestaurant.socialMedia.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-surface-secondary rounded-lg text-text-primary hover:bg-surface-tertiary transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Coordinates */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-text-secondary uppercase mb-2">
                Coordinates
              </h3>
              <p className="text-text-primary text-sm font-mono">
                {selectedRestaurant.coordinates.lat.toFixed(6)},{' '}
                {selectedRestaurant.coordinates.lng.toFixed(6)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex-shrink-0 p-4 border-t border-border space-y-2">
        <a
          href={getDirectionsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          <Navigation className="w-5 h-5" />
          Get Directions
        </a>
        {selectedRestaurant.phone && (
          <a
            href={`tel:${selectedRestaurant.phone}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface-secondary text-text-primary rounded-lg font-medium hover:bg-surface-tertiary transition-colors"
          >
            <Phone className="w-5 h-5" />
            Call Restaurant
          </a>
        )}
      </div>
    </div>
  );
}
