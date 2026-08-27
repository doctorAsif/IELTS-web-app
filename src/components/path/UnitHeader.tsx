import React from 'react';
import { BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { Unit } from '../../lib/types';
import { sound } from '../../lib/audio';

interface UnitHeaderProps {
  unit: Unit;
  isUnlocked: boolean;
  isCompleted: boolean;
  onOpenGuidebook: (unit: Unit) => void;
}

export const UnitHeader: React.FC<UnitHeaderProps> = ({
  unit,
  isUnlocked,
  isCompleted,
  onOpenGuidebook,
}) => {
  const getColorClasses = (color: Unit['color']) => {
    switch (color) {
      case 'blue':
        return 'from-sky-500 to-blue-600 border-blue-700 text-white';
      case 'purple':
        return 'from-purple-500 to-indigo-600 border-purple-700 text-white';
      case 'orange':
        return 'from-amber-500 to-orange-600 border-orange-700 text-white';
      case 'red':
        return 'from-rose-500 to-red-600 border-red-700 text-white';
      case 'gold':
        return 'from-amber-400 to-yellow-500 border-amber-600 text-yellow-950';
      case 'green':
      default:
        return 'from-emerald-500 to-green-600 border-green-700 text-white';
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl p-5 md:p-6 mb-8 border-b-6 shadow-md bg-gradient-to-r ${
        isUnlocked
          ? getColorClasses(unit.color)
          : 'from-gray-300 to-gray-400 border-gray-500 text-gray-700 opacity-80'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider opacity-90">
              Unit {unit.id}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 bg-white/30 backdrop-blur-xs text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> MASTERED
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-black leading-tight tracking-wide">
            {unit.title}
          </h2>
          <p className="text-xs md:text-sm font-semibold opacity-90 mt-1 max-w-xl">
            {unit.subtitle}
          </p>
        </div>

        {/* Guidebook Button */}
        {isUnlocked && (
          <button
            onClick={() => {
              sound.playClick();
              onOpenGuidebook(unit);
            }}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 active:scale-95 transition-all rounded-2xl border-2 border-white/40 font-black text-xs uppercase tracking-wider backdrop-blur-xs shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>GUIDEBOOK</span>
          </button>
        )}
      </div>
    </div>
  );
};
