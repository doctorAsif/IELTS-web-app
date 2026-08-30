export interface IELTSDocument {
  id: string;
  category: 'grammar' | 'strategy' | 'vocabulary' | 'criteria';
  title: string;
  content: string;
  tokens?: string[];
}

export class LocalRAGEngine {
  private static documents: IELTSDocument[] = [
    {
      id: 'task2_coherence',
      category: 'criteria',
      title: 'Coherence and Cohesion (Task 2)',
      content: 'Coherence is logical idea progression. Cohesion is the varied use of cohesive devices (linkers, pronouns, discourse markers). Band 7 requires clear organization and smooth transitions.'
    },
    {
      id: 'task2_task_response',
      category: 'criteria',
      title: 'Task Response (Task 2)',
      content: 'Band 7 requires addressing all parts of the prompt, a clear position throughout, and well-developed main ideas with relevant examples.'
    },
    {
      id: 'reading_tfng',
      category: 'strategy',
      title: 'True/False/Not Given Strategy',
      content: 'True: statement agrees with passage. False: statement contradicts passage. Not Given: impossible to say. Rely solely on passage text; do not extrapolate.'
    },
    {
      id: 'speaking_fluency',
      category: 'criteria',
      title: 'Speaking Fluency and Coherence',
      content: 'Focus on natural speech flow, minimal hesitation for grammar/vocab search, and cohesive connectives (e.g. however, on the other hand, consequently).'
    },
    {
      id: 'listening_spelling',
      category: 'strategy',
      title: 'Listening Spelling & Grammar',
      content: 'Ensure answers comply with word counts (e.g. NO MORE THAN TWO WORDS) and words are correctly spelled (British or American variants accepted).'
    }
  ];

  /**
   * Ranked lexical retrieval with token budgeting & compression.
   * Keeps retrieved context strictly within ~300-500 tokens for the local LLM.
   */
  static retrieveContext(query: string, maxTokensBudget: number = 400): string {
    const queryTokens = this.tokenize(query);

    const scoredDocs = this.documents.map(doc => {
      const docTokens = doc.tokens || this.tokenize(`${doc.title} ${doc.content}`);
      const score = queryTokens.reduce((acc, token) => {
        return acc + (docTokens.includes(token) ? 1 : 0);
      }, 0);

      return { doc, score };
    });

    const relevantDocs = scoredDocs
      .filter(d => d.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(d => d.doc);

    // Compress & budget tokens
    let combinedText = '';
    let estimatedTokens = 0;

    for (const doc of relevantDocs) {
      const docSnippet = `[${doc.title}]: ${doc.content}\n`;
      const snippetTokens = Math.ceil(docSnippet.length / 4);

      if (estimatedTokens + snippetTokens <= maxTokensBudget) {
        combinedText += docSnippet;
        estimatedTokens += snippetTokens;
      } else {
        break;
      }
    }

    return combinedText.trim();
  }

  private static tokenize(text: string): string[] {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'to', 'in', 'on', 'with', 'for', 'of', 'this', 'that']);
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  }
}
