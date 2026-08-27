import { AIRouter } from '../ai/AIRouter';
import { SPEAKING_EXAMINER_PROMPT_V1 } from '../ai/prompts/prompts';

export interface SpeakingEvaluation {
  fluency: number;
  coherence: number;
  vocabulary: number;
  grammar: number;
  pronunciation: number;
  estimatedBand: number;
  feedback: string;
}

export class SpeakingEngine {
  /**
   * Evaluates an IELTS speaking transcript using structured output from the Local AI.
   * Note: Acoustic pronunciation analysis is handled separately; this engine evaluates the textual transcript and extracted signals.
   */
  static async evaluateSpeaking(
    transcript: string, 
    taskPrompt: string, 
    acousticSignals?: { pauses: number, wpm: number }
  ): Promise<SpeakingEvaluation | null> {
    const router = AIRouter.getInstance();
    
    const prompt = `
Task Prompt: ${taskPrompt}
Student Transcript: ${transcript}
Acoustic Signals: Pauses: ${acousticSignals?.pauses ?? 'Unknown'}, WPM: ${acousticSignals?.wpm ?? 'Unknown'}

Evaluate this speaking performance according to official IELTS criteria.
Return ONLY valid JSON matching this schema, no markdown blocks, just the raw JSON:
{
  "fluency": number (0-9),
  "coherence": number (0-9),
  "vocabulary": number (0-9),
  "grammar": number (0-9),
  "pronunciation": number (0-9),
  "estimatedBand": number (0-9),
  "feedback": "string"
}
    `;

    try {
      const response = await router.chat([
        { role: 'system', content: SPEAKING_EXAMINER_PROMPT_V1 },
        { role: 'user', content: prompt }
      ]);
      
      const cleaned = response.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const evaluation = JSON.parse(cleaned) as SpeakingEvaluation;
      
      return evaluation;
    } catch (e) {
      console.error("Failed to evaluate speaking or parse JSON:", e);
      return null;
    }
  }
}
