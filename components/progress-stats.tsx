"use client"

import { Award, Compass, RotateCcw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { GOVERNORATES, TOTAL_POINTS } from "@/lib/kuwait-data"

type Props = {
  earnedPoints: number
  exploredCount: number
  onReset: () => void
}

export function ProgressStats({ earnedPoints, exploredCount, onReset }: Props) {
  const { t } = useLanguage()
  const total = GOVERNORATES.length
  const pct = Math.round((exploredCount / total) * 100)
  const complete = exploredCount === total

  return (
    <section
      aria-label={t.exploreProgress}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-foreground">{t.exploreProgress}</h2>
        {exploredCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {t.resetProgress}
          </Button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat
          icon={<Award className="size-4" aria-hidden="true" />}
          value={`${earnedPoints}`}
          sub={`/ ${TOTAL_POINTS} ${t.pointsLabel}`}
          tone="accent"
        />
        <Stat
          icon={<Compass className="size-4" aria-hidden="true" />}
          value={`${exploredCount}`}
          sub={`/ ${total} ${t.exploredLabel}`}
          tone="primary"
        />
      </div>

      <div className="mt-4">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {complete && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-accent/25 px-3 py-2 text-xs font-semibold text-accent-foreground">
          <Trophy className="size-4 shrink-0" aria-hidden="true" />
          {t.allExplored}
        </p>
      )}
    </section>
  )
}

function Stat({
  icon,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode
  value: string
  sub: string
  tone: "accent" | "primary"
}) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-3">
      <div
        className={`mb-1.5 flex size-7 items-center justify-center rounded-lg ${
          tone === "accent"
            ? "bg-accent/30 text-accent-foreground"
            : "bg-primary/15 text-primary"
        }`}
      >
        {icon}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold leading-none text-foreground">{value}</span>
        <span className="text-[11px] font-medium text-muted-foreground">{sub}</span>
      </div>
    </div>
  )
}
