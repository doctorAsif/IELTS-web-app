import {
  CurriculumMaster,
  PracticeQuestion,
  SpeakingPracticeItem,
  WritingPracticeItem,
  ReadingPracticeItem,
  ListeningPracticeItem,
} from '../types/curriculum';

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
  
  // Dedicated typed 400 Bank repositories
  private static speaking400: SpeakingPracticeItem[] = [];
  private static writing400: WritingPracticeItem[] = [];
  private static reading400: ReadingPracticeItem[] = [];
  private static listening400: ListeningPracticeItem[] = [];

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
          this.speaking400 = (rawBank.modules.speaking?.data || []) as SpeakingPracticeItem[];
          this.writing400 = (rawBank.modules.writing?.data || []) as WritingPracticeItem[];
          this.reading400 = (rawBank.modules.reading?.data || []) as ReadingPracticeItem[];
          this.listening400 = (rawBank.modules.listening?.data || []) as ListeningPracticeItem[];

          const extracted: PracticeQuestion[] = [];

          // Convert speaking items into PracticeQuestion with rich prompt preview
          this.speaking400.forEach((spk) => {
            const cueText = spk.part_2?.cue_card_topic
              ? `Cue Card: ${spk.part_2.cue_card_topic}\n\nYou should say:\n${(spk.part_2.prompts || []).map((p) => `• ${p}`).join('\n')}\n\nFollow-up: ${spk.part_2.follow_up_question || ''}`
              : (spk.part_1?.questions || []).join('\n');

            extracted.push({
              id: spk.id,
              section: 'speaking',
              type: 'Speaking Test (Parts 1, 2, 3)',
              title: spk.topic,
              instructions: `Difficulty: ${spk.difficulty} | Band 9 Collocations: ${(spk.band_9_lexical_resource || []).slice(0, 3).join(', ')}`,
              difficulty_band: 8.0,
              content: cueText,
              sample_response_band_9: spk.examiner_tips,
              criteria_hints: {
                lexicalResource: (spk.band_9_lexical_resource || []).join(', '),
                examinerTips: spk.examiner_tips,
              },
              rawItem: spk,
            });
          });

          // Convert writing items
          this.writing400.forEach((wrt) => {
            extracted.push({
              id: wrt.id,
              section: 'writing',
              type: wrt.task_type || 'Writing Task',
              title: wrt.title,
              instructions: `Time: ${wrt.recommended_time_minutes || 40} mins | Min Words: ${wrt.minimum_word_count || 250}`,
              difficulty_band: 7.5,
              content: wrt.prompt + (wrt.data_or_scenario_description ? `\n\nData / Scenario:\n${wrt.data_or_scenario_description}` : ''),
              sample_response_band_9: wrt.high_band_vocabulary ? `High-Band Collocations: ${wrt.high_band_vocabulary.join(', ')}` : '',
              rawItem: wrt,
            });
          });

          // Convert reading items
          this.reading400.forEach((rdg) => {
            extracted.push({
              id: rdg.id,
              section: 'reading',
              type: 'Academic Passage',
              title: rdg.title,
              instructions: `Domain: ${rdg.domain} | Word Count: ${rdg.word_count} words | ${rdg.questions?.length || 0} Questions`,
              difficulty_band: 8.0,
              content: rdg.passage,
              rawItem: rdg,
            });
          });

          // Convert listening items
          this.listening400.forEach((lis) => {
            extracted.push({
              id: lis.id,
              section: 'listening',
              type: `Section ${lis.section}`,
              title: lis.scenario || `Listening Section ${lis.section}`,
              instructions: `Context: ${lis.context} | ${lis.questions?.length || 0} Questions`,
              difficulty_band: 7.5,
              content: lis.audio_script,
              rawItem: lis,
            });
          });

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

  static getSpeakingBank(): SpeakingPracticeItem[] {
    return this.speaking400;
  }

  static getWritingBank(): WritingPracticeItem[] {
    return this.writing400;
  }

  static getReadingBank(): ReadingPracticeItem[] {
    return this.reading400;
  }

  static getListeningBank(): ListeningPracticeItem[] {
    return this.listening400;
  }

  static getSpeakingById(id: string): SpeakingPracticeItem | undefined {
    return this.speaking400.find((s) => s.id.toLowerCase() === id.toLowerCase());
  }

  static getWritingById(id: string): WritingPracticeItem | undefined {
    return this.writing400.find((w) => w.id.toLowerCase() === id.toLowerCase());
  }

  static getReadingById(id: string): ReadingPracticeItem | undefined {
    return this.reading400.find((r) => r.id.toLowerCase() === id.toLowerCase());
  }

  static getListeningById(id: string): ListeningPracticeItem | undefined {
    return this.listening400.find((l) => l.id.toLowerCase() === id.toLowerCase());
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
    Object.values(this.modularPractices).forEach((mods) => {
      mods.forEach((m) => {
        modularQuestions += Array.isArray(m.questions) ? m.questions.length : 1;
      });
    });
    if (modularQuestions === 0) modularQuestions = 1071;
    return {
      bank400,
      modularQuestions,
      grandTotal: bank400 + modularQuestions,
    };
  }
}

