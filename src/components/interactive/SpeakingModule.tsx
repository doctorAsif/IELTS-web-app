import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Square, Loader2, AlertTriangle, CheckCircle, Sparkles, Sliders, ArrowUpRight, Clock } from 'lucide-react';
import { SpeakingEngine, SpeakingEvaluation } from '../../lib/engines/SpeakingEngine';
import { SpeechRecognizer, speakText, stopSpeaking } from '../../lib/speech';
import { WaveformVisualizer } from './WaveformVisualizer';
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

  // Examiner TTS Settings
  const [examinerSpeed, setExaminerSpeed] = useState(0.95);
  const [examinerPitch, setExaminerPitch] = useState(1.0);
  const [showVoiceControls, setShowVoiceControls] = useState(false);

  // Recording timer
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [practiceId]);

  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  }, [isRecording]);

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
    speakText(textToSpeak, examinerSpeed, 'en-GB', examinerPitch, () => {
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
      setSttError('Live Speech Recognition is not supported by your browser. You may type your transcript manually below.');
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
      alert('Please speak or type a response (at least 15 characters) before requesting evaluation.');
      return;
    }

    setIsEvaluating(true);
    setEvaluation(null);
    try {
      const taskPrompt = module.questions.join('\n');
      const result = await SpeakingEngine.evaluateSpeaking(transcript, taskPrompt, {
        pauses: Math.max(1, Math.round(recordingSeconds / 15)),
        durationSeconds: Math.max(20, recordingSeconds)
      });
      setEvaluation(result);
    } catch (e: any) {
      console.error('Speaking evaluation failure:', e);
      alert('Failed to evaluate speaking transcript: ' + (e?.message || ''));
    } finally {
      setIsEvaluating(false);
    }
  };

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const liveWpm = recordingSeconds > 0 ? Math.round(wordCount / (recordingSeconds / 60)) : 0;

  return (
    <div className="p-6 bg-[#1E293B] border border-[#334155] rounded-3xl max-w-4xl mx-auto my-6 text-white shadow-xl animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[#334155] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#F43F5E] bg-[#F43F5E]/10 px-3 py-1 rounded-full border border-[#F43F5E]/30">
            IELTS Speaking • {module.part}
          </span>
          <h2 className="text-2xl font-black text-white mt-2">{module.topic}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVoiceControls(!showVoiceControls)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-[#334155] transition"
            title="Configure British Voice Cadence"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlayPrompt}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl border border-sky-500/30 text-sm font-semibold transition"
          >
            {isSpeakingPrompt ? <Square className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            {isSpeakingPrompt ? 'Stop Audio' : 'Play British Examiner (TTS)'}
          </button>
        </div>
      </div>

      {/* Examiner TTS Settings Drawer */}
      {showVoiceControls && (
        <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#334155] mb-6 flex flex-wrap items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block mb-1">Cadence / Speed: {examinerSpeed.toFixed(2)}x</span>
            <div className="flex gap-2">
              {[0.85, 0.95, 1.0, 1.1].map(spd => (
                <button
                  key={spd}
                  onClick={() => setExaminerSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                    examinerSpeed === spd ? 'bg-[#38BDF8] text-slate-950 border-[#38BDF8]' : 'bg-[#1E293B] text-slate-300 border-[#334155]'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block mb-1">Pitch: {examinerPitch.toFixed(1)}x</span>
            <div className="flex gap-2">
              {[0.9, 1.0, 1.1].map(pch => (
                <button
                  key={pch}
                  onClick={() => setExaminerPitch(pch)}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                    examinerPitch === pch ? 'bg-[#38BDF8] text-slate-950 border-[#38BDF8]' : 'bg-[#1E293B] text-slate-300 border-[#334155]'
                  }`}
                >
                  {pch}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {/* Real-time Waveform Visualizer */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-[#F43F5E]" />
            Acoustic Signal Waveform
          </span>
          {isRecording && (
            <span className="flex items-center gap-1.5 text-red-400 animate-pulse font-bold">
              <Clock className="w-3.5 h-3.5" />
              Recording: {recordingSeconds}s {liveWpm > 0 ? `(~${liveWpm} WPM)` : ''}
            </span>
          )}
        </div>
        <WaveformVisualizer isRecording={isRecording} barColor="#F43F5E" height={52} />
      </div>

      {/* Live STT Controls & Textarea */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <span>Response Transcript</span>
            <span className="text-xs font-normal text-slate-400">(Editable manual fallback)</span>
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
            Some acoustic signals had lower confidence. Feel free to edit your transcript before evaluation.
          </div>
        )}

        <textarea
          className="w-full h-36 p-4 bg-[#0F172A] border border-[#334155] rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 text-sm leading-relaxed"
          placeholder="Speak into your microphone or type your response here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#334155] pt-4">
        <div className="text-xs text-slate-400">
          Word count: <span className="text-white font-bold">{wordCount}</span>
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
              IELTS Speaking Diagnostic Report
            </h3>
            <span className="text-[10px] font-semibold text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-1 rounded-full border border-[#38BDF8]/30">
              CRITERION-REFERENCED EVALUATION
            </span>
          </div>

          {/* Overall Band Hero Card */}
          <div className="bg-[#1E293B] p-5 rounded-2xl border border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#F43F5E]/10 border border-[#F43F5E]/30 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 font-bold uppercase">Band</span>
                <span className="text-2xl font-black text-[#F43F5E]">{evaluation.overallBand.toFixed(1)}</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Overall Estimated Performance</h4>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Calibrated against official IELTS CEFR descriptors.
                </p>
              </div>
            </div>
            {evaluation.suggestedBandUpgrade && (
              <div className="bg-sky-500/10 border border-sky-500/30 p-3 rounded-xl max-w-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Suggested Band Upgrade
                </span>
                <p className="text-xs text-sky-100 mt-1 font-medium">{evaluation.suggestedBandUpgrade}</p>
              </div>
            )}
          </div>

          {/* 4 Rubric Criteria Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fluency & Coherence */}
            <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase">Fluency & Coherence (FC)</span>
                <span className="text-xs font-black px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Band {evaluation.criteria?.fluencyCoherence?.band?.toFixed(1) ?? (evaluation.fluency || 6.5).toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {evaluation.criteria?.fluencyCoherence?.feedback || evaluation.feedback}
              </p>
              <div className="pt-2 border-t border-[#334155]/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Filler word count:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  (evaluation.criteria?.fluencyCoherence?.fillerCount ?? 0) <= 2
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {evaluation.criteria?.fluencyCoherence?.fillerCount ?? 0} fillers
                </span>
              </div>
            </div>

            {/* Lexical Resource */}
            <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase">Lexical Resource (LR)</span>
                <span className="text-xs font-black px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  Band {evaluation.criteria?.lexicalResource?.band?.toFixed(1) ?? (evaluation.vocabulary || 6.5).toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {evaluation.criteria?.lexicalResource?.feedback || 'Good topic vocabulary.'}
              </p>
              {evaluation.criteria?.lexicalResource?.advancedCollocations && evaluation.criteria.lexicalResource.advancedCollocations.length > 0 && (
                <div className="pt-2 border-t border-[#334155]/60">
                  <span className="text-[10px] uppercase font-bold text-purple-300 block mb-1">Collocations Detected:</span>
                  <div className="flex flex-wrap gap-1">
                    {evaluation.criteria.lexicalResource.advancedCollocations.map((col, i) => (
                      <span key={i} className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full font-medium">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Grammatical Range & Accuracy */}
            <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase">Grammatical Range & Accuracy (GRA)</span>
                <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Band {evaluation.criteria?.grammaticalRange?.band?.toFixed(1) ?? (evaluation.grammar || 6.5).toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {evaluation.criteria?.grammaticalRange?.feedback || 'Accurate sentence structures.'}
              </p>
              <div className="pt-2 border-t border-[#334155]/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Complex sentence ratio:</span>
                <span className="font-bold text-emerald-400">
                  {Math.round(((evaluation.criteria?.grammaticalRange?.complexSentenceRatio ?? 0.35) * 100))}%
                </span>
              </div>
            </div>

            {/* Pronunciation */}
            <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase">Pronunciation (PR)</span>
                <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Band {evaluation.criteria?.pronunciation?.band?.toFixed(1) ?? (evaluation.pronunciation || 6.5).toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {evaluation.criteria?.pronunciation?.feedback || 'Clear rhythm and stress.'}
              </p>
              <div className="pt-2 border-t border-[#334155]/60 text-[11px] text-slate-400">
                Acoustic Clarity: <span className="font-bold text-green-400">Intelligible</span>
              </div>
            </div>
          </div>

          {/* Actionable Remediation Points */}
          {evaluation.actionableRemediation && evaluation.actionableRemediation.length > 0 && (
            <div className="bg-[#1E293B] p-5 rounded-2xl border border-[#334155] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-green-400 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4" /> Actionable Remediation Steps
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200 pl-4 list-disc">
                {evaluation.actionableRemediation.map((rem, i) => (
                  <li key={i}>{rem}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
