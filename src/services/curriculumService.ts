import { CurriculumMaster, PracticeQuestion } from '../types/curriculum';

export interface PracticeModuleItem {
  practiceId: string;
  skill: 'speaking' | 'writing' | 'reading' | 'listening' | 'vocabulary' | 'grammar';
  part: string;
  questionType: string;
  topic: string;
  difficulty: string;
  targetBand: number | string;
  instructions: string;
  questions: string[] | any[];
  rubric?: any;
  explanation?: string | any;
  sourceReferences?: string[];
  estimatedTime?: string;
  status?: string;
}

export class CurriculumService {
  private static isLoaded = false;
  private static master: CurriculumMaster | null = null;
  private static practiceBank400: PracticeQuestion[] = [];
  private static modularPractices: Record<string, PracticeModuleItem[]> = {
    speaking: [],
    writing: [],
    reading: [],
    listening: [],
    vocabulary: [],
    grammar: [],
  };

  static async loadAll(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const [
        masterRes,
        bankRes,
        speakingRes,
        writingRes,
        readingRes,
        listeningRes,
        vocabRes,
        grammarRes,
      ] = await Promise.all([
        fetch('/database/curriculum_master.json'),
        fetch('/database/ielts_comprehensive_400_bank.json'),
        fetch('/database/speaking_modules.json'),
        fetch('/database/writing_modules.json'),
        fetch('/database/reading_modules.json'),
        fetch('/database/listening_modules.json'),
        fetch('/database/vocabulary_modules.json'),
        fetch('/database/grammar_modules.json'),
      ]);

      if (masterRes.ok) this.master = await masterRes.json();

      if (bankRes.ok) {
        const rawBank = await bankRes.json();
        if (rawBank.modules) {
          const extracted: PracticeQuestion[] = [];
          for (const sec of ['speaking', 'writing', 'reading', 'listening'] as const) {
            const items = rawBank.modules[sec]?.data || [];
            items.forEach((it: any, idx: number) => {
              extracted.push({
                id: it.id || `${sec}_${idx + 1}`,
                section: sec,
                type: it.task_type || it.type || 'Practice Task',
                title: it.topic || it.title || `${sec.toUpperCase()} Drill #${idx + 1}`,
                instructions: it.instructions || '',
                difficulty_band: it.difficulty_band || 7.0,
                content: it.content || it.prompt || '',
                sample_response_band_9: it.sample_response_band_9 || it.model_answer || '',
                criteria_hints: it.criteria_hints || {},
              });
            });
          }
          this.practiceBank400 = extracted;
        }
      }

      if (speakingRes.ok) {
        const d = await speakingRes.json();
        this.modularPractices.speaking = d.modules || [];
      }
      if (writingRes.ok) {
        const d = await writingRes.json();
        this.modularPractices.writing = d.modules || [];
      }
      if (readingRes.ok) {
        const d = await readingRes.json();
        this.modularPractices.reading = d.modules || [];
      }
      if (listeningRes.ok) {
        const d = await listeningRes.json();
        this.modularPractices.listening = d.modules || [];
      }
      if (vocabRes.ok) {
        const d = await vocabRes.json();
        this.modularPractices.vocabulary = d.modules || [];
      }
      if (grammarRes.ok) {
        const d = await grammarRes.json();
        this.modularPractices.grammar = d.modules || [];
      }

      this.isLoaded = true;
    } catch (e) {
      console.error('Curriculum loading error:', e);
    }
  }

  static getMaster(): CurriculumMaster | null {
    return this.master;
  }

  static getPracticeBank400(): PracticeQuestion[] {
    return this.practiceBank400;
  }

  static getModularPractices(skill: 'speaking' | 'writing' | 'reading' | 'listening' | 'vocabulary' | 'grammar'): PracticeModuleItem[] {
    return this.modularPractices[skill] || [];
  }

  static getAllModularPractices(): PracticeModuleItem[] {
    return Object.values(this.modularPractices).flat();
  }

  static getTotalPracticeCount(): { bank400: number; modularQuestions: number; grandTotal: number } {
    const bank400 = this.practiceBank400.length || 400;
    let modularQuestions = 0;
    Object.values(this.modularPractices).forEach(mods => {
      mods.forEach(m => {
        modularQuestions += Array.isArray(m.questions) ? m.questions.length : 1;
      });
    });
    // If not loaded yet, fallback to recorded numbers
    if (modularQuestions === 0) modularQuestions = 1071;
    return {
      bank400,
      modularQuestions,
      grandTotal: bank400 + modularQuestions,
    };
  }
}
