import React, { useState, useEffect } from 'react';
import { WritingEngine, WritingEvaluation, WritingAnalysis } from '../../lib/engines/WritingEngine';
import { PenTool, CheckCircle, Loader2, AlertCircle, Sparkles, BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';
import writingData from '../../assets/database/writing_modules.json';

interface WritingModuleProps {
  practiceId?: string;
}

export const WritingModule: React.FC<WritingModuleProps> = ({ practiceId = 'AKHL-WR-005' }) => {
  const [module, setModule] = useState<any>(null);
  const [essay, setEssay] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [liveAnalysis, setLiveAnalysis] = useState<WritingAnalysis | null>(null);

  useEffect(() => {
    const data = writingData.modules.find(m => m.practiceId === practiceId);
    if (data) {
      setModule(data);
    }
  }, [practiceId]);

  useEffect(() => {
    if (!module) return;
    const taskPrompt = `${module.instructions}\n${module.questions}`;
    const analysis = WritingEngine.analyzeEssay(essay, taskPrompt);
    setLiveAnalysis(analysis);
  }, [essay, module]);

  if (!module) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#38BDF8]" />
        Loading Writing Practice Module...
      </div>
    );
  }

  const isTask1 = /task\s*1|graph|chart|diagram|table/i.test(module.part || '') || /task\s*1/i.test(module.topic || '');
  const minWords = isTask1 ? 150 : 250;
  const wordCount = liveAnalysis?.wordCount || 0;
  const meetsMinWords = wordCount >= minWords;

  const handleEvaluate = async () => {
    if (wordCount < 40) {
      alert(`Please write a substantive response (at least 40 words, recommended ${minWords}+) before requesting diagnostic grading.`);
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

  const handleApplyUpgrade = (original: string, suggested: string) => {
    const regex = new RegExp(`\\b${original}\\b`, 'i');
    const firstOption = suggested.split('/')[0].trim();
    setEssay(prev => prev.replace(regex, firstOption));
  };

  return (
    <div className="p-6 bg-[#1E293B] border border-[#334155] rounded-3xl max-w-4xl mx-auto my-6 text-white shadow-xl animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[#334155] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FB923C] bg-[#FB923C]/10 px-3 py-1 rounded-full border border-[#FB923C]/30">
            IELTS Academic Writing • {module.part}
          </span>
          <h2 className="text-2xl font-black text-white mt-2">{module.topic}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#94A3B8] font-semibold">
            Requirement: <span className="text-white font-bold">{minWords} words minimum</span>
          </span>
        </div>
      </div>

      {/* Instructions & Prompt */}
      <div className="bg-[#0F172A] p-5 rounded-2xl border border-[#334155] mb-6 space-y-2">
        <p className="text-xs text-[#94A3B8] uppercase font-bold tracking-wider">Exam Prompt Instructions</p>
        <p className="text-sm text-slate-200">{module.instructions}</p>
        <p className="text-base font-bold text-slate-100 pt-1 border-t border-[#334155]/60">{module.questions}</p>
      </div>

      {/* Real-time Diagnostics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Word Count Guard */}
        <div className={`p-3 rounded-2xl border text-center transition ${
          meetsMinWords
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}>
          <div className="text-[10px] font-bold uppercase">Word Count Guard</div>
          <div className="text-lg font-black mt-0.5">{wordCount} / {minWords}</div>
          <div className="text-[10px] font-medium">
            {meetsMinWords ? '✓ Meets requirement' : `${minWords - wordCount} words needed`}
          </div>
        </div>

        {/* Paragraphs */}
        <div className="p-3 rounded-2xl border bg-[#0F172A] border-[#334155] text-center">
          <div className="text-[10px] font-bold uppercase text-slate-400">Paragraphs</div>
          <div className="text-lg font-black text-white mt-0.5">{liveAnalysis?.paragraphCount || 0}</div>
          <div className="text-[10px] text-slate-400">Recommended: 4 - 5</div>
        </div>

        {/* Cohesion Markers */}
        <div className="p-3 rounded-2xl border bg-[#0F172A] border-[#334155] text-center">
          <div className="text-[10px] font-bold uppercase text-slate-400">Cohesive Linkers</div>
          <div className="text-lg font-black text-sky-400 mt-0.5">{liveAnalysis?.transitionWordsCount || 0}</div>
          <div className="text-[10px] text-slate-400">Target: 5+ devices</div>
        </div>

        {/* Task 1 Zero-Number Overview Guard */}
        <div className={`p-3 rounded-2xl border text-center transition ${
          isTask1
            ? liveAnalysis?.zeroNumberOverviewVerified
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
            : 'bg-[#0F172A] border-[#334155] text-slate-400'
        }`}>
          <div className="text-[10px] font-bold uppercase">Zero-Number Rule</div>
          <div className="text-lg font-black mt-0.5">
            {isTask1 ? (liveAnalysis?.zeroNumberOverviewVerified ? 'VALID' : 'ALERT') : 'N/A'}
          </div>
          <div className="text-[10px] font-medium">
            {isTask1 ? (liveAnalysis?.zeroNumberOverviewVerified ? 'No figures in overview' : 'Numbers in overview!') : 'Task 2 Essay'}
          </div>
        </div>
      </div>

      {/* Zero Number Overview Warning Alert */}
      {isTask1 && liveAnalysis && !liveAnalysis.zeroNumberOverviewVerified && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 rounded-2xl text-xs text-red-200 mb-4 flex items-start gap-3 animate-shake">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
          <div>
            <span className="font-bold text-red-300">Dr. Asif Kibria's IELTS Rule Violation: </span>
            <span>{liveAnalysis.zeroNumberOverviewWarning}</span>
          </div>
        </div>
      )}

      {/* Repetitive Vocabulary C1/C2 Replacement Suggestions Drawer */}
      {liveAnalysis && liveAnalysis.repetitiveWords.length > 0 && (
        <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#334155] mb-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Band 8.0+ Lexical Upgrade Opportunities
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {liveAnalysis.repetitiveWords.map((item, i) => (
              <div
                key={i}
                className="bg-[#1E293B] border border-purple-500/30 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs"
              >
                <span className="text-slate-300 font-medium">
                  "{item.word}" (x{item.count}):
                </span>
                <span className="text-purple-300 font-bold">{item.suggestions.slice(0, 2).join(' / ')}</span>
                <button
                  onClick={() => handleApplyUpgrade(item.word, item.suggestions[0])}
                  className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1"
                  title="Replace first occurrence"
                >
                  Apply <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Essay Input Textarea */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-slate-300">Your Essay Response</label>
          <span className="text-xs text-slate-400 font-semibold">
            {isTask1 ? 'Format: Intro • Overview • Body 1 • Body 2' : 'Format: Intro • Body 1 • Body 2 • Conclusion'}
          </span>
        </div>
        <textarea
          className="w-full h-72 p-4 bg-[#0F172A] border border-[#334155] rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 text-sm leading-relaxed font-sans"
          placeholder="Begin typing your IELTS essay response here..."
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
        />
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#334155] pt-4">
        <div className="text-xs text-slate-400">
          Status: {meetsMinWords ? (
            <span className="text-green-400 font-bold">Ready for grading</span>
          ) : (
            <span className="text-amber-400 font-semibold">Need {minWords - wordCount} more words to reach target length</span>
          )}
        </div>

        <button
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="px-6 py-2.5 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 rounded-xl font-bold text-sm transition disabled:opacity-50 flex items-center gap-2 shadow"
        >
          {isEvaluating && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEvaluating ? 'Examiner Grading...' : 'Submit for Diagnostic Evaluation'}
        </button>
      </div>

      {/* Evaluation Results */}
      {evaluation && (
        <div className="mt-8 bg-[#0F172A] border border-[#334155] rounded-3xl p-6 animate-fadeInUp space-y-6">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              IELTS Writing Examiner Diagnostic Report
            </h3>
            <span className="text-[10px] font-semibold text-[#FB923C] bg-[#FB923C]/10 px-2.5 py-1 rounded-full border border-[#FB923C]/30">
              ACADEMIC RUBRIC EVALUATION
            </span>
          </div>

          {/* Overall Band Hero Card */}
          <div className="bg-[#1E293B] p-5 rounded-2xl border border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FB923C]/10 border border-[#FB923C]/30 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 font-bold uppercase">Band</span>
                <span className="text-2xl font-black text-[#FB923C]">
                  {evaluation.overallBand.toFixed(1)}
                </span>
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Overall Band Score</h4>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Calibrated against TR / CC / LR / GRA official public band descriptors.
                </p>
              </div>
            </div>
            {evaluation.zeroNumberOverviewWarning && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl max-w-sm">
                <span className="text-[10px] font-bold text-red-400 block uppercase">Penalty Applied</span>
                <p className="text-xs text-red-200 mt-0.5">{evaluation.zeroNumberOverviewWarning}</p>
              </div>
            )}
          </div>

          {/* 4 Rubric Criteria Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Task Response */}
            <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase">Task Response / Achievement</span>
                <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Band {(evaluation.criteria?.taskResponse?.band ?? evaluation.taskResponse).toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {evaluation.criteria?.taskResponse?.feedback || 'Addresses the required prompt points.'}
              </p>
              <div className="pt-2 border-t border-[#334155]/60 text-[11px] text-slate-400 flex justify-between">
                <span>Words: {wordCount}</span>
                <span className={meetsMinWords ? 'text-green-400 font-bold' : 'text-amber-400 font-bold'}>
                  {meetsMinWords ? '✓ Target Met' : 'Under length penalty'}
                </span>
              </div>
            </div>

            {/* Coherence & Cohesion */}
            <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase">Coherence & Cohesion</span>
                <span className="text-xs font-black px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Band {(evaluation.criteria?.coherenceCohesion?.band ?? evaluation.coherenceCohesion).toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {evaluation.criteria?.coherenceCohesion?.feedback || 'Clear progression of ideas.'}
              </p>
              <div className="pt-2 border-t border-[#334155]/60 text-[11px] text-slate-400 flex justify-between">
                <span>Cohesion Devices: {evaluation.criteria?.coherenceCohesion?.transitionWordCount ?? liveAnalysis?.transitionWordsCount}</span>
                <span className="text-sky-400 font-bold">{evaluation.criteria?.coherenceCohesion?.cohesionRating || 'Effective'}</span>
              </div>
            </div>

            {/* Lexical Resource */}
            <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase">Lexical Resource</span>
                <span className="text-xs font-black px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  Band {(evaluation.criteria?.lexicalResource?.band ?? evaluation.lexicalResource).toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {evaluation.criteria?.lexicalResource?.feedback || 'Academic vocabulary range.'}
              </p>
              {evaluation.criteria?.lexicalResource?.c1c2Upgrades && evaluation.criteria.lexicalResource.c1c2Upgrades.length > 0 && (
                <div className="pt-2 border-t border-[#334155]/60">
                  <span className="text-[10px] text-purple-300 font-bold block mb-1">Recommended C1 Upgrades:</span>
                  <div className="flex flex-wrap gap-1">
                    {evaluation.criteria.lexicalResource.c1c2Upgrades.map((u, i) => (
                      <span key={i} className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-md border border-purple-500/20">
                        {u.original} → <b>{u.suggested}</b>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Grammatical Range & Accuracy */}
            <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase">Grammatical Range & Accuracy</span>
                <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Band {(evaluation.criteria?.grammaticalRange?.band ?? evaluation.grammar).toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {evaluation.criteria?.grammaticalRange?.feedback || 'Syntactic structure evaluation.'}
              </p>
              <div className="pt-2 border-t border-[#334155]/60 text-[11px] text-slate-400">
                Register: <span className="font-bold text-emerald-400">Strict Academic (No informal contractions)</span>
              </div>
            </div>
          </div>

          {/* Actionable Next Practice */}
          {evaluation.nextPractice && evaluation.nextPractice.length > 0 && (
            <div className="bg-[#1E293B] p-5 rounded-2xl border border-[#334155] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Next Practice Recommendations
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200 pl-4 list-disc">
                {evaluation.nextPractice.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
