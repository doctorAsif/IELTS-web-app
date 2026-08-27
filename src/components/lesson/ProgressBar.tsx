import React from 'react';
import { X, Heart } from 'lucide-react';
import { sound } from '../../lib/audio';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  hearts: number;
  onQuit: () => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  hearts,
  onQuit,
}) => {
  const percentage = Math.min(100, Math.round(((currentStep) / totalSteps) * 100));

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-4 px-4 py-4 select-none">
      {/* Quit Button */}
      <button
        onClick={() => {
          sound.playClick();
          onQuit();
        }}
        className="text-gray-400 hover:text-duo-charcoal p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <X className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Progress Bar */}
      <div className="flex-1 h-4 bg-duo-gray rounded-full overflow-hidden relative">
        <div
          className="h-full bg-duo-green transition-all duration-300 ease-out rounded-full relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Subtle highlight sheen */}
          <div className="absolute top-1 left-2 right-2 h-1 bg-white/40 rounded-full" />
        </div>
      </div>

      {/* Hearts Counter */}
      <div className="flex items-center gap-1.5 px-2">
        <Heart className="w-7 h-7 text-duo-red fill-duo-red animate-pulse" />
        <span className="font-black text-lg text-duo-red">
          {hearts > 100 ? '∞' : hearts}
        </span>
      </div>
    </div>
  );
};
