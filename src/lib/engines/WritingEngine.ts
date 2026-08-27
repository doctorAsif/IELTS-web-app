import { AIRouter } from '../ai/AIRouter';
import { WRITING_EXAMINER_PROMPT_V1 } from '../ai/prompts/prompts';

export interface WritingEvaluation {
  taskResponse: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammar: number;
  estimatedBand: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  corrections: string[];
  nextPractice: string[];
}

export class WritingEngine {
  /**
   * Evaluates an IELTS essay using structured output from the Local AI.
   */
  static async evaluateEssay(essay: string, taskPrompt: string): Promise<WritingEvaluation | null> {
    const router = AIRouter.getInstance();
    
    const prompt = `
Task Prompt: ${taskPrompt}
Student Essay:
${essay}

Evaluate this essay according to official IELTS criteria.
Return ONLY valid JSON matching this schema, no markdown blocks, just the raw JSON:
{
  "taskResponse": number (0-9),
  "coherenceCohesion": number (0-9),
  "lexicalResource": number (0-9),
  "grammar": number (0-9),
  "estimatedBand": number (0-9),
  "confidence": number (0-1),
  "strengths": ["string"],
  "weaknesses": ["string"],
  "corrections": ["string"],
  "nextPractice": ["string"]
}
    `;

    try {
      const response = await router.chat([
        { role: 'system', content: WRITING_EXAMINER_PROMPT_V1 },
        { role: 'user', content: prompt }
      ]);
      
      // Clean potential markdown wrap if the model ignores the instruction
      const cleaned = response.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const evaluation = JSON.parse(cleaned) as WritingEvaluation;
      
      return evaluation;
    } catch (e) {
      console.error("Failed to evaluate writing or parse JSON:", e);
      return null;
    }
  }
}
