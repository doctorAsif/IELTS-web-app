import React, { useState, useEffect } from 'react';
import { Headphones, Volume2, Play, RotateCcw, Eye, Gauge } from 'lucide-react';
import { ListeningQuestion } from '../../lib/types';
import { speakText, stopSpeaking } from '../../lib/speech';
import { sound } from '../../lib/audio';

interface ListeningExerciseProps {
  question: ListeningQuestion;
  selectedIndex: number | null;
  onSelectOption: (index: number) => void;
  isAnswerSubmitted: boolean;
  correctIndex?: number;
}

export const ListeningExercise: React.FC<ListeningExerciseProps> = ({
  question,
  selectedIndex,
  onSelectOption,
  isAnswerSubmitted,
  correctIndex,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<number>(0.95);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    // Auto-play audio when first loading question
    playAudio(playSpeed);
    return () => {
      stopSpeaking();
    };
  }, [question]);

  const playAudio = (speed: number) => {
    setIsPlaying(true);
    sound.playClick();
    speakText(
      question.audioScript,
      speed,
      question.accent || 'en-GB',
      () => setIsPlaying(false)
    );
  };

  const toggleSpeed = () => {
    sound.playClick();
    const newSpeed = playSpeed === 0.95 ? 0.75 : 0.95;
    setPlaySpeed(newSpeed);
    playAudio(newSpeed);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto select-none">
      {/* Prompt */}
      <div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-duo-blue mb-1">
          <Headphones className="w-4 h-4" />
          <span>IELTS Listening Comprehension</span>
        </div>
        <h3 className="text-lg md:text-xl font-black text-duo-charcoal leading-snug">
          {question.prompt}
        </h3>
      </div>

      {/* Audio Player Controller Box */}
      <div className="p-5 bg-gradient-to-r from-sky-50 to-blue-50 rounded-3xl border-2 border-blue-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Play / Listen Button */}
        <button
          onClick={() => playAudio(playSpeed)}
          className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-sm ${
            isPlaying
              ? 'bg-duo-blue text-white animate-pulse'
              : 'btn-duo-blue'
          }`}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-6 h-6 animate-bounce" />
              <span>Playing Audio...</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6 fill-white" />
              <span>Listen ({question.accent || 'British'})</span>
            </>
          )}
        </button>

        {/* Speed Toggle & Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSpeed}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border-2 transition-colors ${
              playSpeed === 0.75
                ? 'bg-blue-100 border-duo-blue text-duo-blue'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{playSpeed === 0.75 ? '0.75x Slow' : '1.0x Normal'}</span>
          </button>

          {isAnswerSubmitted && (
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-xl text-xs font-black text-gray-700"
            >
              <Eye className="w-3.5 h-3.5 text-duo-blue" />
              <span>{showTranscript ? 'Hide' : 'Transcript'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Transcript accordion if submitted */}
      {showTranscript && isAnswerSubmitted && (
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-300 text-xs md:text-sm font-semibold text-gray-800 italic animate-bounceSmall">
          <div className="font-bold text-gray-400 not-italic uppercase mb-1">Audio Script:</div>
          "{question.audioScript}"
        </div>
      )}

      {/* Options List */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrect = isAnswerSubmitted && idx === correctIndex;
          const isWrongSelected = isAnswerSubmitted && isSelected && idx !== correctIndex;

          let btnClasses = 'border-duo-gray bg-white text-duo-charcoal hover:bg-gray-50';

          if (isSelected && !isAnswerSubmitted) {
            btnClasses = 'border-duo-blue bg-blue-50 text-duo-blue border-b-4';
          } else if (isCorrect) {
            btnClasses = 'border-duo-green bg-green-50 text-duo-green border-b-4';
          } else if (isWrongSelected) {
            btnClasses = 'border-duo-red bg-red-50 text-duo-red border-b-4';
          }

          return (
            <button
              key={idx}
              onClick={() => {
                if (isAnswerSubmitted) return;
                sound.playClick();
                onSelectOption(idx);
              }}
              disabled={isAnswerSubmitted}
              className={`p-4 rounded-2xl border-2 border-b-4 font-bold text-left text-sm md:text-base flex items-center gap-3 transition-all ${btnClasses}`}
            >
              <span className="w-7 h-7 rounded-xl border-2 border-current flex items-center justify-center text-xs font-black shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
