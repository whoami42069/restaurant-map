'use client';

import { GitCompare, X } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/app/store/useStore';
import { cn } from '@/app/lib/utils';

export default function CompareFloatingButton() {
  const { compareList, clearCompare, restaurants } = useStore();

  if (compareList.length === 0) return null;

  const compareRestaurants = restaurants.filter(r => compareList.includes(r.id));

  return (
    <div className="fixed bottom-24 md:bottom-4 left-1/2 -translate-x-1/2 z-[200]">
      <div className="glass-card p-2 flex items-center gap-3">
        <div className="flex items-center gap-2 px-3">
          <GitCompare className="w-5 h-5 text-accent" />
          <span className="text-sm text-text-primary font-medium">
            {compareList.length} restaurant{compareList.length > 1 ? 's' : ''} selected
          </span>
        </div>

        {/* Restaurant preview */}
        <div className="flex items-center gap-1">
          {compareRestaurants.map((r) => (
            <div
              key={r.id}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white',
                r.list === 'worlds-50-best' ? 'bg-amber-500' :
                r.list === 'la-liste' ? 'bg-blue-500' : 'bg-emerald-500'
              )}
              title={r.name}
            >
              {r.rank}
            </div>
          ))}
        </div>

        <Link
          href="/compare"
          className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          Compare
        </Link>

        <button
          onClick={clearCompare}
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-white/10 rounded-lg transition-colors"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
