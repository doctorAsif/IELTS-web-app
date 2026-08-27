import { AIRouter } from '../ai/AIRouter';
import { TEACHER_PROMPT_V1 } from '../ai/prompts/prompts';

export class ReadingListeningEngine {
  /**
   * Deterministic scoring function.
   * Compares the student's answer against the known correct answer key.
   */
  static scoreAnswer(studentAnswer: string, correctAnswer: string): boolean {
    // Basic normalization for deterministic checking
    const normalize = (str: string) => str.toLowerCase().trim().replace(/[.,!?;:]/g, '');
    return normalize(studentAnswer) === normalize(correctAnswer);
  }

  /**
   * Uses Local AI to explain why an answer is correct or incorrect.
   */
  static async explainAnswer(
    passageOrAudioTranscript: string, 
    question: string, 
    studentAnswer: string, 
    correctAnswer: string
  ): Promise<string> {
    const isCorrect = this.scoreAnswer(studentAnswer, correctAnswer);
    const router = AIRouter.getInstance();
    
    const prompt = `
Context: ${passageOrAudioTranscript}
Question: ${question}
Correct Answer: ${correctAnswer}
Student Answer: ${studentAnswer} (${isCorrect ? 'Correct' : 'Incorrect'})

Explain to the student why the correct answer is correct based on the context. 
If the student was incorrect, explain why their answer does not fit. Provide relevant evidence from the context.
    `;

    return router.chat([
      { role: 'system', content: TEACHER_PROMPT_V1 },
      { role: 'user', content: prompt }
    ]);
  }
}
