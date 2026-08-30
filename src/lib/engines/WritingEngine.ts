import { aiRouter } from '../ai/gateway/AIProviderRouter';
import { WritingEvaluation } from '../ai/gateway/AIProvider';
import { LocalRAGEngine } from './LocalRAGEngine';

export type { WritingEvaluation };

export class WritingEngine {
  /**
   * Evaluates an IELTS essay using the authoritative AI router with RAG grounding.
   */
  static async evaluateEssay(essay: string, taskPrompt: string): Promise<WritingEvaluation> {
    const ragContext = LocalRAGEngine.retrieveContext(taskPrompt);
    const enrichedPrompt = ragContext
      ? `Evaluation Rubric Context:\n${ragContext}\n\nTask Prompt: ${taskPrompt}`
      : taskPrompt;

    return aiRouter.evaluateWriting(essay, enrichedPrompt);
  }
}
