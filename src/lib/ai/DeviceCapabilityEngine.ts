export enum LocalAITier {
  LEVEL_A = 'LOCAL_AI_LEVEL_A', // High-end WebGPU (Fast local inference)
  LEVEL_B = 'LOCAL_AI_LEVEL_B', // Mid-range WebGPU (Standard inference)
  LEVEL_C = 'LOCAL_AI_LEVEL_C', // Storage or resource constrained
  CLOUD_ONLY = 'CLOUD_ONLY',    // No WebGPU, insufficient storage, or unsupported
}

export interface DeviceCapabilities {
  tier: LocalAITier;
  hasWebGPU: boolean;
  hasWASM: boolean;
  isBrowserSupported: boolean;
  os: string;
  browser: string;
  isMobile: boolean;
  deviceMemoryGB?: number;
  storageEstimateMB: number;
  storageQuotaMB: number;
  storageUsageMB: number;
  gpuAdapterInfo: string;
  maxComputeWorkgroupSizeX: number;
  maxComputeInvocationsPerWorkgroup: number;
  maxBufferSizeMB: number;
  supportedModels: string[];
  recommendedModelId: string;
  incompatibilityReason?: string;
}

export class DeviceCapabilityEngine {
  private static cachedCapabilities: DeviceCapabilities | null = null;

  static async evaluate(forceFresh: boolean = false): Promise<DeviceCapabilities> {
    if (this.cachedCapabilities && !forceFresh) {
      return this.cachedCapabilities;
    }

    const hasWebGPU = typeof navigator !== 'undefined' && !!(navigator as any).gpu;
    const hasWASM = typeof WebAssembly === 'object';
    const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let storageEstimateMB = 0;
    let storageQuotaMB = 0;
    let storageUsageMB = 0;

    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        if (estimate.quota !== undefined && estimate.usage !== undefined) {
          storageQuotaMB = Math.round(estimate.quota / (1024 * 1024));
          storageUsageMB = Math.round(estimate.usage / (1024 * 1024));
          storageEstimateMB = Math.max(0, storageQuotaMB - storageUsageMB);
        }
      } catch (e) {
        console.warn('Storage Estimate API error:', e);
      }
    }

    let gpuAdapterInfo = 'Not Available';
    let maxComputeWorkgroupSizeX = 0;
    let maxComputeInvocationsPerWorkgroup = 0;
    let maxBufferSizeMB = 0;
    let adapterAvailable = false;

    if (hasWebGPU) {
      try {
        const adapter = await (navigator as any).gpu.requestAdapter({
          powerPreference: 'high-performance'
        });
        if (adapter) {
          adapterAvailable = true;
          gpuAdapterInfo = adapter.name || 'WebGPU Compatible Adapter';
          if (adapter.info) {
            gpuAdapterInfo = `${adapter.info.vendor || ''} ${adapter.info.architecture || ''} ${adapter.info.device || ''}`.trim() || gpuAdapterInfo;
          }
          maxComputeWorkgroupSizeX = adapter.limits?.maxComputeWorkgroupSizeX || 0;
          maxComputeInvocationsPerWorkgroup = adapter.limits?.maxComputeInvocationsPerWorkgroup || 0;
          const maxStorageBufferBindingSize = adapter.limits?.maxStorageBufferBindingSize || 0;
          maxBufferSizeMB = Math.round(maxStorageBufferBindingSize / (1024 * 1024));
        }
      } catch (e) {
        console.warn('Failed to acquire WebGPU adapter:', e);
      }
    }

    const os = this.detectOS();
    const browser = this.detectBrowser();
    const isBrowserSupported = ['Chrome', 'Edge', 'Opera', 'Firefox', 'Safari'].includes(browser);
    const deviceMemoryGB = typeof navigator !== 'undefined' && (navigator as any).deviceMemory
      ? (navigator as any).deviceMemory
      : undefined;

    let tier = LocalAITier.CLOUD_ONLY;
    let incompatibilityReason: string | undefined;
    const supportedModels: string[] = [];
    let recommendedModelId = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC';

    // Required storage for 1.5B model is ~1.2GB; for 3B model is ~2.4GB (safety margin ~4GB free)
    const REQUIRED_MIN_STORAGE_MB = 1800;
    const DESKTOP_STORAGE_MB = 4000;

    if (!hasWebGPU || !adapterAvailable) {
      tier = LocalAITier.CLOUD_ONLY;
      incompatibilityReason = 'WebGPU is not available or disabled in this browser. Cloud AI will be used.';
      recommendedModelId = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC';
    } else if (storageEstimateMB > 0 && storageEstimateMB < REQUIRED_MIN_STORAGE_MB) {
      tier = LocalAITier.LEVEL_C;
      incompatibilityReason = `Insufficient storage space (~${storageEstimateMB} MB available, ~${REQUIRED_MIN_STORAGE_MB} MB recommended).`;
      recommendedModelId = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC';
    } else {
      supportedModels.push('Qwen2.5-1.5B-Instruct-q4f16_1-MLC');
      supportedModels.push('Llama-3.2-3B-Instruct-q4f16_1-MLC');

      // Desktop Tier: PC/Laptop, WebGPU, and >= 8GB Native Shared RAM (or sufficient storage quota)
      const hasHighMemory = deviceMemoryGB ? deviceMemoryGB >= 8 : true; // Heuristic: default true if not mobile
      const hasDesktopStorage = storageEstimateMB === 0 || storageEstimateMB >= DESKTOP_STORAGE_MB;

      if (!isMobile && hasHighMemory && hasDesktopStorage && maxComputeInvocationsPerWorkgroup >= 256) {
        tier = LocalAITier.LEVEL_A;
        recommendedModelId = 'Llama-3.2-3B-Instruct-q4f16_1-MLC';
      } else {
        tier = LocalAITier.LEVEL_B;
        recommendedModelId = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC';
      }
    }

    const caps: DeviceCapabilities = {
      tier,
      hasWebGPU: hasWebGPU && adapterAvailable,
      hasWASM,
      isBrowserSupported,
      os,
      browser,
      isMobile,
      deviceMemoryGB,
      storageEstimateMB,
      storageQuotaMB,
      storageUsageMB,
      gpuAdapterInfo,
      maxComputeWorkgroupSizeX,
      maxComputeInvocationsPerWorkgroup,
      maxBufferSizeMB,
      supportedModels,
      recommendedModelId,
      incompatibilityReason
    };

    this.cachedCapabilities = caps;
    return caps;
  }

  private static detectOS(): string {
    if (typeof navigator === 'undefined') return 'Unknown';
    const ua = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac') && !ua.includes('iPhone') && !ua.includes('iPad')) return 'macOS';
    if (ua.includes('Linux') && !ua.includes('Android')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod')) return 'iOS';
    return 'Unknown';
  }

  private static detectBrowser(): string {
    if (typeof navigator === 'undefined') return 'Unknown';
    const ua = navigator.userAgent;
    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('OPR/') || ua.includes('Opera')) return 'Opera';
    if (ua.includes('Chrome') && !ua.includes('Chromium')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    return 'Unknown';
  }
}
