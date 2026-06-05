"use client";

import { useMemo } from "react";
import { Trophy, Gem } from "lucide-react";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { useProgress } from "@/lib/progress-context";
import { useGetLeaderboardQuery } from "@/src/redux/queries/userApi";

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

type Entry = {
  id?: string;
  name: string;
  avatar?: string | null;
  points: number;
  isMe: boolean;
};

function Avatar({
  name,
  avatar,
  size = "sm",
}: {
  name: string;
  avatar?: string | null;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "size-9" : "size-7";
  const text = size === "md" ? "text-sm" : "text-xs";

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

export function Leaderboard() {
  const { t } = useLanguage();
  const { derived } = useProgress();
  const userInfo = useSelector((state: any) => state.auth.userInfo);

  const { data: apiEntries = [], isLoading } = useGetLeaderboardQuery(undefined);
  const { ranked, myRank } = useMemo(() => {
    const currentId = userInfo?._id;

    // Build full sorted list with current user merged in
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

    // Always show top 10; if current user is outside top 10, append them separately
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
  // rest = ranks 4–10 (plus current user if outside top 10, shown as last row)
  const rest = ranked.slice(3);

  return (
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
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                  MEDAL_ROW[rank],
                  entry.isMe && "ring-2 ring-primary/40",
                )}>
                {/* Medal */}
                <span
                  className="text-xl leading-none shrink-0 select-none"
                  aria-label={`Rank ${rank}`}>
                  {MEDALS[i]}
                </span>

                {/* Avatar */}
                <Avatar name={entry.name} avatar={entry.avatar} size="md" />

                {/* Name */}
                <div className="flex flex-1 items-center gap-1.5 min-w-0">
                  <span className={cn(
                    "truncate text-sm font-bold",
                    entry.isMe ? "text-primary" : "text-foreground",
                  )}>
                    {entry.name}
                  </span>
                  {entry.isMe && (
                    <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-extrabold text-primary">
                      {t.you}
                    </span>
                  )}
                </div>

                {/* Points */}
                <span
                  className={cn(
                    "flex items-center gap-1 text-sm font-extrabold",
                    MEDAL_POINTS[rank] ?? "text-foreground",
                  )}>
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
            // If this entry is "me" appended outside top 10, use real rank; otherwise sequential
            const isOutsideTop10 = entry.isMe && i + 4 > 10;
            const rank = isOutsideTop10 ? (myRank ?? i + 4) : i + 4;
            return (
              <li
                key={entry.id ?? entry.name}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 transition-colors",
                  entry.isMe ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-secondary/50",
                  isOutsideTop10 && "mt-1 border-t border-dashed border-border pt-2",
                )}>
                {/* Rank number */}
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-extrabold text-muted-foreground">
                  {rank}
                </span>

                {/* Avatar */}
                <Avatar name={entry.name} avatar={entry.avatar} size="sm" />

                {/* Name */}
                <div className="flex flex-1 items-center gap-1.5 min-w-0">
                  <span className={cn(
                    "truncate text-sm font-semibold",
                    entry.isMe ? "text-primary" : "text-foreground",
                  )}>
                    {entry.name}
                  </span>
                  {entry.isMe && (
                    <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-extrabold text-primary">
                      {t.you}
                    </span>
                  )}
                </div>

                {/* Points */}
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
  );
}
