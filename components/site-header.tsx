import { Link, useLocation } from "react-router-dom";
import { Languages, MapPin, Brain, BookOpen, User, Moon, Sun, Gem } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { useProgress } from "@/lib/progress-context";

export function SiteHeader() {
  const { t, toggleLang } = useLanguage();
  const { derived, ready } = useProgress();
  const pathname = useLocation().pathname;
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const userInfo = useSelector((state: any) => state.auth?.userInfo);

  useEffect(() => setMounted(true), []);

  const navItems = [
    { href: "/", label: t.navMap, icon: MapPin },
    { href: "/quiz", label: t.navQuiz, icon: Brain },
    { href: "/dictionary", label: t.navDictionary, icon: BookOpen },
    { href: "/profile", label: t.navProfile, icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="hidden md:flex shrink-0 items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <MapPin className="size-5" aria-hidden="true" />
          </div>
          <div className="leading-tight max-sm:hidden">
            <p className="text-base font-bold tracking-tight text-foreground">{t.brand}</p>
            <p className="text-xs text-muted-foreground">{t.brandSub}</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-border bg-card/70 p-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            const isProfile = item.href === "/profile";
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:text-sm",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}>
                <Icon className="size-5" aria-hidden="true" />

                <span className="">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div
            className="hidden items-center gap-1.5 rounded-full border border-border bg-accent/20 px-3 py-1.5 text-sm font-bold text-accent-foreground md:flex"
            title={t.totalPoints}>
            <Gem className="size-6" aria-hidden="true" />
            {ready ? derived.totalPoints : 0}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="size-9 rounded-full bg-card"
            aria-label={t.themeToggle}>
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="size-4" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleLang}
            className="gap-2 rounded-full bg-card font-semibold">
            <Languages className="size-4" aria-hidden="true" />
            <span className="max-sm:hidden">{t.langToggle}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
