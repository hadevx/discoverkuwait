import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { KuwaitMap } from "@/components/kuwait-map";
import { GovernorateDetail } from "@/components/governorate-detail";
import { ProgressStats } from "@/components/progress-stats";
import { useLanguage } from "@/lib/language-context";
import { useProgress } from "@/lib/progress-context";
import { GOVERNORATES } from "@/lib/kuwait-data";

export function HomePage() {
  const { t } = useLanguage();
  const { isExplored, markExplored, resetAll, state, derived } = useProgress();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => GOVERNORATES.find((g) => g.id === selectedId) ?? null,
    [selectedId],
  );

  const explored = state.exploredAreas;
  const earnedPoints = derived.explorePoints;

  const scrollToMap = () => {
    document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 sadu-pattern opacity-40" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/40 to-background"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <span className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
            {t.heroKicker}
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            {t.heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.heroSubtitle}
          </p>
          <Button onClick={scrollToMap} size="lg" className="mt-7 gap-2 rounded-full font-bold">
            {t.heroCta}
            <ChevronDown className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </section>

      {/* Map + detail */}
      <main id="map" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-gradient-to-b from-card to-secondary/40 p-4 shadow-sm sm:p-6">
              <KuwaitMap selectedId={selectedId} onSelect={setSelectedId} isExplored={isExplored} />
            </div>
            <ProgressStats
              earnedPoints={earnedPoints}
              exploredCount={explored.length}
              onReset={() => {
                resetAll();
                setSelectedId(null);
              }}
            />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <GovernorateDetail
              governorate={selected}
              explored={selected ? isExplored(selected.id) : false}
              onMarkExplored={markExplored}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        {t.brand} · {t.brandSub}
      </footer>
    </div>
  );
}
