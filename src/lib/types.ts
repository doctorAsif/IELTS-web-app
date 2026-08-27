export type SkillType = 'listening' | 'reading' | 'writing' | 'speaking' | 'vocabulary' | 'grammar' | 'overall';

export type QuestionType =
  | 'multiple-choice'
  | 'sentence-builder'
  | 'pair-matching'
  | 'true-false-not-given'
  | 'listening-comprehension'
  | 'speaking-pronunciation'
  | 'fill-in-blank';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  skill: SkillType;
  prompt: string;
  subPrompt?: string;
  explanation: string;
  tip?: string;
  bandImpact?: number; // e.g. 0.1 towards band rating
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctIndex: number;
}

export interface SentenceBuilderQuestion extends BaseQuestion {
  type: 'sentence-builder';
  targetSentence: string;
  words: string[]; // shuffled word chips
  translationOrMeaning?: string;
}

export interface PairMatchingQuestion extends BaseQuestion {
  type: 'pair-matching';
  pairs: { left: string; right: string }[];
}

export interface TrueFalseNotGivenQuestion extends BaseQuestion {
  type: 'true-false-not-given';
  passage: string;
  statement: string;
  correctAnswer: 'TRUE' | 'FALSE' | 'NOT GIVEN';
}

export interface ListeningQuestion extends BaseQuestion {
  type: 'listening-comprehension';
  audioScript: string;
  accent?: 'en-GB' | 'en-US' | 'en-AU';
  options: string[];
  correctIndex: number;
}

export interface SpeakingQuestion extends BaseQuestion {
  type: 'speaking-pronunciation';
  targetPhrase: string;
  sampleAnswer: string;
  keyWordsToDetect: string[];
  part: 'Part 1' | 'Part 2' | 'Part 3';
  cueCardPoints?: string[];
}

export interface FillInBlankQuestion extends BaseQuestion {
  type: 'fill-in-blank';
  sentenceWithBlank: string; // e.g. "Consequently, the government should ___ measures."
  correctAnswer: string;
  acceptableAnswers?: string[];
  options?: string[]; // optional chips for easy mode
}

export type Question =
  | MultipleChoiceQuestion
  | SentenceBuilderQuestion
  | PairMatchingQuestion
  | TrueFalseNotGivenQuestion
  | ListeningQuestion
  | SpeakingQuestion
  | FillInBlankQuestion;

export type LessonType = 'standard' | 'chest' | 'trophy' | 'speaking' | 'listening' | 'writing' | 'reading' | 'practice';

export interface Lesson {
  id: string;
  unitId: number;
  title: string;
  description: string;
  type: LessonType;
  skill: SkillType;
  xpReward: number;
  gemsReward: number;
  questions: Question[];
}

export interface Unit {
  id: number;
  title: string;
  subtitle: string;
  color: 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'gold';
  guidebook: {
    overview: string;
    keyTips: string[];
    vocabulary: { word: string; pos: string; def: string; example: string }[];
    grammarPatterns: { title: string; pattern: string; example: string }[];
  };
  lessons: Lesson[];
}

export interface UserStats {
  xp: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedLessonIds: string[];
  unlockedUnitId: number;
  streakFreezeActive: boolean;
  doubleXpActive: boolean;
  soundEnabled: boolean;
  targetBand: number; // e.g. 7.5, 8.0, 8.5
  estimatedBand: {
    overall: number;
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
  drillsCompleted: number;
  dailyGoalXp: number;
  todayEarnedXp: number;
  freeSpeakingUsed: number;
  freeWritingUsed: number;
  freeListeningUsed: number;
  freeReadingUsed: number;
  freeMockTestsUsed: number;
  freeTrialDate: string; // YYYY-MM-DD format
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  xpReward: number;
  gemsReward: number;
  iconName: string;
  completed: boolean;
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  gemCost: number;
  icon: string;
  type: 'heart_refill' | 'streak_freeze' | 'double_xp' | 'band_booster' | 'super_ielts';
  popular?: boolean;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  targetBand: number;
  isCurrentUser?: boolean;
  rank?: number;
  streak: number;
}

export type LeagueTier = 'Bronze' | 'Silver' | 'Gold' | 'Sapphire' | 'Ruby' | 'Diamond';
