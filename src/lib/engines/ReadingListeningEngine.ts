import { aiRouter } from '../ai/gateway/AIProviderRouter';

export class ReadingListeningEngine {
  /**
   * Deterministic scoring function.
   * Compares the student's answer against the official answer key.
   */
  static scoreAnswer(studentAnswer: string, correctAnswer: string): boolean {
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .trim()
        .replace(/[.,!?;:'"()]/g, '')
        .replace(/\s+/g, ' ');

    return normalize(studentAnswer) === normalize(correctAnswer);
  }

  /**
   * Generates a grounded pedagogical explanation using the authoritative AI router.
   */
  static async explainAnswer(
    passageOrAudioTranscript: string,
    question: string,
    studentAnswer: string,
    correctAnswer: string
  ): Promise<string> {
    return aiRouter.explainAnswer(
      passageOrAudioTranscript,
      question,
      studentAnswer,
      correctAnswer
    );
  }
}
