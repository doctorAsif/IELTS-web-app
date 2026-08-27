import React from 'react';
import { Flame, Gem, Heart, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useApp } from '../../lib/store';
import { sound } from '../../lib/audio';

export const TopHeader: React.FC = () => {
  const { stats, toggleSound } = useApp();

  return (
    <header className="sticky top-0 z-30 flex md:hidden items-center justify-between px-4 py-3 bg-white border-b-2 border-duo-gray">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded overflow-hidden">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <span className="font-black text-base text-[#1E3A8A] tracking-wider uppercase">
          AKHL IELTS
        </span>
      </div>

      {/* Stats Counters */}
      <div className="flex items-center gap-3">
        {/* Streak */}
        <div className="flex items-center gap-1">
          <Flame className="w-5 h-5 text-duo-orange fill-duo-orange" />
          <span className="font-black text-sm text-duo-orange">{stats.streak}</span>
        </div>

        {/* Gems */}
        <div className="flex items-center gap-1">
          <Gem className="w-5 h-5 text-duo-blue fill-duo-blue" />
          <span className="font-black text-sm text-duo-blue">{stats.gems}</span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1">
          <Heart className="w-5 h-5 text-duo-red fill-duo-red" />
          <span className="font-black text-sm text-duo-red">
            {stats.hearts > 100 ? '∞' : stats.hearts}
          </span>
        </div>

        {/* Sound toggle */}
        <button
          onClick={() => {
            toggleSound();
            sound.playClick();
          }}
          className="p-1 text-gray-500 hover:text-duo-charcoal"
        >
          {stats.soundEnabled ? (
            <Volume2 className="w-5 h-5 text-duo-green" />
          ) : (
            <VolumeX className="w-5 h-5 text-duo-red" />
          )}
        </button>
      </div>
    </header>
  );
};
