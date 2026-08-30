import React, { useState, useEffect } from 'react';
import { WritingEngine, WritingEvaluation } from '../../lib/engines/WritingEngine';
import { PenTool, CheckCircle, Loader2 } from 'lucide-react';
import writingData from '../../assets/database/writing_modules.json';

interface WritingModuleProps {
  practiceId?: string;
}

export const WritingModule: React.FC<WritingModuleProps> = ({ practiceId = 'AKHL-WR-005' }) => {
  const [module, setModule] = useState<any>(null);
  const [essay, setEssay] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);

  useEffect(() => {
    const data = writingData.modules.find(m => m.practiceId === practiceId);
    if (data) {
      setModule(data);
    }
  }, [practiceId]);

  if (!module) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#38BDF8]" />
        Loading Writing Practice Module...
      </div>
    );
  }

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  const handleEvaluate = async () => {
    if (wordCount < 40) {
      alert('Please write at least 40 words before requesting AI grading.');
      return;
    }

    setIsEvaluating(true);
    setEvaluation(null);
    try {
      const taskPrompt = `${module.instructions}\n${module.questions}`;
      const result = await WritingEngine.evaluateEssay(essay, taskPrompt);
      setEvaluation(result);
    } catch (e: any) {
      console.error('Writing evaluation error:', e);
      alert('Failed to evaluate essay: ' + (e?.message || ''));
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="p-6 bg-[#1E293B] border border-[#334155] rounded-3xl max-w-4xl mx-auto my-6 text-white shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[#334155] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FB923C] bg-[#FB923C]/10 px-3 py-1 rounded-full border border-[#FB923C]/30">
            IELTS Writing • {module.part}
          </span>
          <h2 className="text-2xl font-black text-white mt-2">{module.topic}</h2>
        </div>
      </div>

      {/* Instructions & Prompt */}
      <div className="bg-[#0F172A] p-5 rounded-2xl border border-[#334155] mb-6">
        <p className="text-sm text-[#94A3B8] mb-2">{module.instructions}</p>
        <p className="text-base font-bold text-slate-100">{module.questions}</p>
      </div>

      {/* Essay Input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-slate-300">Your Essay Response</label>
          <span className={`text-xs font-semibold ${wordCount >= 150 ? 'text-green-400' : 'text-slate-400'}`}>
            Word count: {wordCount} (Recommended: 150-250+ words)
          </span>
        </div>
        <textarea
          className="w-full h-64 p-4 bg-[#0F172A] border border-[#334155] rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 text-sm leading-relaxed"
          placeholder="Begin typing your essay response here..."
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
        />
      </div>

      {/* Action Footer */}
      <div className="flex justify-end border-t border-[#334155] pt-4">
        <button
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="px-6 py-2.5 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 rounded-xl font-bold text-sm transition disabled:opacity-50 flex items-center gap-2"
        >
          {isEvaluating && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEvaluating ? 'Examiner is grading...' : 'Submit for AI Evaluation'}
        </button>
      </div>

      {/* Results */}
      {evaluation && (
        <div className="mt-8 bg-[#0F172A] border border-[#334155] rounded-2xl p-6 animate-fadeInUp">
          <div className="flex items-center justify-between mb-4 border-b border-[#334155] pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Writing Examiner Report
            </h3>
            <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30">
              AI-GENERATED PRACTICE ESTIMATE
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-[#1E293B] p-4 rounded-xl text-center border-t-4 border-[#FB923C] col-span-2 md:col-span-1 shadow">
              <div className="text-xs text-slate-400 font-semibold uppercase">Est. Band</div>
              <div className="text-3xl font-black text-[#FB923C] mt-1">{evaluation.estimatedBand.toFixed(1)}</div>
            </div>
            <div className="bg-[#1E293B] p-3 rounded-xl text-center">
              <div className="text-[11px] text-slate-400 font-semibold">Task Response</div>
              <div className="text-lg font-bold text-white mt-1">{evaluation.taskResponse.toFixed(1)}</div>
            </div>
            <div className="bg-[#1E293B] p-3 rounded-xl text-center">
              <div className="text-[11px] text-slate-400 font-semibold">Coherence</div>
              <div className="text-lg font-bold text-white mt-1">{evaluation.coherenceCohesion.toFixed(1)}</div>
            </div>
            <div className="bg-[#1E293B] p-3 rounded-xl text-center">
              <div className="text-[11px] text-slate-400 font-semibold">Lexical</div>
              <div className="text-lg font-bold text-white mt-1">{evaluation.lexicalResource.toFixed(1)}</div>
            </div>
            <div className="bg-[#1E293B] p-3 rounded-xl text-center">
              <div className="text-[11px] text-slate-400 font-semibold">Grammar</div>
              <div className="text-lg font-bold text-white mt-1">{evaluation.grammar.toFixed(1)}</div>
            </div>
          </div>

          <div className="space-y-4">
            {evaluation.strengths && evaluation.strengths.length > 0 && (
              <div className="bg-[#1E293B] p-4 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2">Strengths</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-200">
                  {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {evaluation.weaknesses && evaluation.weaknesses.length > 0 && (
              <div className="bg-[#1E293B] p-4 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Areas for Improvement</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-200">
                  {evaluation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}

            {evaluation.corrections && evaluation.corrections.length > 0 && (
              <div className="bg-[#1E293B] p-4 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">Specific Sentence Corrections</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-200">
                  {evaluation.corrections.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}

            {evaluation.nextPractice && evaluation.nextPractice.length > 0 && (
              <div className="bg-[#1E293B] p-4 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">Recommended Next Practice</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-200">
                  {evaluation.nextPractice.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
