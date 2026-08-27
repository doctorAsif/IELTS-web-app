import React, { useState } from 'react';
import {
  User,
  Flame,
  Zap,
  Gem,
  Trophy,
  Target,
  Sparkles,
  BookOpen,
  Calendar,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../lib/store';
import { sound } from '../../lib/audio';
import { MascotSvg } from '../mascot/MascotSvg';

export const ProfileView: React.FC = () => {
  const { stats, currentLeague, updateTargetBand, resetProgress } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const targetBands = [6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

  const subScores = [
    { label: 'Listening Comprehension', score: stats.estimatedBand.listening, color: 'bg-sky-500', barColor: 'bg-sky-500' },
    { label: 'Academic Reading (T/F/NG)', score: stats.estimatedBand.reading, color: 'bg-purple-500', barColor: 'bg-purple-500' },
    { label: 'Writing (Task 1 & 2)', score: stats.estimatedBand.writing, color: 'bg-amber-500', barColor: 'bg-amber-500' },
    { label: 'Speaking Fluency & Lexis', score: stats.estimatedBand.speaking, color: 'bg-rose-500', barColor: 'bg-rose-500' },
  ];

  // 7-day mock streak days
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="flex-1 max-w-3xl mx-auto py-6 px-4 md:px-8 select-none">
      {/* Profile Header Card */}
      <div className="card-duo p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-5xl shadow-md border-4 border-white">
            🦉
          </div>
          <div className="absolute -bottom-1 -right-1 bg-duo-gold text-yellow-950 text-xs font-black px-2 py-0.5 rounded-full border border-yellow-600 shadow-xs">
            {currentLeague}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-duo-charcoal">
            IELTS Academic Candidate
          </h2>
          <p className="text-xs font-bold text-gray-400 mt-0.5">
            Preparing for General & Academic IELTS 2026
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-xs font-black text-duo-orange">
              <Flame className="w-4 h-4 fill-current" />
              <span>{stats.streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-duo-blue">
              <Gem className="w-4 h-4 fill-current" />
              <span>{stats.gems} Gems</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-duo-gold">
              <Trophy className="w-4 h-4 fill-current" />
              <span>{currentLeague} League</span>
            </div>
          </div>
        </div>
      </div>

      {/* IELTS Band Predictor & Diagnostic Breakdown */}
      <div className="card-duo p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-700 tracking-wider">
              <Sparkles className="w-4 h-4 text-duo-gold" />
              <span>Diagnostic Assessment</span>
            </div>
            <h3 className="text-xl font-black text-duo-charcoal mt-1">
              Estimated IELTS Band: <span className="text-emerald-600 font-extrabold">{stats.estimatedBand.overall.toFixed(1)} / 9.0</span>
            </h3>
          </div>

          {/* Target Band Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-500 uppercase">Target:</span>
            <div className="flex gap-1">
              {targetBands.map(band => (
                <button
                  key={band}
                  onClick={() => {
                    sound.playClick();
                    updateTargetBand(band);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                    stats.targetBand === band
                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {band}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-scores Progress Bars */}
        <div className="space-y-4">
          {subScores.map((item, idx) => {
            const pct = Math.min(100, Math.round((item.score / 9.0) * 100));
            return (
              <div key={idx} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-duo-charcoal">{item.label}</span>
                  <span className="text-xs font-black text-gray-700">
                    Band {item.score.toFixed(1)}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Study Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="card-duo p-4 text-center">
          <Zap className="w-6 h-6 text-duo-gold mx-auto mb-1 fill-duo-gold" />
          <div className="text-xl font-black text-duo-charcoal">{stats.xp}</div>
          <div className="text-[10px] font-black uppercase text-gray-400">Total XP</div>
        </div>
        <div className="card-duo p-4 text-center">
          <BookOpen className="w-6 h-6 text-duo-green mx-auto mb-1" />
          <div className="text-xl font-black text-duo-charcoal">{stats.completedLessonIds.length}</div>
          <div className="text-[10px] font-black uppercase text-gray-400">Lessons Completed</div>
        </div>
        <div className="card-duo p-4 text-center">
          <Target className="w-6 h-6 text-duo-blue mx-auto mb-1" />
          <div className="text-xl font-black text-duo-charcoal">{stats.drillsCompleted}</div>
          <div className="text-[10px] font-black uppercase text-gray-400">Drills Mastered</div>
        </div>
        <div className="card-duo p-4 text-center">
          <Flame className="w-6 h-6 text-duo-orange mx-auto mb-1 fill-duo-orange" />
          <div className="text-xl font-black text-duo-charcoal">{stats.streak} Days</div>
          <div className="text-[10px] font-black uppercase text-gray-400">Current Streak</div>
        </div>
      </div>

      {/* 7-Day Activity Streak Bar */}
      <div className="card-duo p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-duo-orange" />
          <h4 className="text-base font-black text-duo-charcoal">Weekly Study Activity</h4>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {weekDays.map((day, i) => {
            const isActiveDay = i <= 4;
            return (
              <div key={day} className="flex flex-col items-center gap-2 p-2 bg-gray-50 rounded-2xl border">
                <span className="text-[11px] font-black text-gray-500">{day}</span>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    isActiveDay ? 'bg-orange-100 text-duo-orange' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Flame className="w-5 h-5 fill-current" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Developer / Reset Tools */}
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-between">
        <div>
          <div className="text-xs font-black text-duo-charcoal uppercase">Reset Learning Progress</div>
          <div className="text-[11px] font-semibold text-gray-500">Clears LocalStorage and restarts from Unit 1</div>
        </div>

        {showResetConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetProgress();
                setShowResetConfirm(false);
                sound.playClick();
              }}
              className="btn-duo-red px-3 py-1.5 text-xs uppercase"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="text-xs font-bold text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-xs font-bold text-gray-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
