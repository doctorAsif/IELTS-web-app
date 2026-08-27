export type AITaskType = 
  | 'student_question'
  | 'speaking_evaluation'
  | 'writing_evaluation'
  | 'reading_evaluation'
  | 'listening_evaluation'
  | 'task_generation'
  | 'homework_generation'
  | 'daily_plan'
  | 'research'
  | 'summarization'
  | 'coding'
  | 'admin_analysis';

export interface AIRequestContext {
  userId?: string;
  studentPlan?: string;
  curriculumContext?: any;
  practiceContext?: any;
  webResearchRequired?: boolean;
}

export interface AIProvider {
  /**
   * Unique identifier for the provider (e.g. 'local-webllm', 'cloud-gateway')
   */
  providerId: string;

  /**
   * General purpose task generation
   */
  generateTask(prompt: string, context?: AIRequestContext): Promise<any>;

  /**
   * Evaluate a student's speaking response
   */
  evaluateSpeaking(audioTranscript: string, targetCriteria: any, context?: AIRequestContext): Promise<any>;

  /**
   * Evaluate a student's writing response
   */
  evaluateWriting(essay: string, taskType: string, context?: AIRequestContext): Promise<any>;

  /**
   * Answer general student questions
   */
  generalQuestion(question: string, context?: AIRequestContext): Promise<string>;

  /**
   * Execute an arbitrary structured task
   */
  executeTask<T = any>(taskType: AITaskType, payload: any, context?: AIRequestContext): Promise<T>;
}
