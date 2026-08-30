import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Square, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { SpeakingEngine, SpeakingEvaluation } from '../../lib/engines/SpeakingEngine';
import { SpeechRecognizer, speakText, stopSpeaking } from '../../lib/speech';
import speakingData from '../../assets/database/speaking_modules.json';

interface SpeakingModuleProps {
  practiceId?: string;
}

export const SpeakingModule: React.FC<SpeakingModuleProps> = ({ practiceId = 'AKHL-SP-001' }) => {
  const [module, setModule] = useState<any>(null);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);
  const [sttError, setSttError] = useState<string | null>(null);
  const [lowConfidenceNotice, setLowConfidenceNotice] = useState(false);

  const recognizerRef = useRef<SpeechRecognizer | null>(null);

  useEffect(() => {
    const data = speakingData.modules.find(m => m.practiceId === practiceId);
    if (data) {
      setModule(data);
    }
    recognizerRef.current = new SpeechRecognizer();

    return () => {
      stopSpeaking();
      recognizerRef.current?.stopListening();
    };
  }, [practiceId]);

  if (!module) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#38BDF8]" />
        Loading Speaking Practice Module...
      </div>
    );
  }

  const handlePlayPrompt = () => {
    if (isSpeakingPrompt) {
      stopSpeaking();
      setIsSpeakingPrompt(false);
      return;
    }

    const textToSpeak = `${module.instructions}. Questions: ${module.questions.join('. ')}`;
    setIsSpeakingPrompt(true);
    speakText(textToSpeak, 0.95, 'en-GB', () => {
      setIsSpeakingPrompt(false);
    });
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      recognizerRef.current?.stopListening();
      setIsRecording(false);
      return;
    }

    setSttError(null);
    setLowConfidenceNotice(false);

    if (!recognizerRef.current?.getIsSupported()) {
      setSttError('Live Speech Recognition is not supported by your browser. You may type your transcript manually.');
      return;
    }

    const started = recognizerRef.current.startListening(
      (text, isFinal, confidence) => {
        setTranscript(text);
        if (confidence !== undefined && confidence < 0.6) {
          setLowConfidenceNotice(true);
        }
      },
      (err) => {
        setSttError(err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (started) {
      setIsRecording(true);
    }
  };

  const handleEvaluate = async () => {
    if (transcript.trim().length < 15) {
      alert('Please speak or type a longer response before requesting evaluation.');
      return;
    }

    setIsEvaluating(true);
    setEvaluation(null);
    try {
      const taskPrompt = module.questions.join('\n');
      const result = await SpeakingEngine.evaluateSpeaking(transcript, taskPrompt, {
        pauses: 2,
        wpm: 125
      });
      setEvaluation(result);
    } catch (e: any) {
      console.error('Speaking evaluation failure:', e);
      alert('Failed to evaluate speaking transcript. ' + (e?.message || ''));
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="p-6 bg-[#1E293B] border border-[#334155] rounded-3xl max-w-4xl mx-auto my-6 text-white shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[#334155] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#F43F5E] bg-[#F43F5E]/10 px-3 py-1 rounded-full border border-[#F43F5E]/30">
            IELTS Speaking • {module.part}
          </span>
          <h2 className="text-2xl font-black text-white mt-2">{module.topic}</h2>
        </div>
        <button
          onClick={handlePlayPrompt}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl border border-sky-500/30 text-sm font-semibold transition"
        >
          {isSpeakingPrompt ? <Square className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          {isSpeakingPrompt ? 'Stop Examiner Audio' : 'Listen to Examiner Prompt (TTS)'}
        </button>
      </div>

      {/* Instructions & Questions */}
      <div className="bg-[#0F172A] p-5 rounded-2xl border border-[#334155] mb-6">
        <p className="text-sm text-[#94A3B8] mb-3">{module.instructions}</p>
        <div className="space-y-2">
          <p className="text-xs font-bold text-sky-400 uppercase tracking-wide">Examiner Questions:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-200">
            {module.questions.map((q: string, idx: number) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Live STT Controls & Textarea */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <span>Your Response Transcript</span>
            <span className="text-xs font-normal text-slate-400">(Voice STT or type directly)</span>
          </label>

          <button
            onClick={handleToggleRecord}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-[#F43F5E] hover:bg-[#F43F5E]/90 text-white'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isRecording ? 'Stop Recording' : 'Start Voice Recognition'}
          </button>
        </div>

        {sttError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{sttError}</span>
          </div>
        )}

        {lowConfidenceNotice && (
          <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-xs text-yellow-300 mb-3">
            Recognition confidence was low on some phrases. You may review and edit the text manually before evaluation.
          </div>
        )}

        <textarea
          className="w-full h-36 p-4 bg-[#0F172A] border border-[#334155] rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 text-sm leading-relaxed"
          placeholder="Your spoken response will appear here in real-time, or you can type..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#334155] pt-4">
        <div className="text-xs text-slate-400">
          Word count: <span className="text-white font-bold">{transcript.trim() ? transcript.trim().split(/\s+/).length : 0}</span>
        </div>

        <button
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="px-6 py-2.5 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 rounded-xl font-bold text-sm transition disabled:opacity-50 flex items-center gap-2"
        >
          {isEvaluating && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEvaluating ? 'Evaluating Performance...' : 'Submit for AI Evaluation'}
        </button>
      </div>

      {/* Evaluation Results */}
      {evaluation && (
        <div className="mt-8 bg-[#0F172A] border border-[#334155] rounded-2xl p-6 animate-fadeInUp">
          <div className="flex items-center justify-between mb-4 border-b border-[#334155] pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Speaking Examiner Report
            </h3>
            <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30">
              AI-GENERATED PRACTICE ESTIMATE
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
            <div className="bg-[#1E293B] p-4 rounded-xl text-center border-t-4 border-[#F43F5E] col-span-2 md:col-span-2 shadow">
              <div className="text-xs text-slate-400 uppercase font-semibold">Est. Band Score</div>
              <div className="text-3xl font-black text-[#F43F5E] mt-1">{evaluation.estimatedBand.toFixed(1)}</div>
            </div>
            <div className="bg-[#1E293B] p-3 rounded-xl text-center">
              <div className="text-[11px] text-slate-400 font-semibold">Fluency</div>
              <div className="text-lg font-bold text-white mt-1">{evaluation.fluency.toFixed(1)}</div>
            </div>
            <div className="bg-[#1E293B] p-3 rounded-xl text-center">
              <div className="text-[11px] text-slate-400 font-semibold">Coherence</div>
              <div className="text-lg font-bold text-white mt-1">{evaluation.coherence.toFixed(1)}</div>
            </div>
            <div className="bg-[#1E293B] p-3 rounded-xl text-center">
              <div className="text-[11px] text-slate-400 font-semibold">Vocabulary</div>
              <div className="text-lg font-bold text-white mt-1">{evaluation.vocabulary.toFixed(1)}</div>
            </div>
            <div className="bg-[#1E293B] p-3 rounded-xl text-center">
              <div className="text-[11px] text-slate-400 font-semibold">Grammar</div>
              <div className="text-lg font-bold text-white mt-1">{evaluation.grammar.toFixed(1)}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#1E293B] p-4 rounded-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">Examiner Feedback</h4>
              <p className="text-sm text-slate-200 leading-relaxed">{evaluation.feedback}</p>
            </div>

            {evaluation.strengths && evaluation.strengths.length > 0 && (
              <div className="bg-[#1E293B] p-4 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2">Key Strengths</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-200">
                  {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {evaluation.weaknesses && evaluation.weaknesses.length > 0 && (
              <div className="bg-[#1E293B] p-4 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Suggested Focus Areas</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-200">
                  {evaluation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
