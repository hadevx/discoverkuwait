"use client"

import { useEffect, useState } from "react"
import { Check, X, ChevronLeft, Brain, Flame, Trophy, RefreshCw, ArrowLeft, CheckCircle2, MessageSquare, Scroll, Globe, Star, Building2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useProgress, POINTS } from "@/lib/progress-context"
import { getQuizQuestions, type QuizQuestion } from "@/lib/quiz-data"

const API_BASE =
  import.meta.env.VITE_ENVIRONMENT === "development"
    ? import.meta.env.VITE_API_LOCALHOST
    : import.meta.env.VITE_API_URL

type Phase = "lobby" | "intro" | "playing" | "done"

const CATEGORY_LABEL = {
  dialect:    { ar: "لهجة",     en: "Dialect"    },
  history:    { ar: "تاريخ",    en: "History"    },
  geography:  { ar: "جغرافيا", en: "Geography"  },
  traditions: { ar: "عادات",   en: "Traditions" },
  landmarks:  { ar: "معالم",   en: "Landmarks"  },
} as const

// Pill colours (used in playing phase category chip)
const CATEGORY_COLORS: Record<string, string> = {
  dialect:    "bg-purple-100 text-purple-700",
  history:    "bg-amber-100  text-amber-700",
  geography:  "bg-blue-100   text-blue-700",
  traditions: "bg-green-100  text-green-700",
  landmarks:  "bg-rose-100   text-rose-700",
}

// Lucide icons per category
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  dialect:    MessageSquare,
  history:    Scroll,
  geography:  Globe,
  traditions: Star,
  landmarks:  Building2,
}

function mapExamQuestions(exam: any): QuizQuestion[] {
  return exam.questions.map((q: any) => ({
    id: q._id ?? String(Math.random()),
    category: q.category,
    question: q.question,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
  }))
}

export function QuizGame() {
  const { t, tr, lang } = useLanguage()
  const { recordQuiz, state, hasCompletedQuiz, getQuizScore } = useProgress()

  const [phase, setPhase] = useState<Phase>("lobby")
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  const [exams, setExams] = useState<any[]>([])
  const [loadingExams, setLoadingExams] = useState(true)
  const [selectedExam, setSelectedExam] = useState<any | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/quiz`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: any[]) => { if (Array.isArray(data)) setExams(data) })
      .catch(() => {})
      .finally(() => setLoadingExams(false))
  }, [])

  const questions: QuizQuestion[] = selectedExam
    ? mapExamQuestions(selectedExam)
    : getQuizQuestions(Number(new Date().toISOString().slice(0, 10).replace(/-/g, "")))

  const current = questions[index]
  const isLast = index === questions.length - 1

  function pickExam(exam: any) {
    setSelectedExam(exam)
    setPhase("intro")
  }

  function pickFallback() {
    setSelectedExam(null)
    setPhase("intro")
  }

  function start() {
    setIndex(0)
    setScore(0)
    setSelected(null)
    setPhase("playing")
  }

  function backToLobby() {
    setSelectedExam(null)
    setPhase("lobby")
  }

  function playAgain() {
    setIndex(0)
    setScore(0)
    setSelected(null)
    setPhase("playing")
  }

  function choose(i: number) {
    if (selected !== null) return
    setSelected(i)
    if (i === current.answer) setScore((s) => s + 1)
  }

  function next() {
    if (isLast) {
      recordQuiz(score, questions.length, selectedExam?._id)
      setPhase("done")
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
    }
  }

  function share() {
    const url = typeof window !== "undefined" ? window.location.href : ""
    navigator.clipboard?.writeText(url).catch(() => {})
    toast.success(t.linkCopied)
  }

  /* --------------------------------- Lobby -------------------------------- */
  if (phase === "lobby") {
    const fallbackCard = exams.length === 0 && !loadingExams
    const completedCount = exams.filter((e) => hasCompletedQuiz(e._id)).length

    return (
      <div className="w-full">
        {/* Header */}
        <div className="flex items-end justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">
              {lang === "ar" ? "الاختبارات" : "Quiz Exams"}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {lang === "ar" ? "اختر اختباراً وابدأ التحدي" : "Pick an exam and start the challenge"}
            </p>
          </div>
          {!loadingExams && exams.length > 0 && (
            <span className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground">
              {completedCount}/{exams.length} {lang === "ar" ? "مكتمل" : "done"}
            </span>
          )}
        </div>

        {loadingExams ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-xl bg-secondary shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-secondary" />
                    <div className="h-3 w-1/3 rounded bg-secondary" />
                    <div className="flex gap-1.5 pt-0.5">
                      <div className="h-5 w-14 rounded-full bg-secondary" />
                      <div className="h-5 w-12 rounded-full bg-secondary" />
                    </div>
                  </div>
                  <div className="h-8 w-16 rounded-full bg-secondary shrink-0" />
                </div>
              </div>
            ))}
          </div>
        ) : fallbackCard ? (
          <div className="flex flex-col gap-3">
            <ExamCard
              title={t.quizTitle}
              questionCount={8}
              categories={["history", "dialect", "geography"]}
              completed={false}
              lang={lang}
              onPlay={pickFallback}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {exams.map((exam) => {
              const categories = [...new Set(exam.questions?.map((q: any) => q.category) ?? [])] as string[]
              return (
                <ExamCard
                  key={exam._id}
                  title={lang === "ar" ? exam.title?.ar : exam.title?.en}
                  questionCount={exam.questions?.length ?? 0}
                  categories={categories}
                  completed={hasCompletedQuiz(exam._id)}
                  grade={getQuizScore(exam._id)}
                  lang={lang}
                  onPlay={() => pickExam(exam)}
                />
              )
            })}
          </div>
        )}
      </div>
    )
  }

  /* --------------------------------- Intro -------------------------------- */
  if (phase === "intro") {
    const examTitle = selectedExam
      ? (lang === "ar" ? selectedExam.title?.ar : selectedExam.title?.en)
      : t.quizTitle

    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Brain className="size-8" aria-hidden="true" />
        </div>
        <p className="mt-4 inline-block rounded-full border border-border bg-accent/20 px-3 py-1 text-xs font-bold text-accent-foreground">
          {t.dailyChallenge}
        </p>
        <h2 className="mt-3 text-2xl font-extrabold text-foreground">{examTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.quizSubtitle}</p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-sm font-bold text-secondary-foreground">
            <Flame className="size-4 text-accent-foreground" aria-hidden="true" />
            {state.streak} {t.days}
          </div>
          <div className="rounded-lg bg-secondary px-3 py-2 text-sm font-bold text-secondary-foreground">
            {questions.length} {lang === "ar" ? "أسئلة" : "questions"}
          </div>
        </div>

        <Button onClick={start} size="lg" className="mt-6 w-full gap-2 rounded-full font-bold">
          {t.startQuiz}
        </Button>
        <button
          onClick={backToLobby}
          className="mt-3 flex items-center justify-center gap-1.5 w-full text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-3" />
          {lang === "ar" ? "العودة إلى الاختبارات" : "Back to exams"}
        </button>
      </div>
    )
  }

  /* --------------------------------- Done --------------------------------- */
  if (phase === "done") {
    const earned = score * POINTS.perCorrectAnswer
    const pct = Math.round((score / questions.length) * 100)
    const examTitle = selectedExam
      ? (lang === "ar" ? selectedExam.title?.ar : selectedExam.title?.en)
      : t.quizTitle

    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Trophy className="size-8" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-foreground">{t.quizComplete}</h2>
        {examTitle && (
          <p className="mt-1 text-sm text-muted-foreground">{examTitle}</p>
        )}

        <div className="mx-auto mt-5 grid max-w-sm grid-cols-3 gap-3">
          <ResultStat label={t.yourScore} value={`${score}/${questions.length}`} />
          <ResultStat label={t.pointsEarned} value={`+${earned}`} tone="accent" />
          <ResultStat label={t.currentStreak} value={`${state.streak}`} />
        </div>

        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button onClick={playAgain} className="flex-1 gap-2 rounded-full font-bold">
            <RefreshCw className="size-4" aria-hidden="true" />
            {t.playAgain}
          </Button>
          <Button onClick={share} variant="outline" className="flex-1 gap-2 rounded-full bg-card font-bold">
            {t.shareChallenge}
          </Button>
        </div>
        <button
          onClick={backToLobby}
          className="mt-3 flex items-center justify-center gap-1.5 w-full text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-3" />
          {lang === "ar" ? "العودة إلى الاختبارات" : "Back to exams"}
        </button>
      </div>
    )
  }

  /* -------------------------------- Playing ------------------------------- */
  const answered = selected !== null
  const cat = CATEGORY_LABEL[current.category as keyof typeof CATEGORY_LABEL]

  return (
    <div>
      {/* progress header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className={cn(
          "rounded-full px-3 py-1 text-xs font-bold",
          CATEGORY_COLORS[current.category] ?? "bg-primary/10 text-primary",
        )}>
          {cat?.ar ?? current.category}
        </span>
        <span className="text-sm font-semibold text-muted-foreground">
          {t.question} {index + 1} {t.of} {questions.length}
        </span>
      </div>
      <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-balance text-lg font-bold leading-relaxed text-foreground sm:text-xl">
          {tr(current.question)}
        </h2>

        <div className="mt-5 flex flex-col gap-3">
          {current.options.map((opt, i) => {
            const isCorrect = i === current.answer
            const isChosen = i === selected
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={answered}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-start text-sm font-semibold transition-all",
                  !answered && "border-border bg-background hover:border-primary/50 hover:bg-secondary/50",
                  answered && isCorrect && "border-chart-3 bg-chart-3/15 text-foreground",
                  answered && isChosen && !isCorrect && "border-destructive bg-destructive/10 text-foreground",
                  answered && !isCorrect && !isChosen && "border-border bg-background opacity-60",
                )}
              >
                <span>{tr(opt)}</span>
                {answered && isCorrect && <Check className="size-5 shrink-0 text-chart-3" aria-hidden="true" />}
                {answered && isChosen && !isCorrect && (
                  <X className="size-5 shrink-0 text-destructive" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>

        {answered && (
          <div
            className={cn(
              "mt-4 rounded-xl p-3 text-sm",
              selected === current.answer ? "bg-chart-3/15 text-foreground" : "bg-destructive/10 text-foreground",
            )}
          >
            <p className="font-bold">
              {selected === current.answer ? t.correct : t.incorrect}
            </p>
            <p className="mt-1 leading-relaxed text-muted-foreground">{tr(current.explanation)}</p>
          </div>
        )}

        <Button
          onClick={next}
          disabled={!answered}
          className="mt-5 w-full gap-2 rounded-full font-bold"
        >
          {isLast ? t.seeResults : t.nextQuestion}
          <ChevronLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

/* ── Exam card in the lobby ── */
function ExamCard({
  title,
  questionCount,
  categories,
  completed,
  grade,
  lang,
  onPlay,
}: {
  title: string
  questionCount: number
  categories: string[]
  completed: boolean
  grade?: { score: number; total: number } | null
  lang: string
  onPlay: () => void
}) {
  const Icon = CATEGORY_ICONS[categories[0] ?? "history"] ?? Brain
  const pct = grade ? Math.round((grade.score / grade.total) * 100) : null
  const gradeColor = pct === null ? "" : pct >= 80 ? "text-chart-3" : pct >= 60 ? "text-amber-500" : "text-destructive"

  return (
    <div className={cn(
      "flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
      completed ? "border-chart-3/30" : "border-border",
    )}>
      {/* Icon */}
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="size-5 text-primary" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-foreground leading-snug truncate">{title}</h3>
          {completed && <CheckCircle2 className="size-4 shrink-0 text-chart-3" aria-hidden="true" />}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {questionCount} {lang === "ar" ? "سؤال" : "questions"}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {categories.slice(0, 4).map((cat) => {
            const label = CATEGORY_LABEL[cat as keyof typeof CATEGORY_LABEL]
            return (
              <span key={cat} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {lang === "ar" ? label?.ar : label?.en ?? cat}
              </span>
            )
          })}
          {grade && pct !== null && (
            <span className={cn("text-xs font-extrabold tabular-nums", gradeColor)}>
              {grade.score}/{grade.total} · {pct}%
            </span>
          )}
        </div>
      </div>

      {/* Action */}
      <Button
        onClick={onPlay}
        size="sm"
        variant={completed ? "outline" : "default"}
        className="shrink-0 rounded-full font-bold"
      >
        {completed
          ? (lang === "ar" ? "إعادة" : "Retry")
          : (lang === "ar" ? "ابدأ" : "Start")}
      </Button>
    </div>
  )
}

function ResultStat({ label, value, tone }: { label: string; value: string; tone?: "accent" }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-3">
      <p className={cn("text-xl font-extrabold", tone === "accent" ? "text-accent-foreground" : "text-foreground")}>
        {value}
      </p>
      <p className="mt-1 text-[11px] font-medium text-muted-foreground">{label}</p>
    </div>
  )
}
