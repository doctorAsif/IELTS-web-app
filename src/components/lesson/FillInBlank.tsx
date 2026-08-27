import React, { useState, useEffect } from 'react';
import { FillInBlankQuestion } from '../../lib/types';
import { sound } from '../../lib/audio';

interface FillInBlankProps {
  question: FillInBlankQuestion;
  userAnswer: string;
  onAnswerChange: (answer: string, isReady: boolean) => void;
  isAnswerSubmitted: boolean;
  correctAnswer?: string;
}

export const FillInBlank: React.FC<FillInBlankProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  isAnswerSubmitted,
  correctAnswer,
}) => {
  const [selectedChip, setSelectedChip] = useState<string>('');

  useEffect(() => {
    setSelectedChip('');
  }, [question]);

  const handleChipClick = (chip: string) => {
    if (isAnswerSubmitted) return;
    sound.playTile();
    setSelectedChip(chip);
    onAnswerChange(chip, true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAnswerSubmitted) return;
    const val = e.target.value;
    setSelectedChip('');
    onAnswerChange(val, val.trim().length > 0);
  };

  // Split sentence around "___"
  const parts = question.sentenceWithBlank.split('___');

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto select-none">
      <div>
        <h3 className="text-xl md:text-2xl font-black text-duo-charcoal leading-snug">
          {question.prompt}
        </h3>
        {question.subPrompt && (
          <p className="text-xs md:text-sm font-bold text-gray-500 mt-1">
            {question.subPrompt}
          </p>
        )}
      </div>

      {/* Sentence with interactive inline blank */}
      <div className="p-6 bg-white rounded-3xl border-2 border-duo-gray shadow-sm text-base md:text-lg font-bold text-duo-charcoal leading-loose">
        <span>{parts[0]}</span>
        <span className="inline-block mx-2">
          {selectedChip ? (
            <span className="word-tile bg-blue-50 border-duo-blue text-duo-blue px-4 py-1.5 align-middle">
              {selectedChip}
            </span>
          ) : (
            <input
              type="text"
              value={userAnswer}
              onChange={handleInputChange}
              disabled={isAnswerSubmitted}
              placeholder="type or select"
              className="border-b-4 border-duo-blue bg-blue-50/50 px-3 py-1 text-center font-black text-duo-charcoal focus:outline-none focus:bg-blue-100 rounded-lg min-w-[140px] text-base"
            />
          )}
        </span>
        <span>{parts[1]}</span>
      </div>

      {/* Option Chips if provided */}
      {question.options && question.options.length > 0 && (
        <div className="pt-2">
          <div className="text-xs font-black uppercase text-gray-400 mb-3 text-center">
            Tap a word chip to fill the blank:
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {question.options.map((opt, idx) => {
              const isSelected = selectedChip === opt || userAnswer.toLowerCase() === opt.toLowerCase();
              return (
                <button
                  key={idx}
                  onClick={() => handleChipClick(opt)}
                  disabled={isAnswerSubmitted}
                  className={`word-tile text-sm md:text-base ${
                    isSelected ? 'word-tile-selected' : ''
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
