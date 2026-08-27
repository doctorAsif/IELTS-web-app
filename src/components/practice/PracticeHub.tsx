import React, { useState } from 'react';
import {
  Mic,
  Headphones,
  Eye,
  PenTool,
  BookMarked,
  Sparkles,
  Zap,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { PRACTICE_MODULES, VOCABULARY_FLASHCARDS, Flashcard } from '../../data/practiceData';
import { useApp } from '../../lib/store';
import { sound } from '../../lib/audio';
import { MascotSvg } from '../mascot/MascotSvg';
import { speakText } from '../../lib/speech';
import { SpeakingTimer } from '../interactive/SpeakingTimer';
import { AudioPlayer } from '../interactive/AudioPlayer';

interface PracticeHubProps {
  onStartPractice?: () => boolean;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({ onStartPractice }) => {
  const { stats, gainXp, refillHearts } = useApp();
  const [activeTab, setActiveTab] = useState<'modules' | 'flashcards'>('modules');

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCardIds, setKnownCardIds] = useState<string[]>([]);

  const card: Flashcard = VOCABULARY_FLASHCARDS[currentCardIndex];

  const handleNextCard = (known: boolean) => {
    sound.playTile();
    if (known && !knownCardIds.includes(card.id)) {
      setKnownCardIds(prev => [...prev, card.id]);
      gainXp(5);
    }
    setIsFlipped(false);
    setCurrentCardIndex(prev => (prev + 1) % VOCABULARY_FLASHCARDS.length);
  };

  const handlePrevCard = () => {
    sound.playTile();
    setIsFlipped(false);
    setCurrentCardIndex(prev => (prev - 1 + VOCABULARY_FLASHCARDS.length) % VOCABULARY_FLASHCARDS.length);
  };

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mic':
        return Mic;
      case 'Eye':
        return Eye;
      case 'PenTool':
        return PenTool;
      case 'Headphones':
        return Headphones;
      default:
        return BookMarked;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return 'border-rose-200 bg-rose-50/60 text-rose-700 hover:border-rose-400';
      case 'blue':
        return 'border-sky-200 bg-sky-50/60 text-sky-700 hover:border-sky-400';
      case 'purple':
        return 'border-purple-200 bg-purple-50/60 text-purple-700 hover:border-purple-400';
      case 'orange':
        return 'border-amber-200 bg-amber-50/60 text-amber-700 hover:border-amber-400';
      default:
        return 'border-emerald-200 bg-emerald-50/60 text-emerald-700 hover:border-emerald-400';
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto py-6 px-4 md:px-8 select-none">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-duo-charcoal">
            Practice Hub
          </h2>
          <p className="text-xs md:text-sm font-bold text-gray-500 mt-1">
            Targeted drills to hone individual IELTS sub-skills and refill hearts for free!
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-gray-200/80 rounded-2xl">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('modules');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'modules'
                ? 'bg-white text-duo-charcoal shadow-sm'
                : 'text-gray-500 hover:text-duo-charcoal'
            }`}
          >
            Skill Drills
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('flashcards');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'flashcards'
                ? 'bg-white text-duo-charcoal shadow-sm'
                : 'text-gray-500 hover:text-duo-charcoal'
            }`}
          >
            Band 8+ Flashcards
          </button>
        </div>
      </div>

      {activeTab === 'modules' ? (
        <div className="space-y-8">
          {/* Smart Interactive Tools */}
          <div>
            <h3 className="text-sm font-black text-duo-charcoal uppercase tracking-widest mb-4">
              Smart IELTS Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SpeakingTimer initialSeconds={120} />
              <div className="flex flex-col justify-center space-y-4">
                <AudioPlayer title="Cambridge IELTS 18 - Test 1 Part 1" />
                <AudioPlayer title="Model Speaking Answer - Band 9" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-duo-charcoal uppercase tracking-widest mb-4">
              Daily Practice Drills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRACTICE_MODULES.map(mod => {
              const Icon = getModuleIcon(mod.icon);
              return (
                <div
                  key={mod.id}
                  onClick={() => {
                    if (onStartPractice && !onStartPractice()) return;
                    sound.playVictory();
                    gainXp(mod.xpReward);
                    refillHearts();
                  }}
                  className={`card-duo p-5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] ${getColorClasses(
                    mod.color
                  )}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/80 border">
                        {mod.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-duo-charcoal mb-1">
                      {mod.title}
                    </h3>
                    <p className="text-xs font-semibold text-gray-600 mb-4 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-current/10">
                    <span className="text-xs font-black text-duo-charcoal">
                      ⏱️ ~{mod.durationMinutes} mins
                    </span>
                    <span className="text-xs font-black text-duo-green flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" /> +{mod.xpReward} XP + ❤️ Full Refill
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      ) : (
        /* Spaced Repetition Flashcards */
        <div className="flex flex-col items-center max-w-xl mx-auto space-y-6">
          <div className="text-xs font-black uppercase tracking-wider text-duo-blue flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>
              Card {currentCardIndex + 1} of {VOCABULARY_FLASHCARDS.length} ({knownCardIds.length} Mastered)
            </span>
          </div>

          {/* Flashcard Card */}
          <div
            onClick={() => {
              sound.playTile();
              setIsFlipped(!isFlipped);
            }}
            className="w-full min-h-[320px] bg-white rounded-3xl border-2 border-duo-gray border-b-6 p-8 flex flex-col justify-between cursor-pointer hover:border-duo-blue transition-all shadow-md text-center select-none animate-bounceSmall"
          >
            {!isFlipped ? (
              /* Front of card */
              <div className="my-auto space-y-4">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
                  {card.band}
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-duo-charcoal">
                  {card.front}
                </h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Topic: {card.category}
                </p>
                <div className="pt-4 text-xs font-black text-duo-blue uppercase tracking-wider flex items-center justify-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Tap to flip and see collocations</span>
                </div>
              </div>
            ) : (
              /* Back of card */
              <div className="text-left space-y-4 my-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-duo-blue">{card.front}</span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      speakText(card.front + '. ' + card.back.academicExample, 0.9, 'en-GB');
                    }}
                    className="p-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-duo-blue"
                  >
                    🔊 Pronounce
                  </button>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-gray-400">Meaning:</div>
                  <p className="text-xs md:text-sm font-bold text-gray-800">{card.back.definition}</p>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-gray-400">High-Scoring Collocations:</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {card.back.collocations.map((col, i) => (
                      <span key={i} className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border text-xs font-semibold text-gray-700 italic">
                  "{card.back.academicExample}"
                </div>
              </div>
            )}
          </div>

          {/* Flashcard Navigation */}
          <div className="flex items-center justify-between w-full gap-4">
            <button
              onClick={handlePrevCard}
              className="btn-duo-white px-5 py-3 text-xs uppercase"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNextCard(false)}
                className="btn-duo-red px-5 py-3 text-xs uppercase"
              >
                Still Learning
              </button>
              <button
                onClick={() => handleNextCard(true)}
                className="btn-duo-green px-5 py-3 text-xs uppercase flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>I Know This (+5 XP)</span>
              </button>
            </div>

            <button
              onClick={() => handleNextCard(false)}
              className="btn-duo-white px-5 py-3 text-xs uppercase"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
