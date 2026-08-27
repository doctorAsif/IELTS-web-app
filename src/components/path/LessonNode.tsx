import React, { useState } from 'react';
import {
  Star,
  Check,
  Lock,
  Headphones,
  Mic,
  PenTool,
  BookOpen,
  Gift,
  Trophy,
  Crown,
  Sparkles,
} from 'lucide-react';
import { Lesson, LessonType, SkillType } from '../../lib/types';
import { sound } from '../../lib/audio';

interface LessonNodeProps {
  lesson: Lesson;
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
  offsetIndex: number; // for serpentine zigzag alignment (-1, 0, 1)
  onStartLesson: (lesson: Lesson) => void;
}

export const LessonNode: React.FC<LessonNodeProps> = ({
  lesson,
  isCompleted,
  isActive,
  isLocked,
  offsetIndex,
  onStartLesson,
}) => {
  const [showTooltip, setShowTooltip] = useState(isActive);

  const getIcon = (type: LessonType, skill: SkillType) => {
    if (type === 'chest') return Gift;
    if (type === 'trophy') return Trophy;
    if (skill === 'speaking') return Mic;
    if (skill === 'listening') return Headphones;
    if (skill === 'writing') return PenTool;
    if (skill === 'reading') return BookOpen;
    return Star;
  };

  const IconComponent = getIcon(lesson.type, lesson.skill);

  // Determine zigzag offset in pixels
  const getHorizontalOffsetClass = (idx: number) => {
    switch (idx) {
      case -1:
        return '-translate-x-12 md:-translate-x-16';
      case 1:
        return 'translate-x-12 md:translate-x-16';
      default:
        return 'translate-x-0';
    }
  };

  const handleClick = () => {
    if (isLocked) {
      sound.playWrong();
      return;
    }
    sound.playClick();
    onStartLesson(lesson);
  };

  return (
    <div className={`relative flex flex-col items-center my-6 transition-transform duration-200 ${getHorizontalOffsetClass(offsetIndex)}`}>
      {/* Active Speech / Start Tooltip Bubble */}
      {isActive && (
        <div className="absolute -top-12 z-20 animate-bounceSmall select-none">
          <div className="relative bg-white text-duo-green font-black text-xs px-3.5 py-1.5 rounded-2xl border-2 border-duo-gray shadow-md flex items-center gap-1.5 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-duo-gold" />
            <span>START +{lesson.xpReward} XP</span>
            {/* Arrow pointer */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
          </div>
        </div>
      )}

      {/* 3D Round Node Button */}
      <button
        onClick={handleClick}
        disabled={isLocked}
        className={`relative group w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-150 select-none ${
          isLocked
            ? 'bg-gray-200 border-b-6 border-gray-300 text-gray-400 cursor-not-allowed'
            : isCompleted
            ? 'bg-duo-gold border-b-6 border-duo-gold-dark text-yellow-950 hover:brightness-105 active:border-b-0 active:translate-y-1 shadow-lg'
            : 'bg-duo-green border-b-6 border-duo-green-border text-white hover:bg-duo-green-light active:border-b-0 active:translate-y-1 shadow-lg animate-pulseGlow'
        }`}
      >
        {/* Outer Circular Progress Ring for Active */}
        {isActive && (
          <div className="absolute -inset-2 rounded-full border-4 border-dashed border-duo-green animate-spin" style={{ animationDuration: '12s' }} />
        )}

        {/* Node Icon */}
        {isCompleted ? (
          lesson.type === 'trophy' ? (
            <Crown className="w-10 h-10 text-white fill-white drop-shadow-sm" />
          ) : (
            <Check className="w-10 h-10 stroke-[3.5] text-white drop-shadow-sm" />
          )
        ) : isLocked ? (
          <Lock className="w-8 h-8 text-gray-400" />
        ) : (
          <IconComponent className="w-9 h-9 md:w-10 md:h-10 fill-current drop-shadow-sm" />
        )}

        {/* Lesson Reward pill badge */}
        {!isLocked && !isCompleted && (
          <div className="absolute -bottom-2 bg-duo-gold text-yellow-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-duo-gold-dark shadow-sm">
            +{lesson.xpReward} XP
          </div>
        )}
      </button>

      {/* Lesson Title label */}
      <div className="mt-2 text-center max-w-[160px]">
        <div className={`text-xs md:text-sm font-black leading-tight ${isLocked ? 'text-gray-400' : 'text-duo-charcoal'}`}>
          {lesson.title}
        </div>
      </div>
    </div>
  );
};
