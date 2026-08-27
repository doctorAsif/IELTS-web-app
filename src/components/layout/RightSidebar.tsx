import React, { useState } from 'react';
import { Flame, Gem, Heart, Plus, Trophy, Zap, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../lib/store';
import { sound } from '../../lib/audio';
import { ActiveTab } from './Sidebar';

interface RightSidebarProps {
  onNavigate: (tab: ActiveTab) => void;
}

import { StudyAbroadAd } from '../shared/StudyAbroadAd';

export const RightSidebar: React.FC<RightSidebarProps> = ({ onNavigate }) => {
  const { stats, quests, currentLeague, refillHearts, spendGems, claimQuest } = useApp();
  const [showHeartModal, setShowHeartModal] = useState(false);

  const handleRefill = () => {
    if (spendGems(50)) {
      refillHearts();
      sound.playChest();
      setShowHeartModal(false);
    } else {
      sound.playWrong();
    }
  };

  return (
    <aside className="hidden xl:flex flex-col w-80 2xl:w-96 min-h-screen p-6 gap-6 select-none overflow-y-auto pb-24">
      {/* Top Counters Bar */}
      <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-2xl border-2 border-duo-gray">
        {/* Streak */}
        <div
          onClick={() => {
            sound.playStreak();
            onNavigate('profile');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-orange-50 cursor-pointer transition-colors"
          title="Daily Study Streak"
        >
          <Flame className="w-6 h-6 text-duo-orange fill-duo-orange animate-wiggle" />
          <span className="font-black text-base text-duo-orange">{stats.streak}</span>
        </div>

        {/* Gems */}
        <div
          onClick={() => {
            sound.playClick();
            onNavigate('shop');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors"
          title="Gems balance"
        >
          <Gem className="w-6 h-6 text-duo-blue fill-duo-blue" />
          <span className="font-black text-base text-duo-blue">{stats.gems}</span>
        </div>

        {/* Hearts */}
        <div
          onClick={() => {
            sound.playClick();
            setShowHeartModal(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-50 cursor-pointer transition-colors"
          title="Hearts remaining"
        >
          <Heart className="w-6 h-6 text-duo-red fill-duo-red" />
          <span className="font-black text-base text-duo-red">
            {stats.hearts > 100 ? '∞' : stats.hearts}
          </span>
          {stats.hearts < stats.maxHearts && stats.hearts < 100 && (
            <Plus className="w-4 h-4 text-duo-red" />
          )}
        </div>
      </div>

      {/* Asif Kibria Education Consultancy Advertisement */}
      <div className="cursor-pointer hover:-translate-y-1 transition-transform duration-300">
        <StudyAbroadAd />
      </div>

      {/* League Progress Card */}
      <div className="card-duo p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-duo-gold" />
            <h4 className="font-black text-sm text-duo-charcoal tracking-wide uppercase">
              {currentLeague} League
            </h4>
          </div>
          <button
            onClick={() => onNavigate('leaderboard')}
            className="text-xs font-black text-duo-blue hover:underline"
          >
            VIEW LEAGUE
          </button>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
          <div className="w-10 h-10 rounded-2xl bg-duo-gold/20 border-2 border-duo-gold flex items-center justify-center text-xl">
            🏆
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-gray-500">Top 3 advance to next league</div>
            <div className="text-sm font-black text-duo-charcoal mt-0.5">
              Rank #4 in {currentLeague}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quests Widget */}
      <div className="card-duo p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-duo-gold" />
            <h4 className="font-black text-sm text-duo-charcoal tracking-wide uppercase">Daily Quests</h4>
          </div>
          <button
            onClick={() => onNavigate('quests')}
            className="text-xs font-black text-duo-blue hover:underline"
          >
            VIEW ALL
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {quests.slice(0, 3).map(quest => {
            const progressPct = Math.min(100, Math.round((quest.current / quest.target) * 100));
            return (
              <div key={quest.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200/70">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-duo-charcoal truncate pr-2">{quest.title}</span>
                  {quest.completed ? (
                    <button
                      onClick={() => claimQuest(quest.id)}
                      className="px-2 py-0.5 bg-duo-green text-white text-[11px] font-black rounded-lg hover:bg-duo-green-light active:scale-95 animate-bounce"
                    >
                      CLAIM +{quest.gemsReward}💎
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-gray-400">
                      {quest.current}/{quest.target}
                    </span>
                  )}
                </div>
                {/* Progress bar */}
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-duo-gold rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heart Refill Modal Popup */}
      {showHeartModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card-duo max-w-sm w-full p-6 text-center animate-bounceSmall">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-10 h-10 text-duo-red fill-duo-red" />
            </div>
            <h3 className="text-xl font-black text-duo-charcoal mb-1">Hearts Refill</h3>
            <p className="text-xs text-gray-500 mb-6">
              You currently have <span className="font-bold text-duo-red">{stats.hearts} hearts</span>. Refill now to avoid waiting.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRefill}
                disabled={stats.gems < 50}
                className={`w-full py-3 rounded-2xl font-black text-sm tracking-wider uppercase transition-all ${
                  stats.gems >= 50
                    ? 'btn-duo-green'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                REFILL FOR 50 GEMS 💎
              </button>
              <button
                onClick={() => {
                  setShowHeartModal(false);
                  onNavigate('practice');
                }}
                className="btn-duo-white py-2.5 text-xs uppercase"
              >
                PRACTICE TO EARN HEARTS
              </button>
              <button
                onClick={() => setShowHeartModal(false)}
                className="text-xs font-black text-gray-400 hover:text-gray-600 py-1"
              >
                NO THANKS
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
