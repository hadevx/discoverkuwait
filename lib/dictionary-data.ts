export type WordCategory =
  | "food"
  | "dailyLife"
  | "traditions"
  | "slang"
  | "greetings"
  | "expressions"
  | "places"
  | "other"

export type DialectWord = {
  id: string
  word: string
  pronunciation: string
  meaningAr: string
  meaningEn: string
  exampleAr: string
  exampleEn: string
  category: WordCategory
  baseVotes: number
  submittedBy?: string
}

export const WORD_CATEGORIES: { id: WordCategory; ar: string; en: string }[] = [
  { id: "food", ar: "طعام", en: "Food" },
  { id: "dailyLife", ar: "حياة يومية", en: "Daily life" },
  { id: "traditions", ar: "عادات", en: "Traditions" },
  { id: "slang", ar: "عامية", en: "Slang" },
  { id: "greetings", ar: "تحيات", en: "Greetings" },
  { id: "expressions", ar: "تعابير", en: "Expressions" },
  { id: "places", ar: "أماكن", en: "Places" },
  { id: "other", ar: "أخرى", en: "Other" },
]

export const DIALECT_WORDS: DialectWord[] = [
  {
    id: "w-wayed",
    word: "وايد",
    pronunciation: "wāyed",
    meaningAr: "كثير، جداً",
    meaningEn: "A lot, very much",
    exampleAr: "الأكل وايد زين.",
    exampleEn: "The food is very good.",
    category: "slang",
    baseVotes: 312,
  },
  {
    id: "w-shlonik",
    word: "شلونك",
    pronunciation: "shlōnik",
    meaningAr: "كيف حالك؟",
    meaningEn: "How are you?",
    exampleAr: "هلا، شلونك اليوم؟",
    exampleEn: "Hi, how are you today?",
    category: "dailyLife",
    baseVotes: 289,
  },
  {
    id: "w-zain",
    word: "زين",
    pronunciation: "zain",
    meaningAr: "جيّد، حسناً",
    meaningEn: "Good, okay",
    exampleAr: "زين، نتقابل بكرة.",
    exampleEn: "Okay, we'll meet tomorrow.",
    category: "dailyLife",
    baseVotes: 256,
  },
  {
    id: "w-yahal",
    word: "يهال",
    pronunciation: "yahāl",
    meaningAr: "أطفال",
    meaningEn: "Children, kids",
    exampleAr: "اليهال يلعبون بالحوش.",
    exampleEn: "The kids are playing in the yard.",
    category: "dailyLife",
    baseVotes: 198,
  },
  {
    id: "w-machboos",
    word: "مجبوس",
    pronunciation: "machbūs",
    meaningAr: "طبق أرز باللحم أو الدجاج، الأكلة الوطنية",
    meaningEn: "Spiced rice with meat or chicken — the national dish",
    exampleAr: "ريحة المجبوس تملي البيت.",
    exampleEn: "The smell of machboos fills the house.",
    category: "food",
    baseVotes: 274,
  },
  {
    id: "w-gaimar",
    word: "قيمر",
    pronunciation: "gaimar",
    meaningAr: "قشطة تؤكل مع الخبز والعسل في الفطور",
    meaningEn: "Clotted cream eaten with bread and honey at breakfast",
    exampleAr: "نبي قيمر وعسل للريوق.",
    exampleEn: "We want gaimar and honey for breakfast.",
    category: "food",
    baseVotes: 167,
  },
  {
    id: "w-darabeel",
    word: "دريشة",
    pronunciation: "darīsha",
    meaningAr: "نافذة",
    meaningEn: "Window",
    exampleAr: "سكّر الدريشة، الجو حار.",
    exampleEn: "Close the window, it's hot.",
    category: "dailyLife",
    baseVotes: 143,
  },
  {
    id: "w-gergean",
    word: "قرقيعان",
    pronunciation: "gergē'ān",
    meaningAr: "احتفال منتصف رمضان يجمع فيه الأطفال الحلوى",
    meaningEn: "Mid-Ramadan celebration where children collect sweets",
    exampleAr: "اليهال يطوفون البيوت في القرقيعان.",
    exampleEn: "Kids go door to door during Gergean.",
    category: "traditions",
    baseVotes: 221,
  },
  {
    id: "w-diwaniya",
    word: "ديوانية",
    pronunciation: "dīwānīya",
    meaningAr: "مجلس اجتماعي يلتقي فيه الرجال للحديث",
    meaningEn: "A social gathering room where men meet and talk",
    exampleAr: "نلتقي بالديوانية بعد العشا.",
    exampleEn: "We'll meet at the diwaniya after dinner.",
    category: "traditions",
    baseVotes: 205,
  },
  {
    id: "w-chai",
    word: "چاي حليب",
    pronunciation: "chāi ḥalīb",
    meaningAr: "شاي بالحليب، مشروب شعبي",
    meaningEn: "Milk tea, a popular drink",
    exampleAr: "تفضل چاي حليب وياي.",
    exampleEn: "Have some milk tea with me.",
    category: "food",
    baseVotes: 188,
  },
  {
    id: "w-mashallah",
    word: "عساه",
    pronunciation: "'asāh",
    meaningAr: "دعاء بمعنى أتمنى له",
    meaningEn: "A blessing meaning 'may he…'",
    exampleAr: "عساه بخير.",
    exampleEn: "May he be well.",
    category: "slang",
    baseVotes: 96,
  },
  {
    id: "w-baachir",
    word: "باچر",
    pronunciation: "bāchir",
    meaningAr: "غداً",
    meaningEn: "Tomorrow",
    exampleAr: "نخلصه باچر إن شاء الله.",
    exampleEn: "We'll finish it tomorrow, God willing.",
    category: "dailyLife",
    baseVotes: 154,
  },
]
