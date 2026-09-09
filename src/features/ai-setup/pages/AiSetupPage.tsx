import React, { useState } from 'react';
import {
  Cpu,
  DownloadCloud,
  CheckCircle2,
  HardDrive,
  Sparkles,
  Zap,
  Server,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { AIProgress, HardwareProfile, ModelTier } from '../../../types/ai';
import { MODEL_CATALOG } from '../../../services/hardwareDetector';

interface AiSetupPageProps {
  hardwareProfile: HardwareProfile | null;
  aiProgress: AIProgress;
  onRefreshHardware: () => void;
  onSelectTier: (tier: ModelTier) => void;
}

export const AiSetupPage: React.FC<AiSetupPageProps> = ({
  hardwareProfile,
  aiProgress,
  onRefreshHardware,
  onSelectTier,
}) => {
  const [selectedTier, setSelectedTier] = useState<ModelTier>(
    hardwareProfile?.recommendedTier || 'light'
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Client-Side Edge AI & RAM Engine</h1>
            <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
              WebGPU Accelerated
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Intelligently balances your computer's RAM and GPU to run 100% private, zero-lag Cambridge IELTS evaluations inside your browser.
          </p>
        </div>

        <button
          onClick={onRefreshHardware}
          className="self-start md:self-auto flex items-center space-x-2 bg-slate-900 border border-slate-700 hover:border-slate-500 px-3.5 py-2 rounded-xl text-xs text-slate-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
          <span>Re-detect Hardware</span>
        </button>
      </div>

      {/* Hardware Inspector Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0D182E] border border-slate-800/90 p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2.5 text-slate-400 text-xs">
            <Cpu className="w-4 h-4 text-sky-400" />
            <span>Detected PC RAM</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {hardwareProfile ? `${hardwareProfile.ramGB} GB+` : 'Detecting...'}
          </div>
          <p className="text-[11px] text-slate-400">
            {hardwareProfile && hardwareProfile.ramGB >= 8
              ? 'High-capacity device. Capable of hosting the 3.0 GB Advanced AI!'
              : 'Standard memory profile. The 1.2 GB model is recommended for smooth performance.'}
          </p>
        </div>

        <div className="bg-[#0D182E] border border-slate-800/90 p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2.5 text-slate-400 text-xs">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Graphics / WebGPU</span>
          </div>
          <div className="text-base font-semibold text-white truncate" title={hardwareProfile?.gpuRenderer}>
            {hardwareProfile?.hasWebGPU ? 'WebGPU Enabled' : 'Software Fallback'}
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {hardwareProfile?.gpuRenderer || 'Detecting GPU capabilities...'}
          </p>
        </div>

        <div className="bg-[#0D182E] border border-slate-800/90 p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2.5 text-slate-400 text-xs">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>24/7 Oracle Cloud Backend</span>
          </div>
          <div className="text-base font-semibold text-emerald-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Always Free VPS</span>
          </div>
          <p className="text-[11px] text-slate-400">
            4 OCPU ARM, 24 GB RAM standby for zero-download cloud queries.
          </p>
        </div>
      </div>

      {/* Live Download / Initialization Progress Card */}
      {aiProgress.status !== 'idle' && (
        <div className="bg-gradient-to-br from-slate-900 via-[#0B152B] to-[#0A1224] border border-sky-500/30 p-6 rounded-2xl shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {aiProgress.status === 'ready' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              )}
              <div>
                <h3 className="font-semibold text-white text-base">
                  {aiProgress.status === 'ready' ? 'Edge AI Model Ready for Practice' : 'Downloading & Initializing Edge AI'}
                </h3>
                <p className="text-xs text-slate-400">{aiProgress.currentStepText}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-lg font-bold text-sky-400">
                {Math.round(aiProgress.progress * 100)}%
              </span>
              <p className="text-[11px] text-slate-400">
                {aiProgress.receivedMB} MB / {aiProgress.totalMB} MB
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden ring-1 ring-white/10">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(5, Math.round(aiProgress.progress * 100))}%` }}
            />
          </div>
        </div>
      )}

      {/* Model Selection Options */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Select Model Tier for Your Device</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tier 1: Light / 1.2 GB */}
          <div
            onClick={() => {
              setSelectedTier('light');
              onSelectTier('light');
            }}
            className={`cursor-pointer rounded-2xl p-5 border transition-all relative ${
              selectedTier === 'light'
                ? 'bg-sky-950/20 border-sky-500 ring-1 ring-sky-500/40'
                : 'bg-[#0D182E]/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            {hardwareProfile?.recommendedTier === 'light' && (
              <span className="absolute -top-2.5 right-4 bg-sky-500 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                Auto-Recommended
              </span>
            )}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Standard Tier</span>
                <span className="text-xs font-bold bg-slate-800 px-2 py-0.5 rounded-md text-white">1.2 GB</span>
              </div>
              <h3 className="font-bold text-white text-base">Qwen 2.5 1.5B Instruct</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Exact same model used on the AKHL Android app. Fast, stable, and requires &lt; 8 GB RAM.
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div>Min RAM: <strong>4 GB</strong></div>
                <div>WebGPU VRAM: <strong>~1.8 GB</strong></div>
              </div>
            </div>
          </div>

          {/* Tier 2: Advanced / 3.0 GB */}
          <div
            onClick={() => {
              setSelectedTier('advanced');
              onSelectTier('advanced');
            }}
            className={`cursor-pointer rounded-2xl p-5 border transition-all relative ${
              selectedTier === 'advanced'
                ? 'bg-sky-950/20 border-sky-500 ring-1 ring-sky-500/40'
                : 'bg-[#0D182E]/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            {hardwareProfile?.recommendedTier === 'advanced' && (
              <span className="absolute -top-2.5 right-4 bg-emerald-500 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                Auto-Recommended (High RAM)
              </span>
            )}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Advanced Master</span>
                <span className="text-xs font-bold bg-slate-800 px-2 py-0.5 rounded-md text-white">3.0 GB</span>
              </div>
              <h3 className="font-bold text-white text-base">Qwen 2.5 3B Instruct</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Elite diagnostic precision for Band 8.5/9.0 lexical nuances and concessive syntax. For PCs with &gt;= 8 GB or 12 GB+ RAM.
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div>Min RAM: <strong>8 GB (or 12 GB+)</strong></div>
                <div>WebGPU VRAM: <strong>~3.8 GB</strong></div>
              </div>
            </div>
          </div>

          {/* Tier 3: 24/7 Oracle Cloud */}
          <div
            onClick={() => {
              setSelectedTier('cloud');
              onSelectTier('cloud');
            }}
            className={`cursor-pointer rounded-2xl p-5 border transition-all relative ${
              selectedTier === 'cloud'
                ? 'bg-sky-950/20 border-sky-500 ring-1 ring-sky-500/40'
                : 'bg-[#0D182E]/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Cloud Fallback</span>
                <span className="text-xs font-bold bg-slate-800 px-2 py-0.5 rounded-md text-white">0 MB</span>
              </div>
              <h3 className="font-bold text-white text-base">Oracle 24/7 Free VPS</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inference runs on Dr. Asif’s Oracle Cloud Always Free 4 OCPU server. Zero download required. Ideal for low-spec PCs.
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div>Min RAM: <strong>Any device</strong></div>
                <div>Internet: <strong>Active connection</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
