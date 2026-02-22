'use client';

import { cn } from '@/app/lib/utils';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export default function TabBar({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
}: TabBarProps) {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2.5',
  };

  const variantClasses = {
    default: {
      container: 'bg-surface-secondary rounded-lg p-1',
      tab: 'rounded-md',
      active: 'bg-surface shadow-sm text-text-primary',
      inactive: 'text-text-secondary hover:text-text-primary',
    },
    pills: {
      container: 'gap-2',
      tab: 'rounded-full',
      active: 'bg-accent text-white',
      inactive: 'text-text-secondary hover:bg-surface-secondary',
    },
    underline: {
      container: 'border-b border-border gap-4',
      tab: 'rounded-none border-b-2 -mb-px',
      active: 'border-accent text-accent',
      inactive: 'border-transparent text-text-secondary hover:text-text-primary hover:border-text-muted',
    },
  };

  const styles = variantClasses[variant];

  return (
    <div
      className={cn(
        'flex items-center',
        styles.container,
        fullWidth && 'w-full',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center justify-center gap-1.5 font-medium transition-all',
              sizeClasses[size],
              styles.tab,
              isActive ? styles.active : styles.inactive,
              fullWidth && 'flex-1'
            )}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  isActive
                    ? variant === 'pills'
                      ? 'bg-white/20 text-white'
                      : 'bg-accent/15 text-accent'
                    : 'bg-surface-secondary text-text-secondary'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Simple tabs for detail panel
interface SimpleTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function SimpleTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: SimpleTabsProps) {
  return (
    <div
      className={cn(
        'flex items-center border-b border-border',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              isActive
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
