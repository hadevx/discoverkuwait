import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { KuwaitMap } from "@/components/kuwait-map";
import { SEO } from "@/src/components/seo";
import { GovernorateDetail } from "@/components/governorate-detail";
import { ProgressStats } from "@/components/progress-stats";
import { useLanguage } from "@/lib/language-context";
import { useProgress } from "@/lib/progress-context";
import { GOVERNORATES } from "@/lib/kuwait-data";

export function HomePage() {
  const { t, lang } = useLanguage();
  const { isExplored, markExplored, resetAll, state, derived } = useProgress();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const seoTitle =
    lang === "ar"
      ? "اكتشف الكويت — استكشف المحافظات الست"
      : "Discover Kuwait — Interactive Map & Cultural Journey";
  const seoDesc =
    lang === "ar"
      ? "رحلة تفاعلية عبر محافظات الكويت الست — استكشف المعالم والتاريخ واجمع نقاط الاستكشاف."
      : "An interactive journey through Kuwait's six governorates. Explore landmarks, history, and earn exploration points.";

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
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical="https://discoverkuwait.org/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": seoTitle,
          "description": seoDesc,
          "url": "https://discoverkuwait.org/",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": lang === "ar" ? "الرئيسية" : "Home",
                "item": "https://discoverkuwait.org/",
              },
            ],
          },
        }}
      />
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 sadu-pattern opacity-40" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/40 to-background"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <span className="animate-float inline-block rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
            {t.heroKicker}
          </span>
          <h1
            className="animate-fade-up-3d mx-auto mt-5 max-w-2xl text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl"
            style={{ animationDelay: "80ms" }}>
            {t.heroTitle}
          </h1>
          <p
            className="animate-fade-up-3d mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
            style={{ animationDelay: "190ms" }}>
            {t.heroSubtitle}
          </p>
          <Button
            onClick={scrollToMap}
            size="lg"
            className="animate-fade-up-3d mt-7 gap-2 rounded-full font-bold"
            style={{ animationDelay: "300ms" }}>
            {t.heroCta}
            <ChevronDown className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </section>

      {/* Map + detail */}
      <main id="map" className="mx-auto max-w-6xl scroll-mt-20 px-2 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Map — first on all sizes */}
          <div className="hover-lift-3d rounded-2xl border border-border bg-linear-to-b from-card to-secondary/40 p-2 shadow-sm sm:p-6">
            <KuwaitMap selectedId={selectedId} onSelect={setSelectedId} isExplored={isExplored} />
          </div>

          {/* GovernorateDetail — second on mobile, right column on lg */}
          <div className="order-2 lg:order-0 lg:row-span-2 lg:sticky lg:top-24 lg:self-start">
            <GovernorateDetail
              governorate={selected}
              explored={selected ? isExplored(selected.id) : false}
              onMarkExplored={markExplored}
            />
          </div>

          {/* ProgressStats — last on mobile, below map on lg */}
          <div className="order-3 lg:order-0">
            <ProgressStats
              earnedPoints={earnedPoints}
              exploredCount={explored.length}
              onReset={() => {
                resetAll();
                setSelectedId(null);
              }}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4">
          <p className="font-medium text-foreground">
            {t.brand} · {t.brandSub}
          </p>

          <a
            href="https://www.instagram.com/discover.kt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-pink-500 transition-colors font-medium">
            @discover.kt
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          <p className="text-muted-foreground">
            © 2026 جميع الحقوق محفوظة — منصة تعلم اللهجة الكويتية
          </p>
        </div>
      </footer>
    </div>
  );
}
