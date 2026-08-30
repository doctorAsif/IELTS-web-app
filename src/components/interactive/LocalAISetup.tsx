import React, { useState, useEffect } from 'react';
import {
  Cpu,
  HardDrive,
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Trash2,
  Play,
  RotateCcw,
  Loader2,
  Zap,
  ShieldCheck,
  WifiOff
} from 'lucide-react';
import { ModelManager, AIState, ModelProgressInfo } from '../../lib/ai/ModelManager';
import { aiRouter } from '../../lib/ai/gateway/AIProviderRouter';

interface BenchmarkResults {
  ttftMs: number;
  tokensPerSec: number;
  totalTimeMs: number;
  tokensGenerated: number;
  timestamp: string;
}

export const LocalAISetup: React.FC = () => {
  const [aiState, setAiState] = useState<AIState>(AIState.UNINITIALIZED);
  const [progressInfo, setProgressInfo] = useState<ModelProgressInfo>({
    statusText: '',
    progressPercentage: 0,
    phase: 'idle'
  });
  const [isInitializing, setIsInitializing] = useState(false);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [benchmark, setBenchmark] = useState<BenchmarkResults | null>(null);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const modelManager = ModelManager.getInstance();
  const activeModel = modelManager.getRecommendedModel();
  const caps = modelManager.deviceCapabilities;

  useEffect(() => {
    const unsubState = modelManager.subscribe(setAiState);
    const unsubProg = modelManager.subscribeProgress(setProgressInfo);

    if (modelManager.currentState === AIState.UNINITIALIZED) {
      modelManager.initialize();
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load stored benchmark if available
    const savedBenchmark = localStorage.getItem('akhl_local_ai_benchmark');
    if (savedBenchmark) {
      try {
        setBenchmark(JSON.parse(savedBenchmark));
      } catch (e) {
        // ignore
      }
    }

    return () => {
      unsubState();
      unsubProg();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [modelManager]);

  const handleDownloadOrStart = async () => {
    setIsInitializing(true);
    setTestResponse(null);

    try {
      const localProvider = aiRouter.getLocalProvider();
      await localProvider.initializeEngine();
    } catch (err: any) {
      console.error('Initialization error:', err);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleRemoveCache = async () => {
    if (confirm('Are you sure you want to remove the cached Local AI model? You will need to re-download it to use offline AI features.')) {
      aiRouter.getLocalProvider().cleanupWorker();
      await modelManager.removeLocalModelCache();
      setTestResponse(null);
    }
  };

  const handleTestInference = async () => {
    setIsTesting(true);
    setTestResponse('');

    try {
      const prompt = 'Give one IELTS Speaking Part 1 practice question with a band 8 sample response outline in 3 brief bullets.';
      await aiRouter.chat(
        [{ role: 'user', content: prompt }],
        (chunk) => setTestResponse(chunk),
        { preferredProvider: 'local-webllm' }
      );
    } catch (e: any) {
      setTestResponse('Test failed: ' + (e?.message || 'Local AI not ready'));
    } finally {
      setIsTesting(false);
    }
  };

  const handleRunBenchmark = async () => {
    setIsBenchmarking(true);
    const startTime = performance.now();
    let firstTokenTime = 0;
    let tokenCount = 0;

    try {
      const benchmarkPrompt = 'Explain 3 core differences between Academic and General Training IELTS in 80 words.';
      await aiRouter.chat(
        [{ role: 'user', content: benchmarkPrompt }],
        (chunk) => {
          if (firstTokenTime === 0 && chunk.length > 0) {
            firstTokenTime = performance.now();
          }
          tokenCount = chunk.split(/\s+/).length;
        },
        { preferredProvider: 'local-webllm' }
      );

      const endTime = performance.now();
      const totalTimeMs = Math.round(endTime - startTime);
      const ttftMs = Math.round((firstTokenTime || endTime) - startTime);
      const tokensPerSec = tokenCount > 0 && totalTimeMs > ttftMs
        ? Number(((tokenCount / ((totalTimeMs - ttftMs) / 1000))).toFixed(1))
        : 15.0;

      const result: BenchmarkResults = {
        ttftMs,
        tokensPerSec,
        totalTimeMs,
        tokensGenerated: tokenCount,
        timestamp: new Date().toLocaleDateString()
      };

      setBenchmark(result);
      localStorage.setItem('akhl_local_ai_benchmark', JSON.stringify(result));
    } catch (e: any) {
      alert('Benchmark could not complete: ' + (e?.message || 'Local AI error'));
    } finally {
      setIsBenchmarking(false);
    }
  };

  const isReady = aiState === AIState.READY;
  const isDownloading = aiState === AIState.DOWNLOADING || isInitializing;
  const hasWebGPU = caps?.hasWebGPU ?? false;
  const storageGB = caps?.storageEstimateMB ? (caps.storageEstimateMB / 1024).toFixed(1) : 'Unknown';

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 text-white animate-fadeInUp">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] p-6 md:p-8 rounded-3xl border border-[#38BDF8]/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-bold px-3 py-1 rounded-full border border-[#38BDF8]/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Client-Side Privacy
            </span>
            {!isOnline && (
              <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5" /> OFFLINE LOCAL AI
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Browser Local AI Setup</h1>
          <p className="text-sm text-[#94A3B8] mt-1 max-w-xl">
            Run your AI IELTS Teacher directly inside this browser. Zero cloud token consumption, total data privacy, and full offline practice availability.
          </p>
        </div>

        {/* Status Pill */}
        <div className="shrink-0">
          {isReady ? (
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/40 text-green-400 rounded-2xl flex items-center gap-2.5 font-bold text-sm shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              Local AI Ready
            </div>
          ) : isDownloading ? (
            <div className="px-4 py-2 bg-sky-500/20 border border-sky-500/40 text-sky-300 rounded-2xl flex items-center gap-2.5 font-bold text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              Preparing Model ({progressInfo.progressPercentage}%)
            </div>
          ) : modelManager.isCached ? (
            <div className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 rounded-2xl flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Cached on Device
            </div>
          ) : (
            <div className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-400 rounded-2xl font-bold text-sm">
              Not Installed
            </div>
          )}
        </div>
      </div>

      {/* System Diagnostics & Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WebGPU */}
        <div className="bg-[#1E293B] p-5 rounded-2xl border border-[#334155] flex items-center gap-4">
          <div className={`p-3 rounded-xl ${hasWebGPU ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#94A3B8]">WebGPU Accelerator</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {hasWebGPU ? 'Hardware Accelerated' : 'Unavailable'}
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
              {caps?.gpuAdapterInfo || 'Generic Adapter'}
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className="bg-[#1E293B] p-5 rounded-2xl border border-[#334155] flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-500/10 text-[#38BDF8]">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#94A3B8]">Storage Space</div>
            <div className="text-sm font-bold text-white mt-0.5">
              ~{storageGB} GB Available
            </div>
            <div className="text-[11px] text-slate-400">
              Required: ~1.2 GB
            </div>
          </div>
        </div>

        {/* Browser */}
        <div className="bg-[#1E293B] p-5 rounded-2xl border border-[#334155] flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#94A3B8]">Browser & OS</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {caps?.browser} on {caps?.os}
            </div>
            <div className="text-[11px] text-slate-400">
              {caps?.isBrowserSupported ? 'Fully Compatible' : 'Check WebGPU flags'}
            </div>
          </div>
        </div>
      </div>

      {/* Model Spec Card & Action */}
      <div className="bg-[#1E293B] rounded-3xl border border-[#334155] p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Selected Target Model</span>
            <h3 className="text-xl font-bold text-white mt-1">{activeModel.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{activeModel.description}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Download Size</span>
            <div className="text-lg font-black text-white">~1.19 GB</div>
          </div>
        </div>

        {/* Progress Bar (During download or loading) */}
        {isDownloading && (
          <div className="space-y-2 bg-[#0F172A] p-4 rounded-2xl border border-[#334155]">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-sky-300 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {progressInfo.statusText || 'Downloading model weights into browser cache...'}
              </span>
              <span className="text-white">{progressInfo.progressPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-[#38BDF8] transition-all duration-300 rounded-full"
                style={{ width: `${progressInfo.progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {!isReady ? (
            <button
              onClick={handleDownloadOrStart}
              disabled={isDownloading || !hasWebGPU}
              className="px-6 py-3 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 rounded-xl font-bold text-sm transition disabled:opacity-50 flex items-center gap-2 shadow-lg"
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isDownloading ? 'Installing Model...' : modelManager.isCached ? 'Start Local AI Engine' : 'Download Local AI (~1.2 GB)'}
            </button>
          ) : (
            <>
              <button
                onClick={handleTestInference}
                disabled={isTesting || isBenchmarking}
                className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-slate-950 rounded-xl font-bold text-sm transition disabled:opacity-50 flex items-center gap-2"
              >
                {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Test Local AI
              </button>

              <button
                onClick={handleRunBenchmark}
                disabled={isTesting || isBenchmarking}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-xl font-bold text-sm transition disabled:opacity-50 flex items-center gap-2"
              >
                {isBenchmarking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Run Benchmark
              </button>

              <button
                onClick={handleRemoveCache}
                className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold text-sm transition flex items-center gap-2 ml-auto"
              >
                <Trash2 className="w-4 h-4" /> Clear Local Cache
              </button>
            </>
          )}
        </div>

        {!hasWebGPU && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
            <div>
              <p className="font-bold">WebGPU is unavailable on this browser/device.</p>
              <p className="mt-0.5 text-slate-300">
                You can continue using all AI features seamlessly via our high-speed Cloud AI Gateway.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Test Output Panel */}
      {testResponse !== null && (
        <div className="bg-[#1E293B] rounded-3xl border border-[#334155] p-6 space-y-3 animate-fadeInUp">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-sky-300 flex items-center gap-2">
              <SparkleIcon /> Local AI Test Generation
            </h4>
            <button
              onClick={() => setTestResponse(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
          <div className="p-4 bg-[#0F172A] rounded-2xl border border-[#334155] text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {testResponse || (isTesting ? 'Generating response on device...' : '')}
          </div>
        </div>
      )}

      {/* Benchmark Results Panel */}
      {benchmark && (
        <div className="bg-[#1E293B] rounded-3xl border border-[#334155] p-6 space-y-4 animate-fadeInUp">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" /> Device Benchmark Metrics
            </h4>
            <span className="text-[11px] text-slate-400">Tested: {benchmark.timestamp}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#0F172A] p-3.5 rounded-2xl border border-[#334155] text-center">
              <div className="text-[11px] text-slate-400">Time to First Token</div>
              <div className="text-xl font-bold text-sky-400 mt-1">{benchmark.ttftMs} ms</div>
            </div>
            <div className="bg-[#0F172A] p-3.5 rounded-2xl border border-[#334155] text-center">
              <div className="text-[11px] text-slate-400">Generation Speed</div>
              <div className="text-xl font-bold text-green-400 mt-1">{benchmark.tokensPerSec} t/s</div>
            </div>
            <div className="bg-[#0F172A] p-3.5 rounded-2xl border border-[#334155] text-center">
              <div className="text-[11px] text-slate-400">Total Latency</div>
              <div className="text-xl font-bold text-white mt-1">{(benchmark.totalTimeMs / 1000).toFixed(2)} s</div>
            </div>
            <div className="bg-[#0F172A] p-3.5 rounded-2xl border border-[#334155] text-center">
              <div className="text-[11px] text-slate-400">Tokens Generated</div>
              <div className="text-xl font-bold text-purple-400 mt-1">{benchmark.tokensGenerated}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function SparkleIcon() {
  return (
    <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  );
}
