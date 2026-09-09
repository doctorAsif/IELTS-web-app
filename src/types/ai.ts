export type ModelTier = 'light' | 'advanced' | 'cloud';

export interface ModelSpec {
  id: string;
  name: string;
  modelId: string;
  provider: 'Qwen' | 'Llama' | 'Cloud';
  sizeBytes: number;
  sizeLabel: string;
  minRamGB: number;
  tier: ModelTier;
  description: string;
  vramRequirementMB: number;
  isRecommended?: boolean;
}

export interface HardwareProfile {
  ramGB: number;
  cpuCores: number;
  hasWebGPU: boolean;
  gpuRenderer: string;
  isHighPerformance: boolean;
  recommendedTier: ModelTier;
  modelSpec: ModelSpec;
}

export interface AIProgress {
  status: 'idle' | 'detecting' | 'downloading' | 'loading' | 'ready' | 'error';
  progress: number;
  receivedMB: number;
  totalMB: number;
  currentStepText: string;
  error?: string;
}

export interface DiagnosticEvaluation {
  overallBand: number;
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalAccuracy: number;
  strengths: string[];
  weaknesses: string[];
  suggestedVocabC1C2: string[];
  pedagogicalFeedback: string;
  zeroNumberRuleCompliant?: boolean;
}
