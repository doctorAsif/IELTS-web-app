import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  Award,
  Search,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Zap,
  AlertCircle,
  ChevronRight,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { CreativeLearningService } from '../../../services/creativeLearningService';
import {
  MnemonicPoemItem,
  GrammarMasteryItem,
  BandMakeoverItem,
  StoryAdventureItem,
} from '../../../types/creativeLearning';
import { WebSpeechService } from '../../../services/webSpeechService';

export const CreativeMasteryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'poems' | 'grammar' | 'makeovers' | 'stories'>('poems');
  const [searchQuery, setSearchQuery] = useState('');

  // Data lists
  const [poems, setPoems] = useState<MnemonicPoemItem[]>([]);
  const [grammar, setGrammar] = useState<GrammarMasteryItem[]>([]);
  const [makeovers, setMakeovers] = useState<BandMakeoverItem[]>([]);
  const [stories, setStories] = useState<StoryAdventureItem[]>([]);

  // Selected items
  const [selectedPoem, setSelectedPoem] = useState<MnemonicPoemItem | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarMasteryItem | null>(null);
  const [selectedMakeover, setSelectedMakeover] = useState<BandMakeoverItem | null>(null);
  const [selectedStory, setSelectedStory] = useState<StoryAdventureItem | null>(null);

  // Filter states
  const [poemCategory, setPoemCategory] = useState<string>('All');
  const [makeoverDomain, setMakeoverDomain] = useState<string>('All');

  // Interactive reveals
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [showGrammarPracticeSolution, setShowGrammarPracticeSolution] = useState(false);
  const [showStorySolution, setShowStorySolution] = useState(false);

  useEffect(() => {
    CreativeLearningService.loadAll().then(() => {
      const p = CreativeLearningService.getPoems();
      const g = CreativeLearningService.getGrammar();
      const m = CreativeLearningService.getMakeovers();
      const s = CreativeLearningService.getStories();

      setPoems(p);
      setGrammar(g);
      setMakeovers(m);
      setStories(s);

      if (p.length > 0) setSelectedPoem(p[0]);
      if (g.length > 0) setSelectedGrammar(g[0]);
      if (m.length > 0) setSelectedMakeover(m[0]);
      if (s.length > 0) setSelectedStory(s[0]);
    });
  }, []);

  const counts = CreativeLearningService.getCounts();

  // Categories
  const poemCategories = ['All', ...Array.from(new Set(poems.map((p) => p.category)))];
  const makeoverDomains = ['All', ...Array.from(new Set(makeovers.map((m) => m.skill_domain)))];

  // Filtered lists
  const filteredPoems = poems.filter((p) => {
    const matchesCat = poemCategory === 'All' || p.category === poemCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.the_rule_explained.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.poem_verse.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredGrammar = grammar.filter((g) =>
    g.structure_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.grammatical_formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.polished_band_8_upgrade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMakeovers = makeovers.filter((m) => {
    const matchesDom = makeoverDomain === 'All' || m.skill_domain === makeoverDomain;
    const matchesSearch =
      m.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.band_8_5_masterpiece.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mentor_takeaway_rule.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDom && matchesSearch;
  });

  const filteredStories = stories.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.story_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 pb-24 animate-in fade-in">
      {/* Header & Hero */}
      <div className="bg-gradient-to-r from-[#190F2E] via-[#10172B] to-[#0A1124] border border-white/10 p-6 md:p-8 rounded-3xl shadow-liquid-card relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl md:text-3xl">✨</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                IELTS Creative Mastery Suite
              </h1>
              <span className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30 text-xs px-3 py-1 rounded-full font-bold shadow-liquid-glow-purple">
                200 Creative Units
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Dr. ABM Asif Kibria's innovative pedagogical suite: <strong>50 Mnemonic Poems</strong>, <strong>50 High-Band Grammar Blueprints</strong>, <strong>50 Band 5 to 8.5 Makeovers</strong>, and <strong>50 Academic Story Adventures</strong> designed to anchor C1/C2 English through rhythm, contrast, and narrative immersion.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-black/40 border border-white/10 px-4 py-2.5 rounded-2xl shrink-0">
            <span className="text-xl">🇧🇩</span>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Special Design</span>
              <span className="text-xs text-rose-300 font-extrabold">Deshi Mental Bridges Included</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Navigation Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-6 border-t border-white/10 mt-6">
          <button
            onClick={() => {
              setActiveTab('poems');
              setSearchQuery('');
              setShowQuizAnswer(false);
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeTab === 'poems'
                ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/20 border-pink-500/50 shadow-liquid-glow-purple text-white'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">📜</span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono">{counts.poems}</span>
            </div>
            <span className="text-xs font-bold block text-white">Mnemonic Poems</span>
            <span className="text-[10px] text-slate-400">Rhymes for Rules & Prepositions</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('grammar');
              setSearchQuery('');
              setShowGrammarPracticeSolution(false);
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeTab === 'grammar'
                ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/20 border-cyan-500/50 shadow-liquid-card text-white'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">📐</span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono">{counts.grammar}</span>
            </div>
            <span className="text-xs font-bold block text-white">Grammar Blueprints</span>
            <span className="text-[10px] text-slate-400">Formulas for Band 8+ Inversion & GRA</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('makeovers');
              setSearchQuery('');
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeTab === 'makeovers'
                ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/20 border-emerald-500/50 shadow-liquid-glow-emerald text-white'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">🚀</span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono">{counts.makeovers}</span>
            </div>
            <span className="text-xs font-bold block text-white">Band 5 ➔ 8.5 Makeovers</span>
            <span className="text-[10px] text-slate-400">Sentence Transformation Showdowns</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('stories');
              setSearchQuery('');
              setShowStorySolution(false);
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeTab === 'stories'
                ? 'bg-gradient-to-r from-amber-600/30 to-orange-600/20 border-amber-500/50 shadow-liquid-card text-white'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">📖</span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono">{counts.stories}</span>
            </div>
            <span className="text-xs font-bold block text-white">Story Adventures</span>
            <span className="text-[10px] text-slate-400">Contextual Band 9 Micro-Stories</span>
          </button>
        </div>
      </div>

      {/* Search & Sub-Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#10172B] border border-white/10 p-3 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {activeTab === 'poems' &&
            poemCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setPoemCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  poemCategory === cat
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}

          {activeTab === 'makeovers' &&
            makeoverDomains.map((dom) => (
              <button
                key={dom}
                onClick={() => setMakeoverDomain(dom)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  makeoverDomain === dom
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {dom}
              </button>
            ))}

          {activeTab === 'grammar' && (
            <span className="text-xs text-slate-400 font-semibold px-2">
              Showing 50 Mathematical Grammatical Range (GRA) Formulas
            </span>
          )}

          {activeTab === 'stories' && (
            <span className="text-xs text-slate-400 font-semibold px-2">
              Showing 50 Immersive Academic Stories with Clickable Pronunciation
            </span>
          )}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter units by keyword..."
            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* 2-Pane Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Master List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          {activeTab === 'poems' &&
            filteredPoems.map((p) => {
              const isSelected = selectedPoem?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPoem(p);
                    setShowQuizAnswer(false);
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-[#1D1435] border-pink-500/70 shadow-liquid-glow-purple ring-1 ring-pink-500/50'
                      : 'bg-[#10172B]/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-mono font-bold text-pink-400">{p.id}</span>
                    <span className="bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-bold">
                      {p.category}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">{p.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{p.the_rule_explained}</p>
                </div>
              );
            })}

          {activeTab === 'grammar' &&
            filteredGrammar.map((g) => {
              const isSelected = selectedGrammar?.id === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => {
                    setSelectedGrammar(g);
                    setShowGrammarPracticeSolution(false);
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-[#0E203B] border-cyan-500/70 shadow-liquid-card ring-1 ring-cyan-500/50'
                      : 'bg-[#10172B]/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-mono font-bold text-cyan-400">{g.id}</span>
                    <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                      {g.target_band}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">{g.structure_name}</h3>
                  <p className="text-[10px] font-mono text-slate-400 line-clamp-1 mt-0.5">{g.grammatical_formula}</p>
                </div>
              );
            })}

          {activeTab === 'makeovers' &&
            filteredMakeovers.map((m) => {
              const isSelected = selectedMakeover?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMakeover(m)}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-[#0F292B] border-emerald-500/70 shadow-liquid-glow-emerald ring-1 ring-emerald-500/50'
                      : 'bg-[#10172B]/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-mono font-bold text-emerald-400">{m.id}</span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      {m.skill_domain}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">{m.topic}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{m.mentor_takeaway_rule}</p>
                </div>
              );
            })}

          {activeTab === 'stories' &&
            filteredStories.map((s) => {
              const isSelected = selectedStory?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedStory(s);
                    setShowStorySolution(false);
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-[#291F12] border-amber-500/70 shadow-liquid-card ring-1 ring-amber-500/50'
                      : 'bg-[#10172B]/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-mono font-bold text-amber-400">{s.id}</span>
                    <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      {s.word_count} words
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">{s.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{s.theme}</p>
                </div>
              );
            })}
        </div>

        {/* Right Column: Detailed Interactive Workspace (8 Cols) */}
        <div className="lg:col-span-8">
          {/* 1. POEMS TAB DETAIL VIEW */}
          {activeTab === 'poems' && selectedPoem && (
            <div className="space-y-6">
              {/* Poem Hero Card */}
              <div className="bg-[#12192D] border border-white/10 p-6 md:p-8 rounded-3xl space-y-6 shadow-liquid-card relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center space-x-2.5 mb-1">
                      <span className="font-mono font-bold text-xs text-pink-400 bg-pink-500/20 px-2.5 py-0.5 rounded-lg border border-pink-500/30">
                        {selectedPoem.id}
                      </span>
                      <span className="text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-lg">
                        {selectedPoem.category} • {selectedPoem.poem_type}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white">{selectedPoem.title}</h2>
                  </div>

                  <button
                    onClick={() => WebSpeechService.speakText(selectedPoem.poem_verse)}
                    className="flex items-center space-x-1.5 text-xs text-pink-300 hover:text-white bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 px-3.5 py-2 rounded-xl transition-all font-bold self-start sm:self-auto shrink-0 shadow-liquid-glow-purple"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Recite Verse (TTS)</span>
                  </button>
                </div>

                {/* The Poem Typography Box */}
                <div className="bg-gradient-to-r from-[#1E1236]/90 via-[#131A30] to-[#12192D] p-6 rounded-2xl border border-pink-500/30 relative">
                  <div className="absolute top-3 right-3 opacity-20 text-3xl">📜</div>
                  <pre className="font-serif text-sm md:text-base text-pink-100 whitespace-pre-line leading-relaxed italic">
                    {selectedPoem.poem_verse}
                  </pre>
                </div>

                {/* The Rule Explained */}
                <div className="bg-[#0B0F19] border border-white/10 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>The Grammatical Rule Explained:</span>
                  </span>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                    {selectedPoem.the_rule_explained}
                  </p>
                </div>

                {/* 🇧🇩 Bengali Mentor Tip */}
                <div className="bg-gradient-to-r from-rose-500/20 via-red-500/10 to-[#0B0F19] border border-rose-500/30 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🇧🇩</span>
                    <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                      Bengali Speaker Mental Bridge:
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-rose-100 leading-relaxed font-medium">
                    {selectedPoem.bengali_mentor_tip}
                  </p>
                </div>

                {/* Quick Quiz Interactive Card */}
                <div className="bg-[#0B0F19] border border-pink-500/30 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center space-x-2">
                      <HelpCircle className="w-4 h-4 text-pink-400" />
                      <span>Interactive Retention Quiz:</span>
                    </span>
                    <button
                      onClick={() => setShowQuizAnswer(!showQuizAnswer)}
                      className="text-[11px] text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1 rounded-lg transition-colors font-semibold"
                    >
                      {showQuizAnswer ? 'Hide Solution' : 'Reveal Solution'}
                    </button>
                  </div>

                  <p className="text-xs md:text-sm text-white font-medium bg-black/40 p-3.5 rounded-xl border border-white/5">
                    {selectedPoem.quick_quiz}
                  </p>

                  {showQuizAnswer && (
                    <div className="bg-emerald-500/15 border border-emerald-500/30 p-3.5 rounded-xl text-xs text-emerald-200 animate-in fade-in flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Mastered! Review the rhyme above to lock this pattern into automatic fluency.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. GRAMMAR BLUEPRINTS DETAIL VIEW */}
          {activeTab === 'grammar' && selectedGrammar && (
            <div className="space-y-6">
              <div className="bg-[#12192D] border border-white/10 p-6 md:p-8 rounded-3xl space-y-6 shadow-liquid-card">
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-2.5 mb-1">
                    <span className="font-mono font-bold text-xs text-cyan-400 bg-cyan-500/20 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                      {selectedGrammar.id}
                    </span>
                    <span className="text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-lg">
                      Target Band: {selectedGrammar.target_band}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white">{selectedGrammar.structure_name}</h2>
                </div>

                {/* The Mathematical Formula Card */}
                <div className="bg-gradient-to-r from-cyan-950/60 via-[#0B0F19] to-cyan-950/60 border-2 border-cyan-500/40 p-5 rounded-2xl space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Mathematical Grammatical Blueprint:</span>
                  </span>
                  <div className="bg-black/60 p-4 rounded-xl font-mono text-sm md:text-base text-cyan-200 border border-cyan-500/20 font-bold">
                    {selectedGrammar.grammatical_formula}
                  </div>
                </div>

                {/* Side-by-Side Makeover Comparison (Band 5 vs Band 8) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Clunky Band 5 Draft */}
                  <div className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                      <span>🔴 Clunky Band 5.0 Draft:</span>
                      <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded-full">Basic Syntax</span>
                    </div>
                    <p className="text-xs md:text-sm text-rose-100 font-serif italic">
                      "{selectedGrammar.clunky_band_5_draft}"
                    </p>
                  </div>

                  {/* Polished Band 8 Upgrade */}
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                      <span>🟢 Polished Band 8.0+ Upgrade:</span>
                      <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">C2 Mastery</span>
                    </div>
                    <p className="text-xs md:text-sm text-emerald-100 font-serif italic font-medium">
                      "{selectedGrammar.polished_band_8_upgrade}"
                    </p>
                    <button
                      onClick={() => WebSpeechService.speakText(selectedGrammar.polished_band_8_upgrade)}
                      className="text-[11px] text-emerald-300 hover:text-white flex items-center space-x-1 pt-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Hear Native Intonation</span>
                    </button>
                  </div>
                </div>

                {/* Why Examiners Love It */}
                <div className="bg-[#0B0F19] border border-white/10 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Why Cambridge Examiners Award High GRA Scores:</span>
                  </span>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                    {selectedGrammar.why_examiners_love_it}
                  </p>
                </div>

                {/* 🇧🇩 Bengali Mental Bridge */}
                <div className="bg-gradient-to-r from-rose-500/20 via-red-500/10 to-[#0B0F19] border border-rose-500/30 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-300 flex items-center space-x-2">
                    <span className="text-base">🇧🇩</span>
                    <span>Bengali Mental Bridge:</span>
                  </span>
                  <p className="text-xs md:text-sm text-rose-100 leading-relaxed font-medium">
                    {selectedGrammar.bengali_mental_bridge}
                  </p>
                </div>

                {/* Real-World Exam Applications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#0B0F19] border border-white/10 p-4 rounded-2xl space-y-1.5">
                    <strong className="text-sky-300 block font-bold">✍️ In Writing Task 2:</strong>
                    <p className="text-slate-300 leading-relaxed">{selectedGrammar.application_in_writing}</p>
                  </div>
                  <div className="bg-[#0B0F19] border border-white/10 p-4 rounded-2xl space-y-1.5">
                    <strong className="text-purple-300 block font-bold">🎙️ In Speaking Part 3:</strong>
                    <p className="text-slate-300 leading-relaxed">{selectedGrammar.application_in_speaking}</p>
                  </div>
                </div>

                {/* Interactive Practice Exercise */}
                <div className="bg-[#0B0F19] border border-cyan-500/30 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                      Practice Transformation Exercise:
                    </span>
                    <button
                      onClick={() => setShowGrammarPracticeSolution(!showGrammarPracticeSolution)}
                      className="text-[11px] text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1 rounded-lg transition-colors font-semibold"
                    >
                      {showGrammarPracticeSolution ? 'Hide Model Solution' : 'Reveal Model Solution'}
                    </button>
                  </div>
                  <p className="text-xs md:text-sm text-white font-medium bg-black/40 p-3.5 rounded-xl border border-white/5">
                    {selectedGrammar.practice_exercise}
                  </p>
                  {showGrammarPracticeSolution && (
                    <div className="bg-emerald-500/15 border border-emerald-500/30 p-3.5 rounded-xl text-xs text-emerald-200 animate-in fade-in flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-emerald-300 font-bold mb-0.5">Model Transformation:</strong>
                        <p className="italic font-serif">Apply the exact formula above: placing the limiting adverb first, inverting the auxiliary verb before the subject.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. BAND MAKEOVERS DETAIL VIEW */}
          {activeTab === 'makeovers' && selectedMakeover && (
            <div className="space-y-6">
              <div className="bg-[#12192D] border border-white/10 p-6 md:p-8 rounded-3xl space-y-6 shadow-liquid-card">
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-2.5 mb-1">
                    <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                      {selectedMakeover.id}
                    </span>
                    <span className="text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-lg">
                      {selectedMakeover.skill_domain}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white">{selectedMakeover.topic}</h2>
                </div>

                {/* 3-Stage Transformation Timeline */}
                <div className="space-y-4">
                  {/* Stage 1: Band 5.0 */}
                  <div className="bg-gradient-to-r from-rose-500/15 via-red-500/5 to-[#0B0F19] border border-rose-500/30 p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-rose-400 flex items-center space-x-1.5">
                        <span>🔴</span>
                        <span>Stage 1: Clunky Band 5.0 Draft</span>
                      </span>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">
                        Band 5.0
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-rose-100/90 font-serif italic bg-black/30 p-3 rounded-xl">
                      "{selectedMakeover.band_5_draft}"
                    </p>
                    <div className="text-[11px] text-rose-300/80 pt-1">
                      <strong>Why this scores Band 5.0: </strong>
                      {selectedMakeover.why_band_5}
                    </div>
                  </div>

                  {/* Stage 2: Band 6.5 */}
                  <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/5 to-[#0B0F19] border border-amber-500/30 p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-amber-400 flex items-center space-x-1.5">
                        <span>🟡</span>
                        <span>Stage 2: Competent Band 6.5 Upgrade</span>
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                        Band 6.5
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-amber-100/90 font-serif italic bg-black/30 p-3 rounded-xl">
                      "{selectedMakeover.band_6_5_upgrade}"
                    </p>
                    <div className="text-[11px] text-amber-300/80 pt-1">
                      <strong>Why this scores Band 6.5: </strong>
                      {selectedMakeover.why_band_6_5}
                    </div>
                  </div>

                  {/* Stage 3: Band 8.5 Masterpiece */}
                  <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-[#0B0F19] border-2 border-emerald-500/40 p-6 rounded-2xl space-y-3 shadow-liquid-glow-emerald">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-emerald-300 flex items-center space-x-1.5">
                        <span>🟢</span>
                        <span>Stage 3: Band 8.5 Masterpiece</span>
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2.5 py-0.5 rounded-full font-extrabold">
                          Band 8.5
                        </span>
                        <button
                          onClick={() => WebSpeechService.speakText(selectedMakeover.band_8_5_masterpiece)}
                          className="flex items-center space-x-1 text-xs text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-all font-bold"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Listen</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-emerald-100 font-serif italic bg-black/40 p-4 rounded-xl border border-emerald-500/20 font-medium">
                      "{selectedMakeover.band_8_5_masterpiece}"
                    </p>
                    <div className="text-xs text-emerald-200/90 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-emerald-500/20">
                      <strong>Examiner Rubric Rationale: </strong>
                      {selectedMakeover.examiner_band_8_5_rubric_analysis}
                    </div>
                  </div>
                </div>

                {/* Dr. Asif Golden Mentor Takeaway Rule */}
                <div className="bg-gradient-to-r from-amber-500/20 to-purple-500/10 border border-amber-500/40 p-5 rounded-2xl space-y-2 shadow-liquid-card">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🎓</span>
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                      Dr. Asif's Golden Mentor Takeaway Rule:
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-200 font-semibold leading-relaxed">
                    {selectedMakeover.mentor_takeaway_rule}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. STORY ADVENTURES DETAIL VIEW */}
          {activeTab === 'stories' && selectedStory && (
            <div className="space-y-6">
              <div className="bg-[#12192D] border border-white/10 p-6 md:p-8 rounded-3xl space-y-6 shadow-liquid-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center space-x-2.5 mb-1">
                      <span className="font-mono font-bold text-xs text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                        {selectedStory.id}
                      </span>
                      <span className="text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-lg">
                        {selectedStory.theme}
                      </span>
                      <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg">
                        {selectedStory.word_count} words
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white">{selectedStory.title}</h2>
                  </div>

                  <button
                    onClick={() => WebSpeechService.speakText(selectedStory.story_text)}
                    className="flex items-center space-x-1.5 text-xs text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 px-3.5 py-2 rounded-xl transition-all font-bold self-start sm:self-auto shrink-0 shadow-liquid-card"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Narrate Story (TTS)</span>
                  </button>
                </div>

                {/* Story Reader Typography Box */}
                <div className="bg-[#0B0F19] p-6 rounded-2xl border border-white/10 space-y-4 font-serif text-sm md:text-base text-slate-200 leading-relaxed">
                  <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-amber-400 first-letter:mr-1">
                    {selectedStory.story_text}
                  </p>
                </div>

                {/* Target Band 9 Collocations Tags */}
                <div className="bg-[#0B0F19] border border-white/10 p-5 rounded-2xl space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Target Band 9 Collocations (Click to hear pronunciation):</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedStory.target_band_9_lexicon.map((lex, idx) => (
                      <button
                        key={idx}
                        onClick={() => WebSpeechService.speakText(lex)}
                        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 group"
                      >
                        <span>{lex}</span>
                        <Volume2 className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grammatical Structures Spotlight */}
                <div className="bg-[#0B0F19] border border-white/10 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Grammatical Structures Spotlight:</span>
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs">
                    {selectedStory.grammatical_structures_spotlight.map((spot, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-slate-200 flex items-start space-x-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{spot}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 🇧🇩 Bengali Mentor Moral Takeaway */}
                <div className="bg-gradient-to-r from-rose-500/20 via-red-500/10 to-[#0B0F19] border border-rose-500/30 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-300 flex items-center space-x-2">
                    <span className="text-base">🇧🇩</span>
                    <span>Mentor Moral Takeaway for IELTS Candidates:</span>
                  </span>
                  <p className="text-xs md:text-sm text-rose-100 leading-relaxed font-medium">
                    {selectedStory.bengali_mentor_takeaway}
                  </p>
                </div>

                {/* Interactive Application Challenge */}
                <div className="bg-[#0B0F19] border border-amber-500/30 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Interactive Application Challenge:
                    </span>
                    <button
                      onClick={() => setShowStorySolution(!showStorySolution)}
                      className="text-[11px] text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1 rounded-lg transition-colors font-semibold"
                    >
                      {showStorySolution ? 'Hide Challenge Hint' : 'Reveal Challenge Hint'}
                    </button>
                  </div>
                  <p className="text-xs md:text-sm text-white font-medium bg-black/40 p-3.5 rounded-xl border border-white/5">
                    {selectedStory.interactive_application_challenge}
                  </p>
                  {showStorySolution && (
                    <div className="bg-amber-500/15 border border-amber-500/30 p-3.5 rounded-xl text-xs text-amber-200 animate-in fade-in flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Challenge your mind: Jot down your rewritten sentence in a notebook and read it aloud with confident, natural pauses.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
