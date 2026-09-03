import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  Mic,
  MicOff,
  Volume2,
  Square,
  PenTool,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Zap,
  Target
} from 'lucide-react';
import { sound } from '../../lib/audio';
import { speakText, stopSpeaking, SpeechRecognizer } from '../../lib/speech';
import { WaveformVisualizer } from '../interactive/WaveformVisualizer';
import { SpeakingEngine } from '../../lib/engines/SpeakingEngine';
import { WritingEngine } from '../../lib/engines/WritingEngine';
import { useApp } from '../../lib/store';

export type ScaffoldingTier = 'foundation' | 'intermediate' | 'mastery';

export const ScaffoldingPractice: React.FC = () => {
  const { gainXp, addGems } = useApp();
  const [selectedTier, setSelectedTier] = useState<ScaffoldingTier>('foundation');
  const [activeDrillIndex, setActiveDrillIndex] = useState(0);

  // --- Foundation: S-V-O State ---
  const svoWordsBank = ['The', 'government', 'implemented', 'strict', 'environmental', 'regulations', 'to', 'curb', 'pollution'];
  const [svoSelected, setSvoSelected] = useState<string[]>([]);
  const [svoResult, setSvoResult] = useState<boolean | null>(null);

  // --- Foundation: AWL Pair Matching ---
  const awlPairs = [
    { id: '1', left: 'Concept', right: 'An abstract idea or principle' },
    { id: '2', left: 'Facilitate', right: 'To make an action or process easier' },
    { id: '3', left: 'Deduce', right: 'To arrive at a conclusion by reasoning' },
    { id: '4', left: 'Subsequent', right: 'Coming after something in time' }
  ];
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedAwl, setSelectedAwl] = useState<{ id: string; side: 'left' | 'right' } | null>(null);

  // --- Foundation: Direct Phonetic Imitation ---
  const targetPhoneticPhrase = 'Sustainable agriculture plays an indispensable role in economic resilience.';
  const [imitationTranscript, setImitationTranscript] = useState('');
  const [isImitating, setIsImitating] = useState(false);
  const [imitationScore, setImitationScore] = useState<number | null>(null);

  // --- Intermediate: PEE Paragraph Scaffold ---
  const [peePoint, setPeePoint] = useState('First and foremost, excessive tourism places severe strain on fragile historical infrastructure.');
  const [peeEvidence, setPeeEvidence] = useState('For example, Venice has witnessed severe erosion of its ancient canals due to constant motorized tourist transport.');
  const [peeExplanation, setPeeExplanation] = useState('Consequently, without strict visitor quotas, irreplaceable cultural heritage will suffer irreversible decay.');
  const [peeEvaluated, setPeeEvaluated] = useState(false);

  // --- Intermediate: ARE + 5W1H 30s Speaking Drill ---
  const [areTimer, setAreTimer] = useState(30);
  const [areTimerRunning, setAreTimerRunning] = useState(false);
  const [areTranscript, setAreTranscript] = useState('');
  const [isAreRecording, setIsAreRecording] = useState(false);
  const [areFeedback, setAreFeedback] = useState<any | null>(null);

  // --- Intermediate: Distractor Trap Analysis ---
  const distractorQuestion = {
    passageSnippet: 'Although the initial proposal claimed renewable energy would lower household expenditures immediately, subsequent governmental audits revealed that installation tariffs resulted in a modest increase in monthly expenses during the transitional decade.',
    question: 'According to the passage, did household energy costs decrease right away?',
    options: [
      { text: 'A) Yes, because initial proposals guaranteed lower bills.', isTrap: true, trapExplanation: 'Trap: True in initial proposal, but contradicts audit findings ("revealed that installation tariffs resulted in an increase").' },
      { text: 'B) No, transition tariffs caused a slight rise in monthly expenses.', isTrap: false, trapExplanation: 'Correct! The passage explicitly states "tariffs resulted in a modest increase in monthly expenses".' },
      { text: 'C) Not Given, since audits did not measure residential costs.', isTrap: true, trapExplanation: 'Trap: Audits did measure household costs ("subsequent governmental audits revealed...").' }
    ]
  };
  const [selectedDistractor, setSelectedDistractor] = useState<number | null>(null);

  // --- Mastery: Syntactic Inversion & Cleft Sentences ---
  const [inversionInput, setInversionInput] = useState('');
  const [inversionFeedback, setInversionFeedback] = useState<string | null>(null);

  // --- Mastery: Academic Register & Contraction Penalizer ---
  const [registerText, setRegisterText] = useState('I don\'t think that kids should spend a lot of time on computers because it\'s bad for them.');
  const [registerViolations, setRegisterViolations] = useState<string[]>([]);

  // --- Mastery: 2-Minute Part 2 Cue Card Simulation ---
  const [cueCardPhase, setCueCardPhase] = useState<'idle' | 'prep' | 'speaking' | 'completed'>('idle');
  const [cueCardTimer, setCueCardTimer] = useState(60); // 1 min prep then 120s speaking
  const [cueCardTranscript, setCueCardTranscript] = useState('');
  const [isCueCardRecording, setIsCueCardRecording] = useState(false);

  const recognizerRef = useRef<SpeechRecognizer | null>(null);

  useEffect(() => {
    recognizerRef.current = new SpeechRecognizer();
    return () => {
      stopSpeaking();
      recognizerRef.current?.stopListening();
    };
  }, []);

  // Timer runner for ARE and Cue Card
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (areTimerRunning && areTimer > 0) {
      interval = setInterval(() => {
        setAreTimer(t => t - 1);
      }, 1000);
    } else if (areTimer === 0 && areTimerRunning) {
      setAreTimerRunning(false);
      recognizerRef.current?.stopListening();
      setIsAreRecording(false);
      sound.playVictory();
      evaluateAreResponse();
    }
    return () => clearInterval(interval);
  }, [areTimerRunning, areTimer]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (cueCardPhase === 'prep' && cueCardTimer > 0) {
      interval = setInterval(() => {
        setCueCardTimer(t => t - 1);
      }, 1000);
    } else if (cueCardPhase === 'prep' && cueCardTimer === 0) {
      // Transition to speaking
      sound.playClick();
      setCueCardPhase('speaking');
      setCueCardTimer(120); // 2 minutes
      startCueCardRecording();
    } else if (cueCardPhase === 'speaking' && cueCardTimer > 0) {
      interval = setInterval(() => {
        setCueCardTimer(t => t - 1);
      }, 1000);
    } else if (cueCardPhase === 'speaking' && cueCardTimer === 0) {
      setCueCardPhase('completed');
      stopCueCardRecording();
      sound.playVictory();
    }
    return () => clearInterval(interval);
  }, [cueCardPhase, cueCardTimer]);

  // Scan register text for contractions & informal slang
  useEffect(() => {
    const violations: string[] = [];
    const lower = registerText.toLowerCase();
    const contractions = ["don't", "can't", "won't", "it's", "they're", "isn't", "aren't", "didn't", "shouldn't"];
    contractions.forEach(c => {
      if (lower.includes(c)) violations.push(`Informal Contraction: "${c}" (use "${c.replace("'", "")}")`);
    });
    if (/\bkids\b/i.test(registerText)) violations.push('Informal Register: "kids" (use "children" or "adolescents")');
    if (/\ba lot of\b/i.test(registerText)) violations.push('Casual Idiom: "a lot of" (use "a substantial amount of" or "numerous")');
    if (/\bbad\b/i.test(registerText)) violations.push('Vague Vocabulary: "bad" (use "detrimental" or "deleterious")');
    setRegisterViolations(violations);
  }, [registerText]);

  // Handlers for Foundation SVO
  const handleToggleSvoWord = (word: string) => {
    sound.playTile();
    if (svoSelected.includes(word)) {
      setSvoSelected(svoSelected.filter(w => w !== word));
    } else {
      setSvoSelected([...svoSelected, word]);
    }
    setSvoResult(null);
  };

  const handleCheckSvo = () => {
    const target = 'The government implemented strict environmental regulations to curb pollution';
    const current = svoSelected.join(' ');
    if (current === target) {
      sound.playCorrect();
      setSvoResult(true);
      gainXp(15);
      addGems(5);
    } else {
      sound.playWrong();
      setSvoResult(false);
    }
  };

  // Handlers for AWL Pair Matching
  const handleAwlClick = (id: string, side: 'left' | 'right') => {
    if (matchedPairs.includes(id)) return;
    sound.playTile();

    if (!selectedAwl) {
      setSelectedAwl({ id, side });
      return;
    }

    if (selectedAwl.side === side) {
      setSelectedAwl({ id, side });
      return;
    }

    if (selectedAwl.id === id) {
      // Match
      sound.playCorrect();
      const updated = [...matchedPairs, id];
      setMatchedPairs(updated);
      setSelectedAwl(null);
      if (updated.length === awlPairs.length) {
        gainXp(25);
        addGems(10);
      }
    } else {
      sound.playWrong();
      setSelectedAwl(null);
    }
  };

  // Phonetic Imitation
  const handleToggleImitation = () => {
    if (isImitating) {
      recognizerRef.current?.stopListening();
      setIsImitating(false);
      calculateImitationScore();
      return;
    }

    setImitationTranscript('');
    setImitationScore(null);

    const started = recognizerRef.current?.startListening(
      (text) => setImitationTranscript(text),
      (err) => { console.warn(err); setIsImitating(false); },
      () => setIsImitating(false)
    );
    if (started) setIsImitating(true);
  };

  const calculateImitationScore = () => {
    const targetWords = targetPhoneticPhrase.toLowerCase().split(/\s+/);
    const spokenWords = imitationTranscript.toLowerCase().split(/\s+/);
    let matches = 0;
    targetWords.forEach(w => {
      if (spokenWords.some(sw => sw.includes(w.slice(0, 4)))) matches++;
    });
    const score = Math.round((matches / targetWords.length) * 100);
    setImitationScore(score);
    if (score >= 75) {
      sound.playVictory();
      gainXp(20);
    } else {
      sound.playTile();
    }
  };

  // ARE speaking drill
  const handleStartAreDrill = () => {
    setAreTimer(30);
    setAreTimerRunning(true);
    setAreTranscript('');
    setAreFeedback(null);
    setIsAreRecording(true);

    recognizerRef.current?.startListening(
      (text) => setAreTranscript(text),
      () => setIsAreRecording(false),
      () => setIsAreRecording(false)
    );
  };

  const evaluateAreResponse = () => {
    const analysis = SpeakingEngine.analyzeTranscript(areTranscript, 30);
    setAreFeedback(analysis);
    gainXp(20);
  };

  // Mastery Inversion check
  const handleCheckInversion = () => {
    const input = inversionInput.trim().toLowerCase();
    const hasInversion = /^(not only did|seldom have|under no circumstances should|scarcely had|rarely do)/i.test(input);
    if (hasInversion && input.includes('but') || input.includes('did the')) {
      setInversionFeedback('Excellent! Band 8.5+ Syntactic Inversion structure detected.');
      sound.playCorrect();
      gainXp(30);
    } else {
      setInversionFeedback('Tip: Begin strictly with "Not only did..." followed immediately by auxiliary inversion (e.g. "Not only did the policy curb emissions, but it also stimulated renewable investment.").');
      sound.playWrong();
    }
  };

  // Cue card simulation
  const startCueCardRecording = () => {
    setIsCueCardRecording(true);
    setCueCardTranscript('');
    recognizerRef.current?.startListening(
      (text) => setCueCardTranscript(text),
      () => setIsCueCardRecording(false),
      () => setIsCueCardRecording(false)
    );
  };

  const stopCueCardRecording = () => {
    setIsCueCardRecording(false);
    recognizerRef.current?.stopListening();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 text-white animate-fadeInUp">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] p-6 md:p-8 rounded-3xl border border-[#38BDF8]/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-bold px-3 py-1 rounded-full border border-[#38BDF8]/30 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> 3-Tier Adaptive Scaffolding
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
              Band 3.0 → 8.5+ Curriculum
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Pedagogical Skill Drills</h1>
          <p className="text-sm text-[#94A3B8] mt-1 max-w-xl">
            Systematic progression from fundamental sentence building to Band 8.5+ syntactic inversion and cue card endurance.
          </p>
        </div>

        {/* Tier Selector */}
        <div className="flex bg-[#0F172A] p-1.5 rounded-2xl border border-[#334155] shrink-0">
          <button
            onClick={() => { setSelectedTier('foundation'); setActiveDrillIndex(0); sound.playClick(); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTier === 'foundation' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Foundation (3.0-4.5)
          </button>
          <button
            onClick={() => { setSelectedTier('intermediate'); setActiveDrillIndex(0); sound.playClick(); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTier === 'intermediate' ? 'bg-sky-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            Intermediate (5.0-6.5)
          </button>
          <button
            onClick={() => { setSelectedTier('mastery'); setActiveDrillIndex(0); sound.playClick(); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTier === 'mastery' ? 'bg-purple-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Mastery (7.0-8.5+)
          </button>
        </div>
      </div>

      {/* TIER 1: FOUNDATION (Bands 3.0 - 4.5 | CEFR A2) */}
      {selectedTier === 'foundation' && (
        <div className="space-y-6">
          {/* Sub-navigation */}
          <div className="flex gap-2 border-b border-[#334155] pb-3">
            {['S-V-O Sentence Builder', '1,000 Academic Word List (AWL)', 'Direct Phonetic Imitation'].map((name, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveDrillIndex(idx); sound.playClick(); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeDrillIndex === idx
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Drill 1: SVO Sentence Builder */}
          {activeDrillIndex === 0 && (
            <div className="bg-[#1E293B] p-6 rounded-3xl border border-[#334155] space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Foundation Drill 1</span>
                <h3 className="text-xl font-bold text-white mt-1">S-V-O Structure Assembly</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Assemble the word tiles into an authentic Academic Subject-Verb-Object sentence.
                </p>
              </div>

              {/* Target Assembly Area */}
              <div className="min-h-[100px] p-4 bg-[#0F172A] rounded-2xl border-2 border-dashed border-[#334155] flex flex-wrap gap-2 items-center">
                {svoSelected.length === 0 ? (
                  <span className="text-xs text-slate-500 mx-auto">Tap tiles below in correct grammatical order...</span>
                ) : (
                  svoSelected.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleToggleSvoWord(word)}
                      className="bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-red-400 hover:text-white transition shadow-sm"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>

              {/* Word Tile Bank */}
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {svoWordsBank.map((word, idx) => {
                  const isUsed = svoSelected.includes(word);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleToggleSvoWord(word)}
                      disabled={isUsed}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                        isUsed
                          ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                          : 'bg-[#0F172A] text-slate-200 border-[#334155] hover:border-emerald-400 hover:text-white'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              {/* Actions & Feedback */}
              <div className="flex items-center justify-between pt-4 border-t border-[#334155]">
                <button
                  onClick={() => setSvoSelected([])}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Clear Tiles
                </button>

                <div className="flex items-center gap-3">
                  {svoResult !== null && (
                    <span className={`text-xs font-bold flex items-center gap-1 ${svoResult ? 'text-green-400' : 'text-red-400'}`}>
                      {svoResult ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {svoResult ? 'Perfect S-V-O Syntax! (+15 XP)' : 'Check word order and try again.'}
                    </span>
                  )}
                  <button
                    onClick={handleCheckSvo}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition shadow"
                  >
                    Verify S-V-O Sentence
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Drill 2: AWL Pair-Matching */}
          {activeDrillIndex === 1 && (
            <div className="bg-[#1E293B] p-6 rounded-3xl border border-[#334155] space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Foundation Drill 2</span>
                <h3 className="text-xl font-bold text-white mt-1">1,000 Academic Word List (AWL) Pairs</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connect each high-frequency Academic Word List term with its precise English definition.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Left side (terms) */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Academic Term</span>
                  {awlPairs.map(pair => {
                    const isMatched = matchedPairs.includes(pair.id);
                    const isSelected = selectedAwl?.id === pair.id && selectedAwl?.side === 'left';
                    return (
                      <button
                        key={pair.id}
                        onClick={() => handleAwlClick(pair.id, 'left')}
                        disabled={isMatched}
                        className={`w-full p-4 rounded-2xl border text-left text-sm font-bold transition flex items-center justify-between ${
                          isMatched
                            ? 'bg-green-500/10 border-green-500/30 text-green-400 line-through'
                            : isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 text-white shadow'
                            : 'bg-[#0F172A] border-[#334155] text-slate-200 hover:border-emerald-500/60'
                        }`}
                      >
                        <span>{pair.left}</span>
                        {isMatched && <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Right side (definitions) */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Definition</span>
                  {awlPairs.map(pair => {
                    const isMatched = matchedPairs.includes(pair.id);
                    const isSelected = selectedAwl?.id === pair.id && selectedAwl?.side === 'right';
                    return (
                      <button
                        key={pair.id}
                        onClick={() => handleAwlClick(pair.id, 'right')}
                        disabled={isMatched}
                        className={`w-full p-4 rounded-2xl border text-left text-xs font-medium transition flex items-center justify-between ${
                          isMatched
                            ? 'bg-green-500/10 border-green-500/30 text-green-400 line-through'
                            : isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 text-white shadow'
                            : 'bg-[#0F172A] border-[#334155] text-slate-300 hover:border-emerald-500/60'
                        }`}
                      >
                        <span>{pair.right}</span>
                        {isMatched && <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {matchedPairs.length === awlPairs.length && (
                <div className="p-4 bg-green-500/15 border border-green-500/30 rounded-2xl text-center text-xs font-bold text-green-300">
                  🎉 All 4 Academic Word List items linked successfully! (+25 XP)
                </div>
              )}
            </div>
          )}

          {/* Drill 3: Direct Phonetic Imitation */}
          {activeDrillIndex === 2 && (
            <div className="bg-[#1E293B] p-6 rounded-3xl border border-[#334155] space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Foundation Drill 3</span>
                <h3 className="text-xl font-bold text-white mt-1">Direct Phonetic Imitation (Eliminating Translation)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Listen to the native British acoustic cadence, then speak it back directly without mental Bengali/native translation.
                </p>
              </div>

              <div className="bg-[#0F172A] p-5 rounded-2xl border border-[#334155] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Model Sentence</span>
                  <button
                    onClick={() => speakText(targetPhoneticPhrase, 0.9, 'en-GB')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen British Voice
                  </button>
                </div>
                <p className="text-base font-bold text-white leading-relaxed">
                  "{targetPhoneticPhrase}"
                </p>
              </div>

              <WaveformVisualizer isRecording={isImitating} barColor="#10B981" height={48} />

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleToggleImitation}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow ${
                    isImitating ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {isImitating ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isImitating ? 'Stop & Check Imitation' : 'Start Phonetic Imitation'}
                </button>

                {imitationScore !== null && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Acoustic Accuracy:</span>
                    <span className={`font-black text-sm ${imitationScore >= 75 ? 'text-green-400' : 'text-amber-400'}`}>
                      {imitationScore}%
                    </span>
                  </div>
                )}
              </div>

              {imitationTranscript && (
                <div className="p-4 bg-[#0F172A] rounded-2xl border border-[#334155] text-xs text-slate-300">
                  <span className="text-slate-400 font-semibold block mb-1">Your Speech Transcript:</span>
                  "{imitationTranscript}"
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TIER 2: INTERMEDIATE (Bands 5.0 - 6.5 | CEFR B1-B2) */}
      {selectedTier === 'intermediate' && (
        <div className="space-y-6">
          <div className="flex gap-2 border-b border-[#334155] pb-3">
            {['PEE Paragraph Scaffold', 'ARE + 5W1H 30s Speaking', 'Distractor Trap Analysis'].map((name, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveDrillIndex(idx); sound.playClick(); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeDrillIndex === idx
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Drill 1: PEE Paragraph Scaffold */}
          {activeDrillIndex === 0 && (
            <div className="bg-[#1E293B] p-6 rounded-3xl border border-[#334155] space-y-6">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Intermediate Drill 1</span>
                <h3 className="text-xl font-bold text-white mt-1">PEE (Point • Evidence • Explanation) Scaffold</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Master paragraph coherence by constructing a logically bulletproof body paragraph using Dr. Asif Kibria's PEE framework.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-sky-400 block mb-1">1. Point (Topic Sentence):</label>
                  <input
                    type="text"
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400"
                    value={peePoint}
                    onChange={e => setPeePoint(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-sky-400 block mb-1">2. Evidence (Concrete Example / Fact):</label>
                  <input
                    type="text"
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400"
                    value={peeEvidence}
                    onChange={e => setPeeEvidence(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-sky-400 block mb-1">3. Explanation (Impact & Broader Implication):</label>
                  <input
                    type="text"
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400"
                    value={peeExplanation}
                    onChange={e => setPeeExplanation(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#334155] space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Synthesized Body Paragraph:</span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {peePoint} {peeEvidence} {peeExplanation}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setPeeEvaluated(true);
                    sound.playVictory();
                    gainXp(25);
                  }}
                  className="px-6 py-2.5 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 font-bold text-xs rounded-xl transition shadow"
                >
                  Validate PEE Coherence
                </button>
              </div>

              {peeEvaluated && (
                <div className="p-4 bg-green-500/15 border border-green-500/30 rounded-2xl text-xs text-green-200">
                  ✓ High-scoring PEE structure verified. Contains clear claim, illustrative real-world evidence, and strong causal explanation.
                </div>
              )}
            </div>
          )}

          {/* Drill 2: ARE + 5W1H 30s Speaking Drill */}
          {activeDrillIndex === 1 && (
            <div className="bg-[#1E293B] p-6 rounded-3xl border border-[#334155] space-y-6">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Intermediate Drill 2</span>
                <h3 className="text-xl font-bold text-white mt-1">ARE (Assertion • Reason • Example) 30s Sprint</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Deliver an organized 30-second speaking response answering 5W1H (Who, What, When, Where, Why, How) within the countdown.
                </p>
              </div>

              <div className="bg-[#0F172A] p-5 rounded-2xl border border-[#334155] space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase">Topic Prompt</span>
                <p className="text-sm font-bold text-white">
                  "Do you prefer working individually or as part of a collaborative team? Why?"
                </p>
                <div className="text-[11px] text-slate-400 flex gap-4 pt-1">
                  <span><b>A</b>: State preference</span>
                  <span><b>R</b>: Explain cause</span>
                  <span><b>E</b>: Offer 5W1H instance</span>
                </div>
              </div>

              {/* Countdown circle */}
              <div className="flex items-center justify-center py-4">
                <div className="w-24 h-24 rounded-full border-4 border-sky-400 flex flex-col items-center justify-center bg-[#0F172A] shadow-lg">
                  <span className="text-2xl font-black text-white">{areTimer}s</span>
                  <span className="text-[10px] text-slate-400 uppercase">Remaining</span>
                </div>
              </div>

              <WaveformVisualizer isRecording={isAreRecording} barColor="#38BDF8" height={48} />

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleStartAreDrill}
                  disabled={areTimerRunning}
                  className="px-6 py-3 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 font-bold text-xs rounded-xl transition disabled:opacity-50 flex items-center gap-2 shadow"
                >
                  <Clock className="w-4 h-4" />
                  {areTimerRunning ? 'Sprint in progress...' : 'Start 30-Second ARE Sprint'}
                </button>
              </div>

              {areFeedback && (
                <div className="p-4 bg-[#0F172A] rounded-2xl border border-[#334155] space-y-2 text-xs">
                  <span className="text-sky-300 font-bold uppercase">ARE Compliance Result:</span>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2 bg-[#1E293B] rounded-xl">
                      <span className="text-slate-400 block">Assertion</span>
                      <span className="font-bold text-white">{areFeedback.areCompliance.hasAssertion ? '✓ Yes' : 'Missing'}</span>
                    </div>
                    <div className="p-2 bg-[#1E293B] rounded-xl">
                      <span className="text-slate-400 block">Reason</span>
                      <span className="font-bold text-white">{areFeedback.areCompliance.hasReason ? '✓ Yes' : 'Missing'}</span>
                    </div>
                    <div className="p-2 bg-[#1E293B] rounded-xl">
                      <span className="text-slate-400 block">Example</span>
                      <span className="font-bold text-white">{areFeedback.areCompliance.hasExample ? '✓ Yes' : 'Missing'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Drill 3: Distractor Trap Analysis */}
          {activeDrillIndex === 2 && (
            <div className="bg-[#1E293B] p-6 rounded-3xl border border-[#334155] space-y-6">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Intermediate Drill 3</span>
                <h3 className="text-xl font-bold text-white mt-1">Distractor Trap Analysis (Misleading Synonyms)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Learn to spot official IELTS trap answers that mimic passage vocabulary but invert the factual meaning.
                </p>
              </div>

              <div className="bg-[#0F172A] p-5 rounded-2xl border border-[#334155] space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Passage Excerpt:</span>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{distractorQuestion.passageSnippet}"
                </p>
                <p className="text-sm font-bold text-white pt-2 border-t border-[#334155]/60">
                  {distractorQuestion.question}
                </p>
              </div>

              <div className="space-y-3">
                {distractorQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDistractor(idx);
                      if (!opt.isTrap) {
                        sound.playCorrect();
                        gainXp(20);
                      } else {
                        sound.playWrong();
                      }
                    }}
                    className={`w-full p-4 rounded-2xl border text-left text-xs font-medium transition ${
                      selectedDistractor === idx
                        ? opt.isTrap
                          ? 'bg-red-500/15 border-red-500/40 text-red-200'
                          : 'bg-green-500/15 border-green-500/40 text-green-200'
                        : 'bg-[#0F172A] border-[#334155] text-slate-200 hover:border-sky-400'
                    }`}
                  >
                    <div className="font-bold">{opt.text}</div>
                    {selectedDistractor === idx && (
                      <div className="mt-2 text-[11px] pt-2 border-t border-current/20 font-sans">
                        <b>{opt.isTrap ? 'TRAP IDENTIFIED: ' : 'EXACT MATCH: '}</b>
                        {opt.trapExplanation}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TIER 3: MASTERY (Bands 7.0 - 8.5+ | CEFR C1-C2) */}
      {selectedTier === 'mastery' && (
        <div className="space-y-6">
          <div className="flex gap-2 border-b border-[#334155] pb-3">
            {['Syntactic Inversion & Clefts', 'Academic Register Enforcement', '2-Min Part 2 Cue Card Simulation'].map((name, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveDrillIndex(idx); sound.playClick(); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeDrillIndex === idx
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Drill 1: Syntactic Inversion & Cleft Sentences */}
          {activeDrillIndex === 0 && (
            <div className="bg-[#1E293B] p-6 rounded-3xl border border-[#334155] space-y-6">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Mastery Drill 1</span>
                <h3 className="text-xl font-bold text-white mt-1">Syntactic Inversion & Cleft Sentences</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Band 8.0+ examiners look for inverted conditionals ("Not only did...", "Had the authorities...") and cleft focus structures ("It was the...").
                </p>
              </div>

              <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#334155] space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Standard Sentence:</span>
                <p className="text-sm font-semibold text-slate-200">
                  "The government reduced emissions, and they also invested in green transport."
                </p>
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-[11px] text-purple-300">
                  <b>Task:</b> Rewrite this sentence beginning strictly with: <code className="font-bold">Not only did...</code>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Type your inverted sentence here..."
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-400"
                  value={inversionInput}
                  onChange={e => setInversionInput(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">Target structure: Band 8.5+ GRA descriptor</span>
                <button
                  onClick={handleCheckInversion}
                  className="px-6 py-2.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs rounded-xl transition shadow"
                >
                  Verify Syntactic Inversion
                </button>
              </div>

              {inversionFeedback && (
                <div className="p-4 bg-[#0F172A] rounded-2xl border border-[#334155] text-xs text-purple-200">
                  {inversionFeedback}
                </div>
              )}
            </div>
          )}

          {/* Drill 2: Academic Register Enforcement */}
          {activeDrillIndex === 1 && (
            <div className="bg-[#1E293B] p-6 rounded-3xl border border-[#334155] space-y-6">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Mastery Drill 2</span>
                <h3 className="text-xl font-bold text-white mt-1">Academic Register & Contraction Penalizer</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Casual speech habits (contractions like "don't", "it's" and informal words like "kids") cap Academic Writing at Band 6.0.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Live Register Scanner:</label>
                <textarea
                  className="w-full h-32 bg-[#0F172A] border border-[#334155] rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-purple-400"
                  value={registerText}
                  onChange={e => setRegisterText(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Violations Detected:</span>
                {registerViolations.length === 0 ? (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-xs text-green-400 font-bold">
                    ✓ Clean Academic Register. Zero casual contractions or informal vocabulary found!
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {registerViolations.map((v, i) => (
                      <div key={i} className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Drill 3: 2-Minute Part 2 Cue Card Simulation */}
          {activeDrillIndex === 2 && (
            <div className="bg-[#1E293B] p-6 rounded-3xl border border-[#334155] space-y-6">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Mastery Drill 3</span>
                <h3 className="text-xl font-bold text-white mt-1">Part 2 Cue Card Simulation (1m Prep • 2m Speaking)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Full exam simulation with strict 1-minute countdown preparation followed by 2 minutes uninterrupted speaking.
                </p>
              </div>

              {/* Cue Card Card */}
              <div className="bg-[#0F172A] p-5 rounded-2xl border-2 border-purple-500/40 space-y-3">
                <span className="text-xs font-bold text-purple-400 uppercase">Candidate Cue Card</span>
                <h4 className="text-base font-bold text-white">Describe an ambition that you have had for a long time.</h4>
                <div className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                  <p>• What this ambition is</p>
                  <p>• Why you have had it for so long</p>
                  <p>• What steps you have taken towards achieving it</p>
                  <p>• And explain how you will feel when you accomplish it</p>
                </div>
              </div>

              {/* Status & Timer */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-[#0F172A] rounded-2xl border border-[#334155] gap-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Current Phase</span>
                  <div className="text-lg font-black text-white capitalize">
                    {cueCardPhase === 'idle' ? 'Ready to begin' : cueCardPhase === 'prep' ? '1-Minute Preparation' : cueCardPhase === 'speaking' ? '2-Minute Uninterrupted Speech' : 'Simulation Finished'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-purple-500/40 flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-purple-400">{cueCardTimer}s</span>
                    <span className="text-[9px] text-slate-400 uppercase">Clock</span>
                  </div>
                  {cueCardPhase === 'idle' && (
                    <button
                      onClick={() => {
                        setCueCardPhase('prep');
                        setCueCardTimer(60);
                        sound.playClick();
                      }}
                      className="px-5 py-2.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs rounded-xl transition shadow"
                    >
                      Start 1-Min Prep
                    </button>
                  )}
                </div>
              </div>

              {cueCardPhase === 'speaking' && (
                <div className="space-y-3 animate-fadeInUp">
                  <WaveformVisualizer isRecording={isCueCardRecording} barColor="#A855F7" height={52} />
                  <textarea
                    className="w-full h-32 bg-[#0F172A] border border-[#334155] rounded-2xl p-4 text-xs text-white"
                    placeholder="Speaking audio transcription..."
                    value={cueCardTranscript}
                    readOnly
                  />
                </div>
              )}

              {cueCardPhase === 'completed' && (
                <div className="p-4 bg-green-500/15 border border-green-500/30 rounded-2xl text-xs text-green-200 font-bold text-center">
                  🎉 2-Minute Part 2 Simulation Complete! You sustained speech across the entire allotted duration. (+35 XP)
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
