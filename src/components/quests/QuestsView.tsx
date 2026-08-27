import React from 'react';
import { Scroll, Zap, Gift, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../../lib/store';
import { BADGES } from '../../data/questsData';
import { sound } from '../../lib/audio';
import { MascotSvg } from '../mascot/MascotSvg';

export const QuestsView: React.FC = () => {
  const { quests, claimQuest } = useApp();

  return (
    <div className="flex-1 max-w-3xl mx-auto py-6 px-4 md:px-8 select-none">
      {/* Header Banner */}
      <div className="flex items-center justify-between p-6 mb-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl shadow-md">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-200">
            Daily & Milestone Challenges
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-1">
            IELTS Quests & Badges
          </h2>
          <p className="text-xs md:text-sm font-semibold opacity-90 mt-1">
            Complete daily study goals to earn gems, double XP potions, and band achievements.
          </p>
        </div>
        <MascotSvg mood="studying" size={110} className="shrink-0 -my-2" />
      </div>

      {/* Daily Quests Section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-duo-gold fill-duo-gold" />
          <h3 className="text-xl font-black text-duo-charcoal">
            Daily Quests
          </h3>
        </div>

        <div className="space-y-3">
          {quests.map(quest => {
            const progress = Math.min(100, Math.round((quest.current / quest.target) * 100));

            return (
              <div
                key={quest.id}
                className="card-duo p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-2xl shrink-0">
                    🎯
                  </div>
                  <div>
                    <h4 className="text-base font-black text-duo-charcoal">
                      {quest.title}
                    </h4>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">
                      {quest.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="w-44 md:w-56 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-duo-gold rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-gray-500">
                        {quest.current} / {quest.target}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reward / Claim Action */}
                <div className="flex items-center gap-3 self-end md:self-auto">
                  <div className="text-right">
                    <div className="text-xs font-black text-duo-green">
                      +{quest.xpReward} XP
                    </div>
                    <div className="text-xs font-black text-duo-blue">
                      +{quest.gemsReward} 💎
                    </div>
                  </div>

                  {quest.completed ? (
                    <button
                      onClick={() => claimQuest(quest.id)}
                      className="btn-duo-green px-5 py-2.5 text-xs uppercase animate-bounce"
                    >
                      CLAIM
                    </button>
                  ) : (
                    <div className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-black text-gray-400">
                      IN PROGRESS
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-duo-purple fill-duo-purple" />
          <h3 className="text-xl font-black text-duo-charcoal">
            Band 8.0+ Milestone Badges
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BADGES.map(badge => (
            <div
              key={badge.id}
              className={`card-duo p-4 flex items-center gap-4 ${
                badge.unlocked ? 'bg-white' : 'opacity-60 bg-gray-50'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 flex items-center justify-center text-3xl shadow-xs shrink-0">
                {badge.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-duo-charcoal">
                    {badge.title}
                  </h4>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {badge.tier}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-500 mt-1">
                  {badge.description}
                </p>
                {badge.unlocked && (
                  <div className="flex items-center gap-1 text-[11px] font-black text-duo-green mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> UNLOCKED
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
