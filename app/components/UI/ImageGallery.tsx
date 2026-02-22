'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { RestaurantImages } from '@/app/types/restaurant';
import { cn } from '@/app/lib/utils';

interface ImageGalleryProps {
  images: RestaurantImages;
  restaurantName: string;
  className?: string;
}

export default function ImageGallery({
  images,
  restaurantName,
  className,
}: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Combine all images
  const allImages: { src: string; type: 'hero' | 'dish' | 'interior' }[] = [];

  if (images.hero) {
    allImages.push({ src: images.hero, type: 'hero' });
  }
  if (images.dishes) {
    images.dishes.forEach((src) => allImages.push({ src, type: 'dish' }));
  }
  if (images.interior) {
    images.interior.forEach((src) => allImages.push({ src, type: 'interior' }));
  }

  if (allImages.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          className
        )}
      >
        <ImageIcon className="w-12 h-12 text-text-muted mb-4" />
        <p className="text-text-secondary">No images available</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <>
      <div className={cn('space-y-3', className)}>
        {/* Hero Image */}
        {images.hero && (
          <div
            className="relative h-48 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(0)}
          >
            <img
              src={images.hero}
              alt={`${restaurantName} hero`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        )}

        {/* Thumbnail Grid */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {allImages.slice(images.hero ? 1 : 0, 5).map((image, index) => {
              const actualIndex = images.hero ? index + 1 : index;
              const isLast = index === 3 && allImages.length > 5;

              return (
                <div
                  key={actualIndex}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(actualIndex)}
                >
                  <img
                    src={image.src}
                    alt={`${restaurantName} ${image.type}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {isLast && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        +{allImages.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          {allImages.length > 1 && (
            <>
              <button
                className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image */}
          <img
            src={allImages[activeIndex].src}
            alt={`${restaurantName} ${allImages[activeIndex].type}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm">
            {activeIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  );
}
