import React, { useState, useEffect } from 'react';
import { ReadingListeningEngine } from '../../lib/engines/ReadingListeningEngine';
import { Headphones, CheckCircle, XCircle, Loader2, Sparkles, Eye, EyeOff, Volume2 } from 'lucide-react';
import listeningData from '../../assets/database/listening_modules.json';
import { AudioPlayer } from './AudioPlayer';
import { sound } from '../../lib/audio';

interface ListeningModuleProps {
  practiceId?: string;
}

export const ListeningModule: React.FC<ListeningModuleProps> = ({ practiceId = 'AKHL-LS-001' }) => {
  const [module, setModule] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loadingExpl, setLoadingExpl] = useState<Record<string, boolean>>({});
  const [showTranscript, setShowTranscript] = useState(false);
  const [hasScored, setHasScored] = useState(false);

  useEffect(() => {
    const data = listeningData.modules.find(m => m.practiceId === practiceId);
    if (data) {
      setModule(data);
    }
  }, [practiceId]);

  if (!module) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#38BDF8]" />
        Loading Listening Practice Module...
      </div>
    );
  }

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
    setHasScored(true);
    setShowTranscript(true); // Automatically reveal synchronized transcript upon grading

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
    const questionText = module.questions.find((q: string) => q.includes(`${qNum}.`)) || `Question ${qNum}`;
    const passage = module.script.map((s: any) => `${s.speaker}: ${s.text}`).join('\n');

    try {
      const explanation = await ReadingListeningEngine.explainAnswer(
        passage,
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
    <div className="p-6 bg-[#1E293B] border border-[#334155] rounded-3xl max-w-4xl mx-auto my-6 text-white shadow-xl animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[#334155] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#06B6D4] bg-[#06B6D4]/10 px-3 py-1 rounded-full border border-[#06B6D4]/30">
            IELTS Academic Listening • {module.part}
          </span>
          <h2 className="text-2xl font-black text-white mt-2">{module.topic}</h2>
        </div>

        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-slate-300 border border-[#334155] rounded-xl text-xs font-semibold transition"
        >
          {showTranscript ? <EyeOff className="w-3.5 h-3.5 text-[#38BDF8]" /> : <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />}
          {showTranscript ? 'Hide Transcript' : 'Synchronized Transcript Reveal'}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#334155] mb-6 text-sm text-[#94A3B8]">
        <p className="font-semibold text-slate-200 mb-1">Audio Instructions:</p>
        <p>{module.instructions}</p>
      </div>

      {/* Modern Audio Player */}
      <div className="mb-6">
        <AudioPlayer
          title={`${module.topic} - Audio Track`}
          transcriptText={module.script.map((s: any) => `${s.speaker}: ${s.text}`).join('\n')}
        />
      </div>

      {/* Synchronized Audio Transcript (Hidden during test, revealed on demand or after submission) */}
      {showTranscript && (
        <div className="bg-[#0F172A] p-5 rounded-2xl border border-sky-500/30 mb-6 space-y-2.5 text-sm text-slate-200 leading-relaxed max-h-80 overflow-y-auto animate-fadeInUp">
          <div className="flex items-center justify-between border-b border-[#334155] pb-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Synchronized Exam Script Reveal
            </span>
            <span className="text-[10px] text-slate-400">Authentic British/Australian Speakers</span>
          </div>
          {module.script.map((s: any, idx: number) => (
            <p key={idx} className="p-1 rounded hover:bg-white/5 transition">
              <span className="font-semibold text-sky-300">{s.speaker}:</span> {s.text}
            </p>
          ))}
        </div>
      )}

      {/* Questions */}
      <div className="border-t border-[#334155] pt-6 space-y-6">
        <h3 className="text-lg font-bold text-white">Questions</h3>
        {module.questions.map((q: string, idx: number) => {
          const match = q.match(/(\d+)\./);
          const qNum = match ? match[1] : null;

          return (
            <div key={idx} className="bg-[#0F172A] p-5 rounded-2xl border border-[#334155] space-y-3">
              <p className="text-sm font-semibold text-slate-100">{q}</p>
              {qNum && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      className="bg-[#1E293B] border border-[#334155] rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 w-64"
                      value={userAnswers[qNum] || ''}
                      onChange={e => setUserAnswers({ ...userAnswers, [qNum]: e.target.value })}
                      placeholder="Your listening answer"
                    />

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
                        className="text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5"
                      >
                        {loadingExpl[qNum] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        {loadingExpl[qNum] ? 'Analyzing Script...' : 'AI Explain Answer'}
                      </button>
                    )}
                  </div>

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
          Check Listening Answers
        </button>
      </div>
    </div>
  );
};
