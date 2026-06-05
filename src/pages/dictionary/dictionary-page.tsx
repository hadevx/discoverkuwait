import { useMemo, useState, useEffect } from "react"
import { Search, TrendingUp, Clock } from "lucide-react"
import { useSelector } from "react-redux"
import { SiteHeader } from "@/components/site-header"
import { WordCard } from "@/components/word-card"
import { SubmitWordDialog } from "@/components/submit-word-dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useProgress } from "@/lib/progress-context"
import { useGetWordsQuery, useGetMySubmissionsQuery } from "@/src/redux/queries/wordsApi"
import { DIALECT_WORDS, WORD_CATEGORIES, type WordCategory, type DialectWord } from "@/lib/dictionary-data"

/** Map a backend Word document to the DialectWord shape the WordCard expects. */
function toDialectWord(w: any): DialectWord {
  return {
    id: w._id,
    word: w.kuwaitiWord,
    pronunciation: w.pronunciation || "",
    meaningAr: w.arabicMeaning,
    meaningEn: w.englishMeaning,
    exampleAr: w.example || "",
    exampleEn: "",
    category: w.category as WordCategory,
    baseVotes: w.likesCount ?? w.likes?.length ?? 0,
    submittedBy: w.user?.name,
  }
}

export function DictionaryPage() {
  const { t, tr } = useLanguage()
  const { state, reconcileApiVotes } = useProgress()
  const userInfo = useSelector((state: any) => state.auth.userInfo)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<WordCategory | "all">("all")

  // Fetch approved words from API
  const { data: apiWords = [] } = useGetWordsQuery(undefined)

  // Fetch the logged-in user's own submissions
  const { data: mySubmissions = [] } = useGetMySubmissionsQuery(undefined, {
    skip: !userInfo,
  })

  // Reconcile local votedWords with server's likedByMe on every fetch (logged-in only)
  useEffect(() => {
    if (!userInfo || !(apiWords as any[]).length) return
    reconcileApiVotes(
      (apiWords as any[]).map((w) => ({ wordId: w._id, voted: w.likedByMe ?? false }))
    )
  }, [apiWords, userInfo])

  // Merge static words + approved API words (de-dup by word text)
  const allWords = useMemo<DialectWord[]>(() => {
    const staticTexts = new Set(DIALECT_WORDS.map((w) => w.word))
    const apiConverted = (apiWords as any[])
      .filter((w) => !staticTexts.has(w.kuwaitiWord))
      .map(toDialectWord)
    return [...DIALECT_WORDS, ...apiConverted]
  }, [apiWords])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allWords.filter((w) => {
      const matchesCat = category === "all" || w.category === category
      const matchesQuery =
        !q ||
        w.word.includes(q) ||
        w.pronunciation.toLowerCase().includes(q) ||
        w.meaningAr.includes(q) ||
        w.meaningEn.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [query, category, allWords])

  const trending = useMemo(
    () => [...allWords].sort((a, b) => b.baseVotes - a.baseVotes).slice(0, 3),
    [allWords],
  )

  const trendingIds = new Set(trending.map((w) => w.id))

  // Submissions to show: API list when logged in, localStorage list when guest
  const pendingSubmissions = userInfo
    ? (mySubmissions as any[]).filter((w) => !w.isApproved)
    : state.submittedWords

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 sadu-pattern opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-balance text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {t.dictTitle}
            </h1>
            <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
              {t.dictSubtitle}
            </p>
            <SubmitWordDialog />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Search + filters */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="h-12 rounded-full bg-card text-base ltr:pl-10 rtl:pr-10"
              aria-label={t.searchPlaceholder}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
              {t.allCategories}
            </FilterChip>
            {WORD_CATEGORIES.map((c) => (
              <FilterChip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                {tr(c)}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Trending */}
        {category === "all" && !query && (
          <section className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <TrendingUp className="size-5 text-accent-foreground" aria-hidden="true" />
              {t.trending}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trending.map((w) => (
                <WordCard key={w.id} word={w} trending />
              ))}
            </div>
          </section>
        )}

        {/* Your submissions */}
        {pendingSubmissions.length > 0 && category === "all" && !query && (
          <section className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <Clock className="size-5 text-primary" aria-hidden="true" />
              {t.yourSubmissions}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(pendingSubmissions as any[]).map((w) => {
                const word = w.kuwaitiWord ?? w.word
                const ar = w.arabicMeaning ?? w.meaningAr
                const en = w.englishMeaning ?? w.meaningEn
                return (
                  <article
                    key={w._id ?? w.id}
                    className="flex flex-col rounded-2xl border border-dashed border-border bg-card/60 p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-extrabold text-foreground">{word}</h3>
                      <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                        {t.underReview}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-foreground">{ar}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">{en}</p>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {/* All / filtered results */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-foreground">
            {category === "all" && !query
              ? (tr({ ar: "كل الكلمات", en: "All words" }))
              : `${filtered.length} ${tr({ ar: "نتيجة", en: "results" })}`}
          </h2>
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
              {t.noResults}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((w) => (
                <WordCard key={w.id} word={w} trending={trendingIds.has(w.id)} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        {t.brand} · {t.brandSub}
      </footer>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
