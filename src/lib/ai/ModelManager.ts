import { DeviceCapabilities, DeviceCapabilityEngine, LocalAITier } from './DeviceCapabilityEngine';
import { APPROVED_WEB_MODELS, DEFAULT_LOCAL_MODEL_ID, WebModelConfig } from './ModelCatalog';
import { hasModelInCache, deleteModelAllInfoInCache, prebuiltAppConfig, AppConfig } from '@mlc-ai/web-llm';

export enum AIState {
  UNINITIALIZED = 'UNINITIALIZED',
  DETECTING_DEVICE = 'DETECTING_DEVICE',
  READY_TO_INSTALL = 'READY_TO_INSTALL',
  DOWNLOADING = 'DOWNLOADING',
  VERIFYING = 'VERIFYING',
  INITIALIZING = 'INITIALIZING',
  READY = 'READY',
  OFFLINE = 'OFFLINE',
  CORRUPTED = 'CORRUPTED',
  ERROR = 'ERROR',
  FALLBACK = 'FALLBACK'
}

export interface ModelProgressInfo {
  statusText: string;
  progressPercentage: number; // 0 to 100
  downloadedBytes?: number;
  totalBytes?: number;
  phase: 'idle' | 'fetching' | 'compiling' | 'verifying' | 'ready' | 'error';
}

export class ModelManager {
  private static instance: ModelManager;
  public currentState: AIState = AIState.UNINITIALIZED;
  public deviceCapabilities: DeviceCapabilities | null = null;
  public activeModel: WebModelConfig = APPROVED_WEB_MODELS[DEFAULT_LOCAL_MODEL_ID];
  public progressInfo: ModelProgressInfo = {
    statusText: '',
    progressPercentage: 0,
    phase: 'idle'
  };
  public isCached: boolean = false;
  public lastError?: string;

  private stateListeners: ((state: AIState) => void)[] = [];
  private progressListeners: ((progress: ModelProgressInfo) => void)[] = [];

  private constructor() {}

  public static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  public subscribe(listener: (state: AIState) => void): () => void {
    this.stateListeners.push(listener);
    listener(this.currentState);
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener);
    };
  }

  public subscribeProgress(listener: (progress: ModelProgressInfo) => void): () => void {
    this.progressListeners.push(listener);
    listener(this.progressInfo);
    return () => {
      this.progressListeners = this.progressListeners.filter(l => l !== listener);
    };
  }

  public setState(newState: AIState, error?: string): void {
    this.currentState = newState;
    if (error) this.lastError = error;
    this.stateListeners.forEach(listener => listener(newState));
  }

  public setProgress(info: Partial<ModelProgressInfo>): void {
    this.progressInfo = { ...this.progressInfo, ...info };
    this.progressListeners.forEach(listener => listener(this.progressInfo));
  }

  /**
   * Evaluates hardware capabilities and checks whether the local model is already cached.
   */
  public async initialize(): Promise<void> {
    this.setState(AIState.DETECTING_DEVICE);
    try {
      this.deviceCapabilities = await DeviceCapabilityEngine.evaluate();

      if (this.deviceCapabilities.tier === LocalAITier.CLOUD_ONLY) {
        this.setState(AIState.FALLBACK);
        return;
      }

      if (this.deviceCapabilities.recommendedModelId && APPROVED_WEB_MODELS[this.deviceCapabilities.recommendedModelId]) {
        this.activeModel = APPROVED_WEB_MODELS[this.deviceCapabilities.recommendedModelId];
      }

      // Check if model is already cached in IndexedDB
      const cached = await this.checkModelCached();
      this.isCached = cached;

      if (cached) {
        this.setState(AIState.READY_TO_INSTALL);
        this.setProgress({
          statusText: 'Local AI is cached and ready to start.',
          progressPercentage: 100,
          phase: 'ready'
        });
      } else {
        this.setState(AIState.READY_TO_INSTALL);
        this.setProgress({
          statusText: 'Model not installed.',
          progressPercentage: 0,
          phase: 'idle'
        });
      }
    } catch (e: any) {
      console.error('Device detection error:', e);
      this.setState(AIState.ERROR, e?.message || 'Device capability check failed.');
    }
  }

  /**
   * Inspects browser storage via WebLLM to determine if model artifacts exist.
   */
  public async checkModelCached(): Promise<boolean> {
    try {
      const appConfig: AppConfig = { ...prebuiltAppConfig };
      const exists = await hasModelInCache(this.activeModel.modelId, appConfig);
      this.isCached = exists;
      return exists;
    } catch (e) {
      console.warn('Failed to query WebLLM cache:', e);
      this.isCached = false;
      return false;
    }
  }

  /**
   * Clears the cached model weights in case of corruption or repair.
   */
  public async removeLocalModelCache(): Promise<void> {
    try {
      this.setProgress({ statusText: 'Removing cached model...', phase: 'verifying' });
      await deleteModelAllInfoInCache(this.activeModel.modelId, prebuiltAppConfig);
      this.isCached = false;
      this.setState(AIState.READY_TO_INSTALL);
      this.setProgress({
        statusText: 'Local AI cache cleared.',
        progressPercentage: 0,
        phase: 'idle'
      });
    } catch (e: any) {
      console.error('Failed to remove model cache:', e);
      this.setState(AIState.ERROR, 'Failed to clear local cache.');
    }
  }

  /**
   * Parses WebLLM progress report into a clean numerical percentage and friendly status.
   */
  public handleInitProgress(reportText: string, progressFraction?: number): void {
    let percentage = progressFraction !== undefined ? Math.round(progressFraction * 100) : this.progressInfo.progressPercentage;

    // Attempt to parse text percentage if available, e.g. "[2/10] Loading param... 25%"
    const match = reportText.match(/(\d+)%/);
    if (match) {
      percentage = parseInt(match[1], 10);
    }

    let phase: ModelProgressInfo['phase'] = 'fetching';
    if (reportText.toLowerCase().includes('compil') || reportText.toLowerCase().includes('wasm')) {
      phase = 'compiling';
    } else if (reportText.toLowerCase().includes('verify') || reportText.toLowerCase().includes('finish')) {
      phase = 'verifying';
    }

    this.setProgress({
      statusText: reportText,
      progressPercentage: percentage,
      phase
    });
  }

  public getRecommendedModel(): WebModelConfig {
    return this.activeModel;
  }
}
