export interface WeaknessProfile {
  grammar: Record<string, number>;
  vocabulary: Record<string, number>;
  reading: Record<string, number>;
  listening: Record<string, number>;
  writing: Record<string, number>;
  speaking: Record<string, number>;
}

export interface StudentProfile {
  id: string;
  history: {
    completedLessons: string[];
    scores: { date: string, skill: string, score: number }[];
  };
  weaknesses: WeaknessProfile;
}

export class StudentMemoryEngine {
  private static readonly STORAGE_KEY = 'ielts_student_memory';
  
  static loadProfile(): StudentProfile {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.warn("Failed to parse student memory", e);
      }
    }
    return this.createEmptyProfile();
  }

  static saveProfile(profile: StudentProfile) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
  }

  static recordMistake(skill: keyof WeaknessProfile, subCategory: string, severity: number = 0.1) {
    const profile = this.loadProfile();
    if (!profile.weaknesses[skill]) profile.weaknesses[skill] = {};
    
    const current = profile.weaknesses[skill][subCategory] || 0;
    // Cap at 1.0 (100% weakness score)
    profile.weaknesses[skill][subCategory] = Math.min(1.0, current + severity);
    
    this.saveProfile(profile);
  }

  static getTopWeaknesses(limit: number = 5): { skill: string, category: string, score: number }[] {
    const profile = this.loadProfile();
    let allWeaknesses: { skill: string, category: string, score: number }[] = [];
    
    for (const [skill, categories] of Object.entries(profile.weaknesses)) {
      for (const [category, score] of Object.entries(categories as Record<string, number>)) {
        allWeaknesses.push({ skill, category, score });
      }
    }
    
    return allWeaknesses.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  private static createEmptyProfile(): StudentProfile {
    return {
      id: 'local_student',
      history: { completedLessons: [], scores: [] },
      weaknesses: {
        grammar: {}, vocabulary: {}, reading: {}, listening: {}, writing: {}, speaking: {}
      }
    };
  }
}
