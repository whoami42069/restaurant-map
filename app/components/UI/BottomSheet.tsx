'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { X, GripHorizontal } from 'lucide-react';
import { cn } from '@/app/lib/utils';

type SheetState = 'closed' | 'peek' | 'half' | 'full';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  peekContent?: React.ReactNode;
  initialState?: SheetState;
  enableDrag?: boolean;
  className?: string;
}

const STATE_HEIGHTS: Record<SheetState, string> = {
  closed: '0%',
  peek: '20%',
  half: '50%',
  full: '90%',
};

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  peekContent,
  initialState = 'half',
  enableDrag = true,
  className,
}: BottomSheetProps) {
  const [state, setState] = useState<SheetState>(initialState);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const currentHeight = useRef(0);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setState(initialState);
      setDragOffset(0);
    }
  }, [isOpen, initialState]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enableDrag) return;
      setIsDragging(true);
      dragStartY.current = e.touches[0].clientY;
      if (sheetRef.current) {
        currentHeight.current = sheetRef.current.offsetHeight;
      }
    },
    [enableDrag]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !enableDrag) return;
      const deltaY = e.touches[0].clientY - dragStartY.current;
      setDragOffset(deltaY);
    },
    [isDragging, enableDrag]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || !enableDrag) return;
    setIsDragging(false);

    // Determine new state based on drag direction and distance
    const threshold = 50;
    if (dragOffset > threshold) {
      // Dragging down
      if (state === 'full') setState('half');
      else if (state === 'half') setState('peek');
      else if (state === 'peek') onClose();
    } else if (dragOffset < -threshold) {
      // Dragging up
      if (state === 'peek') setState('half');
      else if (state === 'half') setState('full');
    }

    setDragOffset(0);
  }, [isDragging, enableDrag, dragOffset, state, onClose]);

  // Expand/collapse on tap
  const cycleState = useCallback(() => {
    if (state === 'peek') setState('half');
    else if (state === 'half') setState('full');
    else if (state === 'full') setState('half');
  }, [state]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-[1200] md:hidden transition-opacity',
          state === 'peek' ? 'opacity-30' : 'opacity-100'
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[1300] bg-surface rounded-t-2xl shadow-2xl md:hidden',
          'safe-area-inset-bottom transition-all duration-300 ease-out',
          isDragging && 'transition-none',
          className
        )}
        style={{
          height: STATE_HEIGHTS[state],
          transform: isDragging ? `translateY(${Math.max(0, dragOffset)}px)` : undefined,
        }}
      >
        {/* Drag Handle */}
        <div
          className="flex flex-col items-center pt-2 pb-3 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={cycleState}
        >
          <GripHorizontal className="w-8 h-1.5 text-text-muted rounded-full" />
        </div>

        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
            <div>
              {title && (
                <h3 className="text-base font-semibold text-text-primary">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-text-secondary">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Peek Content (only shown in peek state) */}
        {state === 'peek' && peekContent && (
          <div className="px-4 py-3">{peekContent}</div>
        )}

        {/* Full Content */}
        {state !== 'peek' && (
          <div className="flex-1 overflow-y-auto px-4 py-3">{children}</div>
        )}
      </div>
    </>
  );
}
