import { HardwareProfile, ModelSpec, ModelTier } from '../types/ai';

export const MODEL_CATALOG: Record<ModelTier, ModelSpec> = {
  light: {
    id: 'qwen2.5-1.5b-instruct',
    name: 'Qwen 2.5 1.5B Instruct (Standard Edge AI)',
    modelId: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    provider: 'Qwen',
    sizeBytes: 1196766496, // ~1.12 GB (Exact match to Android App's 1.2 GB model)
    sizeLabel: '1.2 GB',
    minRamGB: 4,
    tier: 'light',
    description: 'Ultra-fast, power-efficient Cambridge IELTS tutor. Same model used on Android. Optimized for PCs with < 8 GB RAM.',
    vramRequirementMB: 1800,
  },
  advanced: {
    id: 'qwen2.5-3b-instruct',
    name: 'Qwen 2.5 3B Instruct (Master High-Precision AI)',
    modelId: 'Qwen2.5-3B-Instruct-q4f16_1-MLC',
    provider: 'Qwen',
    sizeBytes: 2684354560, // ~2.5 GB - 3 GB
    sizeLabel: '3.0 GB',
    minRamGB: 8,
    tier: 'advanced',
    description: 'Elite Band 9 diagnostic engine with nuanced lexical scoring, deep grammar analysis, and comprehensive feedback. Requires >= 8 GB (or 12 GB+) RAM.',
    vramRequirementMB: 3800,
  },
  cloud: {
    id: 'akhl-oracle-cloud-fallback',
    name: 'AKHL 24/7 Oracle Free Tier Cloud AI',
    modelId: 'cloud-qwen-3b',
    provider: 'Cloud',
    sizeBytes: 0,
    sizeLabel: '0 MB (Zero Download)',
    minRamGB: 2,
    tier: 'cloud',
    description: 'Runs 24/7 on Dr. Asif’s Oracle Cloud Always Free VPS. Perfect for low-spec PCs, tablets, or slow internet connections.',
    vramRequirementMB: 0,
  },
};

export async function detectHardwareProfile(): Promise<HardwareProfile> {
  // 1. Detect Device RAM (Standard Web API reports 0.25, 0.5, 1, 2, 4, 8 GiB)
  // Browsers clamp at 8 to prevent browser fingerprinting. If it says 8, the PC has 8GB, 12GB, 16GB, or 32GB+.
  const rawRam = (navigator as any).deviceMemory !== undefined 
    ? (navigator as any).deviceMemory 
    : 8; // Default conservative estimate if API unsupported
  
  const cpuCores = navigator.hardwareConcurrency || 4;

  // 2. Query WebGPU Hardware Support & Dedicated GPU limits
  let hasWebGPU = false;
  let gpuRenderer = 'Standard GPU / CPU Rasterizer';
  let isHighPerformance = false;

  if (typeof navigator !== 'undefined' && 'gpu' in navigator && (navigator as any).gpu) {
    try {
      const adapter = await (navigator as any).gpu.requestAdapter({
        powerPreference: 'high-performance',
      });

      if (adapter) {
        hasWebGPU = true;
        const info = (await (adapter as any).requestAdapterInfo?.()) || {};
        gpuRenderer = info.description || info.renderer || 'WebGPU Hardware Accelerated Device';

        // Check buffer size: Dedicated GPUs / Apple M-series support >= 1 GB storage buffer
        if (adapter.limits && adapter.limits.maxStorageBufferBindingSize >= 1024 * 1024 * 1024) {
          isHighPerformance = true;
        }
      }
    } catch (e) {
      console.warn('WebGPU query note:', e);
    }
  }

  // 3. Apply Decision Heuristics as requested:
  // - If PC RAM < 8 GB: download 1.2 GB model (same as Android)
  // - If PC RAM >= 8 GB (like 12 GB, 16 GB, or discrete GPU): download 3.0 GB model
  // - If no WebGPU and low CPU: fallback to 24/7 Oracle Cloud AI
  let recommendedTier: ModelTier = 'light';

  if (!hasWebGPU && cpuCores <= 2) {
    recommendedTier = 'cloud';
  } else if (rawRam >= 8 && (isHighPerformance || cpuCores >= 8)) {
    // 8GB+ device with capable GPU or 8+ cores (e.g. 12GB/16GB desktop/laptop)
    recommendedTier = 'advanced';
  } else {
    // RAM < 8GB or integrated light graphics
    recommendedTier = 'light';
  }

  return {
    ramGB: rawRam,
    cpuCores,
    hasWebGPU,
    gpuRenderer,
    isHighPerformance,
    recommendedTier,
    modelSpec: MODEL_CATALOG[recommendedTier],
  };
}
