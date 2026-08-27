import { AIRouter } from './AIRouter';
import * as Prompts from './prompts/prompts';

export class AITeacher {
  static async explain(concept: string): Promise<string> {
    const router = AIRouter.getInstance();
    return router.chat([
      { role: 'system', content: Prompts.TEACHER_PROMPT_V1 },
      { role: 'user', content: `Please explain this IELTS concept: ${concept}` }
    ]);
  }
}

export class AITrainer {
  static async generateDrill(topic: string): Promise<string> {
    const router = AIRouter.getInstance();
    return router.chat([
      { role: 'system', content: Prompts.TRAINER_PROMPT_V1 },
      { role: 'user', content: `Generate a short practice drill for: ${topic}` }
    ]);
  }
}

export class AIExaminer {
  static async evaluate(answer: string, questionContext: string): Promise<string> {
    const router = AIRouter.getInstance();
    return router.chat([
      { role: 'system', content: Prompts.EXAMINER_PROMPT_V1 },
      { role: 'user', content: `Question Context: ${questionContext}\nStudent Answer: ${answer}\nEvaluate this.` }
    ]);
  }
}

export class AICoach {
  static async recommend(weaknesses: string[]): Promise<string> {
    const router = AIRouter.getInstance();
    return router.chat([
      { role: 'system', content: Prompts.COACH_PROMPT_V1 },
      { role: 'user', content: `The student has weaknesses in: ${weaknesses.join(', ')}. Recommend a practice strategy.` }
    ]);
  }
}
