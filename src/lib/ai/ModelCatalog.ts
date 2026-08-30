export interface WebModelConfig {
  modelId: string;
  name: string;
  family: 'qwen' | 'llama' | 'phi' | 'gemma';
  version: string;
  runtime: 'webgpu' | 'wasm';
  format: 'mlc';
  quantization: string;
  sizeBytes: number;
  vramRequiredMB: number;
  contextWindow: number;
  temperature: number;
  benchmarkStatus: 'validated' | 'experimental' | 'deprecated';
  productionStatus: 'active' | 'standby' | 'retired';
  description: string;
}

export const APPROVED_WEB_MODELS: Record<string, WebModelConfig> = {
  'Qwen2.5-1.5B-Instruct-q4f16_1-MLC': {
    modelId: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 1.5B Instruct',
    family: 'qwen',
    version: '2.5',
    runtime: 'webgpu',
    format: 'mlc',
    quantization: 'q4f16_1',
    sizeBytes: 1196766496, // ~1.12 GiB (~1.2 GB)
    vramRequiredMB: 1800,
    contextWindow: 4096,
    temperature: 0.7,
    benchmarkStatus: 'validated',
    productionStatus: 'active',
    description: 'Primary approved WebLLM model for student-facing browser-local IELTS practice.'
  }
};

export const DEFAULT_LOCAL_MODEL_ID = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC';
