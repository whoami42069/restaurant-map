'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Map,
  Trophy,
  BarChart3,
  GitCompare,
  Search,
  Moon,
  Sun,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useStore } from '@/app/store/useStore';
import { cn } from '@/app/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/awards', label: 'Awards', icon: Trophy },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/compare', label: 'Compare', icon: GitCompare },
];

export default function TopNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { compareList } = useStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-text-primary">🍽️</span>
            <span className="text-sm font-semibold text-text-primary hidden sm:block">
              Restaurant Explorer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isCompare = item.href === '/compare';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative',
                    isActive
                      ? 'bg-accent/15 text-accent'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isCompare && compareList.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {compareList.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
              title={mounted ? (theme === 'dark' ? 'Light mode' : 'Dark mode') : 'Toggle theme'}
            >
              {mounted ? (
                theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <nav className="px-4 py-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isCompare = item.href === '/compare';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative',
                    isActive
                      ? 'bg-accent/15 text-accent'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {isCompare && compareList.length > 0 && (
                    <span className="ml-auto w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {compareList.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
