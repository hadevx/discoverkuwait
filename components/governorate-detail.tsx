"use client"

import { Check, Landmark as LandmarkIcon, Lightbulb, MapPinned, MapPin, Ruler, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import type { Governorate } from "@/lib/kuwait-data"

type Props = {
  governorate: Governorate | null
  explored: boolean
  onMarkExplored: (id: string) => void
}

export function GovernorateDetail({ governorate, explored, onMarkExplored }: Props) {
  const { t, tr, lang } = useLanguage()

  if (!governorate) {
    return (
      <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">
          <MapPinned className="size-7" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-foreground">{t.selectPrompt}</h3>
        <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{t.selectPromptSub}</p>
      </div>
    )
  }

  const g = governorate

  return (
    <article
      key={g.id}
      className="animate-card-enter-3d flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      {/* header band colored by the region */}
      <div
        className="relative px-5 py-5"
        style={{ backgroundColor: g.colorActive }}
      >
        <div className="absolute inset-0 sadu-pattern opacity-30" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="text-[oklch(0.2_0.03_240)]">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
              {t.governoratesLabel}
            </p>
            <h2 className="mt-0.5 text-2xl font-extrabold leading-tight">{tr(g.name)}</h2>
            <p className="mt-1 text-sm font-medium opacity-90">{tr(g.tagline)}</p>
          </div>
          {explored && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-bold text-[oklch(0.45_0.13_150)]">
              <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              {t.explored}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <p className="text-sm leading-relaxed text-foreground/85">{tr(g.description)}</p>

        {/* quick stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <MiniStat
            icon={<Ruler className="size-3.5" aria-hidden="true" />}
            label={t.area}
            value={`${g.areaKm2.toLocaleString(lang === "ar" ? "ar-KW" : "en-US")} ${t.km2}`}
          />
          <MiniStat
            icon={<Users className="size-3.5" aria-hidden="true" />}
            label={t.population}
            value={g.population}
          />
          <MiniStat
            icon={<Sparkles className="size-3.5" aria-hidden="true" />}
            label={t.rewardPoints}
            value={`${g.points}`}
          />
        </div>

        {/* landmarks */}
        <div>
          <h3 className="mb-2.5 flex items-center gap-2 text-sm font-bold text-foreground">
            <LandmarkIcon className="size-4 text-primary" aria-hidden="true" />
            {t.landmarks}
          </h3>
          <ul className="flex flex-col gap-2">
            {g.landmarks.map((l) => (
              <li
                key={l.id}
                className="hover-3d rounded-xl border border-border bg-background/60 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">{tr(l.name)}</p>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                    {tr(l.category)}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {tr(l.description)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* facts */}
        <div className="flex flex-col gap-2">
          {g.facts.map((f, i) => (
            <div
              key={i}
              className="hover-3d flex items-start gap-2.5 rounded-xl bg-accent/20 p-3"
            >
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-accent-foreground" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold text-accent-foreground">{t.facts}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-foreground/80">{tr(f)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* notable areas */}
        {g.notableAreas.length > 0 && (
          <div>
            <h3 className="mb-2.5 flex items-center gap-2 text-sm font-bold text-foreground">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              {t.notableAreas}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {g.notableAreas.map((area) => (
                <span
                  key={area.en}
                  className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-semibold text-secondary-foreground"
                >
                  {tr(area)}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-1">
          <Button
            onClick={() => onMarkExplored(g.id)}
            disabled={explored}
            className="w-full gap-2 font-bold disabled:opacity-100"
            variant={explored ? "secondary" : "default"}
          >
            {explored ? (
              <>
                <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                {t.explored}
              </>
            ) : (
              <>
                <Sparkles className="size-4" aria-hidden="true" />
                {`${t.markExplored} · +${g.points}`}
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  )
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="hover-3d rounded-xl border border-border bg-background/60 p-2.5 text-center">
      <div className="mx-auto mb-1 flex size-6 items-center justify-center rounded-md bg-secondary text-primary">
        {icon}
      </div>
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xs font-bold text-foreground">{value}</p>
    </div>
  )
}
