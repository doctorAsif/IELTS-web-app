import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Heart, ArrowRight, RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Lesson, Question } from '../../lib/types';
import { useApp } from '../../lib/store';
import { sound } from '../../lib/audio';
import { ProgressBar } from './ProgressBar';
import { ResultFooter } from './ResultFooter';
import { MultipleChoice } from './MultipleChoice';
import { SentenceBuilder } from './SentenceBuilder';
import { PairMatching } from './PairMatching';
import { TrueFalseNotGiven } from './TrueFalseNotGiven';
import { ListeningExercise } from './ListeningExercise';
import { SpeakingExercise } from './SpeakingExercise';
import { FillInBlank } from './FillInBlank';
import { MascotSvg } from '../mascot/MascotSvg';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({ lesson, onClose }) => {
  const { stats, loseHeart, completeLesson, refillHearts, spendGems } = useApp();

  // Active questions queue (missed questions can be re-queued)
  const [questionsQueue, setQuestionsQueue] = useState<Question[]>(lesson.questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorsCount, setErrorsCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isOutOfHearts, setIsOutOfHearts] = useState(false);

  // Current Question state
  const [answerStatus, setAnswerStatus] = useState<'unanswered' | 'correct' | 'incorrect'>('unanswered');
  const [isReadyToCheck, setIsReadyToCheck] = useState(false);

  // Exercise specific answer buffers
  const [selectedMcIndex, setSelectedMcIndex] = useState<number | null>(null);
  const [assembledSentence, setAssembledSentence] = useState<string>('');
  const [tfngAnswer, setTfngAnswer] = useState<'TRUE' | 'FALSE' | 'NOT GIVEN' | null>(null);
  const [fillBlankAnswer, setFillBlankAnswer] = useState<string>('');
  const [speakingPassed, setSpeakingPassed] = useState<boolean>(false);
  const [pairMatchingDone, setPairMatchingDone] = useState<boolean>(false);

  const currentQ = questionsQueue[currentIndex];

  useEffect(() => {
    // Reset inputs when moving to next question
    setAnswerStatus('unanswered');
    setIsReadyToCheck(false);
    setSelectedMcIndex(null);
    setAssembledSentence('');
    setTfngAnswer(null);
    setFillBlankAnswer('');
    setSpeakingPassed(false);
    setPairMatchingDone(false);
  }, [currentIndex, questionsQueue]);

  // Check user heart depletion
  useEffect(() => {
    if (stats.hearts <= 0 && !isCompleted) {
      setIsOutOfHearts(true);
    }
  }, [stats.hearts, isCompleted]);

  // Evaluate Answer on "CHECK" button click
  const handleCheckAnswer = () => {
    if (!currentQ || answerStatus !== 'unanswered') return;

    let isCorrect = false;

    switch (currentQ.type) {
      case 'multiple-choice':
        isCorrect = selectedMcIndex === currentQ.correctIndex;
        break;

      case 'sentence-builder': {
        const cleanAssembled = assembledSentence.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim().toLowerCase();
        const cleanTarget = currentQ.targetSentence.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim().toLowerCase();
        isCorrect = cleanAssembled === cleanTarget;
        break;
      }

      case 'pair-matching':
        isCorrect = pairMatchingDone;
        break;

      case 'true-false-not-given':
        isCorrect = tfngAnswer === currentQ.correctAnswer;
        break;

      case 'listening-comprehension':
        isCorrect = selectedMcIndex === currentQ.correctIndex;
        break;

      case 'speaking-pronunciation':
        isCorrect = speakingPassed;
        break;

      case 'fill-in-blank': {
        const cleanAns = fillBlankAnswer.trim().toLowerCase();
        const cleanTarget = currentQ.correctAnswer.trim().toLowerCase();
        const alternates = currentQ.acceptableAnswers?.map(a => a.trim().toLowerCase()) || [];
        isCorrect = cleanAns === cleanTarget || alternates.includes(cleanAns);
        break;
      }
    }

    if (isCorrect) {
      sound.playCorrect();
      setAnswerStatus('correct');
    } else {
      sound.playWrong();
      loseHeart();
      setErrorsCount(prev => prev + 1);
      setAnswerStatus('incorrect');
      // Re-queue this question to the end of the lesson so the user masters it!
      setQuestionsQueue(prev => [...prev, currentQ]);
    }
  };

  // Continue to next question or complete lesson
  const handleContinue = () => {
    if (currentIndex + 1 < questionsQueue.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed all questions in the queue!
      setIsCompleted(true);
      sound.playVictory();

      // Trigger Confetti shower!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#58cc02', '#1cb0f6', '#ffc800', '#ce82ff', '#ff4b4b'],
      });

      // Complete in store
      completeLesson(
        lesson.id,
        lesson.unitId,
        lesson.xpReward,
        lesson.gemsReward,
        errorsCount
      );
    }
  };

  // Get formatted correct solution text to show on incorrect banner
  const getCorrectSolutionText = () => {
    if (!currentQ) return '';
    switch (currentQ.type) {
      case 'multiple-choice':
        return currentQ.options[currentQ.correctIndex];
      case 'sentence-builder':
        return currentQ.targetSentence;
      case 'true-false-not-given':
        return currentQ.correctAnswer;
      case 'listening-comprehension':
        return currentQ.options[currentQ.correctIndex];
      case 'speaking-pronunciation':
        return currentQ.sampleAnswer;
      case 'fill-in-blank':
        return currentQ.correctAnswer;
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between overflow-y-auto select-none">
      {/* 1. Out of Hearts Screen */}
      {isOutOfHearts && (
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
          <div className="card-duo max-w-md w-full p-8 text-center animate-bounceSmall shadow-xl">
            <MascotSvg mood="crying" size={130} className="mx-auto mb-4" />
            <h3 className="text-2xl font-black text-duo-charcoal mb-2">
              You ran out of Hearts!
            </h3>
            <p className="text-sm text-gray-600 font-semibold mb-6">
              Keep your practice going without waiting by refilling your hearts or practicing previous lessons.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  if (spendGems(50)) {
                    refillHearts();
                    setIsOutOfHearts(false);
                    sound.playChest();
                  } else {
                    sound.playWrong();
                  }
                }}
                disabled={stats.gems < 50}
                className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider ${
                  stats.gems >= 50 ? 'btn-duo-green' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                REFILL (50 GEMS 💎)
              </button>
              <button
                onClick={() => {
                  refillHearts(); // allow practice
                  onClose();
                }}
                className="btn-duo-white py-3 text-xs uppercase"
              >
                RETURN TO HOME
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Victory / Lesson Completed Summary Screen */}
      {isCompleted && !isOutOfHearts && (
        <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-emerald-50/50 to-white">
          <div className="max-w-lg w-full text-center space-y-6 animate-bounceSmall">
            <MascotSvg mood="celebrating" size={160} className="mx-auto" />
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-duo-gold mb-1">
                Lesson Complete!
              </h2>
              <p className="text-base font-bold text-gray-600">
                You've strengthened your IELTS academic fluency.
              </p>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-3 gap-3">
              {/* XP Earned */}
              <div className="card-duo p-4 bg-amber-50 border-amber-300">
                <div className="text-[11px] font-black uppercase text-amber-800 tracking-wider">
                  TOTAL XP
                </div>
                <div className="text-2xl md:text-3xl font-black text-amber-600 mt-1">
                  +{lesson.xpReward}
                </div>
              </div>

              {/* Accuracy */}
              <div className="card-duo p-4 bg-emerald-50 border-emerald-300">
                <div className="text-[11px] font-black uppercase text-emerald-800 tracking-wider">
                  ACCURACY
                </div>
                <div className="text-2xl md:text-3xl font-black text-emerald-600 mt-1">
                  {Math.max(60, Math.round(((lesson.questions.length) / (lesson.questions.length + errorsCount)) * 100))}%
                </div>
              </div>

              {/* Band Boost */}
              <div className="card-duo p-4 bg-blue-50 border-blue-300">
                <div className="text-[11px] font-black uppercase text-blue-800 tracking-wider">
                  EST. BAND
                </div>
                <div className="text-2xl md:text-3xl font-black text-blue-600 mt-1">
                  {stats.estimatedBand.overall.toFixed(1)}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-full btn-duo-green py-4 text-base font-black uppercase tracking-wider"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* 3. Active Quiz Question View */}
      {!isCompleted && !isOutOfHearts && currentQ && (
        <>
          {/* Top Progress Header */}
          <ProgressBar
            currentStep={currentIndex}
            totalSteps={questionsQueue.length}
            hearts={stats.hearts}
            onQuit={() => {
              sound.playClick();
              onClose();
            }}
          />

          {/* Main Question Body */}
          <div className="flex-1 flex items-center justify-center px-4 py-6 md:py-10">
            {currentQ.type === 'multiple-choice' && (
              <MultipleChoice
                question={currentQ}
                selectedIndex={selectedMcIndex}
                onSelectOption={idx => {
                  setSelectedMcIndex(idx);
                  setIsReadyToCheck(true);
                }}
                isAnswerSubmitted={answerStatus !== 'unanswered'}
                correctIndex={currentQ.correctIndex}
              />
            )}

            {currentQ.type === 'sentence-builder' && (
              <SentenceBuilder
                question={currentQ}
                onAnswerChange={(sentence, isReady) => {
                  setAssembledSentence(sentence);
                  setIsReadyToCheck(isReady);
                }}
                isAnswerSubmitted={answerStatus !== 'unanswered'}
              />
            )}

            {currentQ.type === 'pair-matching' && (
              <PairMatching
                question={currentQ}
                onAllMatched={isComplete => {
                  setPairMatchingDone(isComplete);
                  setIsReadyToCheck(isComplete);
                }}
                isAnswerSubmitted={answerStatus !== 'unanswered'}
              />
            )}

            {currentQ.type === 'true-false-not-given' && (
              <TrueFalseNotGiven
                question={currentQ}
                selectedAnswer={tfngAnswer}
                onSelectAnswer={ans => {
                  setTfngAnswer(ans);
                  setIsReadyToCheck(true);
                }}
                isAnswerSubmitted={answerStatus !== 'unanswered'}
                correctAnswer={currentQ.correctAnswer}
              />
            )}

            {currentQ.type === 'listening-comprehension' && (
              <ListeningExercise
                question={currentQ}
                selectedIndex={selectedMcIndex}
                onSelectOption={idx => {
                  setSelectedMcIndex(idx);
                  setIsReadyToCheck(true);
                }}
                isAnswerSubmitted={answerStatus !== 'unanswered'}
                correctIndex={currentQ.correctIndex}
              />
            )}

            {currentQ.type === 'speaking-pronunciation' && (
              <SpeakingExercise
                question={currentQ}
                onSpeakingComplete={(text, score, isPassing) => {
                  setSpeakingPassed(isPassing);
                  setIsReadyToCheck(true);
                }}
                isAnswerSubmitted={answerStatus !== 'unanswered'}
              />
            )}

            {currentQ.type === 'fill-in-blank' && (
              <FillInBlank
                question={currentQ}
                userAnswer={fillBlankAnswer}
                onAnswerChange={(val, isReady) => {
                  setFillBlankAnswer(val);
                  setIsReadyToCheck(isReady);
                }}
                isAnswerSubmitted={answerStatus !== 'unanswered'}
                correctAnswer={currentQ.correctAnswer}
              />
            )}
          </div>

          {/* Bottom Action / Feedback Footer */}
          <ResultFooter
            status={answerStatus}
            explanation={currentQ.explanation}
            correctAnswerText={getCorrectSolutionText()}
            isCheckDisabled={!isReadyToCheck}
            onCheck={handleCheckAnswer}
            onContinue={handleContinue}
          />
        </>
      )}
    </div>
  );
};
