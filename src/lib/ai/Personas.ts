import { aiRouter } from './gateway/AIProviderRouter';
import * as Prompts from './prompts/prompts';

export class AITeacher {
  static async explain(concept: string): Promise<string> {
    return aiRouter.chat([
      { role: 'system', content: Prompts.TEACHER_PROMPT_V1 },
      { role: 'user', content: `Please explain this IELTS concept: ${concept}` }
    ]);
  }
}

export class AITrainer {
  static async generateDrill(topic: string): Promise<string> {
    return aiRouter.chat([
      { role: 'system', content: Prompts.TRAINER_PROMPT_V1 },
      { role: 'user', content: `Generate a focused IELTS practice drill for: ${topic}` }
    ]);
  }
}

export class AIExaminer {
  static async evaluate(answer: string, questionContext: string): Promise<string> {
    return aiRouter.chat([
      { role: 'system', content: Prompts.EXAMINER_PROMPT_V1 },
      { role: 'user', content: `Question Context: ${questionContext}\nCandidate Response: ${answer}\nEvaluate objectively.` }
    ]);
  }
}

export class AICoach {
  static async recommend(weaknesses: string[]): Promise<string> {
    return aiRouter.chat([
      { role: 'system', content: Prompts.COACH_PROMPT_V1 },
      { role: 'user', content: `The student has identified weaknesses in: ${weaknesses.join(', ')}. Recommend an actionable daily practice strategy.` }
    ]);
  }
}
