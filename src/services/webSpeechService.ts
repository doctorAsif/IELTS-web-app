/**
 * Browser Speech Recognition & Synthesis Service
 * 100% Free, Native W3C Web Speech API
 */

export class WebSpeechService {
  private static recognition: any = null;
  private static isListening = false;

  static isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  static startSpeechRecognition(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ): boolean {
    if (!this.isSpeechRecognitionSupported()) {
      onError('Speech Recognition API is not supported in this browser. Please use Chrome or Edge.');
      return false;
    }

    try {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-GB'; // Cambridge IELTS standard British English

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        onResult(text, !!finalTranscript);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          onError(`Speech recognition error: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e: any) {
      onError(`Failed to start microphone recording: ${e.message}`);
      return false;
    }
  }

  static stopSpeechRecognition(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
      this.isListening = false;
    }
  }

  static speakText(text: string, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Clear, measured IELTS examiner pace
    utterance.pitch = 1.0;

    // Pick British or Australian voice if available
    const voices = window.speechSynthesis.getVoices();
    const examinerVoice = voices.find(v => v.lang === 'en-GB' || v.lang === 'en-AU' || v.name.includes('UK') || v.name.includes('British'));
    if (examinerVoice) {
      utterance.voice = examinerVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  static stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
