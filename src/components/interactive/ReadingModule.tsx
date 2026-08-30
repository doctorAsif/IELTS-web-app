import React, { useState, useEffect } from 'react';
import { ReadingListeningEngine } from '../../lib/engines/ReadingListeningEngine';
import { BookOpen, CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react';
import readingData from '../../assets/database/reading_modules.json';

interface ReadingModuleProps {
  practiceId?: string;
}

export const ReadingModule: React.FC<ReadingModuleProps> = ({ practiceId = 'AKHL-RD-022' }) => {
  const [module, setModule] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loadingExpl, setLoadingExpl] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const data = readingData.modules.find(m => m.practiceId === practiceId);
    if (data) {
      setModule(data);
    }
  }, [practiceId]);

  if (!module) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#38BDF8]" />
        Loading Reading Practice Module...
      </div>
    );
  }

  const handleScore = () => {
    const newResults: Record<string, boolean> = {};
    for (const [qNum, correctAnswers] of Object.entries(module.answerKey)) {
      const studentAns = userAnswers[qNum] || '';
      const isCorrect = (correctAnswers as string[]).some(ca => ReadingListeningEngine.scoreAnswer(studentAns, ca));
      newResults[qNum] = isCorrect;
    }
    setResults(newResults);
  };

  const handleExplain = async (qNum: string) => {
    setLoadingExpl(prev => ({ ...prev, [qNum]: true }));
    const studentAns = userAnswers[qNum] || '';
    const correctAns = module.answerKey[qNum][0];
    const questionText = module.questions.find((q: string) => q.startsWith(qNum)) || `Question ${qNum}`;

    try {
      const explanation = await ReadingListeningEngine.explainAnswer(
        module.passage.join('\n\n'),
        questionText,
        studentAns,
        correctAns
      );
      setExplanations(prev => ({ ...prev, [qNum]: explanation }));
    } catch (e: any) {
      console.error('Explanation error:', e);
      setExplanations(prev => ({ ...prev, [qNum]: 'Failed to generate explanation. ' + (e?.message || '') }));
    } finally {
      setLoadingExpl(prev => ({ ...prev, [qNum]: false }));
    }
  };

  return (
    <div className="p-6 bg-[#1E293B] border border-[#334155] rounded-3xl max-w-4xl mx-auto my-6 text-white shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[#334155] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A855F7] bg-[#A855F7]/10 px-3 py-1 rounded-full border border-[#A855F7]/30">
            IELTS Reading • {module.part}
          </span>
          <h2 className="text-2xl font-black text-white mt-2">{module.topic}</h2>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#334155] mb-6 text-sm text-[#94A3B8]">
        <p className="font-semibold text-slate-200 mb-1">Instructions:</p>
        <p>{module.instructions}</p>
      </div>

      {/* Passage */}
      <div className="bg-[#0F172A] p-5 rounded-2xl border border-[#334155] mb-6 space-y-4 text-sm text-slate-200 leading-relaxed max-h-96 overflow-y-auto">
        {module.passage.map((para: string, idx: number) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* Questions */}
      <div className="border-t border-[#334155] pt-6 space-y-6">
        <h3 className="text-lg font-bold text-white">Questions</h3>
        {module.questions.map((q: string, idx: number) => {
          const match = q.match(/^(\d+)\./);
          const qNum = match ? match[1] : null;

          return (
            <div key={idx} className="bg-[#0F172A] p-4 rounded-2xl border border-[#334155]">
              <p className="text-sm font-medium text-slate-100 mb-3">{q}</p>
              {qNum && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      className="bg-[#1E293B] border border-[#334155] rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-sky-400 w-64"
                      value={userAnswers[qNum] || ''}
                      onChange={e => setUserAnswers({ ...userAnswers, [qNum]: e.target.value })}
                      placeholder="Your answer"
                    />

                    {results[qNum] !== undefined && (
                      <span className={`text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 ${
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
                        className="text-xs bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5"
                      >
                        {loadingExpl[qNum] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        {loadingExpl[qNum] ? 'Analyzing...' : 'AI Teacher Explain'}
                      </button>
                    )}
                  </div>

                  {explanations[qNum] && (
                    <div className="bg-[#1E293B] p-4 rounded-xl text-xs text-sky-100 border border-sky-500/20 whitespace-pre-wrap leading-relaxed">
                      <span className="font-bold text-sky-300">AI Teacher Explanation:</span>
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
          Check Answers
        </button>
      </div>
    </div>
  );
};
