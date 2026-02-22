'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, GitCompare, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useStore } from '@/app/store/useStore';
import { cn } from '@/app/lib/utils';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { compareList } = useStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering theme-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 right-0 z-[1000] p-4 flex items-center gap-2">
      {/* Analytics */}
      <Link
        href="/analytics"
        className="glass-card p-2.5 hover:bg-white/10 transition-colors"
        title="Analytics Dashboard"
      >
        <BarChart3 className="w-5 h-5 text-text-primary" />
      </Link>

      {/* Compare */}
      <Link
        href="/compare"
        className={cn(
          'glass-card p-2.5 hover:bg-white/10 transition-colors relative',
          compareList.length > 0 && 'ring-2 ring-accent'
        )}
        title="Compare Restaurants"
      >
        <GitCompare className="w-5 h-5 text-text-primary" />
        {compareList.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
            {compareList.length}
          </span>
        )}
      </Link>

      {/* Theme Toggle - only render after mount to avoid hydration mismatch */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="glass-card p-2.5 hover:bg-white/10 transition-colors"
        title={mounted ? (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle theme'}
      >
        {mounted ? (
          theme === 'dark' ? (
            <Sun className="w-5 h-5 text-text-primary" />
          ) : (
            <Moon className="w-5 h-5 text-text-primary" />
          )
        ) : (
          <Sun className="w-5 h-5 text-text-primary" />
        )}
      </button>
    </header>
  );
}
