export enum LocalAITier {
  LEVEL_A = 'LOCAL_AI_LEVEL_A', // High-end WebGPU (Fast local inference)
  LEVEL_B = 'LOCAL_AI_LEVEL_B', // Mid-range WebGPU (Acceptable local inference)
  LEVEL_C = 'LOCAL_AI_LEVEL_C', // WASM fallback or Low-end WebGPU (Slow inference, consider cloud)
  CLOUD_ONLY = 'CLOUD_ONLY',    // No WebGPU, insufficient RAM, or unsupported browser
}

export interface DeviceCapabilities {
  tier: LocalAITier;
  hasWebGPU: boolean;
  hasWASM: boolean;
  os: string;
  browser: string;
  isMobile: boolean;
  storageEstimateMB: number;
  gpuAdapterInfo?: string;
  maxComputeWorkgroupSizeX?: number;
  maxComputeInvocationsPerWorkgroup?: number;
}

export class DeviceCapabilityEngine {
  static async evaluate(): Promise<DeviceCapabilities> {
    const hasWebGPU = !!(navigator as any).gpu;
    const hasWASM = typeof WebAssembly === 'object';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let storageEstimateMB = 0;
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        if (estimate.quota && estimate.usage !== undefined) {
          storageEstimateMB = Math.round((estimate.quota - estimate.usage) / (1024 * 1024));
        }
      } catch (e) {
        console.warn("Storage API not available:", e);
      }
    }

    let gpuAdapterInfo = 'Unknown';
    let maxComputeWorkgroupSizeX = 0;
    let maxComputeInvocationsPerWorkgroup = 0;

    if (hasWebGPU) {
      try {
        const adapter = await (navigator as any).gpu.requestAdapter();
        if (adapter) {
          gpuAdapterInfo = adapter.name || 'Generic WebGPU Adapter';
          maxComputeWorkgroupSizeX = adapter.limits?.maxComputeWorkgroupSizeX || 0;
          maxComputeInvocationsPerWorkgroup = adapter.limits?.maxComputeInvocationsPerWorkgroup || 0;
        }
      } catch (e) {
        console.warn("Failed to request WebGPU adapter", e);
      }
    }

    let tier = LocalAITier.CLOUD_ONLY;

    if (hasWebGPU && maxComputeInvocationsPerWorkgroup >= 256) {
      // Typically high-end desktop/modern mobile GPUs
      if (storageEstimateMB > 2000 && !isMobile) {
        tier = LocalAITier.LEVEL_A;
      } else if (storageEstimateMB > 1500) {
        tier = LocalAITier.LEVEL_B;
      } else {
        tier = LocalAITier.LEVEL_C; // Storage constrained
      }
    } else if (hasWASM && storageEstimateMB > 1000) {
      tier = LocalAITier.LEVEL_C;
    }

    return {
      tier,
      hasWebGPU,
      hasWASM,
      os: this.detectOS(),
      browser: this.detectBrowser(),
      isMobile,
      storageEstimateMB,
      gpuAdapterInfo,
      maxComputeWorkgroupSizeX,
      maxComputeInvocationsPerWorkgroup
    };
  }

  private static detectOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('like Mac')) return 'iOS';
    return 'Unknown';
  }

  private static detectBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }
}
