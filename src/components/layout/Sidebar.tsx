import React from 'react';
import {
  BookOpen,
  Target,
  Trophy,
  Scroll,
  ShoppingBag,
  User,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../lib/store';
import { sound } from '../../lib/audio';

export type ActiveTab = 'learn' | 'practice' | 'leaderboard' | 'quests' | 'shop' | 'profile';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { stats, toggleSound } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'learn', label: 'DAILY TEACHER', icon: BookOpen },
    { id: 'practice', label: 'SPEAKING TRAINER', icon: Target },
    { id: 'leaderboard', label: 'LEADERBOARDS', icon: Trophy },
    { id: 'quests', label: 'HOMEWORK', icon: Scroll },
    { id: 'shop', label: 'SHOP', icon: ShoppingBag },
    { id: 'profile', label: 'PROFILE & BAND', icon: User },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    sound.playClick();
    onSelectTab(tab);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 bg-white border-r-2 border-duo-gray px-4 py-6 justify-between select-none">
      {/* App Brand / Logo */}
      <div>
        <div className="flex items-center gap-3 px-3 mb-8 cursor-pointer" onClick={() => handleTabClick('learn')}>
          <div className="w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden shadow-sm">
            <img src="/logo.png" alt="AKHL Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider text-[#1E3A8A] uppercase font-sans leading-tight">
              AKHL IELTS
            </h1>
            <div className="text-[10px] font-extrabold text-duo-gray-text tracking-widest uppercase mt-0.5">
              Student World BD
            </div>
            <div className="text-[9px] font-bold text-blue-600 tracking-wide uppercase mt-0.5">
              by Dr. ABM Asif Kibria
            </div>
          </div>
        </div>

        {/* Nav list */}
        <nav className="flex flex-col gap-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-sm tracking-wider transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50/80 text-duo-blue border-2 border-duo-blue shadow-sm'
                    : 'text-duo-charcoal hover:bg-gray-100/80 border-2 border-transparent'
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-transform ${
                    isActive ? 'text-duo-blue scale-110' : 'text-duo-gray-text'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls / Band Target & Sound */}
      <div className="flex flex-col gap-3 pt-4 border-t-2 border-duo-gray">
        {/* Band score predictor badge */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Est. Band Score</div>
              <div className="text-base font-black text-emerald-700">
                Band {stats.estimatedBand.overall.toFixed(1)} / 9.0
              </div>
            </div>
          </div>
          <div className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Aim {stats.targetBand}
          </div>
        </div>

        {/* Sound toggle & version */}
        <div className="flex items-center justify-between px-2 text-xs font-bold text-duo-gray-text">
          <button
            onClick={() => {
              toggleSound();
              sound.playClick();
            }}
            className="flex items-center gap-2 hover:text-duo-charcoal p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {stats.soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-duo-green" />
                <span>Audio FX On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-duo-red" />
                <span>Audio FX Muted</span>
              </>
            )}
          </button>
          <span className="text-[11px] opacity-60">IELTS 2026</span>
        </div>
      </div>
    </aside>
  );
};
