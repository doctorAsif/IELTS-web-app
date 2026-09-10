import React from 'react';
import {
  LayoutDashboard,
  Mic,
  PenTool,
  BookOpen,
  Headphones,
  GraduationCap,
  Layers,
  Sparkles,
  Wand2,
  Cpu,
  Globe,
  KeyRound,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Daily Teacher', icon: LayoutDashboard, badge: 'Daily' },
    { id: 'about-founder', label: 'Founder & Global', icon: Globe, badge: '138+ Unis' },
    { id: 'creative', label: 'Creative Mastery', icon: Wand2, badge: '200 Units' },
    { id: 'speaking', label: 'Speaking Trainer', icon: Mic, badge: 'AI Live' },
    { id: 'writing', label: 'Writing Trainer', icon: PenTool, badge: 'Task 1&2' },
    { id: 'reading', label: 'Reading Practice', icon: BookOpen },
    { id: 'listening', label: 'Listening Practice', icon: Headphones },
    { id: 'curriculum', label: '16 Master Classes', icon: GraduationCap },
    { id: 'flashcards', label: 'Academic Vocab', icon: Layers },
    { id: 'ai-setup', label: 'Edge AI & RAM', icon: Cpu, badge: 'Hardware' },
    { id: 'licensing', label: 'Licensing & Anti-Share', icon: KeyRound },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#080E1E] flex flex-col justify-between p-4 shrink-0 select-none">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Core IELTS Training
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  isActive ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Handouts & Dr. Asif Signature Box */}
      <div className="p-3.5 bg-slate-900/70 border border-slate-800/90 rounded-2xl space-y-2">
        <div className="flex items-center space-x-2 text-xs text-sky-400 font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>IELTS Handout 2026</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          4 Foundation Docs & Practice Sheets copied in <code className="text-sky-300 text-[10px]">/public/handouts/</code>
        </p>
      </div>
    </aside>
  );
};
