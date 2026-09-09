export interface MnemonicPoemItem {
  id: string;
  title: string;
  category: string;
  poem_type: string;
  poem_verse: string;
  the_rule_explained: string;
  bengali_mentor_tip: string;
  quick_quiz: string;
}

export interface GrammarMasteryItem {
  id: string;
  structure_name: string;
  target_band: string;
  grammatical_formula: string;
  why_examiners_love_it: string;
  bengali_mental_bridge: string;
  clunky_band_5_draft: string;
  polished_band_8_upgrade: string;
  application_in_writing: string;
  application_in_speaking: string;
  practice_exercise: string;
}

export interface BandMakeoverItem {
  id: string;
  topic: string;
  skill_domain: string;
  band_5_draft: string;
  why_band_5: string;
  band_6_5_upgrade: string;
  why_band_6_5: string;
  band_8_5_masterpiece: string;
  examiner_band_8_5_rubric_analysis: string;
  mentor_takeaway_rule: string;
}

export interface StoryAdventureItem {
  id: string;
  title: string;
  theme: string;
  word_count: number;
  story_text: string;
  target_band_9_lexicon: string[];
  grammatical_structures_spotlight: string[];
  bengali_mentor_takeaway: string;
  interactive_application_challenge: string;
}

export interface CreativeMasteryCounts {
  poems: number;
  grammar: number;
  makeovers: number;
  stories: number;
  total: number;
}
