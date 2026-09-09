import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Circle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Mic,
  PenTool,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { DailyActivity, DailyStudyPlan, DailyTeacherService } from '../../../services/dailyTeacherService';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [selectedDuration, setSelectedDuration] = useState<15 | 30 | 45 | 60>(30);
  const [plan, setPlan] = useState<DailyStudyPlan | null>(null);
  const [expandedRationale, setExpandedRationale] = useState<string | null>(null);

  useEffect(() => {
    setPlan(DailyTeacherService.getPlan(selectedDuration));
  }, [selectedDuration]);

  const handleToggleActivity = (id: string) => {
    const updated = DailyTeacherService.toggleActivityComplete(id);
    setPlan({ ...updated });
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'speaking': return <Mic className="w-4 h-4 text-emerald-400" />;
      case 'writing': return <PenTool className="w-4 h-4 text-sky-400" />;
      case 'reading': return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'listening': return <Headphones className="w-4 h-4 text-purple-400" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  const completedCount = plan?.activities.filter(a => a.isCompleted).length || 0;
  const totalCount = plan?.activities.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0C1A38] via-[#0F244C] to-[#0A1630] border border-sky-500/20 p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full text-xs font-semibold text-sky-300">
            <Award className="w-3.5 h-3.5" />
            <span>Autonomous Daily AI Teacher</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Target: Cambridge Band 7.5+ Mastery
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Welcome, Dr. Asif's IELTS Scholar. Your daily training regimen dynamically adapts to your available study time using our conservative moving average difficulty engine.
          </p>
        </div>

        {/* Band Score Cards */}
        <div className="mt-6 md:mt-0 md:absolute md:right-8 md:top-8 flex items-center space-x-4">
          <div className="bg-slate-900/80 backdrop-blur border border-slate-700/80 px-4 py-3 rounded-2xl text-center">
            <span className="text-[11px] text-slate-400 font-medium">Estimated Band</span>
            <div className="text-2xl font-black text-sky-400">6.5</div>
          </div>
          <div className="bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/40 px-4 py-3 rounded-2xl text-center">
            <span className="text-[11px] text-sky-300 font-medium">Target Band</span>
            <div className="text-2xl font-black text-white">7.5+</div>
          </div>
        </div>
      </div>

      {/* Dynamic Study Time Scaling Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0D182E] border border-slate-800 p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-white font-semibold text-sm">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>How much time do you have to study today?</span>
          </div>
          <p className="text-xs text-slate-400">
            The AI teacher automatically scales from 2 to 5 targeted drills based on your availability.
          </p>
        </div>

        <div className="inline-flex bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          {([15, 30, 45, 60] as const).map((mins) => (
            <button
              key={mins}
              onClick={() => setSelectedDuration(mins)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedDuration === mins
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Daily Progress & Activity List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Today's Prescribed Activities</h2>
            <p className="text-xs text-slate-400">
              Completed {completedCount} of {totalCount} drills ({progressPercent}%)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {plan?.activities.map((activity) => {
            const isCompleted = activity.isCompleted;
            const isRationaleOpen = expandedRationale === activity.id;

            return (
              <div
                key={activity.id}
                className={`border rounded-2xl p-4 transition-all ${
                  isCompleted
                    ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
                    : 'bg-[#0D182E] border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <button
                      onClick={() => handleToggleActivity(activity.id)}
                      className="mt-1 text-slate-400 hover:text-sky-400 transition-colors"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="p-1 rounded-md bg-slate-800">
                          {getSectionIcon(activity.section)}
                        </span>
                        <h3 className={`text-sm font-semibold ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                          {activity.title}
                        </h3>
                        <span className="text-[10px] font-semibold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                          Band {activity.difficultyBand}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {activity.durationMinutes} mins
                        </span>
                      </div>

                      {/* Explainable AI ("Why this practice?") button */}
                      <div>
                        <button
                          onClick={() => setExpandedRationale(isRationaleOpen ? null : activity.id)}
                          className="inline-flex items-center space-x-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium transition-colors"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>Why this practice? (Pedagogical Rationale)</span>
                        </button>
                      </div>

                      {isRationaleOpen && (
                        <div className="mt-2 text-xs bg-slate-900/90 border border-sky-500/20 text-slate-300 p-3 rounded-xl leading-relaxed">
                          <strong className="text-sky-400 block mb-1">Dr. Asif Teaching Directive:</strong>
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
                    className="shrink-0 flex items-center space-x-1.5 bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  >
                    <span>Start</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Access Skill Cards */}
      <div className="pt-4">
        <h2 className="text-lg font-bold text-white mb-4">Quick Practice Simulators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('speaking')}
            className="cursor-pointer bg-[#0D182E] hover:bg-sky-950/20 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl transition-all group"
          >
            <Mic className="w-6 h-6 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white text-sm">Speaking Trainer</h3>
            <p className="text-xs text-slate-400 mt-1">
              Part 1, 2, 3 with real-time mic speech recognition & Band 9 scoring.
            </p>
          </div>

          <div
            onClick={() => onNavigate('writing')}
            className="cursor-pointer bg-[#0D182E] hover:bg-sky-950/20 border border-slate-800 hover:border-sky-500/50 p-5 rounded-2xl transition-all group"
          >
            <PenTool className="w-6 h-6 text-sky-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white text-sm">Writing Trainer</h3>
            <p className="text-xs text-slate-400 mt-1">
              Task 1 & 2 timed editor with Zero Number Rule validator.
            </p>
          </div>

          <div
            onClick={() => onNavigate('reading')}
            className="cursor-pointer bg-[#0D182E] hover:bg-sky-950/20 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all group"
          >
            <BookOpen className="w-6 h-6 text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white text-sm">Reading Practice</h3>
            <p className="text-xs text-slate-400 mt-1">
              Split-screen Academic passages with True/False/Not Given drills.
            </p>
          </div>

          <div
            onClick={() => onNavigate('listening')}
            className="cursor-pointer bg-[#0D182E] hover:bg-sky-950/20 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl transition-all group"
          >
            <Headphones className="w-6 h-6 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white text-sm">Listening Practice</h3>
            <p className="text-xs text-slate-400 mt-1">
              4-section audio simulator with note completion & map labeling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
