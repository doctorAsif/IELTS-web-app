import { DeviceCapabilities, DeviceCapabilityEngine, LocalAITier } from './DeviceCapabilityEngine';

export enum AIState {
  UNINITIALIZED = 'UNINITIALIZED',
  DETECTING_DEVICE = 'DETECTING_DEVICE',
  READY_TO_INSTALL = 'READY_TO_INSTALL',
  DOWNLOADING = 'DOWNLOADING',
  VERIFYING = 'VERIFYING',
  LOADING = 'LOADING',
  READY = 'READY',
  ERROR = 'ERROR',
  FALLBACK = 'FALLBACK',
  OFFLINE = 'OFFLINE'
}

export interface ModelManifest {
  modelId: string;
  version: string;
  runtime: 'webgpu' | 'wasm' | 'cloud';
  format: 'onnx' | 'mlc';
  quantization: string;
  sizeBytes: number;
  minimumCapability: LocalAITier;
}

export class ModelManager {
  private static instance: ModelManager;
  public currentState: AIState = AIState.UNINITIALIZED;
  public deviceCapabilities: DeviceCapabilities | null = null;
  public activeModel: ModelManifest | null = null;

  // Track event listeners for state changes
  private stateListeners: ((state: AIState) => void)[] = [];

  private constructor() {}

  public static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  public subscribe(listener: (state: AIState) => void) {
    this.stateListeners.push(listener);
    listener(this.currentState);
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener);
    };
  }

  private setState(newState: AIState) {
    this.currentState = newState;
    this.stateListeners.forEach(listener => listener(newState));
  }

  public async initialize(): Promise<void> {
    this.setState(AIState.DETECTING_DEVICE);
    try {
      this.deviceCapabilities = await DeviceCapabilityEngine.evaluate();
      
      if (this.deviceCapabilities.tier === LocalAITier.CLOUD_ONLY) {
        this.setState(AIState.FALLBACK);
        return;
      }
      
      this.setState(AIState.READY_TO_INSTALL);
    } catch (e) {
      console.error("Device detection failed", e);
      this.setState(AIState.ERROR);
    }
  }

  public getRecommendedModel(): ModelManifest {
    return {
      modelId: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
      version: '1.0.0',
      runtime: 'webgpu',
      format: 'mlc',
      quantization: 'q4f16',
      sizeBytes: 1196766496,
      minimumCapability: LocalAITier.LEVEL_B
    };
  }
}
