'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Map,
  Trophy,
  BarChart3,
  GitCompare,
} from 'lucide-react';
import { useStore } from '@/app/store/useStore';
import { cn } from '@/app/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/awards', label: 'Awards', icon: Trophy },
  { href: '/analytics', label: 'Insights', icon: BarChart3 },
  { href: '/compare', label: 'Compare', icon: GitCompare },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { compareList } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] bg-surface/95 backdrop-blur-xl border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isCompare = item.href === '/compare';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg transition-colors relative min-w-[60px]',
                isActive
                  ? 'text-accent'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform',
                    isActive && 'scale-110'
                  )}
                />
                {isCompare && compareList.length > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {compareList.length}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium',
                  isActive && 'font-semibold'
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
