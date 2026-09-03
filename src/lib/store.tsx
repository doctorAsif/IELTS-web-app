import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from './firebase';
import { useAuth } from './AuthContext';
import { UserStats, Quest, LeagueTier } from './types';
import { INITIAL_QUESTS } from '../data/questsData';
import { sound } from './audio';

interface AppContextType {
  stats: UserStats;
  quests: Quest[];
  currentLeague: LeagueTier;
  activeUnitGuidebook: number | null;
  setActiveUnitGuidebook: (unitId: number | null) => void;
  gainXp: (amount: number) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  spendGems: (amount: number) => boolean;
  addGems: (amount: number) => void;
  completeLesson: (lessonId: string, unitId: number, xpReward: number, gemsReward: number, errorsCount: number) => void;
  claimQuest: (questId: string) => void;
  buyShopItem: (itemId: string, gemCost: number) => boolean;
  toggleSound: () => void;
  updateTargetBand: (band: number) => void;
  consumeTrialCredit: (activityType: string) => Promise<boolean>;
  resetProgress: () => void;
}

const DEFAULT_STATS: UserStats = {
  xp: 140,
  gems: 450,
  hearts: 5,
  maxHearts: 5,
  streak: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: ['u1-l1'],
  unlockedUnitId: 999,
  streakFreezeActive: false,
  doubleXpActive: false,
  soundEnabled: true,
  targetBand: 7.5,
  estimatedBand: {
    overall: 7.0,
    listening: 7.5,
    reading: 7.0,
    writing: 6.5,
    speaking: 7.0,
  },
  drillsCompleted: 12,
  dailyGoalXp: 50,
  todayEarnedXp: 20,
  trialCreditsTotal: 20,
  trialCreditsUsed: 0,
  trialCreditsRemaining: 20,
  freeTrialDate: new Date().toISOString().split('T')[0],
  aiMonthlyCredits: 100,
  aiUsedCredits: 0,
  aiRemainingCredits: 100,
  aiOverageAllowed: false,
  aiOverageLimit: 0,
};

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY_STATS = 'ielts_duo_user_stats_v1';
const STORAGE_KEY_QUESTS = 'ielts_duo_quests_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [hasFetched, setHasFetched] = useState(false);

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STATS;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUESTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_QUESTS;
  });

  const [activeUnitGuidebook, setActiveUnitGuidebook] = useState<number | null>(null);

  // Sync sound settings to sound engine
  useEffect(() => {
    sound.setSoundEnabled(stats.soundEnabled);
  }, [stats.soundEnabled]);

  // Automatic 30-minute heart regeneration (up to max 5 hearts)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        if (prev.hearts < prev.maxHearts) {
          return { ...prev, hearts: Math.min(prev.maxHearts, prev.hearts + 1) };
        }
        return prev;
      });
    }, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, []);

  // Fetch from Firestore on load
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.stats) setStats(data.stats);
          if (data.quests) setQuests(data.quests);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setHasFetched(true);
      }
    };
    fetchUserData();
  }, [user]);

  // Persist stats to LocalStorage and Firestore
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
      if (user && hasFetched) {
        setDoc(doc(db, 'users', user.uid), { stats }, { merge: true });
      }
    } catch (e) {
      console.error(e);
    }
  }, [stats, user, hasFetched]);

  // Persist quests to LocalStorage and Firestore
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUESTS, JSON.stringify(quests));
      if (user && hasFetched) {
        setDoc(doc(db, 'users', user.uid), { quests }, { merge: true });
      }
    } catch (e) {
      console.error(e);
    }
  }, [quests, user, hasFetched]);

  // Determine user's current league tier based on XP
  const currentLeague: LeagueTier =
    stats.xp >= 3000
      ? 'Diamond'
      : stats.xp >= 2000
      ? 'Ruby'
      : stats.xp >= 1300
      ? 'Sapphire'
      : stats.xp >= 750
      ? 'Gold'
      : stats.xp >= 350
      ? 'Silver'
      : 'Bronze';

  const gainXp = (amount: number) => {
    const finalAmount = stats.doubleXpActive ? amount * 2 : amount;
    setStats(prev => {
      const newTodayXp = prev.todayEarnedXp + finalAmount;
      const newTotalXp = prev.xp + finalAmount;
      return {
        ...prev,
        xp: newTotalXp,
        todayEarnedXp: newTodayXp,
      };
    });

    // Update quest progress for Daily IELTS Scholar
    setQuests(prev =>
      prev.map(q => {
        if (q.id === 'q1') {
          const newCurr = Math.min(q.target, q.current + finalAmount);
          return { ...q, current: newCurr, completed: newCurr >= q.target };
        }
        return q;
      })
    );
  };

  const loseHeart = () => {
    setStats(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
    }));
  };

  const refillHearts = () => {
    setStats(prev => ({
      ...prev,
      hearts: prev.maxHearts,
    }));
  };

  const spendGems = (amount: number): boolean => {
    if (stats.gems < amount) return false;
    setStats(prev => ({
      ...prev,
      gems: prev.gems - amount,
    }));
    return true;
  };

  const addGems = (amount: number) => {
    setStats(prev => ({
      ...prev,
      gems: prev.gems + amount,
    }));
  };

  const completeLesson = (
    lessonId: string,
    unitId: number,
    xpReward: number,
    gemsReward: number,
    errorsCount: number
  ) => {
    const isNewLesson = !stats.completedLessonIds.includes(lessonId);
    const finalXp = stats.doubleXpActive ? xpReward * 2 : xpReward;

    setStats(prev => {
      const completed = isNewLesson ? [...prev.completedLessonIds, lessonId] : prev.completedLessonIds;
      const nextUnit = unitId >= prev.unlockedUnitId ? unitId + 1 : prev.unlockedUnitId;

      // Dynamically improve estimated band score
      const bandBoost = errorsCount === 0 ? 0.1 : 0.05;
      const newOverall = Math.min(9.0, +(prev.estimatedBand.overall + bandBoost).toFixed(1));

      return {
        ...prev,
        xp: prev.xp + finalXp,
        gems: prev.gems + gemsReward,
        todayEarnedXp: prev.todayEarnedXp + finalXp,
        completedLessonIds: completed,
        unlockedUnitId: Math.max(prev.unlockedUnitId, nextUnit),
        drillsCompleted: prev.drillsCompleted + 1,
        estimatedBand: {
          ...prev.estimatedBand,
          overall: newOverall,
        },
      };
    });

    // Update quest progress
    setQuests(prev =>
      prev.map(q => {
        if (q.id === 'q1') {
          const newCurr = Math.min(q.target, q.current + finalXp);
          return { ...q, current: newCurr, completed: newCurr >= q.target };
        }
        if (q.id === 'q4' && errorsCount === 0) {
          return { ...q, current: 1, completed: true };
        }
        return q;
      })
    );
  };

  const claimQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || !quest.completed) return;

    sound.playChest();
    gainXp(quest.xpReward);
    addGems(quest.gemsReward);

    setQuests(prev => prev.filter(q => q.id !== questId));
  };

  const buyShopItem = (itemId: string, gemCost: number): boolean => {
    if (stats.gems < gemCost) return false;

    if (itemId === 'heart_refill') {
      spendGems(gemCost);
      refillHearts();
      sound.playChest();
      return true;
    }

    if (itemId === 'streak_freeze') {
      spendGems(gemCost);
      setStats(prev => ({ ...prev, streakFreezeActive: true }));
      sound.playChest();
      return true;
    }

    if (itemId === 'double_xp') {
      spendGems(gemCost);
      setStats(prev => ({ ...prev, doubleXpActive: true }));
      sound.playChest();
      return true;
    }

    if (itemId === 'band_booster') {
      spendGems(gemCost);
      setStats(prev => ({
        ...prev,
        estimatedBand: {
          ...prev.estimatedBand,
          overall: Math.min(9.0, +(prev.estimatedBand.overall + 0.5).toFixed(1)),
        }
      }));
      sound.playChest();
      return true;
    }

    if (itemId === 'super_ielts') {
      spendGems(gemCost);
      setStats(prev => ({
        ...prev,
        maxHearts: 999,
        hearts: 999,
        doubleXpActive: true,
      }));
      sound.playVictory();
      return true;
    }

    return false;
  };

  const toggleSound = () => {
    setStats(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const updateTargetBand = (band: number) => {
    setStats(prev => ({ ...prev, targetBand: band }));
  };

  const consumeTrialCredit = async (activityType: string): Promise<boolean> => {
    if (!user) return false;
    
    // Check locally first
    const cost = activityType === 'mock_exam' || activityType === 'daily_teacher' ? 5 : 20;
    if (stats.trialCreditsRemaining < cost) {
      return false;
    }

    try {
      const debitTrialCredit = httpsCallable(functions, 'debitTrialCredit');
      const result = await debitTrialCredit({ activityType });
      const data = result.data as any;
      
      if (data.success) {
        // Optimistically update local state so the UI reacts instantly
        setStats(prev => ({
          ...prev,
          trialCreditsUsed: data.trialCreditsUsed,
          trialCreditsRemaining: data.trialCreditsRemaining
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error debiting trial credit:", error);
      return false;
    }
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY_STATS);
    localStorage.removeItem(STORAGE_KEY_QUESTS);
    setStats(DEFAULT_STATS);
    setQuests(INITIAL_QUESTS);
  };

  return (
    <AppContext.Provider
      value={{
        stats,
        quests,
        currentLeague,
        activeUnitGuidebook,
        setActiveUnitGuidebook,
        gainXp,
        loseHeart,
        refillHearts,
        spendGems,
        addGems,
        completeLesson,
        claimQuest,
        buyShopItem,
        toggleSound,
        updateTargetBand,
        consumeTrialCredit,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
