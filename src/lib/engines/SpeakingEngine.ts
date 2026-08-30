import { aiRouter } from '../ai/gateway/AIProviderRouter';
import { SpeakingEvaluation } from '../ai/gateway/AIProvider';
import { LocalRAGEngine } from './LocalRAGEngine';

export type { SpeakingEvaluation };

export class SpeakingEngine {
  /**
   * Evaluates an IELTS speaking transcript using the authoritative AI router.
   * Note: Speech recognition and acoustic signals are handled separately via Web Speech API.
   */
  static async evaluateSpeaking(
    transcript: string,
    taskPrompt: string,
    acousticSignals?: { pauses: number; wpm: number }
  ): Promise<SpeakingEvaluation> {
    const ragContext = LocalRAGEngine.retrieveContext(taskPrompt);
    const targetCriteria = {
      taskPrompt,
      ragContext,
      acousticSignals: {
        pauses: acousticSignals?.pauses ?? 0,
        estimatedWPM: acousticSignals?.wpm ?? 120
      }
    };

    return aiRouter.evaluateSpeaking(transcript, targetCriteria);
  }
}
