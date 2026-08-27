export interface Flashcard {
  id: string;
  front: string;
  category: string;
  band: string;
  back: {
    definition: string;
    synonyms: string[];
    collocations: string[];
    academicExample: string;
  };
}

export interface PracticeModule {
  id: string;
  title: string;
  skill: 'speaking' | 'listening' | 'reading' | 'writing' | 'vocabulary';
  description: string;
  icon: string;
  color: string;
  durationMinutes: number;
  xpReward: number;
  badge: string;
}

export const PRACTICE_MODULES: PracticeModule[] = [
  {
    id: 'pm-speaking-mic',
    title: 'Speaking Part 2 Simulator',
    skill: 'speaking',
    description: 'Instant AI mic evaluation on fluency, topic vocabulary, and coherence.',
    icon: 'Mic',
    color: 'red',
    durationMinutes: 3,
    xpReward: 25,
    badge: 'Band 7.5+ Cue Card',
  },
  {
    id: 'pm-reading-tfng',
    title: 'True / False / Not Given Blitz',
    skill: 'reading',
    description: 'Rapid-fire passage drills to master subtle logic distinctions in Reading.',
    icon: 'Eye',
    color: 'purple',
    durationMinutes: 5,
    xpReward: 30,
    badge: '10 Drills',
  },
  {
    id: 'pm-writing-linkers',
    title: 'Task 2 Cohesive Linkers Drill',
    skill: 'writing',
    description: 'Avoid overused connectors and practice natural C1 academic transitions.',
    icon: 'PenTool',
    color: 'orange',
    durationMinutes: 4,
    xpReward: 20,
    badge: 'Band 8 Cohesion',
  },
  {
    id: 'pm-listening-accents',
    title: 'Multi-Accent Audio Challenge',
    skill: 'listening',
    description: 'Listen to British, Aussie, and North American accents with note-taking.',
    icon: 'Headphones',
    color: 'blue',
    durationMinutes: 4,
    xpReward: 25,
    badge: 'Section 3 & 4',
  },
  {
    id: 'pm-vocab-flashcards',
    title: 'Band 8.0+ Vocabulary Flashcards',
    skill: 'vocabulary',
    description: 'Spaced repetition flashcards for high-impact academic collocations.',
    icon: 'BookMarked',
    color: 'green',
    durationMinutes: 5,
    xpReward: 25,
    badge: '50 Flashcards',
  }
];

export const VOCABULARY_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    front: 'Exacerbate',
    category: 'Problem & Solution / Environment',
    band: 'Band 8.0+',
    back: {
      definition: 'To make a bad situation or problem worse or more severe.',
      synonyms: ['Aggravate', 'Worsen', 'Intensify', 'Compound'],
      collocations: ['Exacerbate existing tensions', 'Exacerbate the problem', 'Exacerbate poverty'],
      academicExample: 'The unchecked expansion of urban sprawl will inevitably exacerbate metropolitan traffic congestion.'
    }
  },
  {
    id: 'fc-2',
    front: 'Detrimental',
    category: 'Academic Discussion & Impacts',
    band: 'Band 7.5+',
    back: {
      definition: 'Tending to cause harm or damage.',
      synonyms: ['Harmful', 'Adverse', 'Deleterious', 'Damaging'],
      collocations: ['Detrimental effect on', 'Detrimental impact', 'Highly detrimental'],
      academicExample: 'Sedentary desk jobs have proved to have a detrimental effect on cardiovascular wellness.'
    }
  },
  {
    id: 'fc-3',
    front: 'Substantiate',
    category: 'Academic Writing & Arguments',
    band: 'Band 8.5+',
    back: {
      definition: 'To provide evidence to support or prove the truth of an assertion.',
      synonyms: ['Corroborate', 'Validate', 'Verify', 'Support'],
      collocations: ['Substantiate the claim', 'Substantiate hypothesis', 'Empirical data to substantiate'],
      academicExample: 'Researchers have gathered extensive empirical data to substantiate the climate correlation.'
    }
  },
  {
    id: 'fc-4',
    front: 'Proponents vs Opponents',
    category: 'Essay Argumentation Structure',
    band: 'Band 7.5+',
    back: {
      definition: 'Advocates / supporters versus detractors / critics of a policy.',
      synonyms: ['Advocates & Critics', 'Supporters & Detractors'],
      collocations: ['Proponents assert that', 'Opponents contend that', 'Fierce debate between proponents and opponents'],
      academicExample: 'While proponents argue for strict digital taxation, opponents claim it stifles startup innovation.'
    }
  },
  {
    id: 'fc-5',
    front: 'Unprecedented',
    category: 'Task 1 Trends & History',
    band: 'Band 8.0+',
    back: {
      definition: 'Never done or known before; completely novel in scale.',
      synonyms: ['Unparalleled', 'Extraordinary', 'Record-breaking', 'Novel'],
      collocations: ['Unprecedented surge', 'Unprecedented growth', 'At an unprecedented rate'],
      academicExample: 'The renewable energy sector witnessed unprecedented expansion between 2018 and 2024.'
    }
  },
  {
    id: 'fc-6',
    front: 'Mitigate',
    category: 'Government & Solutions',
    band: 'Band 8.0+',
    back: {
      definition: 'To make something less harmful, unpleasant, or bad.',
      synonyms: ['Alleviate', 'Lessen', 'Attenuate', 'Moderate'],
      collocations: ['Mitigate climate risks', 'Mitigate the consequences', 'Measures to mitigate'],
      academicExample: 'Subsidizing electric mass transit could substantially mitigate urban carbon emissions.'
    }
  }
];
