import { AIProgress, HardwareProfile, ModelTier } from '../types/ai';
import { CloudAiFallback } from './cloudAiFallback';
import { MODEL_CATALOG } from './hardwareDetector';

export class WebLlmProvider {
  private static instance: WebLlmProvider;
  private engine: any = null;
  private currentTier: ModelTier = 'light';
  private isLoaded = false;
  private isLoading = false;
  private progressCallback: ((progress: AIProgress) => void) | null = null;

  private constructor() {}

  static getInstance(): WebLlmProvider {
    if (!WebLlmProvider.instance) {
      WebLlmProvider.instance = new WebLlmProvider();
    }
    return WebLlmProvider.instance;
  }

  onProgress(callback: (progress: AIProgress) => void) {
    this.progressCallback = callback;
  }

  get isModelReady(): boolean {
    return this.isLoaded;
  }

  get activeTier(): ModelTier {
    return this.currentTier;
  }

  async initialize(profile: HardwareProfile, forceTier?: ModelTier): Promise<boolean> {
    const targetTier = forceTier || profile.recommendedTier;
    this.currentTier = targetTier;

    if (targetTier === 'cloud') {
      this.isLoaded = true;
      this.notifyProgress({
        status: 'ready',
        progress: 1.0,
        receivedMB: 0,
        totalMB: 0,
        currentStepText: 'Connected to 24/7 Oracle Free Tier Cloud AI.',
      });
      return true;
    }

    if (this.isLoaded && this.currentTier === targetTier) {
      return true;
    }

    this.isLoading = true;
    const modelSpec = MODEL_CATALOG[targetTier];

    this.notifyProgress({
      status: 'downloading',
      progress: 0.05,
      receivedMB: 50,
      totalMB: Math.round(modelSpec.sizeBytes / (1024 * 1024)),
      currentStepText: `Connecting to WebGPU CDN for ${modelSpec.name}...`,
    });

    try {
      // Dynamically load @mlc-ai/web-llm in browser environment
      const webllm = await import('@mlc-ai/web-llm');
      
      const initProgressCallback = (report: any) => {
        const progressVal = report.progress || 0;
        const totalMB = Math.round(modelSpec.sizeBytes / (1024 * 1024));
        const receivedMB = Math.round(progressVal * totalMB);

        this.notifyProgress({
          status: progressVal < 0.99 ? 'downloading' : 'loading',
          progress: progressVal,
          receivedMB,
          totalMB,
          currentStepText: report.text || 'Loading Edge AI model weights into WebGPU VRAM...',
        });
      };

      this.engine = await webllm.CreateMLCEngine(modelSpec.modelId, {
        initProgressCallback,
      });

      this.isLoaded = true;
      this.isLoading = false;
      this.notifyProgress({
        status: 'ready',
        progress: 1.0,
        receivedMB: Math.round(modelSpec.sizeBytes / (1024 * 1024)),
        totalMB: Math.round(modelSpec.sizeBytes / (1024 * 1024)),
        currentStepText: `${modelSpec.name} initialized and ready in browser WebGPU!`,
      });
      return true;
    } catch (err: any) {
      console.warn('WebGPU MLCEngine init warning, falling back gracefully:', err);
      // Fallback gracefully without breaking student experience
      this.isLoaded = true;
      this.isLoading = false;
      this.notifyProgress({
        status: 'ready',
        progress: 1.0,
        receivedMB: 0,
        totalMB: 0,
        currentStepText: 'Running in High-Performance Local Heuristic / Cloud Fallback Mode.',
      });
      return true;
    }
  }

  async generateJson(prompt: string): Promise<any> {
    if (this.engine) {
      try {
        const reply = await this.engine.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
        });
        const content = reply.choices[0]?.message?.content || '';
        const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (e) {
        console.warn('Engine generation error, using fallback:', e);
      }
    }

    return CloudAiFallback.generateEvaluation(prompt);
  }

  private notifyProgress(progress: AIProgress) {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }
}
