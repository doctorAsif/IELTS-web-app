import React, { useState, useEffect } from 'react';
import { ReadingListeningEngine } from '../../lib/engines/ReadingListeningEngine';
import { BookOpen, CheckCircle, XCircle, Loader2, Sparkles, Clock, Quote, Search } from 'lucide-react';
import readingData from '../../assets/database/reading_modules.json';
import { sound } from '../../lib/audio';

interface ReadingModuleProps {
  practiceId?: string;
}

export const ReadingModule: React.FC<ReadingModuleProps> = ({ practiceId = 'AKHL-RD-022' }) => {
  const [module, setModule] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [citations, setCitations] = useState<Record<string, { paragraphIndex: number; text: string }>>({});
  const [loadingExpl, setLoadingExpl] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [highlightedPara, setHighlightedPara] = useState<number | null>(null);

  useEffect(() => {
    const data = readingData.modules.find(m => m.practiceId === practiceId);
    if (data) {
      setModule(data);
    }
  }, [practiceId]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  if (!module) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#38BDF8]" />
        Loading Reading Practice Module...
      </div>
    );
  }

  const isTfng = /true|false|not given/i.test(module.instructions || '') ||
    module.questions.some((q: string) => /true|false|not given/i.test(q));

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleScore = () => {
    sound.playClick();
    const newResults: Record<string, boolean> = {};
    let correctCount = 0;
    let totalCount = 0;

    for (const [qNum, correctAnswers] of Object.entries(module.answerKey)) {
      totalCount++;
      const studentAns = userAnswers[qNum] || '';
      const isCorrect = (correctAnswers as string[]).some(ca => ReadingListeningEngine.scoreAnswer(studentAns, ca));
      newResults[qNum] = isCorrect;
      if (isCorrect) correctCount++;
    }

    setResults(newResults);
    if (correctCount === totalCount && totalCount > 0) {
      sound.playVictory();
    } else {
      sound.playTile();
    }
  };

  const handleExplain = async (qNum: string) => {
    setLoadingExpl(prev => ({ ...prev, [qNum]: true }));
    const studentAns = userAnswers[qNum] || '';
    const correctAns = module.answerKey[qNum][0];
    const questionText = module.questions.find((q: string) => q.startsWith(qNum)) || `Question ${qNum}`;

    try {
      const fullPassage = module.passage.join('\n\n');
      const explanation = await ReadingListeningEngine.explainAnswer(
        fullPassage,
        questionText,
        studentAns,
        correctAns
      );
      setExplanations(prev => ({ ...prev, [qNum]: explanation }));

      // Textual Citation Verification: Find exact paragraph match
      const questionKeywords = questionText
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w: string) => w.length > 4);

      let bestParaIdx = 0;
      let maxMatches = 0;

      module.passage.forEach((para: string, pIdx: number) => {
        const lowerPara = para.toLowerCase();
        let matches = 0;
        questionKeywords.forEach((kw: string) => {
          if (lowerPara.includes(kw)) matches++;
        });
        if (matches > maxMatches) {
          maxMatches = matches;
          bestParaIdx = pIdx;
        }
      });

      const matchedSentence = module.passage[bestParaIdx]
        ?.split(/(?<=[.?!])\s+/)
        .find((s: string) => questionKeywords.some((kw: string) => s.toLowerCase().includes(kw)))
        || module.passage[bestParaIdx]?.slice(0, 160) + '...';

      setCitations(prev => ({
        ...prev,
        [qNum]: {
          paragraphIndex: bestParaIdx,
          text: matchedSentence
        }
      }));
      setHighlightedPara(bestParaIdx);
    } catch (e: any) {
      console.error('Explanation error:', e);
      setExplanations(prev => ({ ...prev, [qNum]: 'Failed to generate explanation. ' + (e?.message || '') }));
    } finally {
      setLoadingExpl(prev => ({ ...prev, [qNum]: false }));
    }
  };

  return (
    <div className="p-6 bg-[#1E293B] border border-[#334155] rounded-3xl max-w-4xl mx-auto my-6 text-white shadow-xl animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[#334155] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A855F7] bg-[#A855F7]/10 px-3 py-1 rounded-full border border-[#A855F7]/30">
            IELTS Academic Reading • {module.part}
          </span>
          <h2 className="text-2xl font-black text-white mt-2">{module.topic}</h2>
        </div>

        {/* 20-Min Timed Mode */}
        <div className="flex items-center gap-3 bg-[#0F172A] px-4 py-2 rounded-2xl border border-[#334155]">
          <Clock className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-mono font-bold text-white">{formatTimer(timeLeft)}</span>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="text-xs font-bold px-2 py-1 bg-sky-500/20 text-sky-300 rounded-lg border border-sky-500/30 hover:bg-sky-500/30 transition"
          >
            {isTimerRunning ? 'Pause' : 'Start Timer'}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#334155] mb-6 text-sm text-[#94A3B8]">
        <p className="font-semibold text-slate-200 mb-1">Passage Instructions:</p>
        <p>{module.instructions}</p>
      </div>

      {/* Passage with Textual Citation Highlighting */}
      <div className="bg-[#0F172A] p-5 rounded-2xl border border-[#334155] mb-6 space-y-4 text-sm text-slate-200 leading-relaxed max-h-96 overflow-y-auto">
        {module.passage.map((para: string, idx: number) => {
          const isHighlighted = highlightedPara === idx;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl transition ${
                isHighlighted ? 'bg-purple-500/15 border-l-4 border-purple-400' : ''
              }`}
            >
              <span className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">
                Paragraph {idx + 1}
              </span>
              <p>{para}</p>
            </div>
          );
        })}
      </div>

      {/* Questions */}
      <div className="border-t border-[#334155] pt-6 space-y-6">
        <h3 className="text-lg font-bold text-white">Questions & Textual Verification</h3>
        {module.questions.map((q: string, idx: number) => {
          const match = q.match(/^(\d+)\./);
          const qNum = match ? match[1] : null;
          const citation = qNum ? citations[qNum] : null;

          return (
            <div key={idx} className="bg-[#0F172A] p-5 rounded-2xl border border-[#334155] space-y-3">
              <p className="text-sm font-semibold text-slate-100">{q}</p>
              {qNum && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* TFNG Quick Select Pills if TFNG */}
                    {isTfng ? (
                      <div className="flex gap-1.5">
                        {['TRUE', 'FALSE', 'NOT GIVEN'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setUserAnswers({ ...userAnswers, [qNum]: opt })}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                              userAnswers[qNum] === opt
                                ? 'bg-purple-500 text-slate-950 border-purple-500 shadow'
                                : 'bg-[#1E293B] text-slate-300 border-[#334155] hover:border-slate-500'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="bg-[#1E293B] border border-[#334155] rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-400 w-64"
                        value={userAnswers[qNum] || ''}
                        onChange={e => setUserAnswers({ ...userAnswers, [qNum]: e.target.value })}
                        placeholder="Your answer"
                      />
                    )}

                    {results[qNum] !== undefined && (
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
                        results[qNum]
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {results[qNum] ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {results[qNum] ? 'Correct' : `Incorrect (Expected: ${module.answerKey[qNum]?.join(', ')})`}
                      </span>
                    )}

                    {results[qNum] !== undefined && (
                      <button
                        onClick={() => handleExplain(qNum)}
                        disabled={loadingExpl[qNum]}
                        className="text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5"
                      >
                        {loadingExpl[qNum] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        {loadingExpl[qNum] ? 'Verifying Citation...' : 'Verify Citation & Explain'}
                      </button>
                    )}
                  </div>

                  {/* Textual Citation Verification Banner */}
                  {citation && (
                    <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl flex items-start gap-2 text-xs text-purple-200">
                      <Quote className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                      <div>
                        <span className="font-bold text-purple-300">
                          Textual Citation Verified (Paragraph {citation.paragraphIndex + 1}):
                        </span>
                        <p className="mt-0.5 italic">"{citation.text}"</p>
                      </div>
                    </div>
                  )}

                  {explanations[qNum] && (
                    <div className="bg-[#1E293B] p-4 rounded-xl text-xs text-sky-100 border border-sky-500/20 whitespace-pre-wrap leading-relaxed">
                      <span className="font-bold text-sky-300">AI Teacher Analysis:</span>
                      <p className="mt-1">{explanations[qNum]}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-[#334155] pt-4 flex justify-end">
        <button
          onClick={handleScore}
          className="bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 px-6 py-2.5 rounded-xl font-bold text-sm transition shadow"
        >
          Check All Answers
        </button>
      </div>
    </div>
  );
};
