'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { RankingHistoryEntry } from '@/app/types/restaurant';

interface RankingTimelineProps {
  history: RankingHistoryEntry[];
  currentRank: number;
  className?: string;
}

export default function RankingTimeline({
  history,
  currentRank,
  className,
}: RankingTimelineProps) {
  // Prepare chart data
  const chartData = useMemo(() => {
    return history
      .filter((entry) => entry.rank !== null)
      .map((entry) => ({
        year: entry.year,
        rank: entry.rank,
        // Invert for visual (lower rank = higher position)
        display: entry.rank ? 101 - entry.rank : null,
      }))
      .sort((a, b) => a.year - b.year);
  }, [history]);

  if (chartData.length < 2) {
    return (
      <div className="glass-card p-4 text-center text-text-secondary text-sm">
        Not enough data to display timeline
      </div>
    );
  }

  // Find min/max years and ranks
  const minYear = Math.min(...chartData.map((d) => d.year));
  const maxYear = Math.max(...chartData.map((d) => d.year));
  const minRank = Math.min(...chartData.filter((d) => d.rank).map((d) => d.rank as number));
  const maxRank = Math.max(...chartData.filter((d) => d.rank).map((d) => d.rank as number));

  return (
    <div className={className}>
      <div className="glass-card p-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              domain={[minYear, maxYear]}
            />
            <YAxis
              reversed
              domain={[1, Math.max(maxRank + 10, 50)]}
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `#${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              formatter={(value) => [`#${value}`, 'Rank']}
            />
            {/* Reference lines for tiers */}
            <ReferenceLine
              y={10}
              stroke="rgba(239, 68, 68, 0.3)"
              strokeDasharray="3 3"
            />
            <ReferenceLine
              y={25}
              stroke="rgba(245, 158, 11, 0.3)"
              strokeDasharray="3 3"
            />
            <ReferenceLine
              y={50}
              stroke="rgba(34, 197, 94, 0.3)"
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="rank"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={{
                fill: 'var(--accent)',
                strokeWidth: 2,
                stroke: 'var(--surface)',
                r: 4,
              }}
              activeDot={{
                fill: 'var(--accent)',
                strokeWidth: 3,
                stroke: 'white',
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-red-500/50" />
            <span className="text-text-muted">Top 10</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-amber-500/50" />
            <span className="text-text-muted">Top 25</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-green-500/50" />
            <span className="text-text-muted">Top 50</span>
          </div>
        </div>
      </div>
    </div>
  );
}
