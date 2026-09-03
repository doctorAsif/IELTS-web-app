import React, { useState } from 'react';
import { IELTS_UNITS } from '../../data/units';
import { Unit, Lesson } from '../../lib/types';
import { useApp } from '../../lib/store';
import { UnitHeader } from './UnitHeader';
import { LessonNode } from './LessonNode';
import { GuidebookModal } from './GuidebookModal';
import { MascotSvg } from '../mascot/MascotSvg';
import { Award, Trophy, Gift, Sparkles, Star } from 'lucide-react';
import { sound } from '../../lib/audio';

interface LearningPathProps {
  onStartLesson: (lesson: Lesson) => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({ onStartLesson }) => {
  const { stats, addGems, gainXp } = useApp();
  const [selectedGuidebookUnit, setSelectedGuidebookUnit] = useState<Unit | null>(null);
  const [openedChests, setOpenedChests] = useState<number[]>([]);

  // Find the current active lesson
  let currentActiveLessonId = 'u1-l1';
  for (const unit of IELTS_UNITS) {
    if (unit.id <= stats.unlockedUnitId) {
      for (const lesson of unit.lessons) {
        if (!stats.completedLessonIds.includes(lesson.id)) {
          currentActiveLessonId = lesson.id;
          break;
        }
      }
    }
  }

  const handleOpenChest = (unitId: number) => {
    if (openedChests.includes(unitId)) return;
    sound.playChest();
    setOpenedChests([...openedChests, unitId]);
    addGems(50);
    gainXp(100);
  };

  // Zigzag sequence pattern for the serpentine Duolingo path
  const zigzagOffsets = [0, -1, -1, 0, 1, 1, 0];

  return (
    <div className="flex-1 max-w-2xl mx-auto py-6 px-4 md:px-8 select-none animate-fadeInUp">
      {/* Welcome & Mascot Greeting Banner */}
      <div className="flex items-center justify-between p-6 mb-8 bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] border border-[#38BDF8]/30 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-0.5 rounded-full border border-[#38BDF8]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 6-Unit Master Curriculum
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
            Targeting Band {stats.targetBand.toFixed(1)}+
          </h2>
          <p className="text-xs text-[#94A3B8] font-semibold mt-1 max-w-sm">
            Dr. Asif Kibria's proven micro-learning path. Advance unit-by-unit with milestone rewards.
          </p>
        </div>
        <div className="w-20 h-20 shrink-0 bg-sky-950/40 rounded-full flex items-center justify-center border border-[#38BDF8]/30">
          <MascotSvg mood="encouraging" size={72} />
        </div>
      </div>

      {/* Units Loop */}
      <div className="space-y-12">
        {IELTS_UNITS.map((unit, unitIdx) => {
          const isUnitUnlocked = unit.id <= stats.unlockedUnitId;
          const isUnitCompleted = unit.lessons.every(l => stats.completedLessonIds.includes(l.id));
          const isChestOpened = openedChests.includes(unit.id);

          return (
            <section key={unit.id} className="relative">
              {/* Unit Header Card */}
              <UnitHeader
                unit={unit}
                isUnlocked={isUnitUnlocked}
                isCompleted={isUnitCompleted}
                onOpenGuidebook={u => setSelectedGuidebookUnit(u)}
              />

              {/* Lesson Nodes Path */}
              <div className="relative flex flex-col items-center py-4">
                {unit.lessons.map((lesson, lessonIdx) => {
                  const isLessonCompleted = stats.completedLessonIds.includes(lesson.id);
                  const isLessonActive = lesson.id === currentActiveLessonId && isUnitUnlocked;
                  const isLessonLocked =
                    !isUnitUnlocked ||
                    (!isLessonCompleted && !isLessonActive && !stats.completedLessonIds.includes(lesson.id));

                  const offsetIndex = zigzagOffsets[(unitIdx * 3 + lessonIdx) % zigzagOffsets.length];

                  return (
                    <LessonNode
                      key={lesson.id}
                      lesson={lesson}
                      isCompleted={isLessonCompleted}
                      isActive={isLessonActive}
                      isLocked={isLessonLocked}
                      offsetIndex={offsetIndex}
                      onStartLesson={onStartLesson}
                    />
                  );
                })}

                {/* Milestone Chest & Trophy Checkpoint at end of unit */}
                <div className="my-6 flex flex-col items-center">
                  {isUnitCompleted ? (
                    <button
                      onClick={() => handleOpenChest(unit.id)}
                      disabled={isChestOpened}
                      className={`flex flex-col items-center p-4 rounded-3xl border transition transform hover:scale-105 active:scale-95 ${
                        isChestOpened
                          ? 'bg-slate-800/60 border-slate-700 text-slate-400'
                          : 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-lg animate-bounce'
                      }`}
                    >
                      <Gift className="w-10 h-10 mb-1" />
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {isChestOpened ? 'Chest Claimed (+50 💎)' : 'Claim Milestone Chest!'}
                      </span>
                    </button>
                  ) : (
                    <div className="flex flex-col items-center text-slate-600 opacity-60">
                      <Trophy className="w-8 h-8" />
                      <span className="text-[10px] font-bold mt-1">Unit {unit.id} Checkpoint</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Guidebook Modal */}
      {selectedGuidebookUnit && (
        <GuidebookModal
          unit={selectedGuidebookUnit}
          onClose={() => setSelectedGuidebookUnit(null)}
        />
      )}
    </div>
  );
};
