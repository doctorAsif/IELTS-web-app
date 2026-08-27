import { AITaskType } from './AIProvider';

export class AITaskClassifier {
  /**
   * Determine if a task can be run locally based on its type and complexity.
   * Deterministic rules are preferred over calling an LLM for classification.
   */
  public static canRunLocally(taskType: AITaskType, payload: any): boolean {
    switch (taskType) {
      case 'student_question':
      case 'summarization':
        return true; // Usually fine for local small models

      case 'speaking_evaluation':
      case 'writing_evaluation':
      case 'task_generation':
      case 'homework_generation':
        // If the task requires deep analysis or perfectly structured JSON, 
        // a 1.5B local model might struggle. Let's allow local if the user forces it, 
        // but default to cloud for complex tasks unless we know the local model is capable.
        // For this implementation, we'll route complex evaluations to the cloud by default to guarantee quality.
        return false; 

      case 'research':
      case 'coding':
      case 'admin_analysis':
        // These require tools, RAG, or high reasoning capabilities. Must be cloud.
        return false;

      default:
        return false;
    }
  }

  /**
   * Determine if a task inherently requires current web research.
   */
  public static requiresWebResearch(taskType: AITaskType, payload: any): boolean {
    if (taskType === 'research') return true;
    
    // Example: If a student asks "What is the current IELTS exam fee?", we might need research.
    // In a real system, we might use a quick local intent-classifier to detect time-sensitive queries.
    if (taskType === 'student_question' && typeof payload.question === 'string') {
      const q = payload.question.toLowerCase();
      if (q.includes('current') || q.includes('today') || q.includes('latest')) {
        return true;
      }
    }
    
    return false;
  }
}
