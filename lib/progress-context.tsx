import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { GOVERNORATES } from "@/lib/kuwait-data";

const API_BASE =
  import.meta.env.DEV
    ? import.meta.env.VITE_API_LOCALHOST
    : import.meta.env.VITE_API_URL;

/* ═══════════════════════════════════════════════════════════════
   ➀ TYPE DEFINITIONS
   ═══════════════════════════════════════════════════════════════ */

export type SubmittedWord = {
  id: string;
  word: string;
  meaningAr: string;
  meaningEn: string;
  date: string;
};

export type ProgressState = {
  exploredAreas: string[];
  quizGamesPlayed: number;
  quizBestScore: number;
  quizBestTotal: number;
  quizTotalCorrect: number;
  streak: number;
  bestStreak: number;
  lastQuizDate: string | null;
  votedWords: string[];
  submittedWords: SubmittedWord[];
  completedQuizzes: string[];
  quizScores: Record<string, { score: number; total: number }>;
};

export type LevelInfo = {
  index: number;
  min: number;
  ar: string;
  en: string;
};

export type Badge = {
  id: string;
  ar: string;
  en: string;
  descAr: string;
  descEn: string;
  icon: string;
  unlocked: (s: ProgressState, d: Derived) => boolean;
};

export type Derived = {
  explorePoints: number;
  quizPoints: number;
  contributionPoints: number;
  votePoints: number;
  totalPoints: number;
  level: LevelInfo;
  nextLevel: LevelInfo | null;
  levelProgress: number;
  unlockedBadges: string[];
};

type ProgressContextValue = {
  ready: boolean;
  state: ProgressState;
  derived: Derived;
  isExplored: (id: string) => boolean;
  markExplored: (id: string) => void;
  recordQuiz: (correct: number, total: number, examId?: string) => void;
  recordActivity: () => void;
  hasVoted: (wordId: string) => boolean;
  toggleVote: (wordId: string) => void;
  reconcileApiVotes: (votes: Array<{ wordId: string; voted: boolean }>) => void;
  submitWord: (w: Omit<SubmittedWord, "id" | "date">) => void;
  resetAll: () => void;
  syncFromUser: (userInfo: any) => void;
  hasCompletedQuiz: (examId: string) => boolean;
  getQuizScore: (examId: string) => { score: number; total: number } | null;
};

/* ═══════════════════════════════════════════════════════════════
   ➁ CONSTANTS & CONFIG
   ═══════════════════════════════════════════════════════════════ */

const STORAGE_KEY = "dk-progress-v1";

/**
 * Point values for different user activities
 * Used to calculate total points and determine user level
 */
export const POINTS = {
  perCorrectAnswer: 10,
  perWordSubmission: 15,
  perVote: 2,
};

/**
 * User levels based on total points earned
 * Higher levels unlock as users accumulate more points
 */
export const LEVELS: LevelInfo[] = [
  { index: 0, min: 0, ar: "زائر", en: "Visitor" },
  { index: 1, min: 100, ar: "مستكشف", en: "Explorer" },
  { index: 2, min: 300, ar: "رحّالة", en: "Voyager" },
  { index: 3, min: 600, ar: "خبير", en: "Connoisseur" },
  { index: 4, min: 1000, ar: "عاشق الكويت", en: "Kuwait Devotee" },
  { index: 5, min: 1600, ar: "سفير التراث", en: "Heritage Ambassador" },
];

/**
 * Achievement badges users can unlock
 * Each badge has specific unlock conditions
 */
export const BADGES: Badge[] = [
  {
    id: "first-step",
    ar: "الخطوة الأولى",
    en: "First Step",
    descAr: "استكشف أول محافظة",
    descEn: "Explore your first governorate",
    icon: "Footprints",
    unlocked: (s) => s.exploredAreas.length >= 1,
  },
  {
    id: "cartographer",
    ar: "رسّام الخرائط",
    en: "Cartographer",
    descAr: "استكشف كل المحافظات الست",
    descEn: "Explore all six governorates",
    icon: "Map",
    unlocked: (s) => s.exploredAreas.length >= GOVERNORATES.length,
  },
  {
    id: "quiz-rookie",
    ar: "مبتدئ الاختبارات",
    en: "Quiz Rookie",
    descAr: "أكمل أول اختبار",
    descEn: "Complete your first quiz",
    icon: "Brain",
    unlocked: (s) => s.quizGamesPlayed >= 1,
  },
  {
    id: "sharp-mind",
    ar: "العقل الحاد",
    en: "Sharp Mind",
    descAr: "أجب 50 سؤالاً بشكل صحيح",
    descEn: "Answer 50 questions correctly",
    icon: "Sparkles",
    unlocked: (s) => s.quizTotalCorrect >= 50,
  },
  {
    id: "streak-7",
    ar: "أسبوع متواصل",
    en: "Week Warrior",
    descAr: "حافظ على سلسلة 7 أيام",
    descEn: "Reach a 7-day streak",
    icon: "Flame",
    unlocked: (s) => s.bestStreak >= 7,
  },
  {
    id: "wordsmith",
    ar: "حافظ اللهجة",
    en: "Wordsmith",
    descAr: "أضف 3 كلمات للقاموس",
    descEn: "Submit 3 words to the dictionary",
    icon: "BookMarked",
    unlocked: (s) => s.submittedWords.length >= 3,
  },
  {
    id: "tastemaker",
    ar: "صاحب الذوق",
    en: "Tastemaker",
    descAr: "صوّت على 10 كلمات",
    descEn: "Vote on 10 words",
    icon: "ThumbsUp",
    unlocked: (s) => s.votedWords.length >= 10,
  },
  {
    id: "legend",
    ar: "أسطورة الكويت",
    en: "Kuwait Legend",
    descAr: "اجمع 1000 نقطة",
    descEn: "Earn 1000 points",
    icon: "Crown",
    unlocked: (_s, d) => d.totalPoints >= 1000,
  },
];

/**
 * Default/initial state when user first opens the app
 */
const DEFAULT_STATE: ProgressState = {
  exploredAreas: [],
  quizGamesPlayed: 0,
  quizBestScore: 0,
  quizBestTotal: 0,
  quizTotalCorrect: 0,
  streak: 0,
  bestStreak: 0,
  lastQuizDate: null,
  votedWords: [],
  submittedWords: [],
  completedQuizzes: [],
  quizScores: {},
};

/* ═══════════════════════════════════════════════════════════════
   ➂ UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Get today's date as YYYY-MM-DD string
 */
function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Calculate the difference in days between two dates
 * @param dateA - Date string in format YYYY-MM-DD
 * @param dateB - Date string in format YYYY-MM-DD
 * @returns Number of days between the dates
 */
function calculateDaysDifference(dateA: string, dateB: string): number {
  const timeA = new Date(dateA + "T00:00:00").getTime();
  const timeB = new Date(dateB + "T00:00:00").getTime();
  return Math.round((timeB - timeA) / 86400000); // 86400000ms = 1 day
}

/* ═══════════════════════════════════════════════════════════════
   ➃ POINT CALCULATION FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Calculate points earned from explored governorates
 */
function calculateExplorePoints(exploredAreas: string[]): number {
  return GOVERNORATES.filter((g) => exploredAreas.includes(g.id)).reduce(
    (sum, g) => sum + g.points,
    0,
  );
}

/**
 * Calculate points earned from quiz answers
 */
function calculateQuizPoints(totalCorrect: number): number {
  return totalCorrect * POINTS.perCorrectAnswer;
}

/**
 * Calculate points earned from submitted words
 */
function calculateContributionPoints(submittedWordsCount: number): number {
  return submittedWordsCount * POINTS.perWordSubmission;
}

/**
 * Calculate points earned from votes
 */
function calculateVotePoints(votedWordsCount: number): number {
  return votedWordsCount * POINTS.perVote;
}

/* ═══════════════════════════════════════════════════════════════
   ➄ LEVEL & BADGE CALCULATION FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Determine user's current level based on total points
 */
function getCurrentLevel(totalPoints: number): LevelInfo {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (totalPoints >= l.min) {
      level = l;
    }
  }
  return level;
}

/**
 * Calculate progress towards next level as a percentage (0-1)
 */
function calculateLevelProgress(totalPoints: number, currentLevel: LevelInfo): number {
  const nextLevel = LEVELS[currentLevel.index + 1];
  if (!nextLevel) return 1; // Max level reached

  const pointsInCurrentLevel = totalPoints - currentLevel.min;
  const pointsNeededForNextLevel = nextLevel.min - currentLevel.min;
  return Math.min(1, pointsInCurrentLevel / pointsNeededForNextLevel);
}

/**
 * Determine which badges have been unlocked
 */
function getUnlockedBadges(
  state: ProgressState,
  derived: Omit<Derived, "unlockedBadges">,
): string[] {
  return BADGES.filter((badge) => badge.unlocked(state, derived as Derived)).map((b) => b.id);
}

/* ═══════════════════════════════════════════════════════════════
   ➅ DERIVED STATE COMPUTATION
   ═══════════════════════════════════════════════════════════════ */

/**
 * Compute all derived values from the raw progress state
 * This includes: points breakdown, level info, level progress, and unlocked badges
 */
export function computeDerived(state: ProgressState): Derived {
  // Calculate individual point categories
  const explorePoints = calculateExplorePoints(state.exploredAreas);
  const quizPoints = calculateQuizPoints(state.quizTotalCorrect);
  const contributionPoints = calculateContributionPoints(state.submittedWords.length);
  const votePoints = calculateVotePoints(state.votedWords.length);
  const totalPoints = explorePoints + quizPoints + contributionPoints + votePoints;

  // Determine current and next level
  const level = getCurrentLevel(totalPoints);
  const nextLevel = LEVELS[level.index + 1] ?? null;
  const levelProgress = calculateLevelProgress(totalPoints, level);

  // Temporarily create derived without unlockedBadges to avoid circular dependency
  const partialDerived: Omit<Derived, "unlockedBadges"> = {
    explorePoints,
    quizPoints,
    contributionPoints,
    votePoints,
    totalPoints,
    level,
    nextLevel,
    levelProgress,
  };

  // Now determine unlocked badges using full derived data
  const unlockedBadges = getUnlockedBadges(state, partialDerived);

  return {
    ...partialDerived,
    unlockedBadges,
  };
}

/* ═══════════════════════════════════════════════════════════════
   ➆ STREAK CALCULATION LOGIC
   ═══════════════════════════════════════════════════════════════ */

/**
 * Calculate new streak based on when the last quiz was taken
 * - Same day: keep current streak
 * - Next consecutive day: increment streak
 * - Any other day: reset to 1
 */
function calculateNewStreak(
  currentStreak: number,
  lastQuizDate: string | null,
  today: string,
): number {
  if (lastQuizDate === today) {
    return currentStreak;
  }

  if (lastQuizDate && calculateDaysDifference(lastQuizDate, today) === 1) {
    return currentStreak + 1;
  }

  return 1; // Reset streak
}

/* ═══════════════════════════════════════════════════════════════
   ➇ REACT CONTEXT & PROVIDER
   ═══════════════════════════════════════════════════════════════ */

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  // ───── Initialize: API when logged in, localStorage when guest ─────
  useEffect(() => {
    const isLoggedIn = Boolean(localStorage.getItem("userInfo"));

    if (isLoggedIn) {
      fetch(`${API_BASE}/api/users/profile`, { credentials: "include" })
        .then((r) => {
          if (!r.ok) throw new Error("unauthenticated");
          return r.json();
        })
        .then((data: any) => {
          // Read localStorage (state is still DEFAULT_STATE at this point, prev would be all zeros)
          let local = DEFAULT_STATE;
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) local = { ...DEFAULT_STATE, ...JSON.parse(raw) };
          } catch {}

          // Merge localStorage + DB so neither source loses progress
          const merged: ProgressState = {
            exploredAreas: [...new Set([...local.exploredAreas, ...(Array.isArray(data.exploredAreas) ? data.exploredAreas : [])])],
            quizGamesPlayed: Math.max(local.quizGamesPlayed, data.quizGamesPlayed ?? 0),
            quizBestScore: Math.max(local.quizBestScore, data.quizBestScore ?? 0),
            quizBestTotal: Math.max(local.quizBestTotal, data.quizBestTotal ?? 0),
            quizTotalCorrect: Math.max(local.quizTotalCorrect, data.quizTotalCorrect ?? 0),
            streak: Math.max(local.streak, data.streak ?? 0),
            bestStreak: Math.max(local.bestStreak, data.bestStreak ?? 0),
            lastQuizDate: local.lastQuizDate && data.lastQuizDate
              ? (local.lastQuizDate > data.lastQuizDate ? local.lastQuizDate : data.lastQuizDate)
              : (local.lastQuizDate ?? data.lastQuizDate ?? null),
            votedWords: [...new Set([...local.votedWords, ...(Array.isArray(data.votedWords) ? data.votedWords : [])])],
            completedQuizzes: [...new Set([...local.completedQuizzes, ...(Array.isArray(data.completedQuizzes) ? data.completedQuizzes : [])])],
            quizScores: { ...(data.quizScores ?? {}), ...local.quizScores },
            submittedWords: [
              ...local.submittedWords,
              ...(Array.isArray(data.submittedWords) ? data.submittedWords : []).filter(
                (dw: any) => !local.submittedWords.some((sw: any) => sw.id === dw.id),
              ),
            ],
          };

          setState(merged);
          // Persist merged result so localStorage is always up-to-date
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); } catch {}
        })
        .catch(() => {
          // JWT expired or network error — fall back to localStorage cache
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
          } catch {}
        })
        .finally(() => setReady(true));
    } else {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
      } catch {}
      setReady(true);
    }
  }, []);

  // ───── Core state updater with auto-save ─────
  const update = useCallback((updater: (prev: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        // Silently fail if storage quota exceeded
        console.warn("Failed to save progress to localStorage:", error);
      }
      return next;
    });
  }, []);

  // ───── Action: Mark a governorate as explored ─────
  const markExplored = useCallback(
    (id: string) => {
      update((prev) => {
        if (prev.exploredAreas.includes(id)) {
          return prev; // Already explored
        }
        return {
          ...prev,
          exploredAreas: [...prev.exploredAreas, id],
        };
      });
    },
    [update],
  );

  // ───── Action: Record a completed quiz ─────
  const recordQuiz = useCallback(
    (correct: number, total: number, examId?: string) => {
      update((prev) => {
        const today = getTodayKey();
        const newStreak = calculateNewStreak(prev.streak, prev.lastQuizDate, today);
        const isBestScore = correct > prev.quizBestScore;
        const newCompleted =
          examId && !prev.completedQuizzes.includes(examId)
            ? [...prev.completedQuizzes, examId]
            : prev.completedQuizzes;

        const newScores = examId
          ? { ...prev.quizScores, [examId]: { score: correct, total } }
          : prev.quizScores;

        return {
          ...prev,
          quizGamesPlayed: prev.quizGamesPlayed + 1,
          quizTotalCorrect: prev.quizTotalCorrect + correct,
          quizBestScore: isBestScore ? correct : prev.quizBestScore,
          quizBestTotal: isBestScore ? total : prev.quizBestTotal,
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          lastQuizDate: today,
          completedQuizzes: newCompleted,
          quizScores: newScores,
        };
      });

      // Sync to backend when logged in
      if (examId && localStorage.getItem("userInfo")) {
        fetch(`${API_BASE}/api/users/quiz-result`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ score: correct, total, quizId: examId }),
        }).catch(() => {});
      }
    },
    [update],
  );

  // ───── Action: Record non-quiz activity (forum post, etc.) for streak ─────
  const recordActivity = useCallback(() => {
    update((prev) => {
      const today = getTodayKey();
      if (prev.lastQuizDate === today) return prev;
      const newStreak = calculateNewStreak(prev.streak, prev.lastQuizDate, today);
      return {
        ...prev,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        lastQuizDate: today,
      };
    });
  }, [update]);

  // ───── Action: Toggle vote on a word ─────
  const toggleVote = useCallback(
    (wordId: string) => {
      update((prev) => {
        const hasVoted = prev.votedWords.includes(wordId);
        return {
          ...prev,
          votedWords: hasVoted
            ? prev.votedWords.filter((w) => w !== wordId)
            : [...prev.votedWords, wordId],
        };
      });
    },
    [update],
  );

  // ───── Action: Reconcile local votedWords with server likedByMe (API words only) ─────
  const reconcileApiVotes = useCallback(
    (votes: Array<{ wordId: string; voted: boolean }>) => {
      update((prev) => {
        let votedWords = [...prev.votedWords];
        for (const { wordId, voted } of votes) {
          const inLocal = votedWords.includes(wordId);
          if (voted && !inLocal) votedWords.push(wordId);
          else if (!voted && inLocal) votedWords = votedWords.filter((id) => id !== wordId);
        }
        return { ...prev, votedWords };
      });
    },
    [update],
  );

  // ───── Action: Submit a new word ─────
  const submitWord = useCallback(
    (w: Omit<SubmittedWord, "id" | "date">) => {
      update((prev) => {
        const newSubmission: SubmittedWord = {
          ...w,
          id: `sub-${Date.now()}`,
          date: getTodayKey(),
        };

        return {
          ...prev,
          submittedWords: [newSubmission, ...prev.submittedWords],
        };
      });
    },
    [update],
  );

  // ───── Action: Reset all progress ─────
  const resetAll = useCallback(() => {
    update(() => DEFAULT_STATE);
  }, [update]);

  // ───── Action: Sync progress after login ─────
  /**
   * Merges guest localStorage progress with user database progress on login
   * - Uses set union for arrays (exploredAreas, votedWords)
   * - Uses maximum for numeric values (streaks, scores, counts)
   * - Preserves submitted words with deduplication
   */
  const syncFromUser = useCallback(
    (userInfo: any) => {
      update((prev) => ({
        exploredAreas: [...new Set([...prev.exploredAreas, ...(userInfo.exploredAreas ?? [])])],
        quizGamesPlayed: Math.max(prev.quizGamesPlayed, userInfo.quizGamesPlayed ?? 0),
        quizTotalCorrect: Math.max(prev.quizTotalCorrect, userInfo.quizTotalCorrect ?? 0),
        quizBestScore: Math.max(prev.quizBestScore, userInfo.quizBestScore ?? 0),
        quizBestTotal: Math.max(prev.quizBestTotal, userInfo.quizBestTotal ?? 0),
        streak: Math.max(prev.streak, userInfo.streak ?? 0),
        bestStreak: Math.max(prev.bestStreak, userInfo.bestStreak ?? 0),
        lastQuizDate: prev.lastQuizDate ?? userInfo.lastQuizDate ?? null,
        votedWords: [...new Set([...prev.votedWords, ...(userInfo.votedWords ?? [])])],
        completedQuizzes: [...new Set([...prev.completedQuizzes, ...(userInfo.completedQuizzes ?? [])])],
        quizScores: { ...(userInfo.quizScores ?? {}), ...prev.quizScores },
        submittedWords: [
          ...prev.submittedWords,
          ...(userInfo.submittedWords ?? []).filter(
            (uw: SubmittedWord) => !prev.submittedWords.some((sw) => sw.id === uw.id),
          ),
        ],
      }));
    },
    [update],
  );

  // ───── Compute derived state ─────
  const derived = useMemo(() => computeDerived(state), [state]);

  // ───── Sync ALL progress to backend (debounced) ─────
  // Fires on app load (ready→true) and whenever any tracked field changes.
  // This ensures the admin always reads the same values the frontend shows.
  useEffect(() => {
    if (!ready) return;
    if (!localStorage.getItem("userInfo")) return;

    const timer = setTimeout(() => {
      fetch(`${API_BASE}/api/users/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          exploredAreas: state.exploredAreas,
          votedWords: state.votedWords,
          quizGamesPlayed: state.quizGamesPlayed,
          quizTotalCorrect: state.quizTotalCorrect,
          quizBestScore: state.quizBestScore,
          quizBestTotal: state.quizBestTotal,
          streak: state.streak,
          bestStreak: state.bestStreak,
          lastQuizDate: state.lastQuizDate,
          completedQuizzes: state.completedQuizzes,
          quizScores: state.quizScores,
          submittedWords: state.submittedWords,
        }),
      }).catch(() => {});
    }, 2000);

    return () => clearTimeout(timer);
  }, [
    ready,
    state.exploredAreas,
    state.votedWords,
    state.quizTotalCorrect,
    state.quizGamesPlayed,
    state.completedQuizzes,
    state.streak,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ]);

  // ───── Provide context value ─────
  const value: ProgressContextValue = {
    ready,
    state,
    derived,
    isExplored: (id) => state.exploredAreas.includes(id),
    markExplored,
    recordQuiz,
    recordActivity,
    hasVoted: (id) => state.votedWords.includes(id),
    toggleVote,
    reconcileApiVotes,
    submitWord,
    resetAll,
    syncFromUser,
    hasCompletedQuiz: (examId) => state.completedQuizzes.includes(examId),
    getQuizScore: (examId) => state.quizScores[examId] ?? null,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

/* ═══════════════════════════════════════════════════════════════
   ➈ CUSTOM HOOK
   ═══════════════════════════════════════════════════════════════ */

/**
 * Hook to access progress context
 * Must be used within ProgressProvider
 */
export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return ctx;
}
