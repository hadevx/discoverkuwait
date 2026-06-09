"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"

export type Lang = "ar" | "en"

type UIStrings = {
  // brand / nav
  brand: string
  brandSub: string
  navMap: string
  navQuiz: string
  navDictionary: string
  navProfile: string
  langToggle: string
  themeToggle: string
  // hero
  heroKicker: string
  heroTitle: string
  heroSubtitle: string
  heroCta: string
  // map / progress
  exploreProgress: string
  pointsLabel: string
  exploredLabel: string
  governoratesLabel: string
  tapHint: string
  selectPrompt: string
  selectPromptSub: string
  landmarks: string
  facts: string
  area: string
  population: string
  rewardPoints: string
  markExplored: string
  explored: string
  km2: string
  resetProgress: string
  allExplored: string
  notableAreas: string
  // quiz
  quizTitle: string
  quizSubtitle: string
  dailyChallenge: string
  startQuiz: string
  question: string
  of: string
  nextQuestion: string
  seeResults: string
  correct: string
  incorrect: string
  quizComplete: string
  yourScore: string
  pointsEarned: string
  currentStreak: string
  bestStreak: string
  days: string
  playAgain: string
  shareChallenge: string
  linkCopied: string
  leaderboard: string
  rank: string
  player: string
  score: string
  you: string
  quizCategories: string
  alreadyPlayedToday: string
  // dictionary
  dictTitle: string
  dictSubtitle: string
  searchPlaceholder: string
  allCategories: string
  trending: string
  pronounce: string
  meaningAr: string
  meaningEn: string
  example: string
  votes: string
  vote: string
  voted: string
  submitWord: string
  submitWordTitle: string
  submitWordDesc: string
  wordField: string
  pronunciationField: string
  meaningArField: string
  meaningEnField: string
  exampleField: string
  categoryField: string
  cancel: string
  submit: string
  wordSubmitted: string
  yourSubmissions: string
  underReview: string
  noResults: string
  // profile
  profileTitle: string
  level: string
  nextLevel: string
  maxLevel: string
  totalPoints: string
  pointsBreakdown: string
  fromExploring: string
  fromQuizzes: string
  fromContributions: string
  fromVoting: string
  badges: string
  badgesUnlocked: string
  locked: string
  weeklyChallenges: string
  achievements: string
  statExplored: string
  statQuizzes: string
  statWords: string
  statVotes: string
  // auth
  loginBtn: string
  registerBtn: string
  logoutBtn: string
  guestPromptTitle: string
  guestPromptDesc: string
  loginTitle: string
  registerTitle: string
  emailPlaceholder: string
  passwordPlaceholder: string
  namePlaceholder: string
  confirmPasswordPlaceholder: string
  loggingIn: string
  creatingAccount: string
  noAccount: string
  alreadyHaveAccount: string
  // toasts
  toastAllFieldsRequired: string
  toastPasswordsMismatch: string
  toastAccountCreated: string
  toastWelcomeBack: string
  toastFailedSubmitWord: string
  toastFailedUpdateName: string
  toastErrorOccurred: string
  // forum
  navForum: string
  forumTitle: string
  forumSubtitle: string
  sharePhoto: string
  captionPlaceholder: string
  posting: string
  noForumPosts: string
  loginToVote: string
  loginToPost: string
  imagesTab: string
  topicsTab: string
  competitionOpen: string
  competitionClosed: string
  competitionEnds: string
  competitionClosedMsg: string
  competitionMyPending: string
  pending: string
  confirm: string
  dragImageHere: string
  photoReviewNotice: string
  photoUploadSuccess: string
  newTopic: string
  topicPlaceholder: string
  postTopic: string
  topicCreated: string
  closed: string
  noComments: string
  topicClosedMsg: string
  loginToComment: string
  commentPlaceholder: string
  myPendingPhotos: string
  loadMore: string
  noTopics: string
  startTopic: string
  allCategories: string
  postDeleted: string
  backToForum: string
  // categories
  catFood: string
  catDailyLife: string
  catTraditions: string
  catSlang: string
  catHistory: string
  catGeography: string
  catDialect: string
  catLandmarks: string
  catGreetings: string
  catExpressions: string
  catPlaces: string
  catOther: string
}

const STRINGS: Record<Lang, UIStrings> = {
  ar: {
    brand: "اكتشف الكويت",
    brandSub: "رحلة في الثقافة والتراث",
    navMap: "الخريطة",
    navQuiz: "التحدي",
    navDictionary: "القاموس",
    navProfile: "ملفي",
    navForum: "المنتدى",
    langToggle: "English",
    themeToggle: "تبديل المظهر",
    heroKicker: "استكشف · تعلّم · اجمع النقاط",
    heroTitle: "اكتشف محافظات الكويت الست",
    heroSubtitle:
      "تنقّل عبر خريطة تفاعلية للكويت، اضغط على كل محافظة لتتعرّف على معالمها وتاريخها، واجمع نقاط الاستكشاف.",
    heroCta: "ابدأ الاستكشاف",
    exploreProgress: "تقدّم الاستكشاف",
    pointsLabel: "نقطة",
    exploredLabel: "محافظة مستكشفة",
    governoratesLabel: "المحافظات",
    tapHint: "اضغط على أي محافظة على الخريطة",
    selectPrompt: "اختر محافظة من الخريطة",
    selectPromptSub: "اضغط على إحدى المناطق الملونة لعرض تفاصيلها ومعالمها.",
    landmarks: "أبرز المعالم",
    facts: "هل تعلم؟",
    area: "المساحة",
    population: "عدد السكان",
    rewardPoints: "نقاط المكافأة",
    markExplored: "اعتبرها مستكشفة",
    explored: "تم الاستكشاف",
    km2: "كم²",
    resetProgress: "إعادة ضبط التقدّم",
    allExplored: "أحسنت! استكشفت كل محافظات الكويت",
    notableAreas: "أبرز المناطق",
    quizTitle: "مَن يعرف الكويت أكثر؟",
    quizSubtitle: "اختبر معلوماتك عن الكويت يومياً واجمع النقاط وارتقِ في المستويات.",
    dailyChallenge: "تحدّي اليوم",
    startQuiz: "ابدأ التحدّي",
    question: "السؤال",
    of: "من",
    nextQuestion: "السؤال التالي",
    seeResults: "عرض النتيجة",
    correct: "إجابة صحيحة!",
    incorrect: "إجابة خاطئة",
    quizComplete: "اكتمل التحدّي!",
    yourScore: "نتيجتك",
    pointsEarned: "النقاط المكتسبة",
    currentStreak: "السلسلة الحالية",
    bestStreak: "أطول سلسلة",
    days: "يوم",
    playAgain: "العب مرة أخرى",
    shareChallenge: "تحدَّ صديقاً",
    linkCopied: "تم نسخ رابط التحدّي!",
    leaderboard: "لوحة المتصدّرين",
    rank: "المركز",
    player: "اللاعب",
    score: "النتيجة",
    you: "أنت",
    quizCategories: "تشمل الأسئلة: اللهجة، التاريخ، الجغرافيا، العادات، والمعالم.",
    alreadyPlayedToday: "لقد أكملت تحدّي اليوم — يمكنك إعادة اللعب للتدريب.",
    dictTitle: "قاموس اللهجة الكويتية",
    dictSubtitle: "ابحث في الكلمات والتعابير الكويتية، استمع للنطق، وصوّت لأكثرها استخداماً.",
    searchPlaceholder: "ابحث عن كلمة أو معنى...",
    allCategories: "الكل",
    trending: "الأكثر رواجاً",
    pronounce: "استمع للنطق",
    meaningAr: "المعنى بالعربية الفصحى",
    meaningEn: "المعنى بالإنجليزية",
    example: "مثال",
    votes: "صوت",
    vote: "صوّت",
    voted: "تم التصويت",
    submitWord: "أضف كلمة",
    submitWordTitle: "أضف كلمة جديدة",
    submitWordDesc: "ساهم في القاموس بإضافة كلمة كويتية. ستُراجع قبل النشر.",
    wordField: "الكلمة",
    pronunciationField: "النطق",
    meaningArField: "المعنى بالفصحى",
    meaningEnField: "المعنى بالإنجليزية",
    exampleField: "جملة مثال",
    categoryField: "التصنيف",
    cancel: "إلغاء",
    submit: "إرسال",
    wordSubmitted: "تم إرسال الكلمة للمراجعة. شكراً لمساهمتك!",
    yourSubmissions: "كلماتك المُضافة",
    underReview: "قيد المراجعة",
    noResults: "لا توجد نتائج مطابقة.",
    profileTitle: "ملفي الشخصي",
    level: "المستوى",
    nextLevel: "للمستوى التالي",
    maxLevel: "أعلى مستوى!",
    totalPoints: "إجمالي النقاط",
    pointsBreakdown: "تفصيل النقاط",
    fromExploring: "من الاستكشاف",
    fromQuizzes: "من التحديات",
    fromContributions: "من المساهمات",
    fromVoting: "من التصويت",
    badges: "الأوسمة",
    badgesUnlocked: "وسام مفتوح",
    locked: "مغلق",
    weeklyChallenges: "تحديات الأسبوع",
    achievements: "الإنجازات",
    statExplored: "محافظات مستكشفة",
    statQuizzes: "تحديات مكتملة",
    statWords: "كلمات مُضافة",
    statVotes: "أصوات",
    loginBtn: "تسجيل الدخول",
    registerBtn: "إنشاء حساب",
    logoutBtn: "تسجيل الخروج",
    guestPromptTitle: "احفظ تقدّمك",
    guestPromptDesc: "سجّل دخولك أو أنشئ حساباً لحفظ نقاطك ومزامنة تقدّمك عبر أجهزتك.",
    loginTitle: "أهلاً بعودتك",
    registerTitle: "إنشاء حساب جديد",
    emailPlaceholder: "البريد الإلكتروني",
    passwordPlaceholder: "كلمة المرور",
    namePlaceholder: "الاسم الكامل",
    confirmPasswordPlaceholder: "تأكيد كلمة المرور",
    loggingIn: "جاري تسجيل الدخول...",
    creatingAccount: "جاري إنشاء الحساب...",
    noAccount: "ليس لديك حساب؟",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    toastAllFieldsRequired: "جميع الحقول مطلوبة",
    toastPasswordsMismatch: "كلمتا المرور غير متطابقتين",
    toastAccountCreated: "تم إنشاء الحساب! أهلاً بك.",
    toastWelcomeBack: "أهلاً بعودتك!",
    toastFailedSubmitWord: "فشل إرسال الكلمة",
    toastFailedUpdateName: "فشل تحديث الاسم",
    toastErrorOccurred: "حدث خطأ",
    forumTitle: "المنتدى",
    forumSubtitle: "شارك أفكارك وصورك مع المجتمع",
    sharePhoto: "مشاركة صورة",
    captionPlaceholder: "أضف وصفاً للصورة... (اختياري)",
    posting: "جاري النشر...",
    noForumPosts: "لا توجد منشورات بعد. كن أول من يشارك!",
    loginToVote: "سجّل دخولك للتصويت",
    loginToPost: "سجّل دخولك للمشاركة",
    imagesTab: "مسابقة أفضل صورة",
    topicsTab: "المواضيع",
    competitionOpen: "المسابقة مفتوحة",
    competitionClosed: "المسابقة مغلقة",
    competitionEnds: "تنتهي في",
    competitionClosedMsg: "المسابقة مغلقة حالياً. تابعنا قريباً!",
    competitionMyPending: "صوري قيد المراجعة",
    pending: "قيد المراجعة",
    confirm: "تأكيد",
    dragImageHere: "اضغط أو اسحب صورة هنا",
    photoReviewNotice: "ستخضع صورتك للمراجعة قبل نشرها للعموم.",
    photoUploadSuccess: "تم رفع الصورة! ستظهر بعد موافقة المشرف.",
    newTopic: "موضوع جديد",
    topicPlaceholder: "ما الذي تريد مناقشته؟",
    postTopic: "نشر الموضوع",
    topicCreated: "تم إنشاء الموضوع!",
    closed: "مغلق",
    noComments: "لا تعليقات بعد.",
    topicClosedMsg: "هذا الموضوع مغلق.",
    loginToComment: "سجّل دخولك للتعليق",
    commentPlaceholder: "اكتب تعليقاً...",
    myPendingPhotos: "صوري قيد المراجعة",
    loadMore: "تحميل المزيد",
    noTopics: "لا توجد مواضيع بعد.",
    startTopic: "ابدأ موضوعاً",
    allCategories: "الكل",
    postDeleted: "تم حذف المنشور",
    backToForum: "العودة إلى المنتدى",
    catFood: "طعام",
    catDailyLife: "حياة يومية",
    catTraditions: "عادات",
    catSlang: "عامية",
    catHistory: "تاريخ",
    catGeography: "جغرافيا",
    catDialect: "لهجة",
    catLandmarks: "معالم",
    catGreetings: "تحيات",
    catExpressions: "تعابير",
    catPlaces: "أماكن",
    catOther: "أخرى",
  },
  en: {
    brand: "Discover Kuwait",
    brandSub: "A journey through culture & heritage",
    navMap: "Map",
    navQuiz: "Quiz",
    navDictionary: "Dictionary",
    navProfile: "Profile",
    navForum: "Forum",
    langToggle: "العربية",
    themeToggle: "Toggle theme",
    heroKicker: "Explore · Learn · Earn points",
    heroTitle: "Discover Kuwait's six governorates",
    heroSubtitle:
      "Navigate an interactive map of Kuwait, tap each governorate to learn its landmarks and history, and collect exploration points.",
    heroCta: "Start exploring",
    exploreProgress: "Exploration progress",
    pointsLabel: "points",
    exploredLabel: "governorates explored",
    governoratesLabel: "Governorates",
    tapHint: "Tap any governorate on the map",
    selectPrompt: "Select a governorate from the map",
    selectPromptSub: "Tap one of the colored regions to view its details and landmarks.",
    landmarks: "Key landmarks",
    facts: "Did you know?",
    area: "Area",
    population: "Population",
    rewardPoints: "Reward points",
    markExplored: "Mark as explored",
    explored: "Explored",
    km2: "km²",
    resetProgress: "Reset progress",
    allExplored: "Well done! You explored all of Kuwait's governorates",
    notableAreas: "Notable areas",
    quizTitle: "Who Knows Kuwait Best?",
    quizSubtitle: "Test your Kuwait knowledge daily, earn points, and climb the levels.",
    dailyChallenge: "Today's Challenge",
    startQuiz: "Start the challenge",
    question: "Question",
    of: "of",
    nextQuestion: "Next question",
    seeResults: "See results",
    correct: "Correct!",
    incorrect: "Incorrect",
    quizComplete: "Challenge complete!",
    yourScore: "Your score",
    pointsEarned: "Points earned",
    currentStreak: "Current streak",
    bestStreak: "Best streak",
    days: "days",
    playAgain: "Play again",
    shareChallenge: "Challenge a friend",
    linkCopied: "Challenge link copied!",
    leaderboard: "Leaderboard",
    rank: "Rank",
    player: "Player",
    score: "Score",
    you: "You",
    quizCategories: "Questions cover: dialect, history, geography, customs, and landmarks.",
    alreadyPlayedToday: "You finished today's challenge — replay anytime to practice.",
    dictTitle: "Kuwaiti Dialect Dictionary",
    dictSubtitle: "Search Kuwaiti words and expressions, hear the pronunciation, and vote for favorites.",
    searchPlaceholder: "Search a word or meaning...",
    allCategories: "All",
    trending: "Trending",
    pronounce: "Hear pronunciation",
    meaningAr: "Meaning in Modern Arabic",
    meaningEn: "Meaning in English",
    example: "Example",
    votes: "votes",
    vote: "Vote",
    voted: "Voted",
    submitWord: "Add a word",
    submitWordTitle: "Submit a new word",
    submitWordDesc: "Contribute to the dictionary by adding a Kuwaiti word. It will be reviewed before publishing.",
    wordField: "Word",
    pronunciationField: "Pronunciation",
    meaningArField: "Meaning in Arabic",
    meaningEnField: "Meaning in English",
    exampleField: "Example sentence",
    categoryField: "Category",
    cancel: "Cancel",
    submit: "Submit",
    wordSubmitted: "Word submitted for review. Thanks for contributing!",
    yourSubmissions: "Your submissions",
    underReview: "Under review",
    noResults: "No matching results.",
    profileTitle: "My Profile",
    level: "Level",
    nextLevel: "to next level",
    maxLevel: "Max level!",
    totalPoints: "Total points",
    pointsBreakdown: "Points breakdown",
    fromExploring: "From exploring",
    fromQuizzes: "From quizzes",
    fromContributions: "From contributions",
    fromVoting: "From voting",
    badges: "Badges",
    badgesUnlocked: "badges unlocked",
    locked: "Locked",
    weeklyChallenges: "Weekly challenges",
    achievements: "Achievements",
    statExplored: "Governorates explored",
    statQuizzes: "Quizzes completed",
    statWords: "Words submitted",
    statVotes: "Votes cast",
    loginBtn: "Log in",
    registerBtn: "Create account",
    logoutBtn: "Log out",
    guestPromptTitle: "Save your progress",
    guestPromptDesc: "Log in or create an account to save your points and sync your progress across devices.",
    loginTitle: "Welcome back",
    registerTitle: "Create an account",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    namePlaceholder: "Full name",
    confirmPasswordPlaceholder: "Confirm password",
    loggingIn: "Logging in...",
    creatingAccount: "Creating account...",
    noAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    toastAllFieldsRequired: "All fields are required",
    toastPasswordsMismatch: "Passwords do not match",
    toastAccountCreated: "Account created! Welcome aboard.",
    toastWelcomeBack: "Welcome back!",
    toastFailedSubmitWord: "Failed to submit word",
    toastFailedUpdateName: "Failed to update name",
    toastErrorOccurred: "An error occurred",
    forumTitle: "Forum",
    forumSubtitle: "Share your thoughts and photos with the community",
    sharePhoto: "Share a Photo",
    captionPlaceholder: "Add a caption... (optional)",
    posting: "Posting...",
    noForumPosts: "No posts yet. Be the first to share!",
    loginToVote: "Log in to vote",
    loginToPost: "Log in to post",
    imagesTab: "Best Image Reward",
    topicsTab: "Topics",
    competitionOpen: "Competition is open",
    competitionClosed: "Competition is closed",
    competitionEnds: "Ends",
    competitionClosedMsg: "The competition is currently closed. Check back soon!",
    competitionMyPending: "My pending entries",
    pending: "Pending",
    confirm: "Confirm",
    dragImageHere: "Click or drag an image here",
    photoReviewNotice: "Your photo will be reviewed by an admin before it goes public.",
    photoUploadSuccess: "Photo uploaded! It will appear after admin approval.",
    newTopic: "New Topic",
    topicPlaceholder: "What would you like to discuss?",
    postTopic: "Post Topic",
    topicCreated: "Topic created!",
    closed: "Closed",
    noComments: "No comments yet.",
    topicClosedMsg: "This topic is closed.",
    loginToComment: "Log in to comment",
    commentPlaceholder: "Write a comment…",
    myPendingPhotos: "My pending photos",
    loadMore: "Load more",
    noTopics: "No topics yet.",
    startTopic: "Start a topic",
    allCategories: "All",
    postDeleted: "Post deleted",
    backToForum: "Back to Forum",
    catFood: "Food",
    catDailyLife: "Daily life",
    catTraditions: "Traditions",
    catSlang: "Slang",
    catHistory: "History",
    catGeography: "Geography",
    catDialect: "Dialect",
    catLandmarks: "Landmarks",
    catGreetings: "Greetings",
    catExpressions: "Expressions",
    catPlaces: "Places",
    catOther: "Other",
  },
}

type LanguageContextValue = {
  lang: Lang
  dir: "rtl" | "ltr"
  t: UIStrings
  toggleLang: () => void
  /** picks the right field from a bilingual object */
  tr: (value: { ar: string; en: string }) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar")

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("dk-lang") as Lang | null) : null
    if (stored === "ar" || stored === "en") setLang(stored)
  }, [])

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    localStorage.setItem("dk-lang", lang)
  }, [lang])

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"))
  }, [])

  const value: LanguageContextValue = {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    t: STRINGS[lang],
    toggleLang,
    tr: (v) => v[lang],
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
