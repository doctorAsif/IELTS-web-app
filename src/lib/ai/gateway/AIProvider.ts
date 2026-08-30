export type AITaskType = 
  | 'student_question'
  | 'speaking_evaluation'
  | 'writing_evaluation'
  | 'reading_explanation'
  | 'listening_explanation'
  | 'task_generation'
  | 'homework_generation'
  | 'daily_plan'
  | 'drill_generation'
  | 'research'
  | 'summarization'
  | 'coding'
  | 'admin_analysis';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface SpeakingEvaluation {
  fluency: number;
  coherence: number;
  vocabulary: number;
  grammar: number;
  pronunciation: number;
  estimatedBand: number;
  feedback: string;
  strengths?: string[];
  weaknesses?: string[];
}

export interface WritingEvaluation {
  taskResponse: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammar: number;
  estimatedBand: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  corrections: string[];
  nextPractice: string[];
}

export interface AIRequestContext {
  userId?: string;
  studentPlan?: string;
  curriculumContext?: any;
  practiceContext?: any;
  webResearchRequired?: boolean;
  preferredProvider?: 'local-webllm' | 'cloud-gateway';
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  /**
   * Unique identifier for the provider (e.g. 'local-webllm', 'cloud-gateway', 'router')
   */
  readonly providerId: string;

  /**
   * Multi-turn chat with optional streaming callback
   */
  chat(
    messages: ChatMessage[],
    streamCallback?: (chunk: string) => void,
    context?: AIRequestContext
  ): Promise<string>;

  /**
   * General purpose text/prompt generation
   */
  generateText(prompt: string, context?: AIRequestContext): Promise<string>;

  /**
   * Evaluate a student's speaking response transcript
   */
  evaluateSpeaking(
    audioTranscript: string,
    targetCriteria: any,
    context?: AIRequestContext
  ): Promise<SpeakingEvaluation>;

  /**
   * Evaluate a student's IELTS essay (Task 1 or Task 2)
   */
  evaluateWriting(
    essay: string,
    taskPrompt: string,
    context?: AIRequestContext
  ): Promise<WritingEvaluation>;

  /**
   * Explain an answer for Reading or Listening with context evidence
   */
  explainAnswer(
    contextData: string,
    question: string,
    studentAnswer: string,
    correctAnswer: string,
    context?: AIRequestContext
  ): Promise<string>;

  /**
   * Generate an adaptive practice drill
   */
  generateDrill(topic: string, context?: AIRequestContext): Promise<string>;

  /**
   * Answer general student questions / concept explanations
   */
  generalQuestion(question: string, context?: AIRequestContext): Promise<string>;

  /**
   * Execute an arbitrary structured task
   */
  executeTask<T = any>(
    taskType: AITaskType,
    payload: any,
    context?: AIRequestContext
  ): Promise<T>;
}
