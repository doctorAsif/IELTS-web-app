import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { SpeakingQuestion } from '../../lib/types';
import { SpeechRecognizer, calculateKeywordMatch, speakText, stopSpeaking } from '../../lib/speech';
import { sound } from '../../lib/audio';

interface SpeakingExerciseProps {
  question: SpeakingQuestion;
  onSpeakingComplete: (spokenText: string, score: number, isPassing: boolean) => void;
  isAnswerSubmitted: boolean;
}

export const SpeakingExercise: React.FC<SpeakingExerciseProps> = ({
  question,
  onSpeakingComplete,
  isAnswerSubmitted,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [matchResult, setMatchResult] = useState<{
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
  }>({ score: 0, matchedKeywords: [], missingKeywords: question.keyWordsToDetect });
  const [recognizer] = useState(() => new SpeechRecognizer());
  const [micError, setMicError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      recognizer.stopListening();
      stopSpeaking();
    };
  }, [recognizer]);

  const handleToggleMic = () => {
    if (isAnswerSubmitted) return;

    if (isListening) {
      recognizer.stopListening();
      setIsListening(false);
      sound.playClick();
      return;
    }

    setMicError(null);
    setTranscript('');
    sound.playClick();

    const success = recognizer.startListening(
      (text, isFinal) => {
        setTranscript(text);
        const match = calculateKeywordMatch(text, question.keyWordsToDetect);
        setMatchResult(match);

        const isPassing = match.score >= 50 || text.length > 20;
        onSpeakingComplete(text, match.score, isPassing);

        if (isFinal) {
          setIsListening(false);
        }
      },
      err => {
        setMicError(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (success) {
      setIsListening(true);
    }
  };

  // Fallback simulator for users without a microphone or on unsupported browsers
  const handleSimulateSpeaking = () => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    const simulated = question.targetPhrase;
    setTranscript(simulated);
    const match = calculateKeywordMatch(simulated, question.keyWordsToDetect);
    setMatchResult(match);
    onSpeakingComplete(simulated, 100, true);
  };

  const handleListenSample = () => {
    sound.playClick();
    speakText(question.sampleAnswer, 0.9, 'en-GB');
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-duo-red mb-1">
          <Mic className="w-4 h-4" />
          <span>IELTS Speaking {question.part} Examiner Drill</span>
        </div>
        <h3 className="text-lg md:text-xl font-black text-duo-charcoal leading-snug">
          {question.prompt}
        </h3>
      </div>

      {/* Target Phrase Box */}
      <div className="p-4 md:p-5 bg-red-50/60 rounded-2xl border-2 border-red-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-red-800">
            Target Fluency & Idiomatic Phrase:
          </span>
          <button
            onClick={handleListenSample}
            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-red-100/50 rounded-xl text-xs font-black text-duo-red border border-red-200 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Sample Pronunciation</span>
          </button>
        </div>
        <p className="text-base md:text-lg font-bold text-duo-charcoal leading-relaxed">
          "{question.targetPhrase}"
        </p>
      </div>

      {/* Key Collocations / Keywords to include */}
      <div>
        <div className="text-xs font-black uppercase text-gray-500 mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-duo-gold" />
          <span>Band 8.0 Target Keywords Detected:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {question.keyWordsToDetect.map(kw => {
            const isMatched = matchResult.matchedKeywords.includes(kw);
            return (
              <span
                key={kw}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                  isMatched
                    ? 'bg-green-100 border-green-300 text-green-800 scale-105'
                    : 'bg-gray-100 border-gray-200 text-gray-500'
                }`}
              >
                {isMatched ? '✓ ' : ''}{kw}
              </span>
            );
          })}
        </div>
      </div>

      {/* Live Mic Recording Control Box */}
      <div className="p-6 bg-white rounded-3xl border-2 border-duo-gray flex flex-col items-center justify-center gap-4 text-center shadow-sm">
        {/* Large 3D Mic Button */}
        <button
          onClick={handleToggleMic}
          disabled={isAnswerSubmitted}
          className={`w-24 h-24 rounded-full flex items-center justify-center border-b-6 transition-all duration-150 ${
            isListening
              ? 'bg-duo-red border-duo-red-dark text-white animate-pulse shadow-lg scale-105'
              : 'bg-duo-blue border-duo-blue-dark text-white hover:bg-duo-blue-light active:border-b-0 active:translate-y-1 shadow-md'
          }`}
        >
          {isListening ? (
            <MicOff className="w-12 h-12" />
          ) : (
            <Mic className="w-12 h-12" />
          )}
        </button>

        <div>
          <div className="font-black text-sm text-duo-charcoal">
            {isListening ? 'Listening... Speak clearly into your mic!' : 'Tap mic to start speaking'}
          </div>
          {transcript && (
            <div className="mt-2 text-xs md:text-sm font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border max-w-lg">
              <span className="font-bold text-gray-400">Heard: </span>
              "{transcript}"
            </div>
          )}
        </div>

        {/* Fallback trigger */}
        {!isListening && !isAnswerSubmitted && (
          <button
            onClick={handleSimulateSpeaking}
            className="text-[11px] font-bold text-duo-blue hover:underline"
          >
            (Can't use microphone? Click to simulate perfect speech)
          </button>
        )}

        {micError && (
          <div className="text-xs font-bold text-duo-red flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            <span>{micError} - you can use the simulation link above</span>
          </div>
        )}
      </div>
    </div>
  );
};
