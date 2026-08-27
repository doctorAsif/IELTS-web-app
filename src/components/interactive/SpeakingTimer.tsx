import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Mic, AlertCircle } from 'lucide-react';
import { sound } from '../../lib/audio';

interface SpeakingTimerProps {
  initialSeconds?: number;
  onComplete?: () => void;
}

export const SpeakingTimer: React.FC<SpeakingTimerProps> = ({ 
  initialSeconds = 120, // Default 2 mins for IELTS Part 2
  onComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      stopRecording();
      setIsActive(false);
      sound.playVictory(); // Or a specific timer sound
      if (onComplete) onComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  // Clean up media stream on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const stopRecording = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const requestMicAndStart = async () => {
    setErrorMsg(null);
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setHasMicPermission(true);
      setIsActive(true);
    } catch (err) {
      console.error("Microphone access denied or not available", err);
      setHasMicPermission(false);
      setErrorMsg("Microphone access is required to practice speaking.");
      setIsActive(false);
    }
  };

  const toggleTimer = () => {
    sound.playClick();
    if (!isActive) {
      requestMicAndStart();
    } else {
      stopRecording();
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    sound.playClick();
    stopRecording();
    setIsActive(false);
    setTimeLeft(initialSeconds);
    setHasMicPermission(null);
    setErrorMsg(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate percentage for circular progress (optional visual enhancement)
  const percentage = (timeLeft / initialSeconds) * 100;
  
  // Dynamic color based on time left
  const getColor = () => {
    if (timeLeft > initialSeconds * 0.5) return 'text-[#00205B]'; // Deep Blue
    if (timeLeft > initialSeconds * 0.25) return 'text-[#F9C300]'; // Yellow
    return 'text-[#D01012]'; // Red
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-lg border border-gray-100 animate-in fade-in zoom-in-95">
      {errorMsg && (
        <div className="mb-4 w-full p-3 bg-red-50 rounded-xl flex items-start gap-2 border border-red-100 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
        </div>
      )}

      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
        {/* Simple CSS Circular Progress Indicator */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-current text-gray-100"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            className={`stroke-current ${getColor()} transition-all duration-1000 ease-linear`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * percentage) / 100}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-black font-mono tracking-tighter ${getColor()}`}>
            {formatTime(timeLeft)}
          </span>
          {isActive && (
            <div className="absolute -bottom-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTimer}
          className={`flex items-center justify-center w-14 h-14 rounded-full text-white shadow-md hover:scale-105 active:scale-95 transition-all ${
            isActive ? 'bg-red-500' : 'bg-[#00205B]'
          }`}
          title={isActive ? "Stop Recording" : "Start Recording"}
        >
          {isActive ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>
        
        <button
          onClick={resetTimer}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {hasMicPermission === true && isActive && (
        <p className="mt-4 text-xs font-bold text-gray-400 tracking-wide uppercase flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Recording in progress...
        </p>
      )}
    </div>
  );
};

