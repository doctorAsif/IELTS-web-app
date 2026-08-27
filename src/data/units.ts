import { Unit } from '../lib/types';

export const IELTS_UNITS: Unit[] = [
  {
    id: 1,
    title: 'Unit 1: IELTS Foundations & Band 7+ Strategy',
    subtitle: 'Master the IELTS rubric, academic paraphrase, and formal register',
    color: 'green',
    guidebook: {
      overview: 'Understanding the 4 IELTS Assessment Criteria: Task Achievement/Response, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy.',
      keyTips: [
        'Never repeat the prompt words verbatim in Writing or Speaking; always paraphrase with synonyms or structural changes.',
        'Formal academic register avoids contractions (e.g. use "do not" instead of "don\'t") and colloquialisms.',
        'Signposting connectors (Furthermore, In contrast, Consequently) must be used naturally, not mechanically.'
      ],
      vocabulary: [
        { word: 'Detrimental', pos: 'adj.', def: 'Tending to cause harm; damaging.', example: 'Excessive screen time has a detrimental impact on cognitive development.' },
        { word: 'Mitigate', pos: 'v.', def: 'Make less severe, serious, or painful.', example: 'Renewable energy policies can mitigate environmental degradation.' },
        { word: 'Prevalent', pos: 'adj.', def: 'Widespread in a particular area at a particular time.', example: 'Sedentary lifestyles are increasingly prevalent in urban areas.' },
        { word: 'Exacerbate', pos: 'v.', def: 'Make a problem, bad situation, or negative feeling worse.', example: 'Traffic congestion exacerbates air pollution in metropolitan centers.' }
      ],
      grammarPatterns: [
        { title: 'Inversion for Emphasis', pattern: 'Not only + aux + subject + verb, but also...', example: 'Not only does education improve career prospects, but it also fosters social cohesion.' },
        { title: 'Cleft Sentences', pattern: 'It is / It was + [emphasized part] + that/who...', example: 'It is through rigorous practice that candidates attain Band 8.0.' }
      ]
    },
    lessons: [
      {
        id: 'u1-l1',
        unitId: 1,
        title: 'Academic Synonyms & Paraphrasing',
        description: 'Transform basic words into Band 7.5+ academic vocabulary',
        type: 'standard',
        skill: 'vocabulary',
        xpReward: 20,
        gemsReward: 10,
        questions: [
          {
            id: 'u1-l1-q1',
            type: 'pair-matching',
            skill: 'vocabulary',
            prompt: 'Match each everyday word with its high-scoring IELTS Academic equivalent',
            explanation: 'Using sophisticated synonyms demonstrates wide Lexical Resource for Band 7+.',
            pairs: [
              { left: 'Important', right: 'Crucial / Paramount' },
              { left: 'Dangerous', right: 'Hazardous / Perilous' },
              { left: 'Solve a problem', right: 'Tackle / Resolve' },
              { left: 'Big increase', right: 'Substantial surge' }
            ]
          },
          {
            id: 'u1-l1-q2',
            type: 'sentence-builder',
            skill: 'writing',
            prompt: 'Arrange the tiles to construct a Band 8 introduction paraphrase',
            subPrompt: 'Original: "Many people think that global warming is a big danger."',
            targetSentence: 'It is widely argued that climate change poses a grave threat to humanity.',
            words: ['It', 'is', 'widely', 'argued', 'that', 'climate', 'change', 'poses', 'a', 'grave', 'threat', 'to', 'humanity.'],
            explanation: '"It is widely argued that..." avoids the basic "Many people think" and uses passive academic stance.'
          },
          {
            id: 'u1-l1-q3',
            type: 'multiple-choice',
            skill: 'vocabulary',
            prompt: 'Which word best replaces "very bad" in an academic essay about poverty?',
            options: ['Detrimental', 'Severe / Dire', 'Annoying', 'Unpleasant'],
            correctIndex: 1,
            explanation: '"Dire" and "severe" are formal C1-level adjectives representing critical extremity.'
          },
          {
            id: 'u1-l1-q4',
            type: 'fill-in-blank',
            skill: 'grammar',
            prompt: 'Complete the academic transition with the appropriate formal connector',
            sentenceWithBlank: 'Electric vehicles produce zero emissions; ___, their widespread adoption could dramatically lower urban air pollution.',
            correctAnswer: 'consequently',
            acceptableAnswers: ['consequently', 'therefore', 'as a result', 'thus'],
            options: ['consequently', 'however', 'on the other hand', 'meanwhile'],
            explanation: '"Consequently" denotes a direct logical result in academic discourse.'
          }
        ]
      },
      {
        id: 'u1-l2',
        unitId: 1,
        title: 'Mastering Sentence Structures',
        description: 'Complex sentences, adverbial clauses, and conditionals',
        type: 'standard',
        skill: 'grammar',
        xpReward: 25,
        gemsReward: 12,
        questions: [
          {
            id: 'u1-l2-q1',
            type: 'sentence-builder',
            skill: 'grammar',
            prompt: 'Construct a complex sentence using a concession clause (Although)',
            targetSentence: 'Although technological advancements offer convenience, they may diminish human social interaction.',
            words: ['Although', 'technological', 'advancements', 'offer', 'convenience,', 'they', 'may', 'diminish', 'human', 'social', 'interaction.'],
            explanation: 'Complex sentences with subordinating conjunctions ("Although") boost your Grammatical Range score.'
          },
          {
            id: 'u1-l2-q2',
            type: 'multiple-choice',
            skill: 'grammar',
            prompt: 'Identify the grammatically flawed sentence that would lower the Band score:',
            options: [
              'Despite of the inclement weather, tourists visited the heritage site.',
              'In spite of the adverse conditions, the expedition succeeded.',
              'Although temperatures plummeted, construction continued unabated.',
              'Notwithstanding financial constraints, the project was finalized.'
            ],
            correctIndex: 0,
            explanation: '"Despite" never takes "of" (it is "Despite the weather" or "In spite of the weather").'
          },
          {
            id: 'u1-l2-q3',
            type: 'speaking-pronunciation',
            skill: 'speaking',
            prompt: 'Read this Band 8 compound-complex sentence with natural intonation & stress',
            targetPhrase: 'Not only does public transit reduce traffic congestion, but it also mitigates carbon emissions.',
            sampleAnswer: 'Not only does public transit reduce traffic congestion, but it also mitigates carbon emissions.',
            keyWordsToDetect: ['not only', 'public transit', 'congestion', 'mitigates', 'emissions'],
            part: 'Part 3',
            explanation: 'Focus on clear stress on "Not only", "congestion", and "mitigates".'
          }
        ]
      },
      {
        id: 'u1-l3',
        unitId: 1,
        title: 'Unit 1 Milestone Chest 🎁',
        description: 'Claim your bonus gems and Band 7 badge booster',
        type: 'chest',
        skill: 'overall',
        xpReward: 35,
        gemsReward: 30,
        questions: [
          {
            id: 'u1-l3-q1',
            type: 'multiple-choice',
            skill: 'overall',
            prompt: 'Which of the following is true about IELTS Band 8.0 descriptor for Cohesion?',
            options: [
              'Uses cohesion in such a way that it attracts no attention and manages paragraphing skillfully.',
              'Uses a cohesive device in every single sentence.',
              'Avoids using any transitional phrases.',
              'Repeats the same linking words to show consistency.'
            ],
            correctIndex: 0,
            explanation: 'Band 8 Cohesion is natural and unobtrusive; excessive mechanical linkers cap your score at Band 6.'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Unit 2: IELTS Listening Tactics',
    subtitle: 'Section 1 to 4: Form filling, map labeling, distractors & accents',
    color: 'blue',
    guidebook: {
      overview: 'Listening test has 4 sections with 40 questions. The recording is played only ONCE. Accents include British, Australian, Canadian, and American.',
      keyTips: [
        'Watch out for self-correction distractors (e.g., "We\'ll meet on Tuesday—oh wait, the room is booked, let\'s make it Wednesday").',
        'Strictly follow the word limit (e.g. "NO MORE THAN TWO WORDS AND/OR A NUMBER").',
        'Always use the 30-45 second preparation time to underline keywords and predict word types (noun, date, price, adjective).'
      ],
      vocabulary: [
        { word: 'Itinerary', pos: 'n.', def: 'A planned route or journey.', example: 'The travel agent outlined an extensive 7-day sightseeing itinerary.' },
        { word: 'Refurbishment', pos: 'n.', def: 'The renovation of a building or room.', example: 'The campus library will be closed next month for complete refurbishment.' },
        { word: 'Subsidize', pos: 'v.', def: 'Support financially, especially by a government or organization.', example: 'Public transport fares are heavily subsidized for university students.' }
      ],
      grammarPatterns: [
        { title: 'Passive Voice in Technical Descriptions', pattern: 'Object + is/are + past participle', example: 'Water samples are collected fortnightly and analyzed for microplastics.' }
      ]
    },
    lessons: [
      {
        id: 'u2-l1',
        unitId: 2,
        title: 'Listening Section 1: Avoiding Distractors',
        description: 'Detecting speaker self-corrections in booking and phone calls',
        type: 'listening',
        skill: 'listening',
        xpReward: 25,
        gemsReward: 15,
        questions: [
          {
            id: 'u2-l1-q1',
            type: 'listening-comprehension',
            skill: 'listening',
            prompt: 'Listen to the customer service conversation and select the confirmed departure date:',
            audioScript: 'Customer: I would like to reserve a ticket for Monday the 14th of May. Agent: Let me check our availability... ah, I am afraid all flights on Monday the 14th are fully booked. We do have a seat on Tuesday the 15th, or Wednesday the 16th. Customer: Well, Wednesday is too late, so let us book Tuesday the 15th.',
            accent: 'en-GB',
            options: ['Monday 14th May', 'Tuesday 15th May', 'Wednesday 16th May', 'Thursday 17th May'],
            correctIndex: 1,
            explanation: 'The speaker originally asked for Monday 14th, but because it was fully booked, they settled on Tuesday 15th.'
          },
          {
            id: 'u2-l1-q2',
            type: 'listening-comprehension',
            skill: 'listening',
            prompt: 'Listen to the address detail and select the correct spelling of the street name:',
            audioScript: 'Agent: Could you verify your address, please? Customer: Yes, it is 42 Brackenhill Avenue. That is spelled B-R-A-C-K-E-N-H-I-L-L Avenue, Oxford.',
            accent: 'en-GB',
            options: ['42 Brakenhil Avenue', '42 Brackenhill Avenue', '42 Brockenhill Avenue', '42 Breckenhill Avenue'],
            correctIndex: 1,
            explanation: 'Spelling names correctly is essential in IELTS Section 1. Note the double L and silent c-k.'
          },
          {
            id: 'u2-l1-q3',
            type: 'multiple-choice',
            skill: 'listening',
            prompt: 'If the question prompt instructs: "NO MORE THAN ONE WORD AND/OR A NUMBER", which answer will be penalized?',
            options: ['15th May', '£450', 'Blue sports car', 'Library'],
            correctIndex: 2,
            explanation: '"Blue sports car" contains 3 words, which violates the "NO MORE THAN ONE WORD" rule.'
          }
        ]
      },
      {
        id: 'u2-l2',
        unitId: 2,
        title: 'Listening Section 2: Maps & Directional Language',
        description: 'Compass bearings, clockwise, adjacent, and landmarks',
        type: 'standard',
        skill: 'listening',
        xpReward: 25,
        gemsReward: 15,
        questions: [
          {
            id: 'u2-l2-q1',
            type: 'pair-matching',
            skill: 'listening',
            prompt: 'Match directional idioms with their exact map meaning',
            explanation: 'Map questions test spatial relationships and prepositional precision.',
            pairs: [
              { left: 'Adjacent to', right: 'Directly next to / Beside' },
              { left: 'Due North', right: 'Straight towards the top' },
              { left: 'Opposite', right: 'Across the corridor / street' },
              { left: 'Bend in the path', right: 'Sharp curve / corner' }
            ]
          },
          {
            id: 'u2-l2-q2',
            type: 'listening-comprehension',
            skill: 'listening',
            prompt: 'Where is the newly relocated student counseling center?',
            audioScript: 'Speaker: As you enter through the main foyer, the reception desk is directly in front of you. Previously, counseling was located on the second floor; however, following our recent remodeling, you should take the corridor to the right, proceed past the seminar room, and counseling is the final room on your left-hand side, just before the courtyard.',
            accent: 'en-GB',
            options: [
              'On the second floor near the stairs',
              'End of the right corridor on the left, before the courtyard',
              'Directly opposite the main reception desk',
              'Inside the seminar room on the left'
            ],
            correctIndex: 1,
            explanation: 'The speaker clarifies that the 2nd floor was the old location, and directs right down the corridor to the final room on the left.'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Unit 3: IELTS Reading Masterclass',
    subtitle: 'True/False/Not Given, Heading Matching, and Skim-Scanning',
    color: 'purple',
    guidebook: {
      overview: '3 academic passages, 40 questions, 60 minutes. The #1 trap for candidates is confusing "FALSE" with "NOT GIVEN".',
      keyTips: [
        'TRUE = The passage confirms the statement. FALSE = The passage directly CONTRADICTS the statement. NOT GIVEN = The passage does not give sufficient information to prove or disprove.',
        'Beware of absolute qualifiers (always, exclusively, all, none) versus conditional qualifiers (often, can, sometimes).',
        'Read question stems first to identify anchor keywords (capitalized names, dates, scientific terms) before scanning the passage.'
      ],
      vocabulary: [
        { word: 'Paradigm', pos: 'n.', def: 'A typical example or pattern of something; a model.', example: 'The discovery triggered a paradigm shift in climate science.' },
        { word: 'Plausible', pos: 'adj.', def: 'Seeming reasonable or probable.', example: 'The researchers provided a plausible explanation for the anomalies.' },
        { word: 'Ubiquitous', pos: 'adj.', def: 'Present, appearing, or found everywhere.', example: 'Smartphones have become ubiquitous in modern society.' }
      ],
      grammarPatterns: [
        { title: 'Nominalization in Academic Texts', pattern: 'Verb -> Abstract Noun', example: 'Instead of "The climate deteriorated rapidly", academic texts use "The rapid deterioration of the climate".' }
      ]
    },
    lessons: [
      {
        id: 'u3-l1',
        unitId: 3,
        title: 'True, False, or Not Given Drills',
        description: 'Dissect nuances and avoid the common traps in reading passages',
        type: 'reading',
        skill: 'reading',
        xpReward: 30,
        gemsReward: 15,
        questions: [
          {
            id: 'u3-l1-q1',
            type: 'true-false-not-given',
            skill: 'reading',
            prompt: 'Read the excerpt and determine if the statement is TRUE, FALSE, or NOT GIVEN',
            passage: 'While the ancient Roman aqueduct at Segovia was predominantly constructed using unmortared granite blocks, archaeological evidence indicates that minor brick repairs were conducted during the 15th century under King Ferdinand.',
            statement: 'The Segovia aqueduct was built entirely out of granite without any other materials ever being added.',
            correctAnswer: 'FALSE',
            explanation: 'FALSE because the text states that brick repairs were conducted in the 15th century, directly contradicting "entirely out of granite without any other materials ever being added".'
          },
          {
            id: 'u3-l1-q2',
            type: 'true-false-not-given',
            skill: 'reading',
            prompt: 'Read the excerpt and analyze whether the statement is TRUE, FALSE, or NOT GIVEN',
            passage: 'Dr. Evelyn Carter pioneered the use of satellite radar to detect subsurface water tables beneath the Sahara Desert. Her initial expedition took 18 months to receive regulatory clearance from regional authorities.',
            statement: 'Dr. Carter felt frustrated by the lengthy administrative delays before her expedition.',
            correctAnswer: 'NOT GIVEN',
            explanation: 'NOT GIVEN. We know the delay took 18 months, but the passage never mentions Dr. Carter\'s personal emotional response or frustration.'
          },
          {
            id: 'u3-l1-q3',
            type: 'sentence-builder',
            skill: 'reading',
            prompt: 'Arrange the tiles to formulate the golden rule for NOT GIVEN questions',
            targetSentence: 'If the text neither confirms nor contradicts the statement it is Not Given.',
            words: ['If', 'the', 'text', 'neither', 'confirms', 'nor', 'contradicts', 'the', 'statement', 'it', 'is', 'Not', 'Given.'],
            explanation: 'Never make assumptions based on your personal knowledge; base answers strictly on the provided text.'
          }
        ]
      },
      {
        id: 'u3-l2',
        unitId: 3,
        title: 'Headings Matching Strategy',
        description: 'Identify the main theme of paragraphs vs supporting details',
        type: 'standard',
        skill: 'reading',
        xpReward: 30,
        gemsReward: 15,
        questions: [
          {
            id: 'u3-l2-q1',
            type: 'multiple-choice',
            skill: 'reading',
            prompt: 'Which heading best captures a paragraph describing how cities in 2050 will use rooftop gardens, solar glass, and rainwater harvesting?',
            options: [
              'Architectural Innovations for Sustainable Urban Living',
              'The High Financial Cost of Solar Technology',
              'Historical Evolution of Ancient Irrigation Systems',
              'Why Rural Populations are Migrating to Megacities'
            ],
            correctIndex: 0,
            explanation: 'The paragraph synthesizes sustainable urban building techniques (solar glass, rooftop flora, water harvesting).'
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Unit 4: IELTS Writing Task 1 & 2',
    subtitle: 'Data trends, overview statements, essay architecture & band 8.0 linkers',
    color: 'orange',
    guidebook: {
      overview: 'Task 1 (150 words, 20 mins, 33% weight) requires objective factual reporting without personal opinions. Task 2 (250 words, 40 mins, 67% weight) requires a well-structured essay.',
      keyTips: [
        'In Task 1, ALWAYS write a clear Overview paragraph highlighting key trends, highs, and lows without numerical figures.',
        'In Task 2, answer ALL parts of the prompt equally. Give reasons and concrete academic examples.',
        'Use varied cohesive devices: "In addition to...", "A striking distinction is...", "This phenomenon can be attributed to..."'
      ],
      vocabulary: [
        { word: 'Fluctuate', pos: 'v.', def: 'Rise and fall irregularly in number or amount.', example: 'Oil prices fluctuated wildly between January and August.' },
        { word: 'Plateau', pos: 'v./n.', def: 'Reach a state of little or no change after a period of activity.', example: 'Consumer demand plateaued at roughly 50,000 units.' },
        { word: 'Unprecedented', pos: 'adj.', def: 'Never done or known before.', example: 'The city experienced an unprecedented surge in tourism.' }
      ],
      grammarPatterns: [
        { title: 'Describing Trends with Participle Clauses', pattern: 'Main clause, followed by / reaching / peaking at...', example: 'The proportion of graduates rose sharply, reaching a peak of 78% in 2022.' }
      ]
    },
    lessons: [
      {
        id: 'u4-l1',
        unitId: 4,
        title: 'Task 1: Writing Band 8+ Overviews',
        description: 'The single most decisive paragraph for Task 1 achievement',
        type: 'writing',
        skill: 'writing',
        xpReward: 30,
        gemsReward: 20,
        questions: [
          {
            id: 'u4-l1-q1',
            type: 'sentence-builder',
            skill: 'writing',
            prompt: 'Construct an exemplary Band 8.5 Task 1 Overview sentence for a line chart',
            targetSentence: 'Overall, renewable energy consumption witnessed a substantial upward trajectory throughout the period.',
            words: ['Overall,', 'renewable', 'energy', 'consumption', 'witnessed', 'a', 'substantial', 'upward', 'trajectory', 'throughout', 'the', 'period.'],
            explanation: '"witnessed a substantial upward trajectory" demonstrates lexical mastery compared to "went up a lot".'
          },
          {
            id: 'u4-l1-q2',
            type: 'pair-matching',
            skill: 'writing',
            prompt: 'Match data movement descriptions with exact percentage changes',
            explanation: 'Band 7+ requires precise adverbs and verbs for trend descriptions.',
            pairs: [
              { left: 'Doubled', right: 'Increased by 100% (2x)' },
              { left: 'Plummeted / Slumped', right: 'Dramatically collapsed' },
              { left: 'Marginal rise', right: 'Slight upward movement (~2%)' },
              { left: 'Remained steady', right: 'Hovered around same value' }
            ]
          },
          {
            id: 'u4-l1-q3',
            type: 'multiple-choice',
            skill: 'writing',
            prompt: 'What should NEVER be included in an IELTS Writing Task 1 response?',
            options: [
              'Personal opinions or speculative reasons why data changed (e.g. "people probably bought cars because they were rich")',
              'An overview paragraph summarizing general trends',
              'Comparisons between key data categories',
              'Appropriate time prepositions (e.g., between 2010 and 2020)'
            ],
            correctIndex: 0,
            explanation: 'Task 1 is purely descriptive reporting. Explaining speculative causes will penalize Task Achievement.'
          }
        ]
      },
      {
        id: 'u4-l2',
        unitId: 4,
        title: 'Task 2: Academic Essay Structure & Argumentation',
        description: 'Opinion, Discuss Both Views, and Cause-Solution essays',
        type: 'writing',
        skill: 'writing',
        xpReward: 35,
        gemsReward: 20,
        questions: [
          {
            id: 'u4-l2-q1',
            type: 'sentence-builder',
            skill: 'writing',
            prompt: 'Build a thesis statement stating a clear, balanced stance for Task 2',
            targetSentence: 'While there are valid arguments on both sides, I firmly believe that governments should subsidize healthcare.',
            words: ['While', 'there', 'are', 'valid', 'arguments', 'on', 'both', 'sides,', 'I', 'firmly', 'believe', 'that', 'governments', 'should', 'subsidize', 'healthcare.'],
            explanation: 'A thesis statement must state your position clearly in the introduction to satisfy Band 7+ Task Response.'
          },
          {
            id: 'u4-l2-q2',
            type: 'fill-in-blank',
            skill: 'writing',
            prompt: 'Complete this academic topic sentence with the correct formal connector',
            sentenceWithBlank: '___ to the environmental benefits, urban cycling significantly enhances cardiovascular health.',
            correctAnswer: 'In addition',
            acceptableAnswers: ['In addition', 'In addition to', 'In contrast', 'Prior'],
            options: ['In addition', 'Furthermore', 'Moreover', 'Besides'],
            explanation: '"In addition to [noun phrase]" introduces an additional supporting factor smoothly.'
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Unit 5: IELTS Speaking Fluency',
    subtitle: 'Part 1, 2 (Cue Card), and 3 (Abstract Ideas) with voice feedback',
    color: 'red',
    guidebook: {
      overview: 'Speaking is an 11-14 minute face-to-face or video call interview with an examiner across 3 distinct parts.',
      keyTips: [
        'In Part 1, aim for 2-3 complete sentences per answer (Answer + Reason/Example). Do not give one-word answers!',
        'In Part 2 (Cue Card), use your 1 minute prep time to write a bulleted story timeline (Who, Where, What happened, Why it mattered). Keep talking until the examiner stops you.',
        'In Part 3, speak in abstract, societal terms ("In modern society, people tend to...") rather than only about yourself.'
      ],
      vocabulary: [
        { word: 'Eloquent', pos: 'adj.', def: 'Fluent or persuasive in speaking or writing.', example: 'The candidate gave an eloquent speech on climate responsibility.' },
        { word: 'Spontaneous', pos: 'adj.', def: 'Performed or occurring as a result of a sudden inner impulse.', example: 'Examiners reward natural, spontaneous conversation over rehearsed scripts.' },
        { word: 'Reverberate', pos: 'v.', def: 'Have continuing and serious effects.', example: 'His decisions will reverberate across the entire community for decades.' }
      ],
      grammarPatterns: [
        { title: 'Hypothetical / Unreal Conditionals in Speaking Part 3', pattern: 'If + past perfect, would have + past participle', example: 'If governments had invested in green transit earlier, cities would have avoided severe smog.' }
      ]
    },
    lessons: [
      {
        id: 'u5-l1',
        unitId: 5,
        title: 'Speaking Part 1: Fluency & Expansion',
        description: 'Avoid one-word answers using the A-R-E framework (Answer, Reason, Example)',
        type: 'speaking',
        skill: 'speaking',
        xpReward: 30,
        gemsReward: 20,
        questions: [
          {
            id: 'u5-l1-q1',
            type: 'speaking-pronunciation',
            skill: 'speaking',
            prompt: 'Examiner: "Do you enjoy reading books in your spare time?" Practice answering using the microphone:',
            targetPhrase: 'To be honest, I am an avid reader, especially when it comes to historical fiction because it allows me to unwind after a demanding workday.',
            sampleAnswer: 'To be honest, I am an avid reader, especially when it comes to historical fiction because it allows me to unwind after a demanding workday.',
            keyWordsToDetect: ['honest', 'avid reader', 'historical fiction', 'unwind', 'demanding'],
            part: 'Part 1',
            explanation: '"avid reader" and "unwind after a demanding workday" demonstrate natural C1 idiomatic fluency.'
          },
          {
            id: 'u5-l1-q2',
            type: 'multiple-choice',
            skill: 'speaking',
            prompt: 'Which phrase is the most natural filler to buy thinking time during Speaking Part 3?',
            options: [
              'That is a multifaceted question; looking at it from an economic perspective...',
              'Wait, I forgot the English word, let me check my memory...',
              'Uhhh... uhhh... yes, yes, yes...',
              'Repeat the question again and again.'
            ],
            correctIndex: 0,
            explanation: 'Natural conversational fillers like "That is a multifaceted issue..." allow you to organize ideas without losing fluency points.'
          }
        ]
      },
      {
        id: 'u5-l2',
        unitId: 5,
        title: 'Speaking Part 2: 2-Minute Cue Card Strategy',
        description: 'Storytelling frameworks and sensory vocabulary',
        type: 'speaking',
        skill: 'speaking',
        xpReward: 35,
        gemsReward: 25,
        questions: [
          {
            id: 'u5-l2-q1',
            type: 'speaking-pronunciation',
            skill: 'speaking',
            prompt: 'Describe a memorable journey you took. Speak the opening 2 sentences clearly into your mic:',
            targetPhrase: 'One of the most unforgettable journeys I have ever embarked upon was a hiking expedition across the Scottish Highlands.',
            sampleAnswer: 'One of the most unforgettable journeys I have ever embarked upon was a hiking expedition across the Scottish Highlands.',
            keyWordsToDetect: ['unforgettable', 'journeys', 'embarked upon', 'hiking expedition', 'Highlands'],
            part: 'Part 2',
            explanation: '"embarked upon" and "hiking expedition" set an impressive tone right at the start of Part 2.'
          }
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Unit 6: Band 8.5+ Vocabulary & Inversion Grammar',
    subtitle: 'Elite idioms, advanced discourse markers & C2 grammatical precision',
    color: 'gold',
    guidebook: {
      overview: 'The Band 8-9 threshold requires rare, precise vocabulary, natural idiomatic expressions, and mastery of rare grammatical structures like negative inversions and subjunctive mood.',
      keyTips: [
        'Use idioms naturally in Speaking, but strictly avoid informal idioms in Academic Writing Task 1 or 2.',
        'Master negative inversions: "Seldom have we witnessed...", "Under no circumstances should..."',
        'Showcase collocations with high lexical density.'
      ],
      vocabulary: [
        { word: 'Ubiquitous', pos: 'adj.', def: 'Present everywhere.', example: 'Digital interfaces have become ubiquitous in secondary classrooms.' },
        { word: 'Epitome', pos: 'n.', def: 'A person or thing that is a perfect example of a particular quality or type.', example: 'Her essay was the epitome of scholarly precision.' },
        { word: 'Imperative', pos: 'adj.', def: 'Of vital importance; crucial.', example: 'It is imperative that environmental regulations are strictly enforced.' }
      ],
      grammarPatterns: [
        { title: 'Negative Inversion', pattern: 'Hardly / Scarcely + had + subject + past participle + when...', example: 'Hardly had the policy been introduced when emissions dropped.' }
      ]
    },
    lessons: [
      {
        id: 'u6-l1',
        unitId: 6,
        title: 'Negative Inversions & Advanced Syntax',
        description: 'Elite sentence structures that guarantee Band 8.5+ Grammatical Range',
        type: 'standard',
        skill: 'grammar',
        xpReward: 40,
        gemsReward: 30,
        questions: [
          {
            id: 'u6-l1-q1',
            type: 'sentence-builder',
            skill: 'grammar',
            prompt: 'Construct a Band 9 negative inversion sentence for an essay conclusion',
            targetSentence: 'Seldom has there been a more pressing urgency to safeguard our global ecosystem.',
            words: ['Seldom', 'has', 'there', 'been', 'a', 'more', 'pressing', 'urgency', 'to', 'safeguard', 'our', 'global', 'ecosystem.'],
            explanation: 'Starting with "Seldom has there been..." demonstrates mastery of inverted sentence structures.'
          },
          {
            id: 'u6-l1-q2',
            type: 'pair-matching',
            skill: 'vocabulary',
            prompt: 'Match advanced C2 academic collocations',
            explanation: 'Collocation mastery is explicitly required for Band 8+ in Lexical Resource.',
            pairs: [
              { left: 'Spearhead', right: 'A revolutionary initiative' },
              { left: 'Exert', right: 'Substantial influence' },
              { left: 'Foster', right: 'Collaborative spirit' },
              { left: 'Inextricably', right: 'Linked together' }
            ]
          }
        ]
      },
      {
        id: 'u6-l2',
        unitId: 6,
        title: 'Mastery Trophy & Grand Certificate 🏆',
        description: 'Comprehensive Band 9 Challenge across all 4 IELTS modules',
        type: 'trophy',
        skill: 'overall',
        xpReward: 50,
        gemsReward: 50,
        questions: [
          {
            id: 'u6-l2-q1',
            type: 'multiple-choice',
            skill: 'overall',
            prompt: 'Which combination of factors guarantees an IELTS Band 8.5+ overall score?',
            options: [
              'Flawless task response, natural seamless cohesion, sophisticated lexical dexterity, and flexible error-free grammar',
              'Using 50 words per minute and memorizing whole essays from model books',
              'Speaking with a fake Queen’s English accent and quoting poetry',
              'Writing 600 words for Task 1 and 800 words for Task 2'
            ],
            correctIndex: 0,
            explanation: 'IELTS Band 8.5+ rewards precise communication, rich natural vocabulary, flawless structure, and grammatical dexterity.'
          }
        ]
      }
    ]
  }
];
