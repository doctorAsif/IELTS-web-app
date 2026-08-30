import { AITaskType } from './AIProvider';

export class AITaskClassifier {
  /**
   * Determine if a task can be run locally based on its type, context constraints, and payload size.
   */
  public static canRunLocally(taskType: AITaskType, payload: any): boolean {
    switch (taskType) {
      case 'student_question':
      case 'summarization':
      case 'reading_explanation':
      case 'listening_explanation':
      case 'drill_generation':
      case 'homework_generation':
      case 'daily_plan':
        return true;

      case 'speaking_evaluation':
        // Speaking transcript evaluation is well within the 1.5B model's capability
        return true;

      case 'writing_evaluation': {
        // Allow local evaluation if essay length is within local context budget (~1500 words max)
        const essayLength = typeof payload?.essay === 'string' ? payload.essay.length : 0;
        return essayLength < 8000;
      }

      case 'task_generation':
        return true;

      case 'research':
      case 'coding':
      case 'admin_analysis':
        // Deep tool calling or complex administrative analytics route to cloud
        return false;

      default:
        return true;
    }
  }

  /**
   * Determine if a task inherently requires live web research.
   */
  public static requiresWebResearch(taskType: AITaskType, payload: any): boolean {
    if (taskType === 'research') return true;

    if (taskType === 'student_question' && typeof payload?.question === 'string') {
      const q = payload.question.toLowerCase();
      if (q.includes('current fee') || q.includes('exam date 202') || q.includes('visa policy update')) {
        return true;
      }
    }

    return false;
  }
}
