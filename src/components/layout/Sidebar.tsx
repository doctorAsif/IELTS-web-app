import React from 'react';
import {
  LayoutDashboard,
  Brain,
  Download,
  Timer,
  Mic,
  PenTool,
  BookOpen,
  Headphones,
  Layers,
  GraduationCap,
  Globe,
  Key,
  UserPlus,
  Shield,
  User,
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useApp } from '../../lib/store';

export type ActiveTab = 
  | 'dashboard' 
  | 'ai_tutor' 
  | 'ai_setup' 
  | 'mock_exam' 
  | 'speaking' 
  | 'writing' 
  | 'reading' 
  | 'listening' 
  | 'flashcards' 
  | 'founder' 
  | 'study_abroad' 
  | 'license' 
  | 'register' 
  | 'admin';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { user } = useAuth();
  const { stats } = useApp();
  
  const isGuest = !user;
  const isAdmin = (user as any)?.isAdmin || false;

  const handleTabClick = (tab: ActiveTab) => {
    onSelectTab(tab);
  };

  const navItemsTop = [
    { id: 'dashboard', label: 'Dashboard & Daily Plan', icon: LayoutDashboard, color: '#38BDF8' },
    { id: 'ai_tutor', label: 'Offline AI Tutor Hub', icon: Brain, color: '#818CF8' },
    { id: 'ai_setup', label: 'Offline AI Model Setup', icon: Download, color: '#38BDF8' },
    { id: 'mock_exam', label: 'Full IELTS Mock Exam', icon: Timer, color: '#34D399' },
    { id: 'speaking', label: 'Speaking Trainer', icon: Mic, color: '#F43F5E' },
    { id: 'writing', label: 'Writing Evaluator', icon: PenTool, color: '#FB923C' },
    { id: 'reading', label: 'Reading Practice', icon: BookOpen, color: '#A855F7' },
    { id: 'listening', label: 'Listening Practice', icon: Headphones, color: '#06B6D4' },
    { id: 'flashcards', label: 'Vocabulary Flashcards', icon: Layers, color: '#38BDF8' },
  ];

  const navItemsBottom = [
    { id: 'founder', label: 'Founder & CEO Biography', icon: GraduationCap, color: '#38BDF8' },
    { id: 'study_abroad', label: 'Study Abroad (Student World)', icon: Globe, color: '#34D399' },
    { id: 'license', label: 'Activate License Code', icon: Key, color: '#F59E0B' },
  ];

  navItemsBottom.push({ id: 'admin', label: isAdmin ? 'Admin CRM Dashboard' : 'Faculty / Admin Portal', icon: Shield, color: '#60A5FA' });

  const renderNavItem = (item: { id: string; label: string; icon: any; color: string }) => {
    const isActive = activeTab === item.id;
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        onClick={() => handleTabClick(item.id as ActiveTab)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
          isActive ? 'bg-white/10' : 'hover:bg-white/5'
        }`}
      >
        <div 
          className="p-1.5 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${item.color}26` }} // 15% opacity hex
        >
          <Icon className="w-[18px] h-[18px]" style={{ color: item.color }} />
        </div>
        <span className="text-white text-[13px] font-semibold tracking-wide">{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 bg-[#0F172A] border-r border-[#1E293B] select-none">
      {/* 1. Drawer Header with Official Brand Logo */}
      <div className="w-full px-4 pt-5 pb-3 bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] border-b border-[#38BDF8]/20">
        <div className="h-10 bg-[#1E293B]/70 rounded-lg border border-[#38BDF8]/30 px-2.5 py-1 flex items-center w-max">
          <GraduationCap className="text-[#38BDF8] w-6 h-6 mr-2" />
          <span className="text-white font-bold text-[13px] tracking-wider">STUDENT WORLD</span>
        </div>
        <div className="text-[#94A3B8] text-[11px] font-medium mt-2">
          Exclusive IELTS Mastery Curriculum
        </div>
        
        {/* User Session Badge */}
        <div 
          className="mt-3 px-2.5 py-1 rounded-full border flex items-center w-max max-w-full"
          style={{ 
            backgroundColor: isGuest ? 'rgba(245,158,11,0.15)' : 'rgba(52,211,153,0.15)',
            borderColor: isGuest ? 'rgba(245,158,11,0.4)' : 'rgba(52,211,153,0.4)'
          }}
        >
          <User className="w-[13px] h-[13px] mr-1.5 shrink-0" style={{ color: isGuest ? '#F59E0B' : '#34D399' }} />
          <span className="text-[11px] font-bold truncate" style={{ color: isGuest ? '#F59E0B' : '#34D399' }}>
            {isGuest ? 'Guest Mode' : `${user?.displayName || 'Student'} (Band ${stats.targetBand.toFixed(1)})`}
          </span>
        </div>

        {/* Free Trial Badge */}
        {!isGuest && (
          <div className="mt-2 px-2.5 py-1 rounded-full border flex items-center w-max max-w-full bg-[#F59E0B]/10 border-[#F59E0B]/30">
            <Timer className="w-[13px] h-[13px] mr-1.5 shrink-0 text-[#F59E0B]" />
            <span className="text-[11px] font-bold truncate text-[#F59E0B]">
              FREE TRIAL: {stats.trialCreditsRemaining ?? 0} credits
            </span>
          </div>
        )}
      </div>

      {/* 2. Navigation Items List (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-3 no-scrollbar space-y-1">
        {navItemsTop.map(renderNavItem)}
        
        <div className="my-2 h-[1px] bg-[#334155] mx-2" />
        
        {navItemsBottom.map(renderNavItem)}
      </div>

      {/* Founder & Support Contact Card */}
      <div className="p-3">
        <div className="bg-[#1E293B] rounded-xl border border-[#334155] p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-900 overflow-hidden shrink-0 flex items-center justify-center">
            {/* Fallback avatar */}
            <User className="w-6 h-6 text-blue-300" />
          </div>
          <div className="overflow-hidden">
            <div className="text-white text-xs font-bold truncate">Dr. ABM Asif Kibria</div>
            <div className="text-[#94A3B8] text-[10px] truncate">Founder & CEO, Student World</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
