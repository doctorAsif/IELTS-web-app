import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isRecording: boolean;
  barColor?: string;
  height?: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isRecording,
  barColor = '#F43F5E',
  height = 56
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const setupAudio = async () => {
      if (!isRecording) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        drawRealTimeWave();
      } catch (e) {
        // Fallback to simulated organic waveform
        drawSimulatedWave();
      }
    };

    const drawRealTimeWave = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const analyser = analyserRef.current;
      if (!analyser) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const render = () => {
        animationFrameRef.current = requestAnimationFrame(render);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = Math.max(4, (dataArray[i] / 255) * canvas.height * 0.85);

          // Draw centered rounded bars
          const y = (canvas.height - barHeight) / 2;

          ctx.fillStyle = barColor;
          ctx.beginPath();
          ctx.roundRect(x, y, Math.max(3, barWidth - 3), barHeight, 4);
          ctx.fill();

          x += barWidth + 1;
        }
      };

      render();
    };

    const drawSimulatedWave = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let step = 0;
      const render = () => {
        animationFrameRef.current = requestAnimationFrame(render);
        step += 0.08;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const bars = 28;
        const barWidth = canvas.width / bars;

        for (let i = 0; i < bars; i++) {
          const sinVal = Math.sin(step + i * 0.4);
          const barHeight = isRecording
            ? Math.max(6, (Math.abs(sinVal) * canvas.height * 0.75) + (Math.random() * 6))
            : 4;

          const y = (canvas.height - barHeight) / 2;
          ctx.fillStyle = isRecording ? barColor : '#475569';
          ctx.beginPath();
          ctx.roundRect(i * barWidth + 2, y, Math.max(2, barWidth - 4), barHeight, 3);
          ctx.fill();
        }
      };

      render();
    };

    if (isRecording) {
      setupAudio();
    } else {
      drawSimulatedWave();
    }

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isRecording, barColor]);

  return (
    <div className="w-full bg-[#0F172A] rounded-2xl border border-[#334155] p-3 flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={360}
        height={height}
        className="w-full max-w-sm h-14"
      />
    </div>
  );
};
