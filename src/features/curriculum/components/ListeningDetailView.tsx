import React, { useState, useEffect } from 'react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Award,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Volume2,
} from 'lucide-react';
import { ListeningPracticeItem } from '../../../types/curriculum';
import { WebSpeechService } from '../../../services/webSpeechService';

interface Props {
  item: ListeningPracticeItem;
}

export const ListeningDetailView: React.FC<Props> = ({ item }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    WebSpeechService.stopSpeaking();
    setIsPlaying(false);
    setAnswers({});
    setIsSubmitted(false);
    setShowTranscript(false);
  }, [item.id]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      WebSpeechService.stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      WebSpeechService.speakText(item.audio_script, () => setIsPlaying(false));
    }
  };

  const handleInputChange = (qNum: number, val: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qNum]: val }));
  };

  const calculateScore = () => {
    let score = 0;
    (item.questions || []).forEach((q) => {
      const user = (answers[q.question_number] || '').trim().toLowerCase();
      const expected = (q.correct_answer || '').trim().toLowerCase();
      if (user === expected) score++;
    });
    return score;
  };

  const totalQuestions = item.questions?.length || 0;
  const correctCount = isSubmitted ? calculateScore() : 0;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Test Header */}
      <div className="bg-[#131B2E] border border-white/10 p-6 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs px-3 py-1 rounded-xl font-mono font-black tracking-wider">
              {item.id}
            </span>
            <span className="bg-white/10 text-white border border-white/10 text-xs px-3 py-1 rounded-xl font-bold">
              Section {item.section}
            </span>
          </div>

          <span className="text-xs bg-[#0B0F19] text-slate-300 border border-white/10 px-3 py-1 rounded-xl font-medium">
            {item.context}
          </span>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{item.scenario}</h2>
          <p className="text-xs text-slate-300 mt-1">
            Official Cambridge format: Listen once to the audio, note down keywords, and fill in the missing details.
          </p>
        </div>

        {/* Evaluation Banner when Submitted */}
        {isSubmitted && (
          <div className="bg-gradient-to-r from-ielts-emerald/20 to-teal-500/10 border border-ielts-emerald/30 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-ielts-emerald" />
              <div>
                <span className="text-xs font-black text-ielts-emerald uppercase tracking-wider">
                  Listening Evaluation
                </span>
                <p className="text-sm font-bold text-white">
                  Score: {correctCount} / {totalQuestions} Correct
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setAnswers({});
                setIsSubmitted(false);
              }}
              className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>

      {/* Cambridge Audio Player Bar */}
      <div className="bg-[#101726] border border-white/10 p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleTogglePlay}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 font-black animate-pulse shadow-lg'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-liquid-glow-purple'
              }`}
            >
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </button>

            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Headphones className="w-4 h-4 text-purple-400" />
                <span>
                  {isPlaying ? 'Playing Native British English Audio...' : 'Click Play to Start Audio Track'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Spoken at standard IELTS exam rate (140 wpm). Listen once without pausing.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto"
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>{showTranscript ? 'Hide Transcript' : 'Reveal Audio Script'}</span>
          </button>
        </div>

        {/* Audio Script Drawer */}
        {showTranscript && (
          <div className="bg-[#0B0F19] p-5 rounded-2xl border border-white/10 space-y-2 animate-in fade-in">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Audio Script & Transcript:
            </span>
            <div className="text-xs text-slate-200 font-serif leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
              {item.audio_script}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Note & Form Completion Questions */}
      <div className="bg-[#101726] border border-white/10 p-6 rounded-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs font-black uppercase tracking-wider text-purple-400">
            Comprehension Questions (1–{totalQuestions})
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Answered: {Object.keys(answers).length}/{totalQuestions}
          </span>
        </div>

        <div className="space-y-4">
          {(item.questions || []).map((q) => {
            const userAns = answers[q.question_number] || '';
            const isCorrect = userAns.trim().toLowerCase() === (q.correct_answer || '').trim().toLowerCase();

            return (
              <div
                key={q.question_number}
                className={`bg-[#0B0F19] border p-4 rounded-2xl space-y-3 transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-ielts-emerald/50 bg-ielts-emerald/5'
                      : 'border-red-500/50 bg-red-500/5'
                    : 'border-white/10'
                }`}
              >
                {q.instruction && (
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    {q.instruction}
                  </span>
                )}

                <div className="flex items-start space-x-2">
                  <span className="text-xs font-black text-purple-400 mt-0.5">
                    {q.question_number}.
                  </span>
                  <p className="text-xs text-slate-100 font-medium leading-relaxed">
                    {q.question_text}
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <input
                    type="text"
                    disabled={isSubmitted}
                    value={userAns}
                    onChange={(e) => handleInputChange(q.question_number, e.target.value)}
                    placeholder="Type your answer..."
                    className="flex-1 max-w-md bg-[#131B2E] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>

                {isSubmitted && (
                  <div className="pt-2 border-t border-white/10 space-y-1 text-[11px]">
                    <div className="flex items-center space-x-1.5 font-bold">
                      {isCorrect ? (
                        <span className="text-ielts-emerald flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct!</span>
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center space-x-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Expected: <strong>{q.correct_answer}</strong></span>
                        </span>
                      )}
                    </div>

                    {q.explanation && (
                      <p className="text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-xl">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Actions */}
        <div className="pt-3 border-t border-white/10">
          {!isSubmitted ? (
            <button
              onClick={() => setIsSubmitted(true)}
              disabled={Object.keys(answers).length === 0}
              className="w-full bg-gradient-to-r from-ielts-emerald to-teal-500 text-slate-950 font-black py-3 rounded-2xl text-xs transition-all shadow-liquid-glow-emerald disabled:opacity-40"
            >
              Verify Answers ({Object.keys(answers).length}/{totalQuestions})
            </button>
          ) : (
            <button
              onClick={() => {
                setAnswers({});
                setIsSubmitted(false);
              }}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl text-xs transition-all"
            >
              Reset & Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
