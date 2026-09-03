import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, RotateCcw, FastForward, Sliders, Globe } from 'lucide-react';
import { sound } from '../../lib/audio';

interface AudioPlayerProps {
  src?: string;
  title?: string;
  transcriptText?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title = "IELTS Listening Section Track",
  transcriptText
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [accent, setAccent] = useState<'UK' | 'AU' | 'US'>('UK');
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const totalDuration = 180; // 3 minutes mock or audio duration

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return p + (0.5 * speed);
        });
        setCurrentTime(t => {
          if (t >= totalDuration) return 0;
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const togglePlay = () => {
    sound.playClick();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newProgress = Math.min(100, Math.max(0, pos * 100));
    setProgress(newProgress);
    setCurrentTime(Math.round((newProgress / 100) * totalDuration));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col bg-[#1E293B] border border-[#334155] p-5 rounded-3xl shadow-xl animate-fadeInUp space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">{title}</span>
            <span className="text-[10px] text-slate-400">
              Accent: {accent === 'UK' ? '🇬🇧 British Received Pronunciation' : accent === 'AU' ? '🇦🇺 Australian Native' : '🇺🇸 General American'} • {speed}x Speed
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-xl border transition ${
              showControls ? 'bg-[#38BDF8] text-slate-950 border-[#38BDF8]' : 'bg-[#0F172A] text-slate-400 border-[#334155] hover:text-white'
            }`}
            title="Acoustic & Speed Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Acoustic Settings Drawer */}
      {showControls && (
        <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#334155] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Accent Selection */}
          <div>
            <span className="text-slate-400 font-bold block mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#38BDF8]" /> IELTS Accent:
            </span>
            <div className="flex gap-1.5">
              {(['UK', 'AU', 'US'] as const).map(acc => (
                <button
                  key={acc}
                  onClick={() => setAccent(acc)}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                    accent === acc ? 'bg-[#38BDF8] text-slate-950 border-[#38BDF8]' : 'bg-[#1E293B] text-slate-300 border-[#334155]'
                  }`}
                >
                  {acc}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Selection */}
          <div>
            <span className="text-slate-400 font-bold block mb-1">Cadence / Speed:</span>
            <div className="flex gap-1.5">
              {[0.75, 0.9, 1.0, 1.25].map(spd => (
                <button
                  key={spd}
                  onClick={() => setSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                    speed === spd ? 'bg-[#38BDF8] text-slate-950 border-[#38BDF8]' : 'bg-[#1E293B] text-slate-300 border-[#334155]'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Pitch Selection */}
          <div>
            <span className="text-slate-400 font-bold block mb-1">Acoustic Pitch:</span>
            <div className="flex gap-1.5">
              {[0.8, 1.0, 1.2].map(pch => (
                <button
                  key={pch}
                  onClick={() => setPitch(pch)}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                    pitch === pch ? 'bg-[#38BDF8] text-slate-950 border-[#38BDF8]' : 'bg-[#1E293B] text-slate-300 border-[#334155]'
                  }`}
                >
                  {pch}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Playback Bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-slate-950 shadow-lg transition active:scale-95"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        {/* Interactive Progress Bar */}
        <div
          onClick={handleSeek}
          className="flex-1 h-3 bg-[#0F172A] rounded-full overflow-hidden relative cursor-pointer border border-[#334155]"
        >
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-[#38BDF8] rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-xs font-mono font-bold text-slate-400 shrink-0">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </span>
      </div>
    </div>
  );
};
