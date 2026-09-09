import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { WebSpeechService } from '../../../services/webSpeechService';
import { WebLlmProvider } from '../../../services/webLlmProvider';
import { IeltsTeachingRules } from '../../../services/ieltsTeachingRules';

export const SpeakingTrainerPage: React.FC = () => {
  const [activePart, setActivePart] = useState<1 | 2 | 3>(2);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  const cueCardTopic = {
    title: 'Describe an ambitious project or goal you achieved successfully.',
    prompts: [
      'What the project or goal was',
      'Why you decided to undertake it (5W1H: Why)',
      'What difficulties or hurdles you encountered (5W1H: What/How)',
      'And explain how you felt when you successfully completed it.',
    ],
  };

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((s) => s - 1), 1000);
    } else if (timerSeconds === 0 && timerActive) {
      handleStopRecording();
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const handleStartRecording = () => {
    setEvaluation(null);
    setTranscript('');
    setTimerSeconds(activePart === 2 ? 120 : 60);
    setTimerActive(true);

    const started = WebSpeechService.startSpeechRecognition(
      (text) => {
        setTranscript(text);
      },
      (err) => {
        alert(err);
        setTimerActive(false);
        setIsRecording(false);
      }
    );

    if (started) {
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    WebSpeechService.stopSpeechRecognition();
    setIsRecording(false);
    setTimerActive(false);
  };

  const handleExaminerSpeak = () => {
    const textToSpeak =
      activePart === 2
        ? `Here is your cue card: ${cueCardTopic.title}. You have one to two minutes for this, so please begin speaking.`
        : 'Do you work or are you a student? Remember to use the ARE structure: Answer, Reason, and Example.';
    WebSpeechService.speakText(textToSpeak);
  };

  const handleEvaluate = async () => {
    if (!transcript.trim()) {
      alert('Please speak and record your response first.');
      return;
    }

    setIsEvaluating(true);
    try {
      const prompt = IeltsTeachingRules.buildSpeakingEvaluationPrompt({
        partNumber: activePart,
        topicQuestion: cueCardTopic.title,
        transcribedSpeech: transcript,
        targetBand: 7.5,
      });

      const result = await WebLlmProvider.getInstance().generateJson(prompt);
      setEvaluation(result);
    } catch (e) {
      console.error('Speaking eval error:', e);
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
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Speaking Trainer Room</h1>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
              4-Criteria Examiner
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time microphone transcription with Dr. Asif’s ARE method & 5W1H narrative feedback.
          </p>
        </div>

        {/* Part Selector Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          {([1, 2, 3] as const).map((part) => (
            <button
              key={part}
              onClick={() => {
                setActivePart(part);
                setEvaluation(null);
                setTranscript('');
                setTimerSeconds(part === 2 ? 120 : 60);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePart === part
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Part {part}
            </button>
          ))}
        </div>
      </div>

      {/* Cue Card / Prompt Display */}
      <div className="bg-[#0D182E] border border-slate-800 p-6 rounded-3xl space-y-4 relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            {activePart === 2 ? 'IELTS Speaking Part 2 Cue Card' : `Speaking Part ${activePart} Prompt`}
          </span>

          <button
            onClick={handleExaminerSpeak}
            className="flex items-center space-x-1.5 text-xs text-sky-400 hover:text-sky-300 bg-sky-950/40 border border-sky-500/20 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Hear Examiner Voice</span>
          </button>
        </div>

        <h2 className="text-lg font-bold text-white">{cueCardTopic.title}</h2>

        {activePart === 2 && (
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
            <span className="text-xs font-medium text-slate-400">You should say:</span>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {cueCardTopic.prompts.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 5W1H and ARE Pedagogical Banner */}
        <div className="bg-sky-500/5 border border-sky-500/10 p-3 rounded-xl flex items-center space-x-2 text-xs text-sky-300">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            {activePart === 2
              ? 'Dr. Asif 5W1H Drill: Navigate Who, What, Where, When, Why, How to comfortably speak for the full 120 seconds.'
              : 'Dr. Asif ARE Method: Structure every response as Answer directly -> Reason/Why -> Concrete Example.'}
          </span>
        </div>
      </div>

      {/* Recording Room & Live Waveform Interface */}
      <div className="bg-[#0B1327] border border-slate-800/90 p-6 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                isRecording
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold'
              }`}
            >
              {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <div>
              <div className="text-sm font-bold text-white flex items-center space-x-2">
                <span>{isRecording ? 'Examiner Listening...' : 'Ready to Speak'}</span>
                {isRecording && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
              </div>
              <p className="text-xs text-slate-400">
                {isRecording ? 'Speak clearly into your microphone' : 'Click the microphone to begin'}
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
            <Clock className={`w-4 h-4 ${timerSeconds < 15 ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
            <span className="font-mono text-lg font-bold text-white">
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Live Audio Transcript Box */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 min-h-[140px] max-h-[220px] overflow-y-auto font-sans text-sm leading-relaxed text-slate-200">
          {transcript ? (
            <p className="whitespace-pre-wrap">{transcript}</p>
          ) : (
            <span className="text-slate-500 italic text-xs">
              Live speech-to-text will transcribe here as you speak...
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || !transcript.trim()}
            className="flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 disabled:opacity-50 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md"
          >
            {isEvaluating ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Examiner Evaluating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate with Edge AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagnostic Evaluation Card */}
      {evaluation && (
        <div className="bg-[#0D182E] border border-sky-500/30 p-6 rounded-3xl space-y-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Official IELTS Speaking Diagnostic</h3>
                <p className="text-xs text-slate-400">Assessed by Dr. Asif’s Cambridge Band Rubric Engine</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Overall Band</span>
              <div className="text-3xl font-black text-sky-400">{evaluation.overall_band || 6.5}</div>
            </div>
          </div>

          {/* 4 Official Criteria Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Fluency & Coherence</span>
              <div className="text-lg font-bold text-white mt-1">{evaluation.fluency_coherence || 6.5}</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Lexical Resource</span>
              <div className="text-lg font-bold text-white mt-1">{evaluation.lexical_resource || 6.5}</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Grammar Accuracy</span>
              <div className="text-lg font-bold text-white mt-1">{evaluation.grammatical_accuracy || 6.5}</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Pronunciation</span>
              <div className="text-lg font-bold text-white mt-1">{evaluation.pronunciation || 7.0}</div>
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
                <span>Remediation Areas</span>
              </span>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {evaluation.weaknesses?.map((w: string, i: number) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggested C1/C2 Vocabulary */}
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

          {/* Pedagogical Coaching Notes */}
          <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block mb-1">Dr. Asif's Coaching Feedback:</strong>
            {evaluation.pedagogical_feedback}
          </div>
        </div>
      )}
    </div>
  );
};
