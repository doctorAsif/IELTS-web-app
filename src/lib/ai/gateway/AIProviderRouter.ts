import { AIProvider, AIRequestContext, AITaskType } from './AIProvider';
import { BrowserLocalLLMProvider } from './BrowserLocalLLMProvider';
import { CloudAIGatewayClient } from './CloudAIGatewayClient';
import { AITaskClassifier } from './AITaskClassifier';
import { ModelManager, AIState } from '../ModelManager';

export class AIProviderRouter implements AIProvider {
  public providerId = 'router';
  
  private localProvider = new BrowserLocalLLMProvider();
  private cloudProvider = new CloudAIGatewayClient();

  /**
   * Decide which provider to use based on the task and device state.
   */
  private async route(taskType: AITaskType, payload: any): Promise<AIProvider> {
    const manager = ModelManager.getInstance();
    
    // If the local model is explicitly ready, and the task is suitable for local inference
    if (manager.currentState === AIState.READY && AITaskClassifier.canRunLocally(taskType, payload)) {
      console.log(`[AIRouter] Routing ${taskType} to Local WebLLM`);
      return this.localProvider;
    }

    // Otherwise, route to cloud (CloudAIGatewayClient)
    console.log(`[AIRouter] Routing ${taskType} to Cloud Gateway`);
    return this.cloudProvider;
  }

  // --- AIProvider Interface Implementation ---

  async generateTask(prompt: string, context?: AIRequestContext): Promise<any> {
    try {
      const provider = await this.route('task_generation', { prompt });
      return await provider.generateTask(prompt, context);
    } catch (e) {
      // Fallback logic
      console.warn('[AIRouter] Primary provider failed, falling back to cloud', e);
      return this.cloudProvider.generateTask(prompt, context);
    }
  }

  async evaluateSpeaking(audioTranscript: string, targetCriteria: any, context?: AIRequestContext): Promise<any> {
    try {
      const provider = await this.route('speaking_evaluation', { audioTranscript });
      return await provider.evaluateSpeaking(audioTranscript, targetCriteria, context);
    } catch (e) {
      console.warn('[AIRouter] Primary provider failed, falling back to cloud', e);
      return this.cloudProvider.evaluateSpeaking(audioTranscript, targetCriteria, context);
    }
  }

  async evaluateWriting(essay: string, taskType: string, context?: AIRequestContext): Promise<any> {
    try {
      const provider = await this.route('writing_evaluation', { essay });
      return await provider.evaluateWriting(essay, taskType, context);
    } catch (e) {
      console.warn('[AIRouter] Primary provider failed, falling back to cloud', e);
      return this.cloudProvider.evaluateWriting(essay, taskType, context);
    }
  }

  async generalQuestion(question: string, context?: AIRequestContext): Promise<string> {
    // Check if web research is required
    const requiresResearch = AITaskClassifier.requiresWebResearch('student_question', { question });
    const finalContext = { ...context, webResearchRequired: requiresResearch };

    try {
      // If research is required, it must go to the cloud gateway
      const provider = requiresResearch ? this.cloudProvider : await this.route('student_question', { question });
      return await provider.generalQuestion(question, finalContext);
    } catch (e) {
      console.warn('[AIRouter] Primary provider failed, falling back to cloud', e);
      return this.cloudProvider.generalQuestion(question, finalContext);
    }
  }

  async executeTask<T = any>(taskType: AITaskType, payload: any, context?: AIRequestContext): Promise<T> {
    try {
      const provider = await this.route(taskType, payload);
      return await provider.executeTask<T>(taskType, payload, context);
    } catch (e) {
      console.warn('[AIRouter] Primary provider failed, falling back to cloud', e);
      return this.cloudProvider.executeTask<T>(taskType, payload, context);
    }
  }
}

// Export a singleton instance for easy usage in React components
export const aiRouter = new AIProviderRouter();
