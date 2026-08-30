import { aiRouter, AIProviderRouter } from './gateway/AIProviderRouter';
import { ChatMessage, SpeakingEvaluation, WritingEvaluation } from './gateway/AIProvider';
import { ModelManager, AIState } from './ModelManager';

/**
 * Compatibility Facade for legacy AIRouter callers.
 * All operations delegate directly to the authoritative AIProviderRouter.
 */
export class AIRouter {
  private static instance: AIRouter;

  private constructor() {}

  public static getInstance(): AIRouter {
    if (!AIRouter.instance) {
      AIRouter.instance = new AIRouter();
    }
    return AIRouter.instance;
  }

  public async startLocalEngine(onProgress?: (progress: string) => void): Promise<void> {
    const localProvider = aiRouter.getLocalProvider();
    await localProvider.initializeEngine(onProgress);
  }

  public async chat(
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    streamCallback?: (content: string) => void
  ): Promise<string> {
    return aiRouter.chat(messages as ChatMessage[], streamCallback);
  }

  public async generate(prompt: string): Promise<string> {
    return aiRouter.generateText(prompt);
  }

  public async explain(concept: string): Promise<string> {
    return aiRouter.generalQuestion(concept);
  }

  public async evaluateWriting(essay: string, taskType: string): Promise<WritingEvaluation> {
    return aiRouter.evaluateWriting(essay, taskType);
  }

  public async evaluateSpeaking(audioTranscript: string, targetCriteria: any): Promise<SpeakingEvaluation> {
    return aiRouter.evaluateSpeaking(audioTranscript, targetCriteria);
  }
}

export { aiRouter, AIProviderRouter };
