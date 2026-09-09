import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  RotateCcw,
  Volume2,
  HelpCircle,
} from 'lucide-react';
import { ReadingPracticeItem } from '../../../types/curriculum';
import { WebSpeechService } from '../../../services/webSpeechService';

interface Props {
  item: ReadingPracticeItem;
}

export const ReadingDetailView: React.FC<Props> = ({ item }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  useEffect(() => {
    setAnswers({});
    setIsSubmitted(false);
  }, [item.id]);

  const handleSelectAnswer = (qNum: number, ans: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qNum]: ans }));
  };

  const calculateScore = () => {
    let correct = 0;
    (item.questions || []).forEach((q) => {
      const userAns = (answers[q.question_number] || '').trim().toLowerCase();
      const expected = (q.correct_answer || '').trim().toLowerCase();
      if (userAns === expected) {
        correct++;
      }
    });
    return correct;
  };

  const totalQuestions = item.questions?.length || 0;
  const correctCount = isSubmitted ? calculateScore() : 0;
  const estimatedBand = isSubmitted
    ? totalQuestions === 0
      ? 7.0
      : correctCount === totalQuestions
      ? 9.0
      : correctCount >= totalQuestions * 0.75
      ? 8.0
      : correctCount >= totalQuestions * 0.5
      ? 6.5
      : 5.5
    : null;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Test Header */}
      <div className="bg-[#131B2E] border border-white/10 p-6 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-3 py-1 rounded-xl font-mono font-black tracking-wider">
              {item.id}
            </span>
            <span className="bg-white/10 text-white border border-white/10 text-xs px-3 py-1 rounded-xl font-bold">
              {item.domain}
            </span>
            <span className="bg-[#0B0F19] text-slate-300 border border-white/10 text-xs px-2.5 py-1 rounded-xl font-mono">
              {item.word_count} words
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Font size:</span>
            {(['sm', 'base', 'lg'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  fontSize === size ? 'bg-white text-slate-950 shadow' : 'text-slate-400 hover:text-white bg-white/5'
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{item.title}</h2>
          <p className="text-xs text-slate-300 mt-1">
            Authentic Cambridge Academic Reading passage with full comprehension question sets.
          </p>
        </div>

        {/* Score Banner when Submitted */}
        {isSubmitted && (
          <div className="bg-gradient-to-r from-ielts-emerald/20 to-teal-500/10 border border-ielts-emerald/30 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-ielts-emerald" />
              <div>
                <span className="text-xs font-black text-ielts-emerald uppercase tracking-wider">
                  Test Evaluation Complete
                </span>
                <p className="text-sm font-bold text-white">
                  Score: {correctCount} / {totalQuestions} Correct (Estimated Band {estimatedBand})
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
              <span>Retry Test</span>
            </button>
          </div>
        )}
      </div>

      {/* Split-Screen: Left Pane Passage, Right Pane Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Academic Passage (7 cols) */}
        <div className="lg:col-span-7 bg-[#0D182E] border border-white/10 p-6 md:p-8 rounded-3xl space-y-4 max-h-[750px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Academic Reading Passage
            </span>
            <button
              onClick={() => WebSpeechService.speakText(item.passage.slice(0, 500))}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white bg-white/5 px-2.5 py-1 rounded-lg transition-colors"
              title="Hear passage opening"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
          </div>

          <div
            className={`space-y-4 font-serif leading-relaxed text-slate-200 ${
              fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'
            }`}
          >
            {item.passage.split('\n\n').map((para, i) => (
              <p key={i} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Right Pane: Interactive Comprehension Questions (5 cols) */}
        <div className="lg:col-span-5 bg-[#101726] border border-white/10 p-6 rounded-3xl space-y-6 max-h-[750px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-sky-400">
              Questions 1–{totalQuestions}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Answered: {Object.keys(answers).length}/{totalQuestions}
            </span>
          </div>

          <div className="space-y-5">
            {(item.questions || []).map((q) => {
              const userAns = answers[q.question_number];
              const isCorrect = (userAns || '').trim().toLowerCase() === (q.correct_answer || '').trim().toLowerCase();

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
                  <div className="flex items-start space-x-2">
                    <span className="text-xs font-black text-sky-400 mt-0.5">
                      {q.question_number}.
                    </span>
                    <p className="text-xs text-slate-100 font-medium leading-relaxed">
                      {q.question_text}
                    </p>
                  </div>

                  {/* Question Type Options */}
                  {q.type?.toUpperCase().includes('TRUE_FALSE') || q.type?.toUpperCase().includes('TFNG') ? (
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
                        <button
                          key={opt}
                          disabled={isSubmitted}
                          onClick={() => handleSelectAnswer(q.question_number, opt)}
                          className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition-all text-center ${
                            userAns === opt
                              ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : q.options && Array.isArray(q.options) && q.options.length > 0 ? (
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          disabled={isSubmitted}
                          onClick={() => handleSelectAnswer(q.question_number, opt)}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                            userAns === opt
                              ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      disabled={isSubmitted}
                      value={userAns || ''}
                      onChange={(e) => handleSelectAnswer(q.question_number, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full bg-[#131B2E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                    />
                  )}

                  {/* Cambridge Explanation & Distractor Logic when Submitted */}
                  {isSubmitted && (
                    <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px]">
                      <div className="flex items-center space-x-1.5 font-bold">
                        {isCorrect ? (
                          <span className="text-ielts-emerald flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Correct! Answer: {q.correct_answer}</span>
                          </span>
                        ) : (
                          <span className="text-red-400 flex items-center space-x-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Incorrect. Correct Answer: {q.correct_answer}</span>
                          </span>
                        )}
                      </div>

                      {q.explanation && (
                        <p className="text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-xl">
                          <strong>Explanation: </strong> {q.explanation}
                        </p>
                      )}

                      {q.distractor_logic && (
                        <p className="text-amber-300/90 leading-relaxed bg-amber-500/10 p-2.5 rounded-xl">
                          <strong>Trap / Distractor Analysis: </strong> {q.distractor_logic}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-white/10">
            {!isSubmitted ? (
              <button
                onClick={() => setIsSubmitted(true)}
                disabled={Object.keys(answers).length === 0}
                className="w-full bg-gradient-to-r from-ielts-emerald to-teal-500 text-slate-950 font-black py-3 rounded-2xl text-xs transition-all shadow-liquid-glow-emerald disabled:opacity-40"
              >
                Submit & Verify Answers ({Object.keys(answers).length}/{totalQuestions})
              </button>
            ) : (
              <button
                onClick={() => {
                  setAnswers({});
                  setIsSubmitted(false);
                }}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl text-xs transition-all"
              >
                Clear & Retry Drill
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
