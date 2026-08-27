import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { sound } from '../../lib/audio';

interface ResultFooterProps {
  status: 'unanswered' | 'correct' | 'incorrect';
  explanation?: string;
  correctAnswerText?: string;
  isCheckDisabled: boolean;
  onCheck: () => void;
  onContinue: () => void;
}

export const ResultFooter: React.FC<ResultFooterProps> = ({
  status,
  explanation,
  correctAnswerText,
  isCheckDisabled,
  onCheck,
  onContinue,
}) => {
  const getBannerBg = () => {
    switch (status) {
      case 'correct':
        return 'bg-[#d7ffb8] border-[#b8f28b] text-[#257300]';
      case 'incorrect':
        return 'bg-[#ffdfe0] border-[#ffb3b5] text-[#ea2b2b]';
      default:
        return 'bg-white border-duo-gray text-duo-charcoal';
    }
  };

  return (
    <div className={`sticky bottom-0 left-0 right-0 border-t-2 py-4 md:py-6 px-4 md:px-8 select-none transition-colors duration-200 ${getBannerBg()}`}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Message & Explanation */}
        {status === 'unanswered' && (
          <div className="hidden md:flex items-center gap-2 text-xs font-black uppercase text-gray-400">
            <span>Select or arrange your answer, then click Check</span>
          </div>
        )}

        {status === 'correct' && (
          <div className="flex items-start gap-3 w-full md:w-auto">
            <div className="w-12 h-12 rounded-full bg-[#58cc02] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-black leading-tight text-[#257300]">Amazing!</h4>
              {explanation && (
                <p className="text-xs md:text-sm font-bold text-[#328500] mt-0.5 max-w-xl">
                  {explanation}
                </p>
              )}
            </div>
          </div>
        )}

        {status === 'incorrect' && (
          <div className="flex items-start gap-3 w-full md:w-auto">
            <div className="w-12 h-12 rounded-full bg-[#ff4b4b] text-white flex items-center justify-center shrink-0">
              <XCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-black leading-tight text-[#ea2b2b]">Correct Solution:</h4>
              {correctAnswerText && (
                <div className="text-sm font-black text-duo-charcoal mt-0.5">
                  {correctAnswerText}
                </div>
              )}
              {explanation && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mt-1 max-w-xl">
                  <Lightbulb className="w-3.5 h-3.5 text-duo-orange shrink-0" />
                  <span>{explanation}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="w-full md:w-auto shrink-0">
          {status === 'unanswered' ? (
            <button
              onClick={() => {
                sound.playClick();
                onCheck();
              }}
              disabled={isCheckDisabled}
              className={`w-full md:w-44 py-3.5 px-6 font-black text-sm uppercase tracking-wider transition-all rounded-2xl ${
                isCheckDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-b-4 border-gray-300'
                  : 'btn-duo-green'
              }`}
            >
              CHECK
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onContinue();
              }}
              className={`w-full md:w-44 py-3.5 px-6 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 rounded-2xl ${
                status === 'correct'
                  ? 'btn-duo-green'
                  : 'btn-duo-red'
              }`}
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
