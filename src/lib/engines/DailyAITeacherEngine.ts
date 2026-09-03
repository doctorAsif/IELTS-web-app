import { StudentMemoryEngine } from './StudentMemoryEngine';

export type HomeworkStatus = 'generated' | 'assigned' | 'in_progress' | 'completed' | 'reviewed';

export interface DailyDrill {
  id: string;
  title: string;
  skill: 'speaking' | 'writing' | 'reading' | 'listening' | 'grammar' | 'vocabulary';
  durationMinutes: number;
  targetBand: number;
  objective: string;
  pedagogicalRationale: string; // The "Why this practice?" explanation
  category: string;
  completed: boolean;
}

export interface HomeworkAssignment {
  id: string;
  title: string;
  skill: string;
  dueDate: string;
  status: HomeworkStatus;
  prompt: string;
  submission?: string;
  feedback?: string;
  score?: number;
  createdAt: string;
}

export interface RollingAccuracyReport {
  history: number[]; // Scores 0-100 of last 5 activities
  averageAccuracy: number;
  windowSize: number;
  status: 'advance' | 'maintain' | 'remediate';
  bandAdjustment: number;
  message: string;
}

const STORAGE_KEY_ROLLING = 'akhl_rolling_accuracy_v1';
const STORAGE_KEY_HOMEWORK = 'akhl_homework_loop_v1';

const memoryFallback: Record<string, string> = {};
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {}
    return memoryFallback[key] || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {}
    memoryFallback[key] = value;
  }
};

export class DailyAITeacherEngine {
  /**
   * Dynamically scales study plan to 2 - 5 drills based on student availability.
   */
  public static generateDailyPlan(
    availabilityMinutes: 15 | 30 | 45 | 60 = 30,
    currentBand: number = 7.0
  ): DailyDrill[] {
    const weaknesses = StudentMemoryEngine.getTopWeaknesses(3);
    const primaryWeaknessSkill = weaknesses[0]?.skill || 'speaking';

    const drillPool: DailyDrill[] = [
      {
        id: 'drill-1',
        title: 'ARE Framework 30-Second Speaking Sprint',
        skill: 'speaking',
        durationMinutes: 10,
        targetBand: currentBand,
        category: 'Fluency & Coherence',
        objective: 'Formulate rapid Assertion, Reason, and Concrete Example in 30 seconds.',
        pedagogicalRationale: 'Dr. Asif Kibria\'s curriculum emphasizes that spontaneous fluency under 30s pressure eliminates filler words ("um", "like") and trains natural discourse markers required for Band 7.5+ in Part 3.',
        completed: false
      },
      {
        id: 'drill-2',
        title: 'Academic Collocation & AWL Pair Drills',
        skill: 'vocabulary',
        durationMinutes: 5,
        targetBand: currentBand,
        category: 'Lexical Resource',
        objective: 'Master high-yield Band 8.0+ collocations from the 1,000 Academic Word List.',
        pedagogicalRationale: 'Lexical Resource accounts for 25% of your IELTS score. Learning multi-word units rather than isolated words directly prevents awkward direct translations from your native tongue.',
        completed: false
      },
      {
        id: 'drill-3',
        title: 'Academic Task 1 Zero-Number Overview Drill',
        skill: 'writing',
        durationMinutes: 15,
        targetBand: currentBand,
        category: 'Task Achievement',
        objective: 'Draft a broad-trend overview paragraph strictly containing zero numeric figures.',
        pedagogicalRationale: 'Including specific numbers in your Task 1 Overview caps Task Achievement at Band 6.0. This exercise conditions the habit of synthesizing macro-trends before diving into body paragraph data.',
        completed: false
      },
      {
        id: 'drill-4',
        title: 'Reading Distractor Trap Analysis',
        skill: 'reading',
        durationMinutes: 15,
        targetBand: currentBand,
        category: 'Reading Comprehension',
        objective: 'Deconstruct misleading synonym traps and distinguish TRUE from NOT GIVEN.',
        pedagogicalRationale: 'Official IELTS Reading exams purposefully reuse passage keywords in false options. Analyzing distractor traps ensures you look for conceptual meaning rather than matching surface-level words.',
        completed: false
      },
      {
        id: 'drill-5',
        title: 'Syntactic Inversion & Cleft Grammar Refinement',
        skill: 'grammar',
        durationMinutes: 15,
        targetBand: currentBand,
        category: 'Grammatical Range',
        objective: 'Transform basic compound sentences into "Not only did..." and cleft focus structures.',
        pedagogicalRationale: 'Achieving Band 8.0+ in Grammatical Range requires demonstrating complex syntactic structures used with full flexibility and accuracy, rather than simply error-free simple sentences.',
        completed: false
      }
    ];

    // Scale count: 15m -> 2 drills, 30m -> 3 drills, 45m -> 4 drills, 60m -> 5 drills
    const drillCounts: Record<number, number> = { 15: 2, 30: 3, 45: 4, 60: 5 };
    const count = drillCounts[availabilityMinutes] || 3;

    // Prioritize drill matching top weakness
    const sorted = [...drillPool].sort((a, b) => {
      if (a.skill === primaryWeaknessSkill) return -1;
      if (b.skill === primaryWeaknessSkill) return 1;
      return 0;
    });

    return sorted.slice(0, count);
  }

  /**
   * Tracks accuracy over a rolling 5-activity window.
   * Advances band by +0.5 on sustained 85%+ accuracy; triggers diagnostic scaffolding on < 60%.
   */
  public static recordActivityAccuracy(scorePercentage: number): RollingAccuracyReport {
    let history: number[] = [];
    try {
      const saved = safeStorage.getItem(STORAGE_KEY_ROLLING);
      if (saved) history = JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading rolling accuracy:', e);
    }

    // Append new score and keep window size <= 5
    history.push(Math.max(0, Math.min(100, Math.round(scorePercentage))));
    if (history.length > 5) {
      history = history.slice(history.length - 5);
    }

    try {
      safeStorage.setItem(STORAGE_KEY_ROLLING, JSON.stringify(history));
    } catch (e) {
      console.warn('Error saving rolling accuracy:', e);
    }

    const averageAccuracy = Math.round(history.reduce((a, b) => a + b, 0) / history.length);

    let status: RollingAccuracyReport['status'] = 'maintain';
    let bandAdjustment = 0;
    let message = `Current 5-activity average accuracy is ${averageAccuracy}%. Sustain steady practice.`;

    if (history.length >= 5 && averageAccuracy >= 85) {
      status = 'advance';
      bandAdjustment = 0.5;
      message = `Outstanding performance! Sustained ${averageAccuracy}% accuracy over 5 activities. Your target band has progressed +0.5.`;
    } else if (averageAccuracy < 60) {
      status = 'remediate';
      bandAdjustment = 0;
      message = `Average accuracy dropped to ${averageAccuracy}%. Diagnostic scaffolding triggered: recommended to review Foundation Tier sentence builders and vocabulary drills.`;
    }

    return {
      history,
      averageAccuracy,
      windowSize: history.length,
      status,
      bandAdjustment,
      message
    };
  }

  public static getRollingAccuracyReport(): RollingAccuracyReport {
    let history: number[] = [80, 85, 75, 90, 85];
    try {
      const saved = safeStorage.getItem(STORAGE_KEY_ROLLING);
      if (saved) history = JSON.parse(saved);
    } catch (e) {
      // default
    }

    const averageAccuracy = Math.round(history.reduce((a, b) => a + b, 0) / history.length);
    let status: RollingAccuracyReport['status'] = 'maintain';
    let bandAdjustment = 0;
    let message = `Current 5-activity average accuracy is ${averageAccuracy}%. Keep up consistent daily study.`;

    if (history.length >= 5 && averageAccuracy >= 85) {
      status = 'advance';
      bandAdjustment = 0.5;
      message = `Sustained ${averageAccuracy}% accuracy across rolling 5-activity window! Ready for +0.5 band elevation.`;
    } else if (averageAccuracy < 60) {
      status = 'remediate';
      message = `Accuracy below 60% (${averageAccuracy}%). Diagnostic scaffolding recommended.`;
    }

    return {
      history,
      averageAccuracy,
      windowSize: history.length,
      status,
      bandAdjustment,
      message
    };
  }

  /**
   * Weakness-driven homework loop lifecycle manager
   */
  public static getHomeworkAssignments(): HomeworkAssignment[] {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY_HOMEWORK);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // default
    }

    const initial: HomeworkAssignment[] = [
      {
        id: 'hw-001',
        title: 'Task 2 Essay Outline & Thesis Statement',
        skill: 'writing',
        dueDate: 'Tomorrow, 11:59 PM',
        status: 'assigned',
        prompt: 'Some people argue that universities should focus exclusively on job-ready skills rather than general knowledge. Discuss both views and give your opinion.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'hw-002',
        title: 'Speaking Part 2 Cue Card Audio Submission',
        skill: 'speaking',
        dueDate: 'In 2 days',
        status: 'generated',
        prompt: 'Describe a significant life decision you made with the help of an advisor.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'hw-003',
        title: 'True / False / Not Given Passage Diagnostic',
        skill: 'reading',
        dueDate: 'Completed yesterday',
        status: 'reviewed',
        prompt: 'Cambridge 18 Academic Reading Test 2 Passage 1',
        submission: 'Answers 1-7: T, F, NG, T, F, T, NG',
        feedback: 'Excellent accuracy (6/7). Good differentiation of explicit contradiction vs unmentioned details.',
        score: 85,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    try {
      safeStorage.setItem(STORAGE_KEY_HOMEWORK, JSON.stringify(initial));
    } catch (e) {
      // ignore
    }

    return initial;
  }

  public static updateHomeworkStatus(
    homeworkId: string,
    newStatus: HomeworkStatus,
    submissionData?: { submission?: string; feedback?: string; score?: number }
  ): HomeworkAssignment[] {
    const list = this.getHomeworkAssignments();
    const updated = list.map(hw => {
      if (hw.id === homeworkId) {
        return {
          ...hw,
          status: newStatus,
          submission: submissionData?.submission ?? hw.submission,
          feedback: submissionData?.feedback ?? hw.feedback,
          score: submissionData?.score ?? hw.score
        };
      }
      return hw;
    });

    try {
      safeStorage.setItem(STORAGE_KEY_HOMEWORK, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    return updated;
  }
}
