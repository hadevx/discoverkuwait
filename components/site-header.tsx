import { Link, useLocation } from "react-router-dom";
import {
  Languages,
  MapPin,
  Brain,
  BookOpen,
  User,
  Moon,
  Sun,
  Gem,
  Menu,
  Images,
  Flame,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { useProgress } from "@/lib/progress-context";
import logo from "/logo2.png";

export function SiteHeader() {
  const { t, dir, toggleLang } = useLanguage();
  const { state, derived, ready } = useProgress();
  const pathname = useLocation().pathname;
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const userInfo = useSelector((state: any) => state.auth?.userInfo);

  useEffect(() => setMounted(true), []);

  const navItems = [
    { href: "/", label: t.navMap, icon: MapPin },
    { href: "/quiz", label: t.navQuiz, icon: Brain },
    { href: "/dictionary", label: t.navDictionary, icon: BookOpen },
    { href: "/forum", label: t.navForum, icon: Images },
    { href: "/profile", label: t.navProfile, icon: User },
  ];

  const ThemeButton = () => (
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
  );

  const LangButton = () => (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLang}
      className="gap-2 rounded-full bg-card font-semibold">
      <Languages className="size-4" aria-hidden="true" />
      <span>{t.langToggle}</span>
    </Button>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            {/* <MapPin className="size-4" aria-hidden="true" /> */}
            <img src={logo} alt="" className="rounded-md" />
          </div>
          <div className=" leading-tight sm:block">
            <p className="text-sm font-bold tracking-tight text-foreground">{t.brand}</p>
            <p className="text-xs text-muted-foreground">{t.brandSub}</p>
          </div>
        </Link>

        {/* Desktop nav pill */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-card/70 p-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}>
                <Icon className="size-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop right controls */}
        <div className="hidden md:flex shrink-0 items-center gap-2">
          {ready && state.streak > 0 && (
            <div
              className="flex items-center gap-1.5 rounded-full border border-orange-400/40 bg-orange-400/10 px-3 py-1.5 text-sm font-bold text-orange-500 dark:text-orange-400"
              title="Day streak">
              <Flame className="size-4" aria-hidden="true" />
              {state.streak}
            </div>
          )}
          <div
            className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-sm font-bold text-amber-600 dark:text-amber-400"
            title={t.totalPoints}>
            <Gem className="size-4" aria-hidden="true" />
            {ready ? derived.totalPoints : 0}
          </div>
          <ThemeButton />
          <LangButton />
        </div>

        {/* Mobile right controls */}
        <div className="flex md:hidden items-center gap-1.5">
          {ready && state.streak > 0 && (
            <div
              className="flex items-center gap-1 rounded-full border border-orange-400/40 bg-orange-400/10 px-2.5 py-1.5 text-xs font-bold text-orange-500 dark:text-orange-400"
              title="Day streak">
              <Flame className="size-3.5" aria-hidden="true" />
              {state.streak}
            </div>
          )}
          <div
            className="flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400"
            title={t.totalPoints}>
            <Gem className="size-3.5" aria-hidden="true" />
            {ready ? derived.totalPoints : 0}
          </div>
          <ThemeButton />

          {/* Hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-full bg-card"
                aria-label="Menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side={dir === "rtl" ? "right" : "left"} className="w-64 p-0" dir={dir}>
              {/* Sheet header */}
              <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <MapPin className="size-4" aria-hidden="true" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-bold tracking-tight text-foreground">{t.brand}</p>
                  <p className="text-xs text-muted-foreground">{t.brandSub}</p>
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1 px-3 py-4">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}>
                      <Icon className="size-5" aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Language toggle at bottom */}
              <div className="border-t border-border px-5 py-4">
                <LangButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
