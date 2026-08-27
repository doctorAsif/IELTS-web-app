import { CreateWebWorkerMLCEngine, WebWorkerMLCEngine, InitProgressReport, AppConfig, prebuiltAppConfig } from '@mlc-ai/web-llm';
import { ModelManager, AIState } from './ModelManager';

export class AIRouter {
  private static instance: AIRouter;
  private engine: WebWorkerMLCEngine | null = null;
  private worker: Worker | null = null;

  private constructor() {}

  public static getInstance(): AIRouter {
    if (!AIRouter.instance) {
      AIRouter.instance = new AIRouter();
    }
    return AIRouter.instance;
  }

  public async startLocalEngine(
    onProgress: (progress: string) => void
  ): Promise<void> {
    const manager = ModelManager.getInstance();
    manager.currentState = AIState.DOWNLOADING; // Use setState directly if exposed or rely on this
    
    try {
      this.worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
      const model = manager.getRecommendedModel();

      const appConfig: AppConfig = {
        ...prebuiltAppConfig,
      };

      const initProgressCallback = (initProgress: InitProgressReport) => {
        onProgress(initProgress.text);
      };

      this.engine = await CreateWebWorkerMLCEngine(
        this.worker,
        model.modelId,
        { initProgressCallback, appConfig }
      );
      
      manager.currentState = AIState.READY;
    } catch (err) {
      console.error("Engine Start Error:", err);
      manager.currentState = AIState.ERROR;
      throw err;
    }
  }

  public async chat(messages: { role: 'user' | 'assistant' | 'system', content: string }[], streamCallback?: (content: string) => void): Promise<string> {
    if (!this.engine) {
      return this.fallbackCloudChat(messages);
    }

    try {
      if (streamCallback) {
        const chunks = await this.engine.chat.completions.create({
          messages: messages as any,
          stream: true,
        });

        let currentResponse = '';
        for await (const chunk of chunks) {
          currentResponse += chunk.choices[0]?.delta?.content || '';
          streamCallback(currentResponse);
        }
        return currentResponse;
      } else {
        const response = await this.engine.chat.completions.create({
          messages: messages as any,
          stream: false,
        });
        return response.choices[0]?.message?.content || '';
      }
    } catch (e) {
      console.warn("Local chat failed, falling back to cloud", e);
      return this.fallbackCloudChat(messages);
    }
  }

  public async generate(prompt: string): Promise<string> {
    return this.chat([{ role: 'user', content: prompt }]);
  }

  public async explain(concept: string): Promise<string> {
    const messages = [
      { role: 'system' as const, content: 'You are an expert IELTS Teacher. Explain the concept clearly and concisely.' },
      { role: 'user' as const, content: `Please explain this IELTS concept: ${concept}` }
    ];
    return this.chat(messages);
  }

  public async evaluateWriting(essay: string, taskType: string): Promise<any> {
    const messages = [
      { role: 'system' as const, content: 'You are an expert IELTS Examiner. Evaluate the writing and output a strict JSON response containing bands and feedback.' },
      { role: 'user' as const, content: `Evaluate this IELTS ${taskType} essay: ${essay}\nOutput JSON ONLY.` }
    ];
    
    // In a real scenario, use structured output tools if available in engine, 
    // or parse the text strictly.
    const response = await this.chat(messages);
    try {
      return JSON.parse(response);
    } catch {
      return { error: 'Failed to parse evaluation JSON', raw: response };
    }
  }

  private async fallbackCloudChat(messages: any[]): Promise<string> {
    console.log("Routing to Cloud Fallback...");
    // Future Implementation: Call Firebase Functions or directly call OpenAI/Gemini API here
    return "Cloud AI Fallback: This is a placeholder for when Local AI is unavailable or fails.";
  }
}
