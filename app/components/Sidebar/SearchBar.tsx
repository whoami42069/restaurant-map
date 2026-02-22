'use client';

import { Search, X } from 'lucide-react';
import { useStore } from '@/app/store/useStore';

export default function SearchBar() {
  const { filters, setFilters } = useStore();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
      <input
        type="text"
        placeholder="Search restaurants..."
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
        className="w-full pl-10 pr-10 py-2.5 bg-bg-primary border border-border rounded-lg
                   text-text-primary placeholder:text-text-secondary
                   focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                   transition-all duration-200"
      />
      {filters.search && (
        <button
          onClick={() => setFilters({ search: '' })}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full
                     hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-text-secondary" />
        </button>
      )}
    </div>
  );
}
