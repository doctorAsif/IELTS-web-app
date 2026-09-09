import React, { useState, useEffect } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  Circle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Mic,
  PenTool,
  Headphones,
  Sparkles,
  Zap,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Flame,
  ChevronRight,
  Target,
  BarChart3,
  Volume2,
  RefreshCw,
} from 'lucide-react';
import { DailyActivity, DailyStudyPlan, DailyTeacherService } from '../../../services/dailyTeacherService';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [selectedDuration, setSelectedDuration] = useState<15 | 30 | 45 | 60>(30);
  const [targetBand, setTargetBand] = useState<number>(7.5);
  const [plan, setPlan] = useState<DailyStudyPlan | null>(null);
  const [expandedRationale, setExpandedRationale] = useState<string | null>(null);

  useEffect(() => {
    setPlan(DailyTeacherService.getPlan(selectedDuration));
  }, [selectedDuration]);

  const handleToggleActivity = (id: string) => {
    const updated = DailyTeacherService.toggleActivityComplete(id);
    setPlan({ ...updated });
  };

  const completedCount = plan?.activities.filter((a) => a.isCompleted).length || 0;
  const totalCount = plan?.activities.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 pb-24">
      {/* 1. IELTS EXECUTIVE HEADER (Identical to ielts_executive_header.dart) */}
      <div className="bg-gradient-to-r from-[#1F0914] via-[#131B2E] to-[#0B0F19] border border-white/10 p-5 md:p-6 rounded-3xl shadow-liquid-card relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          {/* Logo & Cambridge Shield */}
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <img
                src="/images/logo.png"
                alt="AKHL IELTS Official Logo"
                className="w-12 h-12 object-contain rounded-2xl bg-[#0B0F19] p-1 border border-white/15 shadow-liquid-glow-blue"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-ielts-emerald border-2 border-[#0B0F19] rounded-full" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl md:text-2xl font-black text-white tracking-tight">AKHL IELTS</span>
                <span className="text-[10px] font-extrabold uppercase bg-ielts-royalPurple/20 text-ielts-royalPurple border border-ielts-royalPurple/40 px-2.5 py-0.5 rounded-full">
                  Cambridge Standard
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Dr. ABM Asif Kibria Master Curriculum • Student World Bangladesh
              </p>
            </div>
          </div>

          {/* Right Header Status Controls: Streak & Target Band Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Streak Counter */}
            <div className="flex items-center space-x-1.5 bg-[#0B0F19]/90 border border-amber-500/30 px-3.5 py-1.5 rounded-2xl shadow-sm">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="text-xs font-bold text-white">5 Days Streak</span>
            </div>

            {/* Target Band Selector Pill */}
            <div className="flex items-center space-x-2 bg-[#0B0F19] border border-white/10 px-3 py-1.5 rounded-2xl">
              <Target className="w-3.5 h-3.5 text-ielts-royalPurple" />
              <span className="text-xs text-slate-400">Target:</span>
              <select
                value={targetBand}
                onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                className="bg-transparent text-xs font-black text-white focus:outline-none cursor-pointer"
              >
                <option value="6.5" className="bg-[#0B0F19]">Band 6.5</option>
                <option value="7.0" className="bg-[#0B0F19]">Band 7.0</option>
                <option value="7.5" className="bg-[#0B0F19]">Band 7.5</option>
                <option value="8.0" className="bg-[#0B0F19]">Band 8.0</option>
                <option value="8.5" className="bg-[#0B0F19]">Band 8.5</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME BAND PREDICTOR HERO CARD (Identical to band_predictor_hero_card.dart) */}
      <div className="liquid-glass-card p-6 md:p-8 rounded-3xl border border-white/15 relative overflow-hidden space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Diagnostic Status Pill & Overall Score */}
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-ielts-emerald/10 border border-ielts-emerald/30 px-3 py-1 rounded-full text-xs font-bold text-ielts-emerald">
              <span className="w-2 h-2 rounded-full bg-ielts-emerald animate-ping" />
              <span>REAL-TIME IELTS PREDICTOR</span>
            </div>

            <div className="flex items-baseline space-x-4">
              <div className="text-5xl md:text-6xl font-black text-white tracking-tight">
                6.5
              </div>
              <div className="text-xs text-slate-400 space-y-0.5">
                <span className="block font-bold text-slate-200">CURRENT ESTIMATED BAND</span>
                <span className="block text-slate-500">Based on moving average across your recent mock attempts</span>
              </div>
            </div>
          </div>

          {/* 4-Module Breakdown Sub-Score Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0B0F19]/80 border border-white/10 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Listening</span>
              <span className="text-xl font-black text-white mt-0.5 block">7.0</span>
              <span className="text-[10px] text-ielts-emerald font-semibold">Band Safe</span>
            </div>

            <div className="bg-[#0B0F19]/80 border border-white/10 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Reading</span>
              <span className="text-xl font-black text-white mt.0.5 block">7.0</span>
              <span className="text-[10px] text-ielts-emerald font-semibold">Band Safe</span>
            </div>

            <div className="bg-[#0B0F19]/80 border border-ielts-crimson/40 p-3.5 rounded-2xl text-center shadow-liquid-glow-crimson">
              <span className="text-[10px] uppercase font-bold text-ielts-crimson block">Writing</span>
              <span className="text-xl font-black text-ielts-crimson mt-0.5 block">6.0</span>
              <span className="text-[10px] text-ielts-crimson font-bold">Bottleneck ⚠️</span>
            </div>

            <div className="bg-[#0B0F19]/80 border border-white/10 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Speaking</span>
              <span className="text-xl font-black text-white mt-0.5 block">6.5</span>
              <span className="text-[10px] text-amber-400 font-semibold">Scaffolding</span>
            </div>
          </div>
        </div>

        {/* Primary Bottleneck Diagnostic Alert */}
        <div className="bg-[#0B0F19]/90 border border-ielts-crimson/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start space-x-3 text-slate-200">
            <span className="p-1.5 rounded-xl bg-ielts-crimson/20 text-ielts-crimson shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <strong className="text-ielts-crimson block font-bold">Primary Diagnostic Bottleneck:</strong>
              Your Writing Task 2 is currently holding you back from Band {targetBand.toFixed(1)}. Master Dr. Asif’s Zero Number Rule in Task 1 and PEE paragraph coherence.
            </div>
          </div>

          <button
            onClick={() => onNavigate('writing')}
            className="shrink-0 bg-gradient-to-r from-ielts-crimson to-rose-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-liquid-glow-crimson flex items-center space-x-1.5"
          >
            <span>Focus Writing Drills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. BENTO GRID OF CORE EXAM ENGINES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Speaking Examiner Bento Card (speaking_examiner_bento_card.dart) */}
        <div
          onClick={() => onNavigate('speaking')}
          className="liquid-glass-card p-6 rounded-3xl border border-white/10 hover:border-ielts-crimson/50 transition-all cursor-pointer group space-y-4 relative"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase bg-ielts-crimson/20 text-ielts-crimson border border-ielts-crimson/40 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-ielts-crimson animate-ping" />
              <span>LIVE EXAMINER CALL</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">120s Timer</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white group-hover:text-ielts-crimson transition-colors flex items-center space-x-2">
              <Mic className="w-5 h-5 text-ielts-crimson" />
              <span>Speaking Examiner</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full Part 1, 2, 3 interview simulator with live audio speech recognition and British examiner voice.
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-ielts-crimson font-bold">
            <span>Launch Test</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Writing Rubric Bento Card (writing_rubric_bento_card.dart) */}
        <div
          onClick={() => onNavigate('writing')}
          className="liquid-glass-card p-6 rounded-3xl border border-white/10 hover:border-sky-500/50 transition-all cursor-pointer group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase bg-sky-500/20 text-sky-400 border border-sky-500/40 px-2.5 py-0.5 rounded-full">
              Zero Number Rule
            </span>
            <span className="text-xs text-slate-400 font-mono">150w / 250w</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white group-hover:text-sky-400 transition-colors flex items-center space-x-2">
              <PenTool className="w-5 h-5 text-sky-400" />
              <span>Writing Rubric</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Timed Task 1 & 2 workspace with live word counter, paragraph structure guidance, and Band 9 C1/C2 upgrades.
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-sky-400 font-bold">
            <span>Open Workspace</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Receptive Telemetry Bento Card (receptive_telemetry_bento_card.dart) */}
        <div
          onClick={() => onNavigate('reading')}
          className="liquid-glass-card p-6 rounded-3xl border border-white/10 hover:border-amber-500/50 transition-all cursor-pointer group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
              Computer-Delivered
            </span>
            <span className="text-xs text-slate-400 font-mono">Split-Screen</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Receptive Skills Hub</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              True/False/Not Given scanning drills and 4-section listening practice with official Cambridge speed controls.
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-amber-400 font-bold">
            <span>Practice Receptive</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Creative Mastery Bento Card */}
        <div
          onClick={() => onNavigate('creative')}
          className="liquid-glass-card p-6 rounded-3xl border border-white/10 hover:border-ielts-royalPurple/50 transition-all cursor-pointer group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase bg-ielts-royalPurple/20 text-ielts-royalPurple border border-ielts-royalPurple/40 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-ielts-royalPurple" />
              <span>200 Creative Units</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">4 Pillars</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white group-hover:text-ielts-royalPurple transition-colors flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-ielts-royalPurple" />
              <span>Creative Mastery</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mnemonic poems, grammar blueprints, Band 5 to 8.5 makeover showdowns, and academic stories with audio pronunciation.
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-ielts-royalPurple font-bold">
            <span>Explore 4 Pillars</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 4. AUTONOMOUS DAILY TEACHER (Time-based Scaling 15m to 60m) */}
      <div className="liquid-glass-card p-6 md:p-8 rounded-3xl border border-white/15 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-white tracking-tight">Autonomous Daily Teacher</h2>
              <span className="text-xs text-slate-400">({completedCount}/{totalCount} Completed)</span>
            </div>
            <p className="text-xs text-slate-400">
              Dr. Asif's adaptive engine dynamically assigns 2 to 5 targeted drills based on your study availability.
            </p>
          </div>

          {/* Time Selector */}
          <div className="flex items-center bg-[#0B0F19] border border-white/10 p-1.5 rounded-2xl">
            {([15, 30, 45, 60] as const).map((mins) => (
              <button
                key={mins}
                onClick={() => setSelectedDuration(mins)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  selectedDuration === mins
                    ? 'bg-gradient-to-r from-ielts-royalPurple to-indigo-600 text-white shadow-liquid-glow-purple'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Activity Cards */}
        <div className="space-y-3">
          {plan?.activities.map((activity) => {
            const isCompleted = activity.isCompleted;
            const isRationaleOpen = expandedRationale === activity.id;

            return (
              <div
                key={activity.id}
                className={`border rounded-2xl p-4 transition-all ${
                  isCompleted
                    ? 'bg-[#0B0F19]/40 border-white/5 opacity-70'
                    : 'bg-[#0B0F19]/80 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <button
                      onClick={() => handleToggleActivity(activity.id)}
                      className="mt-0.5 text-slate-400 hover:text-ielts-emerald transition-colors"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-ielts-emerald" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                          {activity.title}
                        </h3>
                        <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded-md">
                          Band {activity.difficultyBand}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {activity.durationMinutes} mins
                        </span>
                      </div>

                      <button
                        onClick={() => setExpandedRationale(isRationaleOpen ? null : activity.id)}
                        className="inline-flex items-center space-x-1 text-[11px] text-ielts-royalPurple hover:text-white font-medium"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Why this practice? (Pedagogical Rationale)</span>
                      </button>

                      {isRationaleOpen && (
                        <div className="mt-2 text-xs bg-[#131B2E] border border-ielts-royalPurple/30 text-slate-200 p-3.5 rounded-xl leading-relaxed">
                          <strong className="text-ielts-royalPurple block mb-1">Dr. Asif Directive:</strong>
                          {activity.pedagogicalRationale}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const tab = activity.actionRoute.replace('/', '');
                      onNavigate(tab);
                    }}
                    className="shrink-0 bg-white/10 hover:bg-white text-white hover:text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                  >
                    Start
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. OFFICIAL FOUNDER SUPPORT CARD (Identical to founder_support_card.dart) */}
      <div className="liquid-glass-card p-6 md:p-8 rounded-3xl border border-white/15 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2.5 py-0.5 rounded-full">
              OFFICIAL ACADEMIC HELPLINE
            </span>
            <h3 className="text-lg font-black text-white mt-1">Dr. ABM ASIF KIBRIA</h3>
            <p className="text-xs text-slate-400 font-medium">FOUNDER & CEO • Student World Bangladesh</p>
          </div>

          <span className="text-xs bg-ielts-emerald/20 text-ielts-emerald border border-ielts-emerald/40 px-3 py-1 rounded-xl font-bold">
            Support Available 24/7
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Need personalized guidance, Band 8+ essay evaluations, or institutional partnership inquiries? Contact Dr. Asif’s academic helpline directly:
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="https://wa.me/8801313529988"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-liquid-glow-emerald"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp: +8801313529988</span>
          </a>

          <a
            href="mailto:info@asifkibriahelpline.com"
            className="flex items-center space-x-2 bg-[#0B0F19] hover:bg-white/10 border border-white/15 text-white font-semibold px-4 py-2.5 rounded-2xl text-xs transition-colors"
          >
            <Mail className="w-4 h-4 text-sky-400" />
            <span>info@asifkibriahelpline.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};
