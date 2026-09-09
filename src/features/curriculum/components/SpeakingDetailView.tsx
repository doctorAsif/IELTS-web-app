import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { SpeakingPracticeItem } from '../../../types/curriculum';
import { WebSpeechService } from '../../../services/webSpeechService';

interface Props {
  item: SpeakingPracticeItem;
  onOpenTrainer?: (item: SpeakingPracticeItem, part: 1 | 2 | 3) => void;
}

export const SpeakingDetailView: React.FC<Props> = ({ item, onOpenTrainer }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'part1' | 'part2' | 'part3'>('all');
  
  // 60-second Preparation Timer
  const [prepSeconds, setPrepSeconds] = useState(60);
  const [isPrepActive, setIsPrepActive] = useState(false);

  // 120-second Speech Practice Recorder
  const [speechSeconds, setSpeechSeconds] = useState(120);
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [userNotes, setUserNotes] = useState('');

  // Reset timers whenever the active item changes
  useEffect(() => {
    setPrepSeconds(60);
    setIsPrepActive(false);
    setSpeechSeconds(120);
    setIsSpeechActive(false);
    setSpeechTranscript('');
    setUserNotes('');
    WebSpeechService.stopSpeechRecognition();
    WebSpeechService.stopSpeaking();
  }, [item.id]);

  // Preparation Timer Interval
  useEffect(() => {
    let timer: any = null;
    if (isPrepActive && prepSeconds > 0) {
      timer = setInterval(() => setPrepSeconds((s) => s - 1), 1000);
    } else if (prepSeconds === 0 && isPrepActive) {
      setIsPrepActive(false);
      WebSpeechService.speakText('Preparation time is up. Please begin speaking for one to two minutes.');
    }
    return () => clearInterval(timer);
  }, [isPrepActive, prepSeconds]);

  // Speech Practice Timer Interval
  useEffect(() => {
    let timer: any = null;
    if (isSpeechActive && speechSeconds > 0) {
      timer = setInterval(() => setSpeechSeconds((s) => s - 1), 1000);
    } else if (speechSeconds === 0 && isSpeechActive) {
      handleStopSpeech();
      WebSpeechService.speakText('Thank you. That is two minutes.');
    }
    return () => clearInterval(timer);
  }, [isSpeechActive, speechSeconds]);

  const handleTogglePrep = () => {
    if (isPrepActive) {
      setIsPrepActive(false);
    } else {
      if (prepSeconds === 0) setPrepSeconds(60);
      setIsPrepActive(true);
    }
  };

  const handleResetPrep = () => {
    setIsPrepActive(false);
    setPrepSeconds(60);
  };

  const handleStartSpeech = () => {
    setSpeechSeconds(120);
    setSpeechTranscript('');
    setIsSpeechActive(true);

    const started = WebSpeechService.startSpeechRecognition(
      (text) => setSpeechTranscript(text),
      (err) => {
        console.warn('Speech error:', err);
        setIsSpeechActive(false);
      }
    );

    if (!started) {
      setIsSpeechActive(false);
    }
  };

  const handleStopSpeech = () => {
    WebSpeechService.stopSpeechRecognition();
    setIsSpeechActive(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Test Title Card */}
      <div className="bg-[#131B2E] border border-white/10 p-6 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="bg-ielts-electricBlue/20 text-ielts-electricBlue border border-ielts-electricBlue/40 text-xs px-3 py-1 rounded-xl font-mono font-black tracking-wider">
              {item.id}
            </span>
            <span className="bg-ielts-emerald/20 text-ielts-emerald border border-ielts-emerald/30 text-xs px-3 py-1 rounded-xl font-bold">
              {item.difficulty}
            </span>
          </div>

          <button
            onClick={() => {
              const fullIntro = `Speaking test on ${item.topic}. Difficulty level: ${item.difficulty}. Examiner tip: ${item.examiner_tips}`;
              WebSpeechService.speakText(fullIntro);
            }}
            className="flex items-center space-x-1.5 text-xs text-ielts-electricBlue hover:text-white bg-ielts-electricBlue/10 hover:bg-ielts-electricBlue/20 border border-ielts-electricBlue/30 px-3 py-1.5 rounded-xl transition-all"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Hear British Examiner</span>
          </button>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{item.topic}</h2>
          <p className="text-xs text-slate-300 mt-1">
            Complete Cambridge-standard Speaking test covering Introduction, Individual Long Turn (Cue Card), and Discursive Discussion.
          </p>
        </div>

        {/* Part Selection Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          {(['all', 'part1', 'part2', 'part3'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-ielts-electricBlue to-indigo-600 text-white shadow-liquid-glow-blue'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              {tab === 'all'
                ? 'Full 3-Part Test'
                : tab === 'part1'
                ? 'Part 1: Interview'
                : tab === 'part2'
                ? 'Part 2: Cue Card'
                : 'Part 3: Discussion'}
            </button>
          ))}
        </div>
      </div>

      {/* Part 1: Interview & Introduction */}
      {(activeTab === 'all' || activeTab === 'part1') && (
        <div className="bg-[#101726] border border-white/10 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-ielts-electricBlue">
                Part 1: 4–5 Minutes
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">{item.part_1.theme}</h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg">
              {item.part_1.questions.length} Questions
            </span>
          </div>

          <div className="space-y-3">
            {item.part_1.questions.map((q, idx) => (
              <div
                key={idx}
                className="bg-[#0B0F19] border border-white/5 p-3.5 rounded-2xl flex items-start justify-between gap-3 hover:border-white/15 transition-all"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-xs font-black text-ielts-electricBlue mt-0.5">Q{idx + 1}.</span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{q}</p>
                </div>
                <button
                  onClick={() => WebSpeechService.speakText(q)}
                  title="Hear Examiner Ask This Question"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-sky-500/10 border border-sky-500/20 p-3 rounded-2xl text-[11px] text-sky-200 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Dr. Asif ARE Rule:</strong> Answer directly (2-3 sentences), state the Reason, and provide a concrete Example. Do not give 1-word replies!
            </span>
          </div>
        </div>
      )}

      {/* Part 2: Candidate Cue Card & Interactive Prep Timer */}
      {(activeTab === 'all' || activeTab === 'part2') && (
        <div className="bg-[#131E35] border-2 border-ielts-royalPurple/40 p-6 md:p-8 rounded-3xl space-y-6 shadow-liquid-glow-purple relative overflow-hidden">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-ielts-royalPurple">
                  Part 2: Individual Long Turn
                </span>
                <span className="text-[10px] bg-ielts-royalPurple/20 text-purple-200 px-2 py-0.5 rounded-full font-bold">
                  Official Candidate Task Card
                </span>
              </div>
              <h3 className="text-base md:text-lg font-black text-white mt-1">
                {item.part_2.cue_card_topic}
              </h3>
            </div>

            <button
              onClick={() => {
                const text = `Candidate Task Card: ${item.part_2.cue_card_topic}. You should say: ${item.part_2.prompts.join('. ')}. And explain: ${item.part_2.follow_up_question}`;
                WebSpeechService.speakText(text);
              }}
              className="flex items-center space-x-1.5 text-xs text-purple-300 hover:text-white bg-purple-500/20 px-3 py-1.5 rounded-xl border border-purple-500/30 shrink-0 self-start sm:self-auto"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Read Task Card</span>
            </button>
          </div>

          {/* Prompts Bullet Box */}
          <div className="bg-[#0B0F19]/90 border border-white/10 p-5 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-slate-300">You should say:</span>
            <ul className="space-y-2">
              {item.part_2.prompts.map((p, idx) => (
                <li key={idx} className="text-xs text-slate-100 flex items-start space-x-2.5">
                  <span className="text-ielts-royalPurple font-black">•</span>
                  <span className="leading-relaxed font-medium">{p}</span>
                </li>
              ))}
            </ul>

            {item.part_2.follow_up_question && (
              <div className="pt-3 border-t border-white/10 text-xs text-slate-300">
                <strong className="text-ielts-electricBlue">Follow-up: </strong>
                <span>{item.part_2.follow_up_question}</span>
              </div>
            )}
          </div>

          {/* Two Interactive Practice Modules: 60s Prep Countdown & 120s Speech Recorder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 60s Prep Timer Box */}
            <div className="bg-[#0B0F19] border border-white/10 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Min Preparation Time</span>
                </span>
                <span className="font-mono text-base font-black text-amber-400">
                  {formatTime(prepSeconds)}
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                Use this minute to jot down 5W1H keywords before you begin your speech.
              </p>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTogglePrep}
                  className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isPrepActive
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isPrepActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPrepActive ? 'Pause Prep' : prepSeconds < 60 ? 'Resume' : 'Start 1-Min Prep'}</span>
                </button>
                <button
                  onClick={handleResetPrep}
                  className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 120s Speech Practice Recorder Box */}
            <div className="bg-[#0B0F19] border border-white/10 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Mic className="w-3.5 h-3.5 text-ielts-emerald" />
                  <span>2-Min Speech Drill</span>
                </span>
                <span className="font-mono text-base font-black text-ielts-emerald">
                  {formatTime(speechSeconds)}
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                Speak into your mic to test continuous speech fluency and pacing.
              </p>

              <div className="flex items-center space-x-2">
                <button
                  onClick={isSpeechActive ? handleStopSpeech : handleStartSpeech}
                  className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSpeechActive
                      ? 'bg-red-500 text-white animate-pulse shadow-md'
                      : 'bg-ielts-emerald text-slate-950 font-black shadow-liquid-glow-emerald hover:brightness-110'
                  }`}
                >
                  {isSpeechActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isSpeechActive ? 'Stop Speaking' : 'Start 2-Min Speech'}</span>
                </button>
                {onOpenTrainer && (
                  <button
                    onClick={() => onOpenTrainer(item, 2)}
                    className="p-2 bg-ielts-royalPurple/30 hover:bg-ielts-royalPurple/50 border border-ielts-royalPurple/40 text-purple-200 rounded-xl transition-colors text-xs font-bold px-3 flex items-center space-x-1"
                    title="Send to Live AI Speaking Trainer"
                  >
                    <span>Mock Room</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live Microphone Transcript Box */}
          {speechTranscript && (
            <div className="bg-[#0B0F19] border border-ielts-emerald/30 p-4 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-ielts-emerald uppercase flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Live Speech Transcription (Non-AI Offline Recognition):</span>
              </span>
              <p className="text-xs text-slate-100 font-serif leading-relaxed italic bg-white/5 p-3 rounded-xl">
                "{speechTranscript}"
              </p>
            </div>
          )}

          {/* Candidate Notes Scratchpad */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Candidate Notes Scratchpad (ARE / 5W1H Notes)
            </span>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Jot down bullet keywords: Who, What, When, Where, Why, How, Collocations..."
              className="w-full h-20 bg-[#0B0F19] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ielts-royalPurple resize-y"
            />
          </div>
        </div>
      )}

      {/* Part 3: Two-Way Discursive Discussion */}
      {(activeTab === 'all' || activeTab === 'part3') && (
        <div className="bg-[#101726] border border-white/10 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                Part 3: 4–5 Minutes
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {item.part_3.discussion_theme}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg">
              {item.part_3.questions.length} Questions
            </span>
          </div>

          <div className="space-y-3">
            {item.part_3.questions.map((q, idx) => (
              <div
                key={idx}
                className="bg-[#0B0F19] border border-white/5 p-3.5 rounded-2xl flex items-start justify-between gap-3 hover:border-white/15 transition-all"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-xs font-black text-amber-400 mt-0.5">Q{idx + 1}.</span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{q}</p>
                </div>
                <button
                  onClick={() => WebSpeechService.speakText(q)}
                  title="Hear Examiner Ask This Question"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl text-[11px] text-amber-200 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Dr. Asif Part 3 Heuristic:</strong> Move from personal anecdotes to societal perspectives. Employ hedging modal adverbs like <em>"predominantly"</em>, <em>"invariably"</em>, and <em>"it is plausible that..."</em>.
            </span>
          </div>
        </div>
      )}

      {/* Band 9 Lexical Collocations Section (Interactive Audio Pronunciation) */}
      <div className="bg-[#101726] border border-white/10 p-6 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-ielts-emerald uppercase tracking-wider flex items-center space-x-2">
            <Award className="w-4 h-4 text-ielts-emerald" />
            <span>Band 9 High-Scoring Lexical Collocations</span>
          </span>
          <span className="text-[10px] text-slate-400">Click any collocation to hear native pronunciation</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {item.band_9_lexical_resource.map((colloc, idx) => (
            <button
              key={idx}
              onClick={() => WebSpeechService.speakText(colloc)}
              className="bg-[#0B0F19] hover:bg-ielts-emerald/20 text-slate-200 hover:text-ielts-emerald border border-white/10 hover:border-ielts-emerald/40 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 group"
            >
              <span>{colloc}</span>
              <Volume2 className="w-3 h-3 opacity-50 group-hover:opacity-100 text-ielts-emerald" />
            </button>
          ))}
        </div>
      </div>

      {/* Dr. Asif Examiner Tips Box */}
      {item.examiner_tips && (
        <div className="bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-transparent border border-amber-500/30 p-5 rounded-3xl space-y-2">
          <span className="text-xs font-black text-amber-300 uppercase flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Dr. Asif's Cambridge Examiner Tip & Secret Heuristics:</span>
          </span>
          <p className="text-xs text-slate-200 leading-relaxed">
            {item.examiner_tips}
          </p>
        </div>
      )}
    </div>
  );
};
