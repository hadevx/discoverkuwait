import { Wrench } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function MaintenancePage() {
  const { lang } = useLanguage()
  const isAr = lang === "ar"

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-6">
        <Wrench className="size-10" aria-hidden="true" />
      </div>

      <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
        {isAr ? "الموقع قيد الصيانة" : "Under Maintenance"}
      </h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        {isAr
          ? "نحن نعمل على تحسين تجربتك. سيعود الموقع قريباً، شكراً لصبرك."
          : "We're making some improvements. The site will be back shortly — thank you for your patience."}
      </p>

      <div className="mt-8 flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-muted-foreground shadow-sm">
        <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
        {isAr ? "سيعود الموقع قريباً" : "We'll be back soon"}
      </div>
    </div>
  )
}
