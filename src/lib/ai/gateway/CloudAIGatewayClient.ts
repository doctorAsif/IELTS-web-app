import { getFunctions, httpsCallable } from 'firebase/functions';
import { AIProvider, AIRequestContext, AITaskType } from './AIProvider';

export class CloudAIGatewayClient implements AIProvider {
  public providerId = 'cloud-gateway';
  
  private async executeCloudFunction(taskType: AITaskType, payload: any, context?: AIRequestContext): Promise<any> {
    try {
      const functions = getFunctions();
      const aiExecute = httpsCallable(functions, 'aiExecute');
      
      const response = await aiExecute({
        taskType,
        payload,
        context
      });
      
      return (response.data as any).result;
    } catch (error: any) {
      console.error('CloudAIGatewayClient Error:', error);
      throw new Error(`Cloud AI execution failed: ${error.message}`);
    }
  }

  async generateTask(prompt: string, context?: AIRequestContext): Promise<any> {
    return this.executeCloudFunction('task_generation', { prompt }, context);
  }

  async evaluateSpeaking(audioTranscript: string, targetCriteria: any, context?: AIRequestContext): Promise<any> {
    return this.executeCloudFunction('speaking_evaluation', { audioTranscript, targetCriteria }, context);
  }

  async evaluateWriting(essay: string, taskType: string, context?: AIRequestContext): Promise<any> {
    return this.executeCloudFunction('writing_evaluation', { essay, taskType }, context);
  }

  async generalQuestion(question: string, context?: AIRequestContext): Promise<string> {
    return this.executeCloudFunction('student_question', { question }, context);
  }

  async executeTask<T = any>(taskType: AITaskType, payload: any, context?: AIRequestContext): Promise<T> {
    return this.executeCloudFunction(taskType, payload, context);
  }
}
