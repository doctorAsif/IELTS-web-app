export interface IELTSDocument {
  id: string;
  category: 'grammar' | 'strategy' | 'vocabulary' | 'criteria';
  title: string;
  content: string;
  tokens?: string[];
}

export class LocalRAGEngine {
  // A simple in-memory document store. In production, this would be populated from the JSON datasets.
  private static documents: IELTSDocument[] = [
    {
      id: 'task2_coherence',
      category: 'criteria',
      title: 'Coherence and Cohesion (Task 2)',
      content: 'Coherence refers to the linking of ideas through logical sequencing. Cohesion refers to the varied and appropriate use of cohesive devices (e.g., logical connectors, pronouns, conjunctions). To score a Band 7, a student must logically organize information and there must be a clear progression throughout the response.'
    },
    {
      id: 'reading_tfng',
      category: 'strategy',
      title: 'True/False/Not Given Strategy',
      content: 'True means the statement agrees with the information. False means the statement contradicts the information. Not Given means there is no information on this. Always read the statement carefully and find the exact keywords in the text. Do not use outside knowledge.'
    }
  ];

  /**
   * Extremely lightweight lexical (BM25-style) or keyword search.
   * Runs locally without needing a vector database.
   */
  static search(query: string, limit: number = 2): IELTSDocument[] {
    const queryTokens = this.tokenize(query);
    
    const scoredDocs = this.documents.map(doc => {
      const docTokens = doc.tokens || this.tokenize(doc.content);
      // Basic keyword intersection scoring
      const score = queryTokens.reduce((acc, token) => {
        return acc + (docTokens.includes(token) ? 1 : 0);
      }, 0);
      
      return { doc, score };
    });

    return scoredDocs
      .filter(d => d.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(d => d.doc);
  }

  private static tokenize(text: string): string[] {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'to', 'in', 'on', 'with', 'for', 'of']);
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  }
}
