export interface CloudAIAdapter {
  providerId: string;
  generateTask(prompt: string, context?: any): Promise<any>;
  evaluateSpeaking(audioTranscript: string, targetCriteria: any, context?: any): Promise<any>;
  evaluateWriting(essay: string, taskType: string, context?: any): Promise<any>;
  generalQuestion(question: string, context?: any): Promise<string>;
  executeTask(taskType: string, payload: any, context?: any): Promise<any>;
}
