import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Layers,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Zap,
  Volume2,
  Clock,
  Award,
  Search,
  Check,
} from 'lucide-react';
import { CurriculumService, PracticeModuleItem } from '../../../services/curriculumService';
import { PracticeQuestion } from '../../../types/curriculum';
import { WebSpeechService } from '../../../services/webSpeechService';

export const CurriculumPage: React.FC = () => {
  const [bankTab, setBankTab] = useState<'modular1000' | 'comprehensive400'>('modular1000');
  const [activeSkill, setActiveSkill] = useState<'speaking' | 'writing' | 'reading' | 'listening' | 'vocabulary' | 'grammar'>('speaking');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [bank400, setBank400] = useState<PracticeQuestion[]>([]);
  const [modularItems, setModularItems] = useState<PracticeModuleItem[]>([]);
  
  const [selectedModular, setSelectedModular] = useState<PracticeModuleItem | null>(null);
  const [selected400, setSelected400] = useState<PracticeQuestion | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [userPracticeText, setUserPracticeText] = useState('');
  const [isSelfEvaluated, setIsSelfEvaluated] = useState(false);

  useEffect(() => {
    CurriculumService.loadAll().then(() => {
      setBank400(CurriculumService.getPracticeBank400());
      setModularItems(CurriculumService.getModularPractices('speaking'));
    });
  }, []);

  const handleSkillChange = (skill: typeof activeSkill) => {
    setActiveSkill(skill);
    const items = CurriculumService.getModularPractices(skill);
    setModularItems(items);
    setSelectedModular(items[0] || null);
    setShowModelAnswer(false);
    setUserPracticeText('');
    setIsSelfEvaluated(false);
  };

  const counts = CurriculumService.getTotalPracticeCount();

  const filteredModular = modularItems.filter(
    (m) =>
      m.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.questionType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.instructions?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filtered400 = bank400.filter(
    (q) =>
      (activeSkill === 'vocabulary' || activeSkill === 'grammar' ? true : q.section === activeSkill) &&
      (q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header & Hero */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
              <span>IELTS Master Practice Repository</span>
            </h1>
            <span className="bg-ielts-royalPurple/20 text-ielts-royalPurple border border-ielts-royalPurple/40 text-xs px-3 py-1 rounded-full font-bold shadow-liquid-glow-purple">
              1,500+ Authentic Practices
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-300">
            Dr. ABM Asif Kibria curriculum: <strong>400 Comprehensive Exam Questions</strong> + <strong>1,071 Modular Skill Drills</strong> with Instant Non-AI Offline Evaluation.
          </p>
        </div>

        {/* Bank Mode Switcher (1000+ Modular Drills vs 400 Comprehensive Bank) */}
        <div className="flex items-center bg-[#131B2E] border border-white/10 p-1.5 rounded-2xl shadow-liquid-card">
          <button
            onClick={() => {
              setBankTab('modular1000');
              setShowModelAnswer(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              bankTab === 'modular1000'
                ? 'bg-gradient-to-r from-ielts-royalPurple to-indigo-600 text-white shadow-liquid-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1,071 Modular Drills
          </button>
          <button
            onClick={() => {
              setBankTab('comprehensive400');
              setShowModelAnswer(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              bankTab === 'comprehensive400'
                ? 'bg-gradient-to-r from-ielts-emerald to-teal-600 text-slate-950 shadow-liquid-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            400 Comprehensive Bank
          </button>
        </div>
      </div>

      {/* Skill Filter Bar (Speaking, Writing, Reading, Listening, Vocabulary, Grammar) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#131B2E]/90 border border-white/10 p-3 rounded-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['speaking', 'writing', 'reading', 'listening', 'vocabulary', 'grammar'] as const).map((skill) => (
            <button
              key={skill}
              onClick={() => handleSkillChange(skill)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeSkill === skill
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeSkill} practices...`}
            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ielts-royalPurple"
          />
        </div>
      </div>

      {/* Master 2-Pane Practice Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Practice Item Selection List */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
            <span>
              {bankTab === 'modular1000' ? `Modular Drills (${filteredModular.length})` : `Bank Questions (${filtered400.length})`}
            </span>
            <span className="text-ielts-emerald font-mono">100% Non-AI Offline Ready</span>
          </div>

          {bankTab === 'modular1000'
            ? filteredModular.map((m, idx) => {
                const isSelected = selectedModular?.practiceId === m.practiceId;
                return (
                  <div
                    key={m.practiceId || idx}
                    onClick={() => {
                      setSelectedModular(m);
                      setShowModelAnswer(false);
                      setUserPracticeText('');
                      setIsSelfEvaluated(false);
                    }}
                    className={`liquid-glass-card p-4 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'border-ielts-royalPurple ring-1 ring-ielts-royalPurple/50 shadow-liquid-glow-purple bg-[#1E293B]/80'
                        : 'hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-bold text-ielts-royalPurple uppercase">{m.part || m.skill}</span>
                      <span className="bg-white/10 text-white px-2 py-0.5 rounded-md font-mono text-[10px]">
                        Target {m.targetBand || '7.5'}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white line-clamp-1">{m.topic || m.questionType}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{m.instructions}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-white/5">
                      <span>{Array.isArray(m.questions) ? `${m.questions.length} Questions` : '1 Exercise'}</span>
                      <span className="text-ielts-emerald font-semibold">{m.difficulty || 'Advanced'}</span>
                    </div>
                  </div>
                );
              })
            : filtered400.map((q, idx) => {
                const isSelected = selected400?.id === q.id;
                return (
                  <div
                    key={q.id || idx}
                    onClick={() => {
                      setSelected400(q);
                      setShowModelAnswer(false);
                      setUserPracticeText('');
                      setIsSelfEvaluated(false);
                    }}
                    className={`liquid-glass-card p-4 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'border-ielts-emerald ring-1 ring-ielts-emerald/50 shadow-liquid-glow-emerald bg-[#1E293B]/80'
                        : 'hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-bold text-ielts-emerald uppercase">{q.section}</span>
                      <span className="bg-white/10 text-white px-2 py-0.5 rounded-md font-mono text-[10px]">
                        Band {q.difficulty_band}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white line-clamp-1">{q.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{q.content}</p>
                  </div>
                );
              })}
        </div>

        {/* Right Column: Liquid Non-AI Practice Simulator Pane */}
        <div className="lg:col-span-7 liquid-glass-card p-6 md:p-8 rounded-3xl space-y-6 min-h-[600px] border border-white/15">
          {bankTab === 'modular1000' && selectedModular ? (
            <div className="space-y-5">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold uppercase text-ielts-royalPurple tracking-wider">
                      {selectedModular.skill} • {selectedModular.part}
                    </span>
                    <span className="text-[10px] bg-ielts-emerald/20 text-ielts-emerald px-2 py-0.5 rounded-full font-bold">
                      Non-AI Offline Mode
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-1">{selectedModular.topic}</h2>
                </div>

                <span className="text-xs font-bold bg-[#0B0F19] text-white border border-white/10 px-3 py-1 rounded-xl shrink-0">
                  Target Band {selectedModular.targetBand}
                </span>
              </div>

              {/* Instructions */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Instructions</span>
                <p className="text-xs text-slate-200 bg-[#0B0F19]/80 p-3.5 rounded-2xl border border-white/5 leading-relaxed">
                  {selectedModular.instructions}
                </p>
              </div>

              {/* Individual Question Prompts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Interactive Questions / Prompts
                  </span>
                  <button
                    onClick={() => {
                      const text = Array.isArray(selectedModular.questions)
                        ? selectedModular.questions.join('. ')
                        : String(selectedModular.questions);
                      WebSpeechService.speakText(text);
                    }}
                    className="flex items-center space-x-1.5 text-xs text-ielts-electricBlue hover:text-white bg-ielts-electricBlue/10 px-3 py-1 rounded-xl transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Hear British Voice</span>
                  </button>
                </div>

                <div className="bg-[#0B0F19] p-4 rounded-2xl border border-white/10 space-y-2.5 text-xs text-slate-100">
                  {Array.isArray(selectedModular.questions) ? (
                    selectedModular.questions.map((q: string, i: number) => (
                      <div key={i} className="flex items-start space-x-2">
                        <span className="text-ielts-royalPurple font-bold">•</span>
                        <span className="leading-relaxed font-medium">{q}</span>
                      </div>
                    ))
                  ) : (
                    <p>{selectedModular.questions}</p>
                  )}
                </div>
              </div>

              {/* Student Practice Input (Instant Non-AI Self-Test) */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Your Answer / Speaking Notes (Non-AI Mode)
                </span>
                <textarea
                  value={userPracticeText}
                  onChange={(e) => setUserPracticeText(e.target.value)}
                  placeholder="Type your response here to test yourself. Structure using Dr. Asif’s ARE (Answer, Reason, Example) or 5W1H method..."
                  className="w-full h-32 bg-[#0B0F19] border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ielts-royalPurple resize-y font-sans"
                />
              </div>

              {/* Action Buttons: Show Model Answer & Non-AI Evaluation */}
              <div className="flex flex-wrap items-center justify-between pt-2 gap-3 border-t border-white/10">
                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-ielts-emerald to-teal-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-liquid-glow-emerald"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{showModelAnswer ? 'Hide Model Answer' : 'Reveal Band 9 Model Answer & Rubric'}</span>
                </button>

                <button
                  onClick={() => setIsSelfEvaluated(true)}
                  disabled={!userPracticeText.trim()}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark Drill Completed</span>
                </button>
              </div>

              {/* Model Answer & Rubric Drawer */}
              {showModelAnswer && (
                <div className="space-y-4 pt-4 animate-in fade-in">
                  {selectedModular.explanation && (
                    <div className="bg-ielts-emerald/10 border border-ielts-emerald/30 p-5 rounded-2xl space-y-2">
                      <span className="text-xs font-black text-ielts-emerald uppercase flex items-center space-x-1.5">
                        <Award className="w-4 h-4" />
                        <span>Dr. Asif Band 9 Model Explanation & Vocabulary:</span>
                      </span>
                      <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {typeof selectedModular.explanation === 'string'
                          ? selectedModular.explanation
                          : JSON.stringify(selectedModular.explanation, null, 2)}
                      </div>
                    </div>
                  )}

                  {selectedModular.rubric && (
                    <div className="bg-[#0B0F19] border border-white/10 p-4 rounded-2xl space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Official Cambridge Rubric Criteria:</span>
                      <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap font-mono">
                        {typeof selectedModular.rubric === 'string'
                          ? selectedModular.rubric
                          : JSON.stringify(selectedModular.rubric, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : bankTab === 'comprehensive400' && selected400 ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-ielts-emerald">{selected400.section} Task</span>
                  <h2 className="text-lg font-bold text-white mt-0.5">{selected400.title}</h2>
                </div>
                <span className="text-xs font-bold bg-[#0B0F19] text-white px-3 py-1 rounded-xl border border-white/10">
                  Target Band {selected400.difficulty_band}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Exam Prompt</span>
                <div className="text-sm text-slate-100 bg-[#0B0F19] p-5 rounded-2xl border border-white/10 leading-relaxed font-serif">
                  {selected400.content}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="bg-gradient-to-r from-ielts-emerald to-teal-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-liquid-glow-emerald"
                >
                  {showModelAnswer ? 'Hide Sample' : 'Show Band 9 Model Response'}
                </button>
              </div>

              {showModelAnswer && selected400.sample_response_band_9 && (
                <div className="bg-ielts-emerald/10 border border-ielts-emerald/30 p-5 rounded-2xl space-y-2 animate-in fade-in">
                  <span className="text-xs font-bold text-ielts-emerald uppercase">Dr. Asif Band 9 Model Response:</span>
                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selected400.sample_response_band_9}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-500 space-y-3">
              <GraduationCap className="w-14 h-14 text-slate-600" />
              <h3 className="text-base font-bold text-white">Select Any Practice Drill from the 1,500+ Bank</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Browse through Speaking, Writing, Reading, Listening, Vocabulary, and Grammar drills. Practice in 100% Non-AI mode with instant model answers!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
