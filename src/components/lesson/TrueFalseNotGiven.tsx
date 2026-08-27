import React from 'react';
import { TrueFalseNotGivenQuestion } from '../../lib/types';
import { sound } from '../../lib/audio';
import { BookOpen, HelpCircle } from 'lucide-react';

interface TrueFalseNotGivenProps {
  question: TrueFalseNotGivenQuestion;
  selectedAnswer: 'TRUE' | 'FALSE' | 'NOT GIVEN' | null;
  onSelectAnswer: (answer: 'TRUE' | 'FALSE' | 'NOT GIVEN') => void;
  isAnswerSubmitted: boolean;
  correctAnswer?: 'TRUE' | 'FALSE' | 'NOT GIVEN';
}

export const TrueFalseNotGiven: React.FC<TrueFalseNotGivenProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  isAnswerSubmitted,
  correctAnswer,
}) => {
  const options: ('TRUE' | 'FALSE' | 'NOT GIVEN')[] = ['TRUE', 'FALSE', 'NOT GIVEN'];

  const handleSelect = (opt: 'TRUE' | 'FALSE' | 'NOT GIVEN') => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    onSelectAnswer(opt);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto select-none">
      {/* Question Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-700 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>IELTS Reading Task: T / F / NG</span>
        </div>
        <h3 className="text-lg md:text-xl font-black text-duo-charcoal leading-snug">
          {question.prompt}
        </h3>
      </div>

      {/* Passage Excerpt */}
      <div className="p-4 md:p-5 bg-purple-50/50 rounded-2xl border-2 border-purple-200">
        <div className="text-[11px] font-black uppercase tracking-wider text-purple-700 mb-1.5 flex items-center gap-1">
          <span>Passage Excerpt</span>
        </div>
        <p className="text-sm md:text-base font-serif font-medium text-gray-800 leading-relaxed italic">
          "{question.passage}"
        </p>
      </div>

      {/* Statement to Test */}
      <div className="p-4 bg-white rounded-2xl border-2 border-duo-gray shadow-sm">
        <div className="text-xs font-black uppercase text-gray-400 mb-1">
          Statement to Evaluate:
        </div>
        <div className="text-base md:text-lg font-black text-duo-charcoal">
          "{question.statement}"
        </div>
      </div>

      {/* True / False / Not Given Buttons */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        {options.map(opt => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = isAnswerSubmitted && opt === correctAnswer;
          const isWrongSelected = isAnswerSubmitted && isSelected && opt !== correctAnswer;

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
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={isAnswerSubmitted}
              className={`py-4 px-2 rounded-2xl border-2 border-b-4 font-black text-sm md:text-base tracking-wider uppercase text-center transition-all ${btnClasses}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
