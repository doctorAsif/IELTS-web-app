import React from 'react';
import { useApp } from '../../lib/store';
import { Timer, Brain, Mic, PenTool, BookOpen, Headphones } from 'lucide-react';
import { Lesson } from '../../lib/types';
import { ActiveTab } from '../layout/Sidebar';
import { MascotSvg } from '../mascot/MascotSvg';

interface DashboardViewProps {
  onStartLesson: (lesson: Lesson) => void;
  onSelectTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onStartLesson, onSelectTab }) => {
  const { stats } = useApp();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      {/* 1. Autonomous AI Teacher Widget */}
      <div className="bg-[#1E293B] rounded-3xl border border-[#334155] p-5 md:p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg">
        <div className="w-24 h-24 shrink-0 bg-blue-900/30 rounded-full flex items-center justify-center">
          <MascotSvg mood="encouraging" size={80} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-black text-white">Autonomous AI Teacher</h2>
          <p className="text-sm text-[#94A3B8] mt-1">
            Analyzing your strengths. Today's recommended focus is Speaking and Listening.
          </p>
          <div className="mt-4 flex gap-3">
            <button 
              onClick={() => onSelectTab('speaking')}
              className="bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-900 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
            >
              Start Speaking
            </button>
            <button 
              onClick={() => onSelectTab('listening')}
              className="bg-[#1E293B] hover:bg-slate-700 text-white border border-[#334155] px-4 py-2 rounded-xl font-bold text-sm transition-colors"
            >
              Start Listening
            </button>
          </div>
        </div>
      </div>

      {/* 2. Full IELTS Mock Exam Banner */}
      <div 
        onClick={() => onStartLesson({
          id: 'mock-exam-full',
          title: 'Full IELTS Mock Exam',
          type: 'practice',
          xpReward: 100,
          unitId: 0,
          skill: 'overall',
          gemsReward: 50,
          description: 'Full Mock Exam Simulation',
          questions: []
        })}
        className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-[#1E3A8A] to-[#0F766E] shadow-xl flex items-center justify-between border border-[#0EA5E9]/30">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="p-3.5 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Timer className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-wide">Full IELTS Mock Exam</h3>
              <p className="text-sm md:text-base text-[#BAE6FD] font-medium mt-1">Timed 4-Skill Simulation (L → R → W → S)</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold hidden md:flex">
            ❯
          </div>
        </div>
      </div>

      {/* 3. Curriculum Modules */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 px-1">Targeted Practice</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ModuleCard 
            title="Speaking Trainer" 
            desc="AI Voice Evaluation" 
            icon={Mic} 
            color="#F43F5E" 
            onClick={() => onSelectTab('speaking')} 
          />
          <ModuleCard 
            title="Writing Evaluator" 
            desc="Task 1 & 2 Grading" 
            icon={PenTool} 
            color="#FB923C" 
            onClick={() => onSelectTab('writing')} 
          />
          <ModuleCard 
            title="Reading Practice" 
            desc="Academic & General" 
            icon={BookOpen} 
            color="#A855F7" 
            onClick={() => onSelectTab('reading')} 
          />
          <ModuleCard 
            title="Listening Practice" 
            desc="Full Audio Tests" 
            icon={Headphones} 
            color="#06B6D4" 
            onClick={() => onSelectTab('listening')} 
          />
        </div>
      </div>

    </div>
  );
};

function ModuleCard({ title, desc, icon: Icon, color, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="bg-[#1E293B] hover:bg-[#1E293B]/80 border border-[#334155] rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors"
    >
      <div 
        className="p-3 rounded-xl"
        style={{ backgroundColor: `${color}26` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <h4 className="text-white font-bold">{title}</h4>
        <p className="text-[#94A3B8] text-xs font-medium mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
