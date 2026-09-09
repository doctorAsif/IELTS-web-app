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
  rawItem?: SpeakingPracticeItem | WritingPracticeItem | ReadingPracticeItem | ListeningPracticeItem;
}

export interface CurriculumMaster {
  version: string;
  author: string;
  institution: string;
  pedagogy: string;
  modules: Record<string, any>;
}

// ---------------------------------------------------------------------------
// IELTS Comprehensive 400 Practice Asset Bank Models (100 Speaking, 100 Writing, 100 Reading, 100 Listening)
// ---------------------------------------------------------------------------

export interface SpeakingPart1Data {
  theme: string;
  questions: string[];
}

export interface SpeakingPart2Data {
  cue_card_topic: string;
  prompts: string[];
  follow_up_question: string;
}

export interface SpeakingPart3Data {
  discussion_theme: string;
  questions: string[];
}

export interface SpeakingPracticeItem {
  id: string;
  topic: string;
  difficulty: string;
  part_1: SpeakingPart1Data;
  part_2: SpeakingPart2Data;
  part_3: SpeakingPart3Data;
  band_9_lexical_resource: string[];
  examiner_tips?: string;
  mentor_technique?: string;
  deshi_pitfall_alert?: string;
  model_answer_snippet?: string;
}

export interface WritingPracticeItem {
  id: string;
  task_type: string;
  title: string;
  prompt: string;
  data_or_scenario_description: string;
  recommended_time_minutes: number;
  minimum_word_count: number;
  key_features_to_report?: string[] | any;
  suggested_outline?: Record<string, string> | any;
  high_band_vocabulary: string[];
  mentor_technique?: string;
  deshi_pitfall_alert?: string;
  model_answer_snippet?: string;
}

export interface ReadingPracticeQuestion {
  question_number: number;
  type: string;
  question_text: string;
  options?: string[] | Record<string, string> | null;
  correct_answer: string;
  distractor_logic?: string;
  explanation?: string;
}

export interface ReadingPracticeItem {
  id: string;
  title: string;
  domain: string;
  word_count: number;
  passage: string;
  questions: ReadingPracticeQuestion[];
  mentor_technique?: string;
  deshi_pitfall_alert?: string;
}

export interface ListeningPracticeQuestion {
  question_number: number;
  type: string;
  instruction?: string;
  question_text: string;
  options?: string[] | Record<string, string> | null;
  correct_answer: string;
  explanation?: string;
}

export interface ListeningPracticeItem {
  id: string;
  section: number;
  context: string;
  scenario: string;
  audio_script: string;
  questions: ListeningPracticeQuestion[];
  mentor_technique?: string;
  deshi_pitfall_alert?: string;
}

export interface IeltsComprehensiveBank {
  dataset_name: string;
  edition?: string;
  version: string;
  created_at: string;
  total_practice_items: number;
  pedagogical_focus?: {
    deshi_pitfall_alerts?: string;
    mentor_frameworks?: string;
  };
  modules: {
    speaking: {
      description: string;
      item_count: number;
      data: SpeakingPracticeItem[];
    };
    writing: {
      description: string;
      item_count: number;
      data: WritingPracticeItem[];
    };
    reading: {
      description: string;
      item_count: number;
      data: ReadingPracticeItem[];
    };
    listening: {
      description: string;
      item_count: number;
      data: ListeningPracticeItem[];
    };
  };
}
