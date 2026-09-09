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
  private static activeVolume: 1 | 2 = 1;
  
  // Volume 1: Cambridge Standard 400 Bank
  private static speaking400_v1: SpeakingPracticeItem[] = [];
  private static writing400_v1: WritingPracticeItem[] = [];
  private static reading400_v1: ReadingPracticeItem[] = [];
  private static listening400_v1: ListeningPracticeItem[] = [];
  private static practiceBank400_v1: PracticeQuestion[] = [];

  // Volume 2: Bangladesh Mentor Edition 400 Bank
  private static speaking400_v2: SpeakingPracticeItem[] = [];
  private static writing400_v2: WritingPracticeItem[] = [];
  private static reading400_v2: ReadingPracticeItem[] = [];
  private static listening400_v2: ListeningPracticeItem[] = [];
  private static practiceBank400_v2: PracticeQuestion[] = [];

  private static modularPractices: Record<string, PracticeModuleItem[]> = {
    speaking: [],
    writing: [],
    reading: [],
    listening: [],
    vocabulary: [],
    grammar: [],
  };

  private static parseBankToQuestions(rawBank: any, volume: 1 | 2): {
    speaking: SpeakingPracticeItem[];
    writing: WritingPracticeItem[];
    reading: ReadingPracticeItem[];
    listening: ListeningPracticeItem[];
    questions: PracticeQuestion[];
  } {
    const spkItems = (rawBank?.modules?.speaking?.data || []) as SpeakingPracticeItem[];
    const wrtItems = (rawBank?.modules?.writing?.data || []) as WritingPracticeItem[];
    const rdgItems = (rawBank?.modules?.reading?.data || []) as ReadingPracticeItem[];
    const lisItems = (rawBank?.modules?.listening?.data || []) as ListeningPracticeItem[];
    const extracted: PracticeQuestion[] = [];

    // Speaking
    spkItems.forEach((spk) => {
      const cueText = spk.part_2?.cue_card_topic
        ? `Cue Card: ${spk.part_2.cue_card_topic}\n\nYou should say:\n${(spk.part_2.prompts || []).map((p) => `• ${p}`).join('\n')}\n\nFollow-up: ${spk.part_2.follow_up_question || ''}`
        : (spk.part_1?.questions || []).join('\n');

      const mentorHint = spk.mentor_technique ? ` | Framework: ${spk.mentor_technique.slice(0, 45)}...` : '';

      extracted.push({
        id: spk.id,
        section: 'speaking',
        type: volume === 2 ? '🇧🇩 Bangladesh Mentor Speaking' : 'Speaking Test (Parts 1, 2, 3)',
        title: spk.topic,
        instructions: `Difficulty: ${spk.difficulty}${mentorHint} | Collocations: ${(spk.band_9_lexical_resource || []).slice(0, 3).join(', ')}`,
        difficulty_band: 8.0,
        content: cueText,
        sample_response_band_9: spk.model_answer_snippet || spk.examiner_tips,
        criteria_hints: {
          lexicalResource: (spk.band_9_lexical_resource || []).join(', '),
          examinerTips: spk.examiner_tips || '',
          mentorTechnique: spk.mentor_technique || '',
          deshiPitfall: spk.deshi_pitfall_alert || '',
        },
        rawItem: spk,
      });
    });

    // Writing
    wrtItems.forEach((wrt) => {
      extracted.push({
        id: wrt.id,
        section: 'writing',
        type: wrt.task_type || 'Writing Task',
        title: wrt.title,
        instructions: `Time: ${wrt.recommended_time_minutes || 40} mins | Min Words: ${wrt.minimum_word_count || 250}${wrt.mentor_technique ? ' | ' + wrt.mentor_technique.slice(0, 40) + '...' : ''}`,
        difficulty_band: 7.5,
        content: wrt.prompt + (wrt.data_or_scenario_description ? `\n\nData / Scenario:\n${wrt.data_or_scenario_description}` : ''),
        sample_response_band_9: wrt.model_answer_snippet || (wrt.high_band_vocabulary ? `High-Band Collocations: ${wrt.high_band_vocabulary.join(', ')}` : ''),
        criteria_hints: {
          mentorTechnique: wrt.mentor_technique || '',
          deshiPitfall: wrt.deshi_pitfall_alert || '',
        },
        rawItem: wrt,
      });
    });

    // Reading
    rdgItems.forEach((rdg) => {
      extracted.push({
        id: rdg.id,
        section: 'reading',
        type: volume === 2 ? '🇧🇩 Academic Passage (Synonym Radar)' : 'Academic Passage',
        title: rdg.title,
        instructions: `Domain: ${rdg.domain} | Word Count: ${rdg.word_count} words | ${rdg.questions?.length || 0} Questions`,
        difficulty_band: 8.0,
        content: rdg.passage,
        criteria_hints: {
          mentorTechnique: rdg.mentor_technique || '',
          deshiPitfall: rdg.deshi_pitfall_alert || '',
        },
        rawItem: rdg,
      });
    });

    // Listening
    lisItems.forEach((lis) => {
      extracted.push({
        id: lis.id,
        section: 'listening',
        type: volume === 2 ? `🇧🇩 Section ${lis.section} (Distractor Catcher)` : `Section ${lis.section}`,
        title: lis.scenario || `Listening Section ${lis.section}`,
        instructions: `Context: ${lis.context} | ${lis.questions?.length || 0} Questions`,
        difficulty_band: 7.5,
        content: lis.audio_script,
        criteria_hints: {
          mentorTechnique: lis.mentor_technique || '',
          deshiPitfall: lis.deshi_pitfall_alert || '',
        },
        rawItem: lis,
      });
    });

    return {
      speaking: spkItems,
      writing: wrtItems,
      reading: rdgItems,
      listening: lisItems,
      questions: extracted,
    };
  }

  static async loadAll(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const [
        masterRes,
        bankV1Res,
        bankV2Res,
        speakingRes,
        writingRes,
        readingRes,
        listeningRes,
        vocabRes,
        grammarRes,
      ] = await Promise.all([
        fetch('/database/curriculum_master.json'),
        fetch('/database/ielts_comprehensive_400_bank.json'),
        fetch('/database/ielts_comprehensive_400_bank_v2.json'),
        fetch('/database/speaking_modules.json'),
        fetch('/database/writing_modules.json'),
        fetch('/database/reading_modules.json'),
        fetch('/database/listening_modules.json'),
        fetch('/database/vocabulary_modules.json'),
        fetch('/database/grammar_modules.json'),
      ]);

      if (masterRes.ok) this.master = await masterRes.json();

      // Volume 1
      if (bankV1Res.ok) {
        const rawV1 = await bankV1Res.json();
        const parsedV1 = this.parseBankToQuestions(rawV1, 1);
        this.speaking400_v1 = parsedV1.speaking;
        this.writing400_v1 = parsedV1.writing;
        this.reading400_v1 = parsedV1.reading;
        this.listening400_v1 = parsedV1.listening;
        this.practiceBank400_v1 = parsedV1.questions;
      }

      // Volume 2 (Bangladesh Mentor Edition)
      if (bankV2Res.ok) {
        const rawV2 = await bankV2Res.json();
        const parsedV2 = this.parseBankToQuestions(rawV2, 2);
        this.speaking400_v2 = parsedV2.speaking;
        this.writing400_v2 = parsedV2.writing;
        this.reading400_v2 = parsedV2.reading;
        this.listening400_v2 = parsedV2.listening;
        this.practiceBank400_v2 = parsedV2.questions;
      }

      // Modular practice banks
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

  // Volume state
  static getActiveVolume(): 1 | 2 {
    return this.activeVolume;
  }

  static setActiveVolume(vol: 1 | 2): void {
    this.activeVolume = vol;
  }

  // Volume-aware getters
  static getPracticeBank400(volume?: 1 | 2): PracticeQuestion[] {
    const targetVol = volume ?? this.activeVolume;
    return targetVol === 2 ? this.practiceBank400_v2 : this.practiceBank400_v1;
  }

  static getAllPracticeQuestions(): PracticeQuestion[] {
    return [...this.practiceBank400_v1, ...this.practiceBank400_v2];
  }

  static getSpeakingBank(volume?: 1 | 2): SpeakingPracticeItem[] {
    const targetVol = volume ?? this.activeVolume;
    return targetVol === 2 ? this.speaking400_v2 : this.speaking400_v1;
  }

  static getWritingBank(volume?: 1 | 2): WritingPracticeItem[] {
    const targetVol = volume ?? this.activeVolume;
    return targetVol === 2 ? this.writing400_v2 : this.writing400_v1;
  }

  static getReadingBank(volume?: 1 | 2): ReadingPracticeItem[] {
    const targetVol = volume ?? this.activeVolume;
    return targetVol === 2 ? this.reading400_v2 : this.reading400_v1;
  }

  static getListeningBank(volume?: 1 | 2): ListeningPracticeItem[] {
    const targetVol = volume ?? this.activeVolume;
    return targetVol === 2 ? this.listening400_v2 : this.listening400_v1;
  }

  // Global ID lookups (searches both volumes)
  static getSpeakingById(id: string): SpeakingPracticeItem | undefined {
    const q = id.toLowerCase();
    return this.speaking400_v2.find((s) => s.id.toLowerCase() === q) ||
           this.speaking400_v1.find((s) => s.id.toLowerCase() === q);
  }

  static getWritingById(id: string): WritingPracticeItem | undefined {
    const q = id.toLowerCase();
    return this.writing400_v2.find((w) => w.id.toLowerCase() === q) ||
           this.writing400_v1.find((w) => w.id.toLowerCase() === q);
  }

  static getReadingById(id: string): ReadingPracticeItem | undefined {
    const q = id.toLowerCase();
    return this.reading400_v2.find((r) => r.id.toLowerCase() === q) ||
           this.reading400_v1.find((r) => r.id.toLowerCase() === q);
  }

  static getListeningById(id: string): ListeningPracticeItem | undefined {
    const q = id.toLowerCase();
    return this.listening400_v2.find((l) => l.id.toLowerCase() === q) ||
           this.listening400_v1.find((l) => l.id.toLowerCase() === q);
  }

  static getModularPractices(skill: 'speaking' | 'writing' | 'reading' | 'listening' | 'vocabulary' | 'grammar'): PracticeModuleItem[] {
    return this.modularPractices[skill] || [];
  }

  static getAllModularPractices(): PracticeModuleItem[] {
    return Object.values(this.modularPractices).flat();
  }

  static getTotalPracticeCount(): {
    bank400_v1: number;
    bank400_v2: number;
    totalBank: number;
    modularQuestions: number;
    grandTotal: number;
  } {
    const bank400_v1 = this.practiceBank400_v1.length || 400;
    const bank400_v2 = this.practiceBank400_v2.length || 400;
    const totalBank = bank400_v1 + bank400_v2;

    let modularQuestions = 0;
    Object.values(this.modularPractices).forEach((mods) => {
      mods.forEach((m) => {
        modularQuestions += Array.isArray(m.questions) ? m.questions.length : 1;
      });
    });
    if (modularQuestions === 0) modularQuestions = 1071;

    return {
      bank400_v1,
      bank400_v2,
      totalBank,
      modularQuestions,
      grandTotal: totalBank + modularQuestions,
    };
  }
}

