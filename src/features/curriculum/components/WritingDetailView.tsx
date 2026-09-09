import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Clock,
  Volume2,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WritingPracticeItem } from '../../../types/curriculum';
import { WebSpeechService } from '../../../services/webSpeechService';

interface Props {
  item: WritingPracticeItem;
  onOpenTrainer?: (item: WritingPracticeItem) => void;
}

export const WritingDetailView: React.FC<Props> = ({ item, onOpenTrainer }) => {
  const [essayText, setEssayText] = useState('');
  const [copied, setCopied] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState((item.recommended_time_minutes || 40) * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showOutline, setShowOutline] = useState(true);

  useEffect(() => {
    setEssayText('');
    setTimerSeconds((item.recommended_time_minutes || 40) * 60);
    setIsTimerRunning(false);
  }, [item.id]);

  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      timer = setInterval(() => setTimerSeconds((s) => s - 1), 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      WebSpeechService.speakText('Time is up. Please stop writing and review your task response.');
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timerSeconds]);

  const wordCount = essayText.trim().length > 0 ? essayText.trim().split(/\s+/).length : 0;
  const minWords = item.minimum_word_count || (item.task_type?.toLowerCase().includes('task 1') ? 150 : 250);
  const isWordTargetMet = wordCount >= minWords;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Test Header */}
      <div className="bg-[#131B2E] border border-white/10 p-6 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="bg-ielts-royalPurple/20 text-ielts-royalPurple border border-ielts-royalPurple/40 text-xs px-3 py-1 rounded-xl font-mono font-black tracking-wider">
              {item.id}
            </span>
            <span className="bg-white/10 text-white border border-white/10 text-xs px-3 py-1 rounded-xl font-bold">
              {item.task_type}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#0B0F19] text-amber-400 border border-amber-500/20 px-3 py-1 rounded-xl font-mono font-bold flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{item.recommended_time_minutes || 40} mins</span>
            </span>
            <span className="text-xs bg-[#0B0F19] text-ielts-emerald border border-ielts-emerald/20 px-3 py-1 rounded-xl font-bold">
              Min: {minWords} words
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{item.title}</h2>
        </div>
      </div>

      {/* Official Cambridge Prompt Box */}
      <div className="bg-[#101726] border border-white/10 p-6 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-ielts-royalPurple uppercase tracking-wider flex items-center space-x-1.5">
            <PenTool className="w-3.5 h-3.5" />
            <span>Official Task Prompt</span>
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => WebSpeechService.speakText(item.prompt)}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors"
              title="Hear British Voice Read Prompt"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
            <button
              onClick={handleCopyPrompt}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-ielts-emerald" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="bg-[#0B0F19] p-4 rounded-2xl border border-white/5 text-sm text-slate-100 font-serif leading-relaxed whitespace-pre-line">
          {item.prompt}
        </div>
      </div>

      {/* Data or Scenario Description */}
      {item.data_or_scenario_description && (
        <div className="bg-[#0D182E] border border-sky-500/20 p-5 rounded-3xl space-y-2">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Data Analysis & Scenario Context</span>
          </span>
          <div className="text-xs text-slate-200 leading-relaxed bg-[#0B0F19]/60 p-4 rounded-2xl border border-white/5 whitespace-pre-wrap">
            {item.data_or_scenario_description}
          </div>
        </div>
      )}

      {/* Suggested Paragraph Outline */}
      {item.suggested_outline && (
        <div className="bg-[#101726] border border-white/10 p-5 rounded-3xl space-y-3">
          <button
            onClick={() => setShowOutline(!showOutline)}
            className="w-full flex items-center justify-between text-xs font-black text-white uppercase tracking-wider"
          >
            <span className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Dr. Asif's Recommended Essay Structure Outline</span>
            </span>
            {showOutline ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showOutline && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {typeof item.suggested_outline === 'object' && !Array.isArray(item.suggested_outline)
                ? Object.entries(item.suggested_outline).map(([key, val], idx) => (
                    <div key={idx} className="bg-[#0B0F19] border border-white/5 p-3.5 rounded-2xl space-y-1">
                      <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{String(val)}</p>
                    </div>
                  ))
                : (
                    <div className="bg-[#0B0F19] border border-white/5 p-3.5 rounded-2xl col-span-2 text-xs text-slate-300">
                      {JSON.stringify(item.suggested_outline, null, 2)}
                    </div>
                  )}
            </div>
          )}
        </div>
      )}

      {/* Key Features to Report (Task 1) */}
      {item.key_features_to_report && (
        <div className="bg-[#101726] border border-white/10 p-5 rounded-3xl space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Key Features to Report:
          </span>
          <div className="space-y-1.5">
            {Array.isArray(item.key_features_to_report) ? (
              item.key_features_to_report.map((feat, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-slate-200">
                  <span className="text-ielts-emerald font-bold">•</span>
                  <span>{feat}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-300">{String(item.key_features_to_report)}</p>
            )}
          </div>
        </div>
      )}

      {/* High Band Vocabulary Pills */}
      {item.high_band_vocabulary && item.high_band_vocabulary.length > 0 && (
        <div className="bg-[#101726] border border-white/10 p-5 rounded-3xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-ielts-emerald uppercase tracking-wider flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Band 8–9 Academic Vocabulary & Collocations</span>
            </span>
            <span className="text-[10px] text-slate-400">Click to listen</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.high_band_vocabulary.map((vocab, idx) => (
              <button
                key={idx}
                onClick={() => WebSpeechService.speakText(vocab)}
                className="bg-[#0B0F19] hover:bg-ielts-emerald/20 text-slate-200 hover:text-ielts-emerald border border-white/10 hover:border-ielts-emerald/40 px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 group"
              >
                <span>{vocab}</span>
                <Volume2 className="w-3 h-3 opacity-50 group-hover:opacity-100 text-ielts-emerald" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Writing Workspace */}
      <div className="bg-[#101726] border border-white/10 p-6 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-black uppercase tracking-wider text-white">
              Candidate Essay Practice Editor
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                isWordTargetMet
                  ? 'bg-ielts-emerald/20 text-ielts-emerald border border-ielts-emerald/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {wordCount} / {minWords} words
            </span>
          </div>

          {/* Practice Countdown Timer */}
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-slate-300 bg-[#0B0F19] px-2.5 py-1 rounded-lg border border-white/10">
              {formatTimer(timerSeconds)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1 rounded-lg transition-colors"
            >
              {isTimerRunning ? 'Pause Timer' : 'Start Timer'}
            </button>
          </div>
        </div>

        <textarea
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          placeholder={`Type your response here. Aim for at least ${minWords} words. Remember Dr. Asif's Zero Number Rule (never use numerical digits in Task 2 except years) and precise cohesion...`}
          className="w-full h-64 bg-[#0B0F19] border border-white/10 rounded-2xl p-4 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-ielts-royalPurple font-sans leading-relaxed resize-y"
        />

        <div className="flex flex-wrap items-center justify-between pt-2 gap-3">
          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
            {isWordTargetMet ? (
              <span className="text-ielts-emerald font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Word count target reached!</span>
              </span>
            ) : (
              <span>Need {minWords - wordCount} more words to reach official requirement.</span>
            )}
          </div>

          {onOpenTrainer && (
            <button
              onClick={() => onOpenTrainer(item)}
              className="bg-gradient-to-r from-ielts-royalPurple to-indigo-600 hover:brightness-110 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-liquid-glow-purple transition-all"
            >
              Open in AI Writing Simulator
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
