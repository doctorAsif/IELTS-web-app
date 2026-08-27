import { CloudAIAdapter } from './CloudAIAdapter';

export class GeminiProvider implements CloudAIAdapter {
  public providerId = 'gemini';

  async generateTask(prompt: string, context?: any): Promise<any> {
    return { provider: this.providerId, message: `Mock Gemini Response for: ${prompt}` };
  }

  async evaluateSpeaking(audioTranscript: string, targetCriteria: any, context?: any): Promise<any> {
    return {
      provider: this.providerId,
      overallBand: 7.0,
      feedback: 'Good fluency, mock evaluation.'
    };
  }

  async evaluateWriting(essay: string, taskType: string, context?: any): Promise<any> {
    return {
      provider: this.providerId,
      overallBand: 6.5,
      feedback: 'Clear structure, mock evaluation.'
    };
  }

  async generalQuestion(question: string, context?: any): Promise<string> {
    return `[Gemini] Answer to: ${question}`;
  }

  async executeTask(taskType: string, payload: any, context?: any): Promise<any> {
    return { provider: this.providerId, taskType, status: 'success', mock: true };
  }
}
