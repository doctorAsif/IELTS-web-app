export interface CurriculumModule {
  id: string;
  title: string;
  section: 'listening' | 'reading' | 'writing' | 'speaking' | 'grammar' | 'vocabulary';
  level: string;
  duration_minutes: number;
  objective: string;
  lessons: LessonItem[];
}

export interface LessonItem {
  id: string;
  title: string;
  description: string;
  rules?: string[];
  tips?: string[];
  practice_prompt?: string;
  sample_answer?: string;
}

export interface PracticeQuestion {
  id: string;
  section: 'listening' | 'reading' | 'writing' | 'speaking';
  type: string;
  title: string;
  instructions: string;
  difficulty_band: number;
  content: string;
  audio_url?: string;
  questions?: any[];
  expected_answer?: string;
  sample_response_band_9?: string;
  criteria_hints?: Record<string, string>;
}

export interface CurriculumMaster {
  version: string;
  author: string;
  institution: string;
  pedagogy: string;
  modules: Record<string, any>;
}
