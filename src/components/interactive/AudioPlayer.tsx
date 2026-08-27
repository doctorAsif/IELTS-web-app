import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { sound } from '../../lib/audio';

interface AudioPlayerProps {
  src?: string;
  title?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  title = "IELTS Listening Track 1" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // We mock the audio playback for now if src is missing
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return p + 1; // mock progress 1% per 100ms
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    sound.playClick();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col bg-white p-5 rounded-2xl shadow-duo-sm border border-gray-100 animate-fadeInUp">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-duo-blue" />
          <span className="text-sm font-bold text-duo-charcoal">{title}</span>
        </div>
        <span className="text-xs font-semibold text-gray-400">
          {isPlaying ? "Playing..." : "Paused"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-duo-blue text-white shadow-sm hover:translate-y-[1px] transition-all"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
        </button>
        
        {/* Mock Waveform / Progress Bar */}
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden relative cursor-pointer">
          <div 
            className="absolute top-0 left-0 h-full bg-duo-blue transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <span className="text-xs font-mono font-bold text-gray-500">
          01:23
        </span>
      </div>
    </div>
  );
};
