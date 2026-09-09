import {
  MnemonicPoemItem,
  GrammarMasteryItem,
  BandMakeoverItem,
  StoryAdventureItem,
  CreativeMasteryCounts,
} from '../types/creativeLearning';

export class CreativeLearningService {
  private static isLoaded = false;
  private static poems: MnemonicPoemItem[] = [];
  private static grammar: GrammarMasteryItem[] = [];
  private static makeovers: BandMakeoverItem[] = [];
  private static stories: StoryAdventureItem[] = [];

  static async loadAll(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const [poemsRes, grammarRes, makeoversRes, storiesRes] = await Promise.all([
        fetch('/database/ielts_mnemonic_poems.json'),
        fetch('/database/ielts_grammar_mastery.json'),
        fetch('/database/ielts_band_makeovers.json'),
        fetch('/database/ielts_story_adventures.json'),
      ]);

      if (poemsRes.ok) this.poems = await poemsRes.json();
      if (grammarRes.ok) this.grammar = await grammarRes.json();
      if (makeoversRes.ok) this.makeovers = await makeoversRes.json();
      if (storiesRes.ok) this.stories = await storiesRes.json();

      this.isLoaded = true;
    } catch (e) {
      console.error('Failed to load Creative Learning Suite:', e);
    }
  }

  static getPoems(): MnemonicPoemItem[] {
    return this.poems;
  }

  static getGrammar(): GrammarMasteryItem[] {
    return this.grammar;
  }

  static getMakeovers(): BandMakeoverItem[] {
    return this.makeovers;
  }

  static getStories(): StoryAdventureItem[] {
    return this.stories;
  }

  static getCounts(): CreativeMasteryCounts {
    return {
      poems: this.poems.length || 50,
      grammar: this.grammar.length || 50,
      makeovers: this.makeovers.length || 50,
      stories: this.stories.length || 50,
      total:
        (this.poems.length || 50) +
        (this.grammar.length || 50) +
        (this.makeovers.length || 50) +
        (this.stories.length || 50),
    };
  }
}
