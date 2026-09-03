// Speech Synthesis (TTS) and Speech Recognition (STT) helpers for IELTS drills
// Note: LLM is strictly used for text evaluation, NOT for audio synthesis or acoustic STT.

export function speakText(
  text: string,
  rate: number = 0.95,
  lang: string = 'en-GB',
  pitchOrOnEnd: number | (() => void) = 1.0,
  onEnd?: () => void
): void {
  const pitch = typeof pitchOrOnEnd === 'number' ? pitchOrOnEnd : 1.0;
  const callback = typeof pitchOrOnEnd === 'function' ? pitchOrOnEnd : onEnd;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    callback?.();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.lang = lang;

  // Try to pick a natural British (en-GB) examiner voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    v => (v.lang === lang || v.lang.replace('_', '-').startsWith('en-GB')) &&
         (v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('Arthur') || v.name.includes('Google UK') || v.name.includes('Serena'))
  ) || voices.find(v => v.lang.startsWith('en-GB'))
    || voices.find(v => v.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export interface SpeechRecognitionResultState {
  transcript: string;
  isListening: boolean;
  error?: string;
  isSupported: boolean;
  confidence?: number;
}

export class SpeechRecognizer {
  private recognition: any = null;
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-GB';
        this.isSupported = true;
      }
    }
  }

  public getIsSupported(): boolean {
    return this.isSupported;
  }

  public startListening(
    onResult: (transcript: string, isFinal: boolean, confidence?: number) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser. Please use Chrome/Edge or type your response manually.');
      return false;
    }

    try {
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        let lastConfidence: number | undefined;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
            lastConfidence = item[0].confidence;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        onResult(text, !!finalTranscript, lastConfidence);
      };

      this.recognition.onerror = (event: any) => {
        const errorMsg = event.error === 'not-allowed'
          ? 'Microphone access was denied. Please allow microphone permissions.'
          : (event.error || 'Microphone capture error');
        onError(errorMsg);
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      onError(e.message || 'Failed to initialize microphone');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }
}

/**
 * Helper to calculate keyword overlap for speaking exercises.
 */
export function calculateKeywordMatch(
  spoken: string,
  targetKeywords: string[]
): { score: number; matchedKeywords: string[]; missingKeywords: string[] } {
  const normalizedSpoken = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const spokenTokens = normalizedSpoken.split(/\s+/);

  const matched: string[] = [];
  const missing: string[] = [];

  targetKeywords.forEach(kw => {
    const cleanKw = kw.toLowerCase().trim();
    if (normalizedSpoken.includes(cleanKw) || spokenTokens.some(t => t.startsWith(cleanKw.slice(0, 4)))) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const score = targetKeywords.length > 0 ? Math.round((matched.length / targetKeywords.length) * 100) : 100;
  return { score, matchedKeywords: matched, missingKeywords: missing };
}
