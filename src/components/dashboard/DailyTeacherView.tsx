import React, { useState, useEffect } from 'react';
import {
  Brain,
  Clock,
  HelpCircle,
  CheckCircle,
  Play,
  TrendingUp,
  AlertTriangle,
  FileText,
  Send,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { DailyAITeacherEngine, DailyDrill, HomeworkAssignment, RollingAccuracyReport } from '../../lib/engines/DailyAITeacherEngine';
import { useApp } from '../../lib/store';
import { sound } from '../../lib/audio';
import { MascotSvg } from '../mascot/MascotSvg';
import { ActiveTab } from '../layout/Sidebar';

interface DailyTeacherViewProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const DailyTeacherView: React.FC<DailyTeacherViewProps> = ({ onSelectTab }) => {
  const { stats, updateTargetBand, gainXp, addGems } = useApp();
  const [availability, setAvailability] = useState<15 | 30 | 45 | 60>(30);
  const [drills, setDrills] = useState<DailyDrill[]>([]);
  const [activeRationaleDrill, setActiveRationaleDrill] = useState<DailyDrill | null>(null);
  const [rollingReport, setRollingReport] = useState<RollingAccuracyReport>(DailyAITeacherEngine.getRollingAccuracyReport());
  const [homeworkList, setHomeworkList] = useState<HomeworkAssignment[]>(DailyAITeacherEngine.getHomeworkAssignments());
  const [activeHwTab, setActiveHwTab] = useState<'drills' | 'homework'>('drills');
  const [submittingHwId, setSubmittingHwId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  useEffect(() => {
    const plan = DailyAITeacherEngine.generateDailyPlan(availability, stats.targetBand);
    setDrills(plan);
  }, [availability, stats.targetBand]);

  const handleToggleCompleteDrill = (drillId: string) => {
    sound.playTile();
    setDrills(prev =>
      prev.map(d => {
        if (d.id === drillId) {
          const isDone = !d.completed;
          if (isDone) {
            sound.playCorrect();
            gainXp(20);
            addGems(5);
            // Record 85% accuracy
            const rep = DailyAITeacherEngine.recordActivityAccuracy(85);
            setRollingReport(rep);
            if (rep.status === 'advance' && rep.bandAdjustment > 0) {
              const newBand = Math.min(9.0, stats.targetBand + 0.5);
              updateTargetBand(newBand);
            }
          }
          return { ...d, completed: isDone };
        }
        return d;
      })
    );
  };

  const handleStartDrill = (drill: DailyDrill) => {
    sound.playClick();
    if (drill.skill === 'speaking') {
      onSelectTab('speaking');
    } else if (drill.skill === 'writing') {
      onSelectTab('writing');
    } else if (drill.skill === 'reading') {
      onSelectTab('reading');
    } else if (drill.skill === 'listening') {
      onSelectTab('listening');
    } else {
      onSelectTab('scaffolding');
    }
  };

  const handleSubmitHomework = (hwId: string) => {
    if (!submissionText.trim()) return;
    sound.playVictory();
    const updated = DailyAITeacherEngine.updateHomeworkStatus(hwId, 'completed', {
      submission: submissionText,
      feedback: 'Submitted for faculty & AI review. Great commitment to the study schedule!'
    });
    setHomeworkList(updated);
    setSubmittingHwId(null);
    setSubmissionText('');
    gainXp(30);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 text-white animate-fadeInUp">
      {/* Top Banner: Teacher Persona Greeting */}
      <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] p-6 md:p-8 rounded-3xl border border-[#38BDF8]/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 shrink-0 bg-blue-900/40 rounded-full flex items-center justify-center border border-[#38BDF8]/40 shadow-inner">
            <MascotSvg mood="encouraging" size={72} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-bold px-3 py-0.5 rounded-full border border-[#38BDF8]/30 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" /> Autonomous Daily AI Teacher
              </span>
              <span className="text-xs text-slate-400">Dr. ABM Asif Kibria Method</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">Daily Guided Practice</h1>
            <p className="text-xs md:text-sm text-[#94A3B8] mt-1">
              Targeting Band {stats.targetBand.toFixed(1)} • Custom weakness remediation active.
            </p>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex bg-[#0F172A] p-1.5 rounded-2xl border border-[#334155] shrink-0">
          <button
            onClick={() => { setActiveHwTab('drills'); sound.playClick(); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeHwTab === 'drills' ? 'bg-[#38BDF8] text-slate-950 shadow font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Today's Drills
          </button>
          <button
            onClick={() => { setActiveHwTab('homework'); sound.playClick(); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeHwTab === 'homework' ? 'bg-[#38BDF8] text-slate-950 shadow font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Homework Loop ({homeworkList.filter(h => h.status !== 'reviewed').length})
          </button>
        </div>
      </div>

      {activeHwTab === 'drills' ? (
        <>
          {/* Availability Scaling Bar */}
          <div className="bg-[#1E293B] p-5 rounded-3xl border border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">How much time do you have today?</span>
              <span className="text-sm font-bold text-white">Adaptive Dynamic Study Scaling</span>
            </div>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    setAvailability(mins as any);
                    sound.playClick();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition border ${
                    availability === mins
                      ? 'bg-[#38BDF8] text-slate-950 border-[#38BDF8] shadow-md scale-105'
                      : 'bg-[#0F172A] text-slate-300 border-[#334155] hover:border-slate-500'
                  }`}
                >
                  ⏱️ {mins} mins ({mins === 15 ? '2 drills' : mins === 30 ? '3 drills' : mins === 45 ? '4 drills' : '5 drills'})
                </button>
              ))}
            </div>
          </div>

          {/* Rolling 5-Activity Accuracy Tracker Card */}
          <div className="bg-[#1E293B] p-6 rounded-3xl border border-[#334155] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="text-base font-bold text-white">Conservative Moving Average Difficulty</h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                rollingReport.status === 'advance'
                  ? 'bg-green-500/10 text-green-400 border-green-500/30'
                  : rollingReport.status === 'remediate'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
              }`}>
                {rollingReport.status === 'advance' ? '★ Ready to Advance +0.5 Band' : rollingReport.status === 'remediate' ? 'Diagnostic Scaffolding Triggered' : 'Maintaining Steady Mastery'}
              </span>
            </div>

            <p className="text-xs text-slate-300">{rollingReport.message}</p>

            {/* Visual 5-window bubbles */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-slate-400 font-semibold">Last 5 Activities:</span>
              <div className="flex gap-2">
                {rollingReport.history.map((score, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border ${
                      score >= 85
                        ? 'bg-green-500/20 text-green-300 border-green-500/40'
                        : score >= 65
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {score}%
                  </div>
                ))}
              </div>
              <div className="ml-auto text-right">
                <span className="text-xs text-slate-400">Rolling Window Avg:</span>
                <div className="text-lg font-black text-white">{rollingReport.averageAccuracy}%</div>
              </div>
            </div>
          </div>

          {/* Generated Drills List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white px-1">Curated Daily Micro-Drills</h3>
            <div className="space-y-3">
              {drills.map((drill, idx) => (
                <div
                  key={drill.id}
                  className={`bg-[#1E293B] border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                    drill.completed
                      ? 'border-green-500/40 bg-green-500/5'
                      : 'border-[#334155] hover:border-[#38BDF8]/60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleCompleteDrill(drill.id)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${
                        drill.completed
                          ? 'bg-green-500 border-green-500 text-slate-950'
                          : 'border-slate-500 hover:border-[#38BDF8]'
                      }`}
                    >
                      {drill.completed && <CheckCircle className="w-5 h-5 stroke-[3]" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0F172A] text-slate-300 border border-[#334155]">
                          Drill {idx + 1} • {drill.skill.toUpperCase()}
                        </span>
                        <span className="text-xs text-[#38BDF8] font-bold">~{drill.durationMinutes} mins</span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1">{drill.title}</h4>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{drill.objective}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setActiveRationaleDrill(drill)}
                      className="px-3 py-2 bg-[#0F172A] hover:bg-slate-800 text-slate-300 border border-[#334155] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
                      Why this practice?
                    </button>

                    <button
                      onClick={() => handleStartDrill(drill)}
                      className="px-4 py-2 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Weakness-Driven Homework Loop */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Weakness-Driven Homework Loop</h3>
              <p className="text-xs text-[#94A3B8]">
                Lifecycle: <code className="text-[#38BDF8]">generated → assigned → in_progress → completed → reviewed</code>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {homeworkList.map(hw => (
              <div key={hw.id} className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full border bg-sky-500/10 text-sky-400 border-sky-500/30">
                      {hw.skill.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">Due: {hw.dueDate}</span>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                    hw.status === 'reviewed' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                    hw.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                    hw.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-slate-500/10 text-slate-300 border-slate-500/30'
                  }`}>
                    Status: {hw.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{hw.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 bg-[#0F172A] p-3 rounded-xl border border-[#334155]">
                    {hw.prompt}
                  </p>
                </div>

                {hw.submission && (
                  <div className="text-xs text-slate-300 bg-[#0F172A] p-3 rounded-xl border border-[#334155]">
                    <span className="text-slate-400 font-bold block mb-1">Your Submission:</span>
                    {hw.submission}
                  </div>
                )}

                {hw.feedback && (
                  <div className="text-xs text-green-300 bg-green-500/10 p-3 rounded-xl border border-green-500/30">
                    <span className="font-bold block mb-1">Faculty & AI Examiner Feedback:</span>
                    {hw.feedback} {hw.score && `(Score: ${hw.score}%)`}
                  </div>
                )}

                {/* Submit Action */}
                {hw.status !== 'reviewed' && hw.status !== 'completed' && (
                  <div>
                    {submittingHwId === hw.id ? (
                      <div className="space-y-3 pt-2">
                        <textarea
                          className="w-full h-24 bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                          placeholder="Type or paste your homework response..."
                          value={submissionText}
                          onChange={e => setSubmissionText(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSubmittingHwId(null)}
                            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSubmitHomework(hw.id)}
                            className="px-4 py-1.5 bg-[#38BDF8] text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
                          >
                            <Send className="w-3 h-3" /> Submit Assignment
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => { setSubmittingHwId(hw.id); sound.playClick(); }}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" /> Submit Homework Response
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "Why This Practice?" Pedagogical Modal */}
      {activeRationaleDrill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#1E293B] border border-[#38BDF8]/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeInUp">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Explainable Pedagogical Rationale
              </div>
              <button
                onClick={() => setActiveRationaleDrill(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{activeRationaleDrill.title}</h3>
              <span className="text-xs text-slate-400">Target Area: {activeRationaleDrill.category}</span>
            </div>

            <div className="p-4 bg-[#0F172A] rounded-2xl border border-[#334155] text-xs text-slate-200 leading-relaxed font-sans">
              <p className="font-semibold text-sky-300 mb-2">Curriculum Context & Dr. Asif Kibria's Methodology:</p>
              <p>{activeRationaleDrill.pedagogicalRationale}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveRationaleDrill(null)}
                className="px-5 py-2.5 bg-[#38BDF8] text-slate-950 font-bold text-xs rounded-xl shadow"
              >
                Understood, Let's Practice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
