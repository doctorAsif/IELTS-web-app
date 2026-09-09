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
import {
  PracticeQuestion,
  SpeakingPracticeItem,
  WritingPracticeItem,
  ReadingPracticeItem,
  ListeningPracticeItem,
} from '../../../types/curriculum';
import { WebSpeechService } from '../../../services/webSpeechService';
import { SpeakingDetailView } from '../components/SpeakingDetailView';
import { WritingDetailView } from '../components/WritingDetailView';
import { ReadingDetailView } from '../components/ReadingDetailView';
import { ListeningDetailView } from '../components/ListeningDetailView';

interface Props {
  onNavigate?: (tab: string) => void;
}

export const CurriculumPage: React.FC<Props> = ({ onNavigate }) => {
  const [bankTab, setBankTab] = useState<'comprehensive400' | 'modular1000'>('comprehensive400');
  const [selectedVolume, setSelectedVolume] = useState<1 | 2>(2);
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
      CurriculumService.setActiveVolume(selectedVolume);
      const b400 = CurriculumService.getPracticeBank400(selectedVolume);
      setBank400(b400);
      const mods = CurriculumService.getModularPractices('speaking');
      setModularItems(mods);
      
      const firstSpeaking400 = b400.find((q) => q.section === 'speaking');
      if (firstSpeaking400) setSelected400(firstSpeaking400);
      if (mods.length > 0) setSelectedModular(mods[0]);
    });
  }, []);

  const handleVolumeChange = (vol: 1 | 2) => {
    setSelectedVolume(vol);
    CurriculumService.setActiveVolume(vol);
    const b = CurriculumService.getPracticeBank400(vol);
    setBank400(b);
    const match = b.find((q) => q.section === activeSkill);
    if (match) setSelected400(match);
    setShowModelAnswer(false);
    setUserPracticeText('');
    setIsSelfEvaluated(false);
  };

  const handleSkillChange = (skill: typeof activeSkill) => {
    setActiveSkill(skill);
    const items = CurriculumService.getModularPractices(skill);
    setModularItems(items);
    setSelectedModular(items[0] || null);
    
    // Also select the first matching 400 bank item
    if (skill === 'speaking' || skill === 'writing' || skill === 'reading' || skill === 'listening') {
      const match = bank400.find((q) => q.section === skill);
      if (match) setSelected400(match);
    }

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
        q.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.instructions?.toLowerCase().includes(searchQuery.toLowerCase()))
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
              1,870+ Authentic Practices
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-300">
            Dr. ABM Asif Kibria curriculum: <strong>800 Comprehensive Exam Tests</strong> (Vol 1 Cambridge Standard + Vol 2 Bangladesh Mentor Edition) + <strong>1,071 Modular Skill Drills</strong> with Instant Non-AI Offline Evaluation.
          </p>
        </div>

        {/* Bank Mode Switcher (Comprehensive Bank vs Modular Drills) */}
        <div className="flex items-center bg-[#131B2E] border border-white/10 p-1.5 rounded-2xl shadow-liquid-card">
          <button
            onClick={() => {
              setBankTab('comprehensive400');
              setShowModelAnswer(false);
              const match = bank400.find((q) => q.section === activeSkill);
              if (match) setSelected400(match);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              bankTab === 'comprehensive400'
                ? 'bg-gradient-to-r from-ielts-emerald to-teal-600 text-slate-950 shadow-liquid-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Comprehensive Bank ({counts.totalBank})
          </button>
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
        </div>
      </div>

      {/* Volume Selector for Comprehensive Bank */}
      {bankTab === 'comprehensive400' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#131E35] via-[#101726] to-[#131E35] border border-white/10 p-3.5 rounded-2xl shadow-liquid-card">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Practice Edition:</span>
            <div className="inline-flex bg-[#0B0F19] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => handleVolumeChange(1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  selectedVolume === 1
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📘</span>
                <span>Vol 1: Cambridge Standard ({counts.bank400_v1})</span>
              </button>
              <button
                onClick={() => handleVolumeChange(2)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  selectedVolume === 2
                    ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white shadow-liquid-glow-rose'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇧🇩</span>
                <span>Vol 2: Bangladesh Mentor Edition ({counts.bank400_v2})</span>
              </button>
            </div>
          </div>
          <div className="text-[11px] font-medium flex items-center space-x-2">
            {selectedVolume === 2 ? (
              <span className="text-rose-300 bg-rose-500/15 px-2.5 py-1 rounded-lg border border-rose-500/30">
                ✨ Includes Deshi Pitfall Alerts & PPF / AREA Frameworks
              </span>
            ) : (
              <span className="text-blue-300 bg-blue-500/15 px-2.5 py-1 rounded-lg border border-blue-500/30">
                ⭐ Official Cambridge Test Structure & Band 9 Lexicon
              </span>
            )}
          </div>
        </div>
      )}

      {/* Skill Filter Bar */}
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
              {bankTab === 'comprehensive400' && (skill === 'speaking' || skill === 'writing' || skill === 'reading' || skill === 'listening') && (
                <span className="ml-1.5 opacity-60 text-[10px] font-mono">(100)</span>
              )}
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
            placeholder={`Search ${activeSkill} (${bankTab === 'comprehensive400' ? '400 Bank' : 'Modular'})...`}
            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ielts-royalPurple"
          />
        </div>
      </div>

      {/* Master 2-Pane Practice Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Practice Item Selection List (4 cols) */}
        <div className="lg:col-span-4 space-y-3 max-h-[800px] overflow-y-auto pr-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
            <span>
              {bankTab === 'comprehensive400' ? `Bank Tests (${filtered400.length})` : `Modular Drills (${filteredModular.length})`}
            </span>
            <span className="text-ielts-emerald font-mono">100% Offline Ready</span>
          </div>

          {bankTab === 'comprehensive400'
            ? filtered400.map((q, idx) => {
                const isSelected = selected400?.id === q.id;
                const spk = q.rawItem as SpeakingPracticeItem | undefined;
                const wrt = q.rawItem as WritingPracticeItem | undefined;
                const rdg = q.rawItem as ReadingPracticeItem | undefined;
                const lis = q.rawItem as ListeningPracticeItem | undefined;

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
                        ? 'border-ielts-emerald ring-1 ring-ielts-emerald/50 shadow-liquid-glow-emerald bg-[#1E293B]/90'
                        : 'hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        {q.id.startsWith('BD-') && <span className="text-xs">🇧🇩</span>}
                        <span className="font-bold text-ielts-emerald uppercase font-mono">{q.id}</span>
                      </div>
                      <span className="bg-white/10 text-slate-200 px-2 py-0.5 rounded-md font-mono text-[10px]">
                        {q.section === 'speaking'
                          ? spk?.difficulty || 'Band 6.5 - 9.0'
                          : q.section === 'writing'
                          ? `${wrt?.recommended_time_minutes || 40}m`
                          : q.section === 'reading'
                          ? `${rdg?.word_count || 350}w`
                          : `Sec ${lis?.section || 1}`}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white line-clamp-1">{q.title}</h3>
                    
                    {/* Subtitle / Preview details */}
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {q.section === 'speaking' && spk?.part_2
                        ? `Cue Card: ${spk.part_2.cue_card_topic}`
                        : q.section === 'writing' && wrt
                        ? `Task: ${wrt.task_type}`
                        : q.section === 'reading' && rdg
                        ? `Academic: ${rdg.domain}`
                        : q.section === 'listening' && lis
                        ? `Scenario: ${lis.scenario}`
                        : q.content}
                    </p>

                    {/* Collocations tags preview */}
                    {q.section === 'speaking' && spk?.band_9_lexical_resource && (
                      <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-white/5">
                        {spk.band_9_lexical_resource.slice(0, 2).map((colloc, cIdx) => (
                          <span
                            key={cIdx}
                            className="bg-[#0B0F19] text-ielts-emerald/90 text-[10px] px-2 py-0.5 rounded-md font-medium"
                          >
                            {colloc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            : filteredModular.map((m, idx) => {
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
              })}
        </div>

        {/* Right Column: Multi-Module Cambridge Practice Viewer (8 cols) */}
        <div className="lg:col-span-8 min-h-[650px]">
          {bankTab === 'comprehensive400' && selected400 ? (
            <div>
              {selected400.section === 'speaking' ? (
                <SpeakingDetailView
                  item={
                    (selected400.rawItem as SpeakingPracticeItem) ||
                    CurriculumService.getSpeakingById(selected400.id)!
                  }
                  onOpenTrainer={() => onNavigate?.('speaking')}
                />
              ) : selected400.section === 'writing' ? (
                <WritingDetailView
                  item={
                    (selected400.rawItem as WritingPracticeItem) ||
                    CurriculumService.getWritingById(selected400.id)!
                  }
                  onOpenTrainer={() => onNavigate?.('writing')}
                />
              ) : selected400.section === 'reading' ? (
                <ReadingDetailView
                  item={
                    (selected400.rawItem as ReadingPracticeItem) ||
                    CurriculumService.getReadingById(selected400.id)!
                  }
                />
              ) : selected400.section === 'listening' ? (
                <ListeningDetailView
                  item={
                    (selected400.rawItem as ListeningPracticeItem) ||
                    CurriculumService.getListeningById(selected400.id)!
                  }
                />
              ) : null}
            </div>
          ) : bankTab === 'modular1000' && selectedModular ? (
            <div className="liquid-glass-card p-6 md:p-8 rounded-3xl space-y-6 border border-white/15">
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

              {/* Student Practice Input */}
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

              {/* Action Buttons */}
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
          ) : (
            <div className="liquid-glass-card h-full flex flex-col items-center justify-center text-center p-12 text-slate-500 space-y-3 rounded-3xl border border-white/10">
              <GraduationCap className="w-14 h-14 text-slate-600" />
              <h3 className="text-base font-bold text-white">Select Any Test from the 400 Comprehensive Bank</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Browse through 100 Speaking tests, 100 Writing tasks, 100 Reading passages, and 100 Listening scenarios with interactive Cambridge evaluation!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

