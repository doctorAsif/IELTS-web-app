import { AIProvider, AIRequestContext, AITaskType } from './AIProvider';
import { AIRouter } from '../AIRouter';

export class BrowserLocalLLMProvider implements AIProvider {
  public providerId = 'local-webllm';
  private router = AIRouter.getInstance();

  async generateTask(prompt: string, context?: AIRequestContext): Promise<any> {
    const response = await this.router.generate(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return { text: response };
    }
  }

  async evaluateSpeaking(audioTranscript: string, targetCriteria: any, context?: AIRequestContext): Promise<any> {
    const prompt = `Evaluate the following speaking transcript against these criteria: ${JSON.stringify(targetCriteria)}.\n\nTranscript: ${audioTranscript}\n\nReturn JSON ONLY.`;
    const response = await this.router.generate(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return { raw: response, error: 'Failed to parse structured output' };
    }
  }

  async evaluateWriting(essay: string, taskType: string, context?: AIRequestContext): Promise<any> {
    return this.router.evaluateWriting(essay, taskType);
  }

  async generalQuestion(question: string, context?: AIRequestContext): Promise<string> {
    return this.router.explain(question);
  }

  async executeTask<T = any>(taskType: AITaskType, payload: any, context?: AIRequestContext): Promise<T> {
    const prompt = `Execute task: ${taskType}\nPayload: ${JSON.stringify(payload)}\nReturn structured JSON ONLY.`;
    const response = await this.router.generate(prompt);
    try {
      return JSON.parse(response) as T;
    } catch {
      return { raw: response, error: 'Failed to parse structured output' } as any;
    }
  }
}
