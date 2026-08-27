import React from 'react';
import { BookOpen, Target, Trophy, Scroll, ShoppingBag, User } from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { sound } from '../../lib/audio';

interface MobileNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'learn', label: 'Teacher', icon: BookOpen },
    { id: 'practice', label: 'Speaking', icon: Target },
    { id: 'leaderboard', label: 'Leagues', icon: Trophy },
    { id: 'quests', label: 'Homework', icon: Scroll },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-duo-gray px-2 py-1 justify-around items-center select-none shadow-lg">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              onSelectTab(tab.id);
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
              isActive ? 'text-duo-blue scale-105' : 'text-duo-gray-dark hover:text-duo-charcoal'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-black tracking-tight mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
