export interface DailyActivity {
  id: string;
  section: 'speaking' | 'writing' | 'reading' | 'listening' | 'vocabulary';
  title: string;
  durationMinutes: number;
  pedagogicalRationale: string;
  difficultyBand: number;
  isCompleted: boolean;
  actionRoute: string;
}

export interface DailyStudyPlan {
  date: string;
  selectedDuration: 15 | 30 | 45 | 60;
  activities: DailyActivity[];
  currentBandEstimate: number;
  targetBand: number;
}

export class DailyTeacherService {
  private static readonly STORAGE_KEY = 'akhl_daily_study_plan';

  static getPlan(minutes: 15 | 30 | 45 | 60 = 30): DailyStudyPlan {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === today && parsed.selectedDuration === minutes) {
          return parsed;
        }
      } catch (e) {
        console.warn('Daily plan parse error:', e);
      }
    }

    const plan = this.generatePlan(today, minutes);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(plan));
    return plan;
  }

  static generatePlan(date: string, minutes: 15 | 30 | 45 | 60): DailyStudyPlan {
    const activitiesMap: Record<number, DailyActivity[]> = {
      15: [
        {
          id: 'act-1',
          section: 'speaking',
          title: 'Speaking Part 2: 5W1H Narrative Drill',
          durationMinutes: 7,
          pedagogicalRationale: 'Dr. Asif Rule: Build 120s stamina using Who, What, Where, When, Why, How before starting writing drills.',
          difficultyBand: 6.5,
          isCompleted: false,
          actionRoute: '/speaking',
        },
        {
          id: 'act-2',
          section: 'vocabulary',
          title: 'Top 20 Academic Collocations',
          durationMinutes: 8,
          pedagogicalRationale: 'Master C1/C2 collocations to instantly elevate Lexical Resource in both Writing and Speaking.',
          difficultyBand: 7.0,
          isCompleted: false,
          actionRoute: '/flashcards',
        },
      ],
      30: [
        {
          id: 'act-1',
          section: 'writing',
          title: 'Writing Task 1: Zero-Number Overview Drill',
          durationMinutes: 12,
          pedagogicalRationale: 'Reinforces Dr. Asif’s Zero Number Rule. Learn to summarize macro trends without citing raw percentages.',
          difficultyBand: 6.5,
          isCompleted: false,
          actionRoute: '/writing',
        },
        {
          id: 'act-2',
          section: 'speaking',
          title: 'Speaking Part 1 & 3: ARE Method Practice',
          durationMinutes: 10,
          pedagogicalRationale: 'Internalize Answer -> Reason -> Example discourse structure to avoid trailing off or giving clipped responses.',
          difficultyBand: 6.5,
          isCompleted: false,
          actionRoute: '/speaking',
        },
        {
          id: 'act-3',
          section: 'vocabulary',
          title: 'C1/C2 Syntactic Subordination Drills',
          durationMinutes: 8,
          pedagogicalRationale: 'Master concessive sentence starters ("Notwithstanding...", "Albeit...") for Grammatical Range score boost.',
          difficultyBand: 7.0,
          isCompleted: false,
          actionRoute: '/flashcards',
        },
      ],
      45: [
        {
          id: 'act-1',
          section: 'reading',
          title: 'Academic Reading: True/False/Not Given Speed Drill',
          durationMinutes: 15,
          pedagogicalRationale: 'Dr. Asif Move On Rule: Stop getting trapped by unknown vocabulary. Lock in scanning for factual keywords.',
          difficultyBand: 7.0,
          isCompleted: false,
          actionRoute: '/reading',
        },
        {
          id: 'act-2',
          section: 'writing',
          title: 'Writing Task 2: PEE Body Paragraph Architecture',
          durationMinutes: 15,
          pedagogicalRationale: 'Structure Point -> Explanation -> Example for ironclad coherence in Task 2 essays.',
          difficultyBand: 7.0,
          isCompleted: false,
          actionRoute: '/writing',
        },
        {
          id: 'act-3',
          section: 'speaking',
          title: 'Speaking Part 2 Full 2-Minute Simulation',
          durationMinutes: 10,
          pedagogicalRationale: 'Uninterrupted 120s cue card recording with AI examiner fluency evaluation.',
          difficultyBand: 6.5,
          isCompleted: false,
          actionRoute: '/speaking',
        },
        {
          id: 'act-4',
          section: 'listening',
          title: 'Section 4 Monologue Note Completion',
          durationMinutes: 5,
          pedagogicalRationale: 'High-speed lecture comprehension with spelling precision checks.',
          difficultyBand: 7.0,
          isCompleted: false,
          actionRoute: '/listening',
        },
      ],
      60: [
        {
          id: 'act-1',
          section: 'reading',
          title: 'Full Section 3 Academic Reading Passage',
          durationMinutes: 20,
          pedagogicalRationale: 'Simulate high-cognitive-load academic texts with summary completion and matching headings.',
          difficultyBand: 7.5,
          isCompleted: false,
          actionRoute: '/reading',
        },
        {
          id: 'act-2',
          section: 'writing',
          title: 'Full Timed Writing Task 2 Essay',
          durationMinutes: 20,
          pedagogicalRationale: 'Complete 250-word timed essay under exam constraints with Band 9 AI diagnostic evaluation.',
          difficultyBand: 7.0,
          isCompleted: false,
          actionRoute: '/writing',
        },
        {
          id: 'act-3',
          section: 'speaking',
          title: 'Speaking Parts 1, 2, and 3 Complete Mock Exam',
          durationMinutes: 12,
          pedagogicalRationale: '12-minute examiner simulation with real-time audio evaluation across all 4 criteria.',
          difficultyBand: 7.0,
          isCompleted: false,
          actionRoute: '/speaking',
        },
        {
          id: 'act-4',
          section: 'vocabulary',
          title: 'IELTS Academic Word List Mastery (50 Items)',
          durationMinutes: 8,
          pedagogicalRationale: 'Cement high-frequency academic collocations in active memory.',
          difficultyBand: 7.5,
          isCompleted: false,
          actionRoute: '/flashcards',
        },
      ],
    };

    return {
      date,
      selectedDuration: minutes,
      activities: activitiesMap[minutes] || activitiesMap[30],
      currentBandEstimate: 6.5,
      targetBand: 7.5,
    };
  }

  static toggleActivityComplete(activityId: string): DailyStudyPlan {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return this.getPlan();
    const plan: DailyStudyPlan = JSON.parse(saved);
    plan.activities = plan.activities.map(act =>
      act.id === activityId ? { ...act, isCompleted: !act.isCompleted } : act
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(plan));
    return plan;
  }
}
