import React, { useState } from 'react';
import { IELTS_UNITS } from '../../data/units';
import { Unit, Lesson } from '../../lib/types';
import { useApp } from '../../lib/store';
import { UnitHeader } from './UnitHeader';
import { LessonNode } from './LessonNode';
import { GuidebookModal } from './GuidebookModal';
import { MascotSvg } from '../mascot/MascotSvg';

interface LearningPathProps {
  onStartLesson: (lesson: Lesson) => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({ onStartLesson }) => {
  const { stats } = useApp();
  const [selectedGuidebookUnit, setSelectedGuidebookUnit] = useState<Unit | null>(null);

  // Find the current active lesson (the first non-completed lesson in the highest unlocked unit)
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

  // Zigzag sequence pattern for the serpentine Duolingo path
  const zigzagOffsets = [0, -1, -1, 0, 1, 1, 0];

  return (
    <div className="flex-1 max-w-2xl mx-auto py-6 px-4 md:px-8 select-none">
      {/* Welcome & Mascot Greeting Banner */}
      <div className="flex items-center justify-between p-5 mb-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-3xl">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-emerald-700 mb-1">
            Welcome to IELTS Prep!
          </div>
          <h2 className="text-xl md:text-2xl font-black text-duo-charcoal leading-tight">
            Targeting Band {stats.targetBand}+
          </h2>
          <p className="text-xs text-gray-600 font-semibold mt-1">
            Complete daily bitesize lessons to build test-day confidence & fluency.
          </p>
        </div>
        <MascotSvg mood="encouraging" size={100} className="shrink-0 -my-2" />
      </div>

      {/* Units Loop */}
      <div className="space-y-12">
        {IELTS_UNITS.map((unit, unitIdx) => {
          const isUnitUnlocked = true; // unit.id <= stats.unlockedUnitId;
          const isUnitCompleted = unit.lessons.every(l => stats.completedLessonIds.includes(l.id));

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
                  const isLessonActive = lesson.id === currentActiveLessonId;
                  const isLessonLocked = false;

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
