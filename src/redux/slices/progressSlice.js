import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GOVERNORATES } from "@/lib/kuwait-data";

/* ── Constants ── */

const STORAGE_KEY = "dk-progress-v1";
const API_BASE =
  import.meta.env.DEV
    ? import.meta.env.VITE_API_LOCALHOST
    : import.meta.env.VITE_API_URL;

export const POINTS = {
  perCorrectAnswer: 10,
  perWordSubmission: 15,
  perVote: 2,
};

export const LEVELS = [
  { index: 0, min: 0, ar: "زائر", en: "Visitor" },
  { index: 1, min: 100, ar: "مستكشف", en: "Explorer" },
  { index: 2, min: 300, ar: "رحّالة", en: "Voyager" },
  { index: 3, min: 600, ar: "خبير", en: "Connoisseur" },
  { index: 4, min: 1000, ar: "عاشق الكويت", en: "Kuwait Devotee" },
  { index: 5, min: 1600, ar: "سفير التراث", en: "Heritage Ambassador" },
];

export const BADGES = [
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
  {
    id: "quiz-master",
    ar: "سيّد الاختبارات",
    en: "Quiz Master",
    descAr: "أكمل جميع الجولات العشر",
    descEn: "Complete all 10 rounds",
    icon: "Trophy",
    unlocked: (s) => s.completedQuizzes.length >= 10,
  },
];

/* ── Derived computation (used as selector) ── */

export function computeDerived(s) {
  const explorePoints = GOVERNORATES.filter((g) => s.exploredAreas.includes(g.id)).reduce(
    (sum, g) => sum + g.points,
    0,
  );
  const quizPoints = s.quizTotalCorrect * POINTS.perCorrectAnswer;
  const contributionPoints = s.submittedWords.length * POINTS.perWordSubmission;
  const votePoints = s.votedWords.length * POINTS.perVote;
  const totalPoints = explorePoints + quizPoints + contributionPoints + votePoints;

  let level = LEVELS[0];
  for (const l of LEVELS) if (totalPoints >= l.min) level = l;
  const nextLevel = LEVELS[level.index + 1] ?? null;
  const levelProgress = nextLevel
    ? Math.min(1, (totalPoints - level.min) / (nextLevel.min - level.min))
    : 1;

  const partial = {
    explorePoints,
    quizPoints,
    contributionPoints,
    votePoints,
    totalPoints,
    level,
    nextLevel,
    levelProgress,
    unlockedBadges: [],
  };

  for (const b of BADGES) {
    if (b.unlocked(s, partial)) partial.unlockedBadges.push(b.id);
  }

  return partial;
}

/* ── Helpers ── */

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function dayDiff(a, b) {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

function pickProgress(src) {
  return {
    exploredAreas: Array.isArray(src.exploredAreas) ? src.exploredAreas : [],
    quizGamesPlayed: src.quizGamesPlayed ?? 0,
    quizBestScore: src.quizBestScore ?? 0,
    quizBestTotal: src.quizBestTotal ?? 0,
    quizTotalCorrect: src.quizTotalCorrect ?? 0,
    streak: src.streak ?? 0,
    bestStreak: src.bestStreak ?? 0,
    lastQuizDate: src.lastQuizDate ?? null,
    votedWords: Array.isArray(src.votedWords) ? src.votedWords : [],
    submittedWords: Array.isArray(src.submittedWords) ? src.submittedWords : [],
    completedQuizzes: Array.isArray(src.completedQuizzes) ? src.completedQuizzes : [],
  };
}

function saveToLocalStorage(progress) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  } catch {
    // ignore quota errors
  }
}

/* ── Default state ── */

const DEFAULT_PROGRESS = {
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
};

const savedProgress = (() => {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return raw ? { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } : DEFAULT_PROGRESS;
  } catch {
    return DEFAULT_PROGRESS;
  }
})();

const initialState = {
  progress: savedProgress,
  ready: false,
  isSyncing: false,
};

/* ── Async thunk: save to backend ── */

export const saveProgressToBackend = createAsyncThunk(
  "progress/saveToBackend",
  async (data, { rejectWithValue }) => {
    try {
      await fetch(`${API_BASE}/api/users/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ── Slice ── */

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    // Called on login — load progress from user object
    loadFromUser: (state, action) => {
      state.progress = pickProgress(action.payload);
      state.ready = true;
      saveToLocalStorage(state.progress);
    },

    // Called on logout — reload from localStorage
    loadFromStorage: (state) => {
      try {
        const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        state.progress = raw ? { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } : DEFAULT_PROGRESS;
      } catch {
        state.progress = DEFAULT_PROGRESS;
      }
      state.ready = true;
    },

    setReady: (state) => {
      state.ready = true;
    },

    markExplored: (state, action) => {
      const id = action.payload;
      if (!state.progress.exploredAreas.includes(id)) {
        state.progress.exploredAreas.push(id);
        saveToLocalStorage(state.progress);
      }
    },

    recordQuiz: (state, action) => {
      const { correct, total, quizId } = action.payload;
      const today = todayKey();
      const prev = state.progress;

      let streak = prev.streak;
      if (prev.lastQuizDate === today) {
        streak = prev.streak;
      } else if (prev.lastQuizDate && dayDiff(prev.lastQuizDate, today) === 1) {
        streak = prev.streak + 1;
      } else {
        streak = 1;
      }

      const isBest = correct > prev.quizBestScore;

      state.progress.quizGamesPlayed += 1;
      state.progress.quizTotalCorrect += correct;
      state.progress.quizBestScore = isBest ? correct : prev.quizBestScore;
      state.progress.quizBestTotal = isBest ? total : prev.quizBestTotal;
      state.progress.streak = streak;
      state.progress.bestStreak = Math.max(prev.bestStreak, streak);
      state.progress.lastQuizDate = today;

      if (!state.progress.completedQuizzes.includes(quizId)) {
        state.progress.completedQuizzes.push(quizId);
      }

      saveToLocalStorage(state.progress);
    },

    toggleVote: (state, action) => {
      const wordId = action.payload;
      const idx = state.progress.votedWords.indexOf(wordId);
      if (idx > -1) {
        state.progress.votedWords.splice(idx, 1);
      } else {
        state.progress.votedWords.push(wordId);
      }
      saveToLocalStorage(state.progress);
    },

    submitWord: (state, action) => {
      const w = action.payload;
      state.progress.submittedWords.unshift({
        ...w,
        id: `sub-${Date.now()}`,
        date: todayKey(),
      });
      saveToLocalStorage(state.progress);
    },

    resetAll: (state) => {
      state.progress = DEFAULT_PROGRESS;
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(saveProgressToBackend.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(saveProgressToBackend.fulfilled, (state) => {
        state.isSyncing = false;
      })
      .addCase(saveProgressToBackend.rejected, (state) => {
        state.isSyncing = false;
      });
  },
});

export const {
  loadFromUser,
  loadFromStorage,
  setReady,
  markExplored,
  recordQuiz,
  toggleVote,
  submitWord,
  resetAll,
} = progressSlice.actions;

export default progressSlice.reducer;
