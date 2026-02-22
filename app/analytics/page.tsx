'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Utensils, Globe2, Trophy, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useStore } from '@/app/store/useStore';
import { Restaurant } from '@/app/types/restaurant';
import { groupBy, getUniqueValues } from '@/app/lib/utils';
import restaurantsData from '@/public/data/restaurants.json';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#ef4444', '#06b6d4', '#84cc16'];

export default function AnalyticsPage() {
  const { restaurants, setRestaurants } = useStore();

  useEffect(() => {
    if (restaurants.length === 0) {
      setRestaurants(restaurantsData as Restaurant[]);
    }
  }, [restaurants.length, setRestaurants]);

  // Statistics
  const stats = useMemo(() => {
    const totalRestaurants = restaurants.length;
    const countries = getUniqueValues(restaurants, 'country');
    const cuisines = getUniqueValues(restaurants, 'cuisine');
    const onBothLists = restaurants.filter(r => r.list === 'both').length;

    return {
      total: totalRestaurants,
      countries: countries.length,
      cuisines: cuisines.length,
      onBoth: onBothLists
    };
  }, [restaurants]);

  // Country distribution
  const countryData = useMemo(() => {
    const grouped = groupBy(restaurants, 'country');
    return Object.entries(grouped)
      .map(([country, restaurants]) => ({
        name: country,
        count: restaurants.length
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [restaurants]);

  // Cuisine distribution
  const cuisineData = useMemo(() => {
    const grouped = groupBy(restaurants, 'cuisine');
    return Object.entries(grouped)
      .map(([cuisine, restaurants]) => ({
        name: cuisine,
        value: restaurants.length
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [restaurants]);

  // List distribution
  const listData = useMemo(() => {
    const worldsBest = restaurants.filter(r => r.list === 'worlds-50-best').length;
    const laListe = restaurants.filter(r => r.list === 'la-liste').length;
    const both = restaurants.filter(r => r.list === 'both').length;

    return [
      { name: "World's 50 Best Only", value: worldsBest, color: '#f59e0b' },
      { name: 'La Liste Only', value: laListe, color: '#3b82f6' },
      { name: 'Both Lists', value: both, color: '#10b981' }
    ];
  }, [restaurants]);

  // Score distribution (La Liste)
  const scoreData = useMemo(() => {
    const laListeRestaurants = restaurants.filter(r => r.score);
    const ranges = [
      { range: '96-96.5', min: 96, max: 96.5 },
      { range: '96.5-97', min: 96.5, max: 97 },
      { range: '97-97.5', min: 97, max: 97.5 },
      { range: '97.5-98', min: 97.5, max: 98 },
      { range: '98-98.5', min: 98, max: 98.5 },
      { range: '98.5-99', min: 98.5, max: 99 },
      { range: '99+', min: 99, max: 100 }
    ];

    return ranges.map(({ range, min, max }) => ({
      range,
      count: laListeRestaurants.filter(r => r.score! >= min && r.score! < max).length
    }));
  }, [restaurants]);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-text-primary">Analytics Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm text-text-secondary">Total Restaurants</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">{stats.total}</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Globe2 className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm text-text-secondary">Countries</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">{stats.countries}</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Utensils className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-sm text-text-secondary">Cuisine Types</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">{stats.cuisines}</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-sm text-text-secondary">On Both Lists</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">{stats.onBoth}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Country Distribution */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Restaurants by Country</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="#a0a0a0" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#a0a0a0"
                    tick={{ fill: '#a0a0a0', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12121a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cuisine Distribution */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Cuisine Distribution</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cuisineData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {cuisineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12121a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* List Distribution */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">List Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={listData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {listData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12121a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Score Distribution */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">La Liste Score Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="range" stroke="#a0a0a0" tick={{ fill: '#a0a0a0', fontSize: 12 }} />
                  <YAxis stroke="#a0a0a0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12121a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Restaurants Table */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Top 10 Restaurants</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Restaurant</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Cuisine</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">List</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Score</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.slice(0, 10).map((restaurant) => (
                  <tr key={restaurant.id} className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <span className={`
                        w-8 h-8 inline-flex items-center justify-center rounded-full text-sm font-bold text-white
                        ${restaurant.list === 'worlds-50-best' ? 'bg-amber-500' :
                          restaurant.list === 'la-liste' ? 'bg-blue-500' : 'bg-emerald-500'}
                      `}>
                        {restaurant.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-primary font-medium">{restaurant.name}</td>
                    <td className="py-3 px-4 text-text-secondary">{restaurant.city}, {restaurant.country}</td>
                    <td className="py-3 px-4 text-text-secondary">{restaurant.cuisine}</td>
                    <td className="py-3 px-4">
                      <span className={`
                        text-xs px-2 py-1 rounded-full
                        ${restaurant.list === 'worlds-50-best' ? 'bg-amber-500/20 text-amber-400' :
                          restaurant.list === 'la-liste' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-emerald-500/20 text-emerald-400'}
                      `}>
                        {restaurant.list === 'worlds-50-best' ? "50 Best" :
                         restaurant.list === 'la-liste' ? 'La Liste' : 'Both'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-primary">
                      {restaurant.score ? restaurant.score.toFixed(2) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
