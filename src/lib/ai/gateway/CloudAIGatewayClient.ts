import { getFunctions, httpsCallable } from 'firebase/functions';
import {
  AIProvider,
  AIRequestContext,
  AITaskType,
  ChatMessage,
  SpeakingEvaluation,
  WritingEvaluation
} from './AIProvider';

export class CloudAIGatewayClient implements AIProvider {
  public readonly providerId = 'cloud-gateway';

  private async executeCloudFunction(taskType: AITaskType, payload: any, context?: AIRequestContext): Promise<any> {
    try {
      const functions = getFunctions();
      const aiExecute = httpsCallable(functions, 'aiExecute');

      const response = await aiExecute({
        taskType,
        payload,
        context
      });

      return (response.data as any).result;
    } catch (error: any) {
      console.error('CloudAIGatewayClient Error:', error);
      throw new Error(`Cloud AI execution failed: ${error.message}`);
    }
  }

  async chat(
    messages: ChatMessage[],
    streamCallback?: (chunk: string) => void,
    context?: AIRequestContext
  ): Promise<string> {
    const result = await this.executeCloudFunction('student_question', { messages }, context);
    const text = typeof result === 'string' ? result : result?.text || JSON.stringify(result);
    if (streamCallback) {
      streamCallback(text);
    }
    return text;
  }

  async generateText(prompt: string, context?: AIRequestContext): Promise<string> {
    return this.chat([{ role: 'user', content: prompt }], undefined, context);
  }

  async evaluateSpeaking(
    audioTranscript: string,
    targetCriteria: any,
    context?: AIRequestContext
  ): Promise<SpeakingEvaluation> {
    return this.executeCloudFunction('speaking_evaluation', { audioTranscript, targetCriteria }, context);
  }

  async evaluateWriting(
    essay: string,
    taskPrompt: string,
    context?: AIRequestContext
  ): Promise<WritingEvaluation> {
    return this.executeCloudFunction('writing_evaluation', { essay, taskPrompt }, context);
  }

  async explainAnswer(
    contextData: string,
    question: string,
    studentAnswer: string,
    correctAnswer: string,
    context?: AIRequestContext
  ): Promise<string> {
    return this.executeCloudFunction('reading_explanation', { contextData, question, studentAnswer, correctAnswer }, context);
  }

  async generateDrill(topic: string, context?: AIRequestContext): Promise<string> {
    return this.executeCloudFunction('drill_generation', { topic }, context);
  }

  async generalQuestion(question: string, context?: AIRequestContext): Promise<string> {
    return this.executeCloudFunction('student_question', { question }, context);
  }

  async executeTask<T = any>(taskType: AITaskType, payload: any, context?: AIRequestContext): Promise<T> {
    return this.executeCloudFunction(taskType, payload, context);
  }
}
