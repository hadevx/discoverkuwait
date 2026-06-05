import { Flame, Award } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { QuizGame } from "@/components/quiz-game"
import { Leaderboard } from "@/components/leaderboard"
import { useLanguage } from "@/lib/language-context"
import { useProgress } from "@/lib/progress-context"

export function QuizPage() {
  const { t } = useLanguage()
  const { state } = useProgress()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 sadu-pattern opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 text-center sm:px-6 sm:py-12">
          <h1 className="text-balance text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t.quizTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
            {t.quizSubtitle}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <Badge icon={<Flame className="size-4" aria-hidden="true" />} label={t.currentStreak} value={`${state.streak} ${t.days}`} />
            <Badge icon={<Award className="size-4" aria-hidden="true" />} label={t.bestStreak} value={`${state.bestStreak} ${t.days}`} />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[600px_1fr]">
          <QuizGame />
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Leaderboard />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        {t.brand} · {t.brandSub}
      </footer>
    </div>
  )
}

function Badge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
      <span className="text-accent-foreground">{icon}</span>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-extrabold text-foreground">{value}</span>
    </div>
  )
}
