import React, { useState } from 'react';
import { Trophy, Flame, ChevronUp, ChevronDown, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { MOCK_LEADERBOARDS, LEAGUE_TIERS } from '../../data/mockLeaderboard';
import { LeagueTier, LeaderboardUser } from '../../lib/types';
import { useApp } from '../../lib/store';
import { sound } from '../../lib/audio';

export const LeaderboardView: React.FC = () => {
  const { stats, currentLeague } = useApp();
  const [selectedLeague, setSelectedLeague] = useState<LeagueTier>(currentLeague);

  const rawUsers = MOCK_LEADERBOARDS[selectedLeague] || [];

  // Insert current user into the selected league
  const currentUser: LeaderboardUser = {
    id: 'current-user',
    name: 'You (IELTS Candidate)',
    avatar: '🦉',
    xp: stats.xp,
    targetBand: stats.targetBand,
    isCurrentUser: true,
    streak: stats.streak,
  };

  // Combine and sort by XP descending
  const allUsers = [...rawUsers, currentUser].sort((a, b) => b.xp - a.xp);

  const getTierColor = (tier: LeagueTier) => {
    switch (tier) {
      case 'Diamond':
        return 'text-sky-400 border-sky-400 bg-sky-50';
      case 'Ruby':
        return 'text-rose-500 border-rose-500 bg-rose-50';
      case 'Sapphire':
        return 'text-blue-600 border-blue-600 bg-blue-50';
      case 'Gold':
        return 'text-amber-500 border-amber-500 bg-amber-50';
      case 'Silver':
        return 'text-slate-400 border-slate-400 bg-slate-50';
      case 'Bronze':
      default:
        return 'text-amber-700 border-amber-700 bg-amber-50';
    }
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto py-6 px-4 md:px-8 select-none">
      {/* League Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3 shadow-md border-2 border-amber-300">
          <Trophy className="w-9 h-9 text-duo-gold" />
        </div>
        <h2 className="text-3xl font-black text-duo-charcoal">
          {selectedLeague} League
        </h2>
        <p className="text-xs md:text-sm font-bold text-gray-500 mt-1 flex items-center justify-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>Weekly League ends in 3 days 14 hrs</span>
        </p>

        {/* Tier Selector Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {LEAGUE_TIERS.map(tier => {
            const isSelected = selectedLeague === tier;
            const isCurrent = currentLeague === tier;

            return (
              <button
                key={tier}
                onClick={() => {
                  sound.playClick();
                  setSelectedLeague(tier);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2 ${
                  isSelected
                    ? 'bg-duo-blue text-white border-duo-blue-dark shadow-sm scale-105'
                    : 'bg-white text-gray-600 border-duo-gray hover:bg-gray-50'
                }`}
              >
                {tier} {isCurrent ? '★' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="card-duo p-2 md:p-4 overflow-hidden">
        {/* Promotion banner */}
        <div className="flex items-center gap-2 p-3 mb-2 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-black text-emerald-800 uppercase tracking-wider">
          <ChevronUp className="w-4 h-4 text-duo-green stroke-[3]" />
          <span>Top 3 advance to the next league</span>
        </div>

        <div className="divide-y divide-gray-100">
          {allUsers.map((user, idx) => {
            const rank = idx + 1;
            const isTop3 = rank <= 3;
            const isDemoted = rank > 8;

            return (
              <div
                key={user.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                  user.isCurrentUser
                    ? 'bg-blue-50/90 border-2 border-duo-blue shadow-sm my-1'
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-3.5">
                  {/* Rank indicator */}
                  <span
                    className={`w-7 text-center font-black text-sm md:text-base ${
                      rank === 1
                        ? 'text-amber-500 font-extrabold text-lg'
                        : rank === 2
                        ? 'text-slate-400 font-extrabold text-lg'
                        : rank === 3
                        ? 'text-amber-700 font-extrabold text-lg'
                        : 'text-gray-400'
                    }`}
                  >
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                  </span>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-2xl bg-white border-2 border-duo-gray flex items-center justify-center text-xl shadow-xs">
                    {user.avatar}
                  </div>

                  {/* Name & Target Band */}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-black leading-tight ${user.isCurrentUser ? 'text-duo-blue' : 'text-duo-charcoal'}`}>
                        {user.name}
                      </span>
                      {user.isCurrentUser && (
                        <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-gray-400 flex items-center gap-2 mt-0.5">
                      <span>Target Band {user.targetBand}</span>
                      <span>•</span>
                      <span className="flex items-center text-duo-orange">
                        <Flame className="w-3 h-3 fill-current" /> {user.streak}d
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: XP */}
                <div className="text-right">
                  <div className="text-sm md:text-base font-black text-duo-charcoal">
                    {user.xp} XP
                  </div>
                  {isTop3 && (
                    <div className="text-[10px] font-black text-duo-green flex items-center justify-end">
                      <ChevronUp className="w-3 h-3" /> Promoted
                    </div>
                  )}
                  {isDemoted && (
                    <div className="text-[10px] font-black text-duo-red flex items-center justify-end">
                      <ChevronDown className="w-3 h-3" /> Demotion
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
