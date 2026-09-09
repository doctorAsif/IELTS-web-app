import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Clock,
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { WebLlmProvider } from '../../../services/webLlmProvider';
import { IeltsTeachingRules } from '../../../services/ieltsTeachingRules';

export const WritingTrainerPage: React.FC = () => {
  const [taskType, setTaskType] = useState<'Task 1' | 'Task 2'>('Task 1');
  const [text, setText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [timerSeconds, setTimerSeconds] = useState(20 * 60);
  const [timerActive, setTimerActive] = useState(false);

  const task1Prompt = {
    title: 'The chart below shows the percentage of households with internet access in three European countries between 2010 and 2024.',
    instructions: 'Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    rules: [
      'Paragraph 1: Paraphrase the prompt.',
      'Paragraph 2 (Overview): State 2 macro trends. STRICTLY APPLY THE ZERO NUMBER RULE (no specific percentages or dates).',
      'Paragraph 3: Detailed comparison 1.',
      'Paragraph 4: Detailed comparison 2.',
    ],
  };

  const task2Prompt = {
    title: 'Some people believe that artificial intelligence will replace human educators in language teaching, while others believe that the teacher-student human bond remains irreplaceable. Discuss both views and give your opinion.',
    instructions: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    rules: [
      'Introduction: Paraphrase question & state clear thesis.',
      'Body Paragraph 1 (PEE): Point -> Explain -> Example on View A.',
      'Body Paragraph 2 (PEE): Point -> Explain -> Example on View B.',
      'Conclusion: Balanced synthesis and personal verdict.',
    ],
  };

  const activePrompt = taskType === 'Task 1' ? task1Prompt : task2Prompt;

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minWords = taskType === 'Task 1' ? 150 : 250;

  // Real-time Dr. Asif Zero Number Overview Checker for Task 1
  const paragraphs = text.split(/\n\s*\n/);
  const overviewParagraph = paragraphs.length >= 2 ? paragraphs[1] : '';
  const zeroNumberViolation =
    taskType === 'Task 1' &&
    /\b(19\d\d|20\d\d|\d+%\b|\d+\s*(percent|million|billion|thousand))\b/i.test(overviewParagraph);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((s) => s - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const handleEvaluate = async () => {
    if (wordCount < 50) {
      alert('Please write at least 50 words before requesting evaluation.');
      return;
    }

    setIsEvaluating(true);
    try {
      const prompt = IeltsTeachingRules.buildWritingEvaluationPrompt({
        taskType,
        promptText: activePrompt.title,
        studentText: text,
        targetBand: 7.5,
      });

      const result = await WebLlmProvider.getInstance().generateJson(prompt);
      setEvaluation(result);
    } catch (e) {
      console.error('Writing eval error:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Writing Trainer Room</h1>
            <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
              Zero Number Rule Validator
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Timed IELTS Academic writing simulation with Band 9 rubric evaluation & C1/C2 vocabulary diagnostics.
          </p>
        </div>

        {/* Task Selector Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          <button
            onClick={() => {
              setTaskType('Task 1');
              setText('');
              setEvaluation(null);
              setTimerSeconds(20 * 60);
              setTimerActive(false);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              taskType === 'Task 1' ? 'bg-sky-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Academic Task 1 (150w)
          </button>
          <button
            onClick={() => {
              setTaskType('Task 2');
              setText('');
              setEvaluation(null);
              setTimerSeconds(40 * 60);
              setTimerActive(false);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              taskType === 'Task 2' ? 'bg-sky-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Essay Task 2 (250w)
          </button>
        </div>
      </div>

      {/* Prompt Card & Pedagogical Architecture */}
      <div className="bg-[#0D182E] border border-slate-800 p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            {taskType === 'Task 1' ? 'IELTS Academic Writing Task 1' : 'IELTS Writing Task 2 Essay'}
          </span>
          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg font-mono">
            {taskType === 'Task 1' ? '20 Minutes' : '40 Minutes'}
          </span>
        </div>

        <h2 className="text-base font-bold text-white leading-relaxed">{activePrompt.title}</h2>
        <p className="text-xs text-slate-400 italic">{activePrompt.instructions}</p>

        {/* Dr. Asif 4-Paragraph Structure Checklist */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2">
          <span className="text-xs font-bold text-sky-300">Dr. Asif's Mandatory Paragraph Architecture:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
            {activePrompt.rules.map((rule, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-sky-400 font-bold">•</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor & Real-Time Rule Feedback */}
      <div className="bg-[#0B1327] border border-slate-800/90 p-6 rounded-3xl space-y-4">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Words:</span>
              <strong className={`font-mono text-sm ${wordCount >= minWords ? 'text-emerald-400' : 'text-amber-400'}`}>
                {wordCount} / {minWords}
              </strong>
            </div>

            {/* Zero Number Rule Real-time Warning */}
            {zeroNumberViolation && (
              <div className="flex items-center space-x-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs px-3 py-1 rounded-xl font-medium animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Zero Number Rule Violation in Paragraph 2 Overview! Remove specific numbers.</span>
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 px-3 py-1 rounded-xl text-xs text-slate-300 hover:text-white"
            >
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono">
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Begin typing your IELTS ${taskType} response here. Structure into clean paragraphs with an empty line between each paragraph...`}
          className="w-full h-80 bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-sm leading-relaxed text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 resize-y font-sans"
        />

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || wordCount < 50}
            className="flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 disabled:opacity-50 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md"
          >
            {isEvaluating ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Examiner Assessing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Essay with Edge AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Writing Diagnostic Results Card */}
      {evaluation && (
        <div className="bg-[#0D182E] border border-sky-500/30 p-6 rounded-3xl space-y-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-sky-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Official IELTS Writing Evaluation</h3>
                <p className="text-xs text-slate-400">Assessed by Dr. Asif’s Cambridge Criterion Model</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Overall Band</span>
              <div className="text-3xl font-black text-sky-400">{evaluation.overall_band || 7.0}</div>
            </div>
          </div>

          {/* 4 Criteria Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Task Achievement</span>
              <div className="text-lg font-bold text-white mt-1">{evaluation.task_achievement || 7.0}</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Coherence & Cohesion</span>
              <div className="text-lg font-bold text-white mt-1">{evaluation.coherence_cohesion || 7.0}</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Lexical Resource</span>
              <div className="text-lg font-bold text-white mt-1">{evaluation.lexical_resource || 6.5}</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Grammar Accuracy</span>
              <div className="text-lg font-bold text-white mt-1">{evaluation.grammatical_accuracy || 7.0}</div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-2xl space-y-2">
              <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Demonstrated Strengths</span>
              </span>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {evaluation.strengths?.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-2xl space-y-2">
              <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Key Areas for Correction</span>
              </span>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {evaluation.weaknesses?.map((w: string, i: number) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* C1/C2 Lexical Replacements */}
          {evaluation.suggested_vocab_c1_c2?.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-sky-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dr. Asif C1/C2 Academic Vocabulary Upgrades:</span>
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {evaluation.suggested_vocab_c1_c2.map((word: string, i: number) => (
                  <span
                    key={i}
                    className="bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs px-3 py-1 rounded-xl font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pedagogical Feedback */}
          <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block mb-1">Dr. Asif's Mentor Feedback:</strong>
            {evaluation.pedagogical_feedback}
          </div>
        </div>
      )}
    </div>
  );
};
