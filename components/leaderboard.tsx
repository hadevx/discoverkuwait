"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Gem,
  X,
  Lock,
  Sparkles,
  Footprints,
  Map as MapIcon,
  Brain,
  Flame,
  BookMarked,
  ThumbsUp,
  Crown,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { useProgress, BADGES, LEVELS, computeDerived, type ProgressState } from "@/lib/progress-context";
import { useGetLeaderboardQuery, useGetUserDetailsQuery } from "@/src/redux/queries/userApi";

const MEDALS = ["🥇", "🥈", "🥉"];

const MEDAL_ROW: Record<number, string> = {
  1: "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/70 dark:from-amber-950/30 dark:to-yellow-950/30 dark:border-amber-800/40",
  2: "bg-gradient-to-r from-zinc-50 to-slate-50 border border-zinc-200/70 dark:from-zinc-900/30 dark:border-zinc-700/40",
  3: "bg-gradient-to-r from-orange-50 to-amber-50/50 border border-orange-200/60 dark:from-orange-950/30 dark:border-orange-800/40",
};

const MEDAL_POINTS: Record<number, string> = {
  1: "text-amber-600 dark:text-amber-400",
  2: "text-zinc-500 dark:text-zinc-400",
  3: "text-orange-600 dark:text-orange-400",
};

const BADGE_ICONS: Record<string, LucideIcon> = {
  Footprints,
  Map: MapIcon,
  Brain,
  Sparkles,
  Flame,
  BookMarked,
  ThumbsUp,
  Crown,
};

type Entry = {
  id?: string;
  name: string;
  avatar?: string | null;
  points: number;
  isMe: boolean;
};

export function Avatar({
  name,
  avatar,
  size = "sm",
}: {
  name: string;
  avatar?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? "size-16" : size === "md" ? "size-9" : "size-7";
  const text = size === "lg" ? "text-2xl" : size === "md" ? "text-sm" : "text-xs";

  if (avatar) {
    return (
      <img
        src={`/avatar/${avatar}`}
        alt={name}
        className={cn(dim, "rounded-full object-cover shrink-0 ring-2 ring-background")}
      />
    );
  }
  return (
    <span
      className={cn(
        dim,
        text,
        "flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-extrabold uppercase text-primary",
      )}>
      {name?.[0] ?? "?"}
    </span>
  );
}

/* ── Trophy Modal ── */

export function UserTrophyModal({
  entry,
  rank,
  onClose,
}: {
  entry: Entry;
  rank: number;
  onClose: () => void;
}) {
  const { lang } = useLanguage();

  const { data: userData, isLoading } = useGetUserDetailsQuery(entry.id, {
    skip: !entry.id,
  });

  const { earnedBadges, level } = useMemo(() => {
    const level = [...LEVELS].reverse().find((l) => entry.points >= l.min) ?? LEVELS[0];

    if (!userData) return { earnedBadges: [], level };

    const ps: ProgressState = {
      exploredAreas: userData.exploredAreas ?? [],
      quizGamesPlayed: userData.quizGamesPlayed ?? 0,
      quizBestScore: userData.quizBestScore ?? 0,
      quizBestTotal: userData.quizBestTotal ?? 0,
      quizTotalCorrect: userData.quizTotalCorrect ?? 0,
      streak: userData.streak ?? 0,
      bestStreak: userData.bestStreak ?? 0,
      lastQuizDate: userData.lastQuizDate ?? null,
      votedWords: userData.votedWords ?? [],
      submittedWords: userData.submittedWords ?? [],
      completedQuizzes: userData.completedQuizzes ?? [],
      quizScores: userData.quizScores ?? {},
    };

    const derived = computeDerived(ps);
    const earnedBadges = BADGES.filter((b) => derived.unlockedBadges.includes(b.id));
    return { earnedBadges, level };
  }, [userData, entry.points]);

  const rankLabel = rank <= 3 ? MEDALS[rank - 1] : `#${rank}`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="animate-card-enter-3d relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          onClick={(e) => e.stopPropagation()}>

          {/* Header band */}
          <div className="relative flex items-center gap-4 bg-primary/10 px-5 py-5">
            <Avatar name={entry.name} avatar={entry.avatar} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-extrabold text-foreground">{entry.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xl leading-none">{rankLabel}</span>
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {lang === "ar" ? level.ar : level.en}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close">
              <X className="size-4" />
            </button>
          </div>

          {/* Points row */}
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <Gem className="size-4 text-accent-foreground" aria-hidden="true" />
            <span className="text-xl font-extrabold text-foreground">{entry.points}</span>
            <span className="text-xs text-muted-foreground">
              {lang === "ar" ? "نقطة" : "pts"}
            </span>
          </div>

          {/* Trophies */}
          <div className="p-5">
            <p className="mb-3 text-sm font-bold text-foreground">
              {lang === "ar" ? "الأوسمة" : "Trophies"}
              {!isLoading && (
                <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {earnedBadges.length} / {BADGES.length}
                </span>
              )}
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                {lang === "ar" ? "جاري التحميل..." : "Loading..."}
              </div>
            ) : earnedBadges.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
                <Trophy className="size-8 opacity-30" />
                <p className="text-sm">
                  {lang === "ar" ? "لا توجد أوسمة بعد" : "No trophies yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {earnedBadges.map((badge) => {
                  const Icon = BADGE_ICONS[badge.icon] ?? Sparkles;
                  return (
                    <div
                      key={badge.id}
                      className="hover-3d flex items-center gap-2.5 rounded-xl border border-accent/30 bg-accent/10 p-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-foreground">
                          {lang === "ar" ? badge.ar : badge.en}
                        </p>
                        <p className="mt-0.5 truncate text-[10px] leading-snug text-muted-foreground">
                          {lang === "ar" ? badge.descAr : badge.descEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Locked badges shown as count */}
            {!isLoading && earnedBadges.length > 0 && earnedBadges.length < BADGES.length && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="size-3" />
                {BADGES.length - earnedBadges.length}{" "}
                {lang === "ar" ? "وسام مقفل" : "trophies locked"}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Leaderboard ── */

export function Leaderboard() {
  const { t, lang } = useLanguage();
  const { derived } = useProgress();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const navigate = useNavigate();

  const [selected, setSelected] = useState<{ entry: Entry; rank: number } | null>(null);

  const { data: apiEntries = [], isLoading } = useGetLeaderboardQuery(undefined);
  const { ranked, myRank } = useMemo(() => {
    const currentId = userInfo?._id;

    const all: Entry[] = (apiEntries as any[]).map((u) => ({
      id: u._id,
      name: u.name,
      avatar: u.avatar ?? null,
      points: u.totalPoints,
      isMe: !!(currentId && u._id === currentId),
    }));

    const alreadyIn = all.some((e) => e.isMe);
    if (!alreadyIn) {
      all.push({
        id: currentId,
        name: userInfo?.name ?? t.you,
        avatar: userInfo?.avatar ?? null,
        points: derived.totalPoints,
        isMe: true,
      });
    } else {
      const idx = all.findIndex((e) => e.isMe);
      if (idx !== -1) {
        all[idx].points = derived.totalPoints;
        if (!all[idx].avatar && userInfo?.avatar) all[idx].avatar = userInfo.avatar;
      }
    }

    all.sort((a, b) => b.points - a.points);

    const top10 = all.slice(0, 10);
    const meIdx = all.findIndex((e) => e.isMe);
    const myRank = meIdx === -1 ? null : meIdx + 1;
    const meInTop10 = top10.some((e) => e.isMe);

    if (!meInTop10 && meIdx !== -1) {
      top10.push(all[meIdx]);
    }

    return { ranked: top10, myRank };
  }, [apiEntries, userInfo, derived.totalPoints, t.you]);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  return (
    <>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        {/* Header */}
        <div className="mb-5 flex items-center gap-2">
          <Trophy className="size-5 text-accent-foreground" aria-hidden="true" />
          <h2 className="text-base font-bold text-foreground">{t.leaderboard}</h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-secondary/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <ol className="flex flex-col gap-2">
            {/* ── Top 3 ── */}
            {top3.map((entry, i) => {
              const rank = i + 1;
              return (
                <li
                  key={entry.id ?? entry.name}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                    MEDAL_ROW[rank],
                    entry.isMe && "ring-2 ring-primary/40",
                  )}
                  onClick={() => setSelected({ entry, rank })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelected({ entry, rank }); }}>
                  <span className="text-xl leading-none shrink-0 select-none" aria-label={`Rank ${rank}`}>
                    {MEDALS[i]}
                  </span>
                  <Avatar name={entry.name} avatar={entry.avatar} size="md" />
                  <div className="flex flex-1 items-center gap-1.5 min-w-0">
                    <span className={cn("truncate text-sm font-bold", entry.isMe ? "text-primary" : "text-foreground")}>
                      {entry.name}
                    </span>
                    {entry.isMe && (
                      <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-extrabold text-primary">
                        {t.you}
                      </span>
                    )}
                  </div>
                  <span className={cn("flex items-center gap-1 text-sm font-extrabold", MEDAL_POINTS[rank] ?? "text-foreground")}>
                    <Gem className="size-3.5 shrink-0" aria-hidden="true" />
                    {entry.points}
                  </span>
                </li>
              );
            })}

            {/* ── Divider ── */}
            {rest.length > 0 && <li aria-hidden="true" className="my-1 h-px bg-border" />}

            {/* ── Remaining places ── */}
            {rest.map((entry, i) => {
              const isOutsideTop10 = entry.isMe && i + 4 > 10;
              const rank = isOutsideTop10 ? (myRank ?? i + 4) : i + 4;
              return (
                <li
                  key={entry.id ?? entry.name}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors",
                    entry.isMe ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-secondary/50",
                    isOutsideTop10 && "mt-1 border-t border-dashed border-border pt-2",
                  )}
                  onClick={() => setSelected({ entry, rank })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelected({ entry, rank }); }}>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-extrabold text-muted-foreground">
                    {rank}
                  </span>
                  <Avatar name={entry.name} avatar={entry.avatar} size="sm" />
                  <div className="flex flex-1 items-center gap-1.5 min-w-0">
                    <span className={cn("truncate text-sm font-semibold", entry.isMe ? "text-primary" : "text-foreground")}>
                      {entry.name}
                    </span>
                    {entry.isMe && (
                      <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-extrabold text-primary">
                        {t.you}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-sm font-bold text-foreground">
                    <Gem className="size-3.5 text-accent-foreground shrink-0" aria-hidden="true" />
                    {entry.points}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {/* Show All Users button */}
      <button
        onClick={() => navigate("/users")}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
        <Trophy className="size-4" aria-hidden="true" />
        {lang === "ar" ? "عرض جميع المستخدمين" : "Show All Users"}
      </button>

      {/* Trophy modal */}
      {selected && (
        <UserTrophyModal
          entry={selected.entry}
          rank={selected.rank}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
