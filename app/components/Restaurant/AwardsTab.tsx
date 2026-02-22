'use client';

import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Restaurant } from '@/app/types/restaurant';
import AwardBadge from '@/app/components/UI/AwardBadge';
import { AwardGrid } from '@/app/components/UI/AwardBadges';
import RankingTimeline from '@/app/components/Charts/RankingTimeline';
import { cn } from '@/app/lib/utils';

interface AwardsTabProps {
  restaurant: Restaurant;
  className?: string;
}

export default function AwardsTab({ restaurant, className }: AwardsTabProps) {
  const awards = restaurant.awards || [];
  const rankingHistory = restaurant.rankingHistory || [];

  // Calculate ranking change
  const currentRank = restaurant.rank;
  const previousRank = rankingHistory.length >= 2
    ? rankingHistory[rankingHistory.length - 2]?.rank
    : null;

  let rankChange: number | null = null;
  let rankChangeDirection: 'up' | 'down' | 'same' | null = null;

  if (previousRank !== null && previousRank !== undefined) {
    rankChange = previousRank - currentRank;
    if (rankChange > 0) rankChangeDirection = 'up';
    else if (rankChange < 0) rankChangeDirection = 'down';
    else rankChangeDirection = 'same';
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Current Ranking Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <span className="text-2xl font-bold text-accent">#{currentRank}</span>
          <p className="text-xs text-text-secondary mt-1">Current Rank</p>
        </div>

        <div className="glass-card p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            {rankChangeDirection === 'up' && (
              <>
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-xl font-bold text-green-500">+{rankChange}</span>
              </>
            )}
            {rankChangeDirection === 'down' && (
              <>
                <TrendingDown className="w-5 h-5 text-red-500" />
                <span className="text-xl font-bold text-red-500">{rankChange}</span>
              </>
            )}
            {rankChangeDirection === 'same' && (
              <>
                <Minus className="w-5 h-5 text-text-muted" />
                <span className="text-xl font-bold text-text-muted">0</span>
              </>
            )}
            {rankChangeDirection === null && (
              <span className="text-xl font-bold text-text-muted">-</span>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-1">Change</p>
        </div>

        <div className="glass-card p-3 text-center">
          <span className="text-2xl font-bold text-text-primary">
            #{restaurant.peakRank || currentRank}
          </span>
          <p className="text-xs text-text-secondary mt-1">Peak Rank</p>
        </div>
      </div>

      {/* Awards Section */}
      {awards.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Special Awards
          </h3>
          <AwardGrid awards={awards} columns={2} />
        </div>
      ) : (
        <div className="glass-card p-6 text-center">
          <Trophy className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary text-sm">No special awards yet</p>
        </div>
      )}

      {/* Ranking Timeline */}
      {rankingHistory.length > 1 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Ranking History
          </h3>
          <RankingTimeline history={rankingHistory} currentRank={currentRank} />
        </div>
      )}

      {/* Years in Top 50 */}
      {restaurant.yearsInTop50 && (
        <div className="glass-card p-4 flex items-center justify-between">
          <span className="text-text-secondary">Years in Top 50</span>
          <span className="text-xl font-bold text-text-primary">
            {restaurant.yearsInTop50}
          </span>
        </div>
      )}
    </div>
  );
}
