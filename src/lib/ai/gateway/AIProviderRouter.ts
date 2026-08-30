import {
  AIProvider,
  AIRequestContext,
  AITaskType,
  ChatMessage,
  SpeakingEvaluation,
  WritingEvaluation
} from './AIProvider';
import { BrowserLocalLLMProvider } from './BrowserLocalLLMProvider';
import { CloudAIGatewayClient } from './CloudAIGatewayClient';
import { AITaskClassifier } from './AITaskClassifier';
import { ModelManager, AIState } from '../ModelManager';

export class AIProviderRouter implements AIProvider {
  public readonly providerId = 'router';

  private localProvider = new BrowserLocalLLMProvider();
  private cloudProvider = new CloudAIGatewayClient();

  public getLocalProvider(): BrowserLocalLLMProvider {
    return this.localProvider;
  }

  public getCloudProvider(): CloudAIGatewayClient {
    return this.cloudProvider;
  }

  /**
   * Central connectivity helper
   */
  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  /**
   * Decides which provider to use based on task type, model readiness, and connectivity.
   */
  private async route(taskType: AITaskType, payload: any, context?: AIRequestContext): Promise<AIProvider> {
    const manager = ModelManager.getInstance();
    const isLocalReady = manager.currentState === AIState.READY && this.localProvider.isReady();
    const canRunLocal = AITaskClassifier.canRunLocally(taskType, payload);
    const requiresResearch = AITaskClassifier.requiresWebResearch(taskType, payload) || !!context?.webResearchRequired;
    const online = this.isOnline();

    // 1. Explicit preference in context
    if (context?.preferredProvider === 'local-webllm' && isLocalReady) {
      return this.localProvider;
    }
    if (context?.preferredProvider === 'cloud-gateway' && online) {
      return this.cloudProvider;
    }

    // 2. Offline Mode Guard: Never attempt cloud calls when offline
    if (!online) {
      if (isLocalReady && canRunLocal) {
        return this.localProvider;
      }
      throw new Error('Device is offline and Local AI is not ready. Please install/start Local AI or connect to the internet.');
    }

    // 3. Web research always requires cloud
    if (requiresResearch) {
      return this.cloudProvider;
    }

    // 4. Local-First Strategy: If local model is ready and task is supported, run locally (0 cloud credits consumed)
    if (isLocalReady && canRunLocal) {
      return this.localProvider;
    }

    // 5. Cloud fallback when local is unavailable or downloading
    return this.cloudProvider;
  }

  // --- AIProvider Interface Implementation ---

  async chat(
    messages: ChatMessage[],
    streamCallback?: (chunk: string) => void,
    context?: AIRequestContext
  ): Promise<string> {
    try {
      const provider = await this.route('student_question', { messages }, context);
      return await provider.chat(messages, streamCallback, context);
    } catch (e: any) {
      if (this.isOnline() && !context?.webResearchRequired) {
        console.warn('[AIProviderRouter] Primary provider failed, attempting Cloud fallback...', e);
        return this.cloudProvider.chat(messages, streamCallback, context);
      }
      throw e;
    }
  }

  async generateText(prompt: string, context?: AIRequestContext): Promise<string> {
    try {
      const provider = await this.route('task_generation', { prompt }, context);
      return await provider.generateText(prompt, context);
    } catch (e: any) {
      if (this.isOnline()) {
        console.warn('[AIProviderRouter] generateText fallback to cloud', e);
        return this.cloudProvider.generateText(prompt, context);
      }
      throw e;
    }
  }

  async evaluateSpeaking(
    audioTranscript: string,
    targetCriteria: any,
    context?: AIRequestContext
  ): Promise<SpeakingEvaluation> {
    try {
      const provider = await this.route('speaking_evaluation', { audioTranscript, targetCriteria }, context);
      return await provider.evaluateSpeaking(audioTranscript, targetCriteria, context);
    } catch (e: any) {
      if (this.isOnline()) {
        console.warn('[AIProviderRouter] evaluateSpeaking fallback to cloud', e);
        return this.cloudProvider.evaluateSpeaking(audioTranscript, targetCriteria, context);
      }
      throw e;
    }
  }

  async evaluateWriting(
    essay: string,
    taskPrompt: string,
    context?: AIRequestContext
  ): Promise<WritingEvaluation> {
    try {
      const provider = await this.route('writing_evaluation', { essay, taskPrompt }, context);
      return await provider.evaluateWriting(essay, taskPrompt, context);
    } catch (e: any) {
      if (this.isOnline()) {
        console.warn('[AIProviderRouter] evaluateWriting fallback to cloud', e);
        return this.cloudProvider.evaluateWriting(essay, taskPrompt, context);
      }
      throw e;
    }
  }

  async explainAnswer(
    contextData: string,
    question: string,
    studentAnswer: string,
    correctAnswer: string,
    context?: AIRequestContext
  ): Promise<string> {
    try {
      const provider = await this.route('reading_explanation', { contextData, question, studentAnswer, correctAnswer }, context);
      return await provider.explainAnswer(contextData, question, studentAnswer, correctAnswer, context);
    } catch (e: any) {
      if (this.isOnline()) {
        console.warn('[AIProviderRouter] explainAnswer fallback to cloud', e);
        return this.cloudProvider.explainAnswer(contextData, question, studentAnswer, correctAnswer, context);
      }
      throw e;
    }
  }

  async generateDrill(topic: string, context?: AIRequestContext): Promise<string> {
    try {
      const provider = await this.route('drill_generation', { topic }, context);
      return await provider.generateDrill(topic, context);
    } catch (e: any) {
      if (this.isOnline()) {
        console.warn('[AIProviderRouter] generateDrill fallback to cloud', e);
        return this.cloudProvider.generateDrill(topic, context);
      }
      throw e;
    }
  }

  async generalQuestion(question: string, context?: AIRequestContext): Promise<string> {
    try {
      const provider = await this.route('student_question', { question }, context);
      return await provider.generalQuestion(question, context);
    } catch (e: any) {
      if (this.isOnline()) {
        console.warn('[AIProviderRouter] generalQuestion fallback to cloud', e);
        return this.cloudProvider.generalQuestion(question, context);
      }
      throw e;
    }
  }

  async executeTask<T = any>(
    taskType: AITaskType,
    payload: any,
    context?: AIRequestContext
  ): Promise<T> {
    try {
      const provider = await this.route(taskType, payload, context);
      return await provider.executeTask<T>(taskType, payload, context);
    } catch (e: any) {
      if (this.isOnline()) {
        console.warn(`[AIProviderRouter] executeTask (${taskType}) fallback to cloud`, e);
        return this.cloudProvider.executeTask<T>(taskType, payload, context);
      }
      throw e;
    }
  }
}

// Canonical singleton export
export const aiRouter = new AIProviderRouter();
