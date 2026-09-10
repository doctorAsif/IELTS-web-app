import React from 'react';
import { Cpu, HardDrive, ShieldCheck, Sparkles, Zap, Award, Globe } from 'lucide-react';
import { HardwareProfile } from '../types/ai';

interface NavbarProps {
  hardwareProfile: HardwareProfile | null;
  isAiReady: boolean;
  onOpenAiSetup: () => void;
  onOpenAbout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hardwareProfile,
  isAiReady,
  onOpenAiSetup,
  onOpenAbout,
}) => {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0B0F19]/85 backdrop-blur-2xl px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Identity with Official Logo */}
      <div className="flex items-center space-x-3.5">
        <div className="relative group">
          <img
            src="/images/logo.png"
            alt="AKHL IELTS Official Logo"
            className="w-10 h-10 object-contain rounded-xl shadow-liquid-glow-blue ring-1 ring-white/20 bg-[#131B2E] p-0.5 transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-ielts-emerald border-2 border-[#0B0F19] rounded-full animate-pulse" />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-lg text-white tracking-tight">AKHL IELTS</span>
            <span className="text-[10px] font-bold bg-gradient-to-r from-ielts-royalPurple/30 to-indigo-500/20 text-ielts-royalPurple border border-ielts-royalPurple/40 px-2.5 py-0.5 rounded-full shadow-liquid-glow-purple">
              Liquid UI • 2,070+ Practices & Creative Units
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Student World Bangladesh • Dr. ABM Asif Kibria</p>
        </div>
      </div>

      {/* Hardware & Edge AI / Non-AI Toggle Badge */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenAiSetup}
          className="flex items-center space-x-2.5 bg-[#131B2E] border border-white/15 hover:border-ielts-royalPurple/60 px-3.5 py-1.5 rounded-2xl transition-all shadow-liquid-card group"
        >
          <div className="flex items-center space-x-1.5 text-xs text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-ielts-electricBlue group-hover:rotate-12 transition-transform" />
            <span>RAM: <strong className="text-white">{hardwareProfile ? `${hardwareProfile.ramGB} GB+` : 'Detecting...'}</strong></span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center space-x-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300">
              AI: <strong className="text-sky-300">{hardwareProfile?.modelSpec.sizeLabel || '1.2 GB'}</strong>
            </span>
          </div>
          <span className={`w-2 h-2 rounded-full ${isAiReady ? 'bg-ielts-emerald animate-pulse' : 'bg-amber-400'}`} />
        </button>

        {/* Non-AI Mode Indicator */}
        <div className="hidden md:flex items-center space-x-1.5 bg-ielts-emerald/10 border border-ielts-emerald/30 px-3 py-1.5 rounded-2xl text-xs font-bold text-ielts-emerald shadow-liquid-glow-emerald">
          <Zap className="w-3.5 h-3.5" />
          <span>Non-AI Mode Active</span>
        </div>

        {/* Study Abroad & Founder Bio Button */}
        {onOpenAbout && (
          <button
            onClick={onOpenAbout}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600/20 to-sky-500/20 hover:from-purple-600/30 hover:to-sky-500/30 border border-purple-500/40 text-purple-300 hover:text-white px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-sm group"
          >
            <Globe className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-45 transition-transform" />
            <span>Study Abroad & Bio</span>
          </button>
        )}

        {/* Student Target Band Indicator */}
        <div className="hidden sm:flex items-center space-x-2 bg-[#131B2E] border border-white/10 px-3.5 py-1.5 rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-ielts-royalPurple" />
          <span className="text-xs text-slate-300">Target: <strong className="text-white font-bold">Band 7.5+</strong></span>
        </div>
      </div>
    </header>
  );
};
