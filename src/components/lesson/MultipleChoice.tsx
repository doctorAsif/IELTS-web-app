import React from 'react';
import { MultipleChoiceQuestion } from '../../lib/types';
import { sound } from '../../lib/audio';

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion;
  selectedIndex: number | null;
  onSelectOption: (index: number) => void;
  isAnswerSubmitted: boolean;
  correctIndex?: number;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  selectedIndex,
  onSelectOption,
  isAnswerSubmitted,
  correctIndex,
}) => {
  const handleSelect = (idx: number) => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    onSelectOption(idx);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto select-none">
      {/* Prompt */}
      <div>
        <h3 className="text-xl md:text-2xl font-black text-duo-charcoal leading-snug">
          {question.prompt}
        </h3>
        {question.subPrompt && (
          <p className="text-xs md:text-sm font-bold text-gray-500 mt-2">
            {question.subPrompt}
          </p>
        )}
      </div>

      {/* Options List */}
      <div className="grid grid-cols-1 gap-3.5">
        {question.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrect = isAnswerSubmitted && idx === correctIndex;
          const isWrongSelected = isAnswerSubmitted && isSelected && idx !== correctIndex;

          let btnStyles = 'border-duo-gray bg-white text-duo-charcoal hover:bg-gray-50';

          if (isSelected && !isAnswerSubmitted) {
            btnStyles = 'border-duo-blue bg-blue-50/40 text-duo-blue border-b-4';
          } else if (isCorrect) {
            btnStyles = 'border-duo-green bg-green-50 text-duo-green border-b-4';
          } else if (isWrongSelected) {
            btnStyles = 'border-duo-red bg-red-50 text-duo-red border-b-4';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswerSubmitted}
              className={`relative flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 border-b-4 font-bold text-left text-sm md:text-base transition-all duration-150 active:border-b-2 active:translate-y-0.5 shadow-sm ${btnStyles}`}
            >
              <div className="flex items-center gap-3.5">
                <span className="w-7 h-7 rounded-xl border-2 border-current flex items-center justify-center text-xs font-black shrink-0">
                  {idx + 1}
                </span>
                <span className="font-extrabold leading-snug">{option}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
