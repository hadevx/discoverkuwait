import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Gem, ArrowLeft, Users, Trophy } from "lucide-react";
import { useSelector } from "react-redux";
import { SiteHeader } from "@/components/site-header";
import { Avatar, UserTrophyModal } from "@/components/leaderboard";
import { useLanguage } from "@/lib/language-context";
import { LEVELS } from "@/lib/progress-context";
import { useGetLeaderboardQuery } from "@/src/redux/queries/userApi";
import { cn } from "@/lib/utils";

const MEDALS = ["🥇", "🥈", "🥉"];

type UserEntry = {
  id: string;
  name: string;
  avatar: string | null;
  points: number;
  isMe: boolean;
};

function getLevel(points: number) {
  return [...LEVELS].reverse().find((l) => points >= l.min) ?? LEVELS[0];
}

function UserCard({
  entry,
  rank,
  onClick,
}: {
  entry: UserEntry;
  rank: number;
  onClick: () => void;
}) {
  const { lang } = useLanguage();
  const level = getLevel(entry.points);
  const isTop3 = rank <= 3;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 w-full",
        entry.isMe
          ? "border-primary/40 bg-primary/5 ring-2 ring-primary/20"
          : "border-border bg-card hover:border-primary/20",
      )}>
      {/* Rank badge */}
      <div className="absolute top-3 left-3">
        {isTop3 ? (
          <span className="text-lg leading-none select-none">{MEDALS[rank - 1]}</span>
        ) : (
          <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-[11px] font-extrabold text-muted-foreground">
            {rank}
          </span>
        )}
      </div>

      {/* "You" badge */}
      {entry.isMe && (
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-extrabold text-primary">
            {lang === "ar" ? "أنت" : "You"}
          </span>
        </div>
      )}

      {/* Avatar with medal ring for top 3 */}
      <div className="mt-2">
        {isTop3 ? (
          <div className={cn(
            "rounded-full p-0.75",
            rank === 1 && "bg-linear-to-br from-amber-300 via-yellow-400 to-amber-500 shadow-lg shadow-amber-400/40",
            rank === 2 && "bg-linear-to-br from-zinc-300 via-slate-300 to-zinc-400 shadow-lg shadow-zinc-400/30",
            rank === 3 && "bg-linear-to-br from-orange-300 via-amber-400 to-orange-500 shadow-lg shadow-orange-400/30",
          )}>
            <div className="rounded-full bg-background p-0.5">
              <Avatar name={entry.name} avatar={entry.avatar} size="lg" />
            </div>
          </div>
        ) : (
          <Avatar name={entry.name} avatar={entry.avatar} size="lg" />
        )}
      </div>

      {/* Name */}
      <div className="min-w-0 w-full">
        <p className={cn("truncate font-extrabold text-sm", entry.isMe ? "text-primary" : "text-foreground")}>
          {entry.name}
        </p>
      </div>

      {/* Level */}
      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
        {lang === "ar" ? level.ar : level.en}
      </span>

      {/* Points */}
      <div className={cn(
        "flex items-center gap-1 font-extrabold text-sm",
        isTop3
          ? rank === 1 ? "text-amber-500" : rank === 2 ? "text-zinc-400" : "text-orange-500"
          : "text-foreground",
      )}>
        <Gem className="size-3.5 shrink-0" aria-hidden="true" />
        {entry.points}
      </div>
    </button>
  );
}

export function UsersPage() {
  const { lang, dir } = useLanguage();
  const navigate = useNavigate();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{ entry: UserEntry; rank: number } | null>(null);

  const { data: apiEntries = [], isLoading } = useGetLeaderboardQuery(undefined);

  const ranked = useMemo(() => {
    const currentId = userInfo?._id;
    const all: UserEntry[] = (apiEntries as any[]).map((u) => ({
      id: u._id,
      name: u.name,
      avatar: u.avatar ?? null,
      points: u.totalPoints,
      isMe: !!(currentId && u._id === currentId),
    }));
    all.sort((a, b) => b.points - a.points);
    return all;
  }, [apiEntries, userInfo]);

  const filtered = useMemo(() => {
    if (!search.trim()) return ranked;
    const q = search.toLowerCase();
    return ranked.filter((u) => u.name.toLowerCase().includes(q));
  }, [ranked, search]);

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <SiteHeader />

      {/* Modal */}
      {selected && (
        <UserTrophyModal
          entry={selected.entry}
          rank={selected.rank}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 sadu-pattern opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                {lang === "ar" ? "جميع المستخدمين" : "All Users"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isLoading
                  ? "…"
                  : lang === "ar"
                    ? `${ranked.length} مستخدم مسجّل`
                    : `${ranked.length} registered users`}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "ابحث عن مستخدم..." : "Search users..."}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-secondary/50 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Users className="size-8" />
            </div>
            <p className="text-base font-semibold text-muted-foreground">
              {lang === "ar" ? "لا يوجد مستخدمون بهذا الاسم" : "No users found"}
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 podium row */}
            {!search.trim() && filtered.length >= 3 && (
              <div className="mb-6 grid grid-cols-3 gap-3 max-w-lg mx-auto">
                {/* Silver (2nd) — slightly shorter */}
                <div className="flex flex-col items-center">
                  <UserCard
                    entry={filtered[1]}
                    rank={2}
                    onClick={() => setSelected({ entry: filtered[1], rank: 2 })}
                  />
                </div>
                {/* Gold (1st) — tallest */}
                <div className="flex flex-col items-center -mt-4">
                  <UserCard
                    entry={filtered[0]}
                    rank={1}
                    onClick={() => setSelected({ entry: filtered[0], rank: 1 })}
                  />
                </div>
                {/* Bronze (3rd) — slightly shorter */}
                <div className="flex flex-col items-center">
                  <UserCard
                    entry={filtered[2]}
                    rank={3}
                    onClick={() => setSelected({ entry: filtered[2], rank: 3 })}
                  />
                </div>
              </div>
            )}

            {/* Divider */}
            {!search.trim() && filtered.length > 3 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-border" />
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Trophy className="size-3.5" />
                  {lang === "ar" ? "باقي المستخدمين" : "All participants"}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}

            {/* Remaining users grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {(search.trim() ? filtered : filtered.slice(3)).map((entry, i) => {
                const rank = search.trim()
                  ? ranked.findIndex((u) => u.id === entry.id) + 1
                  : i + 4;
                return (
                  <UserCard
                    key={entry.id}
                    entry={entry}
                    rank={rank}
                    onClick={() => setSelected({ entry, rank })}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
