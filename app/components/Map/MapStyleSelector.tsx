'use client';

import { Map, Satellite, Mountain, Sun } from 'lucide-react';
import { useStore } from '@/app/store/useStore';
import { MAP_STYLES } from '@/app/lib/mapStyles';
import { MapStyle } from '@/app/types/restaurant';
import { cn } from '@/app/lib/utils';

const styleIcons: Record<MapStyle, React.ReactNode> = {
  dark: <Map className="w-4 h-4" />,
  satellite: <Satellite className="w-4 h-4" />,
  terrain: <Mountain className="w-4 h-4" />,
  minimal: <Sun className="w-4 h-4" />,
};

export default function MapStyleSelector() {
  const { mapStyle, setMapStyle } = useStore();

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <div className="glass-card p-1 flex gap-1">
        {(Object.keys(MAP_STYLES) as MapStyle[]).map((style) => (
          <button
            key={style}
            onClick={() => setMapStyle(style)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
              'hover:bg-white/10',
              mapStyle === style
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:text-text-primary'
            )}
            title={MAP_STYLES[style].name}
          >
            {styleIcons[style]}
            <span className="text-sm font-medium hidden sm:inline">
              {MAP_STYLES[style].name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
