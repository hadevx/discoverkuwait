import { useState, useEffect } from "react";
import {
  Footprints,
  Map as MapIcon,
  Brain,
  Sparkles,
  Flame,
  BookMarked,
  ThumbsUp,
  Crown,
  Gem,
  Compass,
  Lock,
  LogIn,
  UserPlus,
  LogOut,
  CheckCircle2,
  Circle,
  Camera,
  X,
  Loader2,
  Pencil,
  Check,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/lib/language-context";
import { useProgress, BADGES } from "@/lib/progress-context";
import { GOVERNORATES } from "@/lib/kuwait-data";
import { cn } from "@/lib/utils";
import { LoginModal } from "@/src/pages/auth/Login";
import { RegisterModal } from "@/src/pages/auth/RegisterModal";
import { logout, setUserInfo } from "@/src/redux/slices/authSlice";
import { useLogoutApiMutation, useUpdateUserMutation } from "@/src/redux/queries/userApi";

// All selectable avatars from /public/avatar/
const AVATARS = [1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18].map(
  (n) => `${n}.webp`
);

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

export function ProfilePage() {
  const { t, lang } = useLanguage();
  const { state, derived, resetAll } = useProgress();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutApiMutation();
  const [updateUser] = useUpdateUserMutation();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [allExams, setAllExams] = useState<any[]>([]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4001/api/quiz")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: any[]) => { if (Array.isArray(data)) setAllExams(data) })
      .catch(() => {})
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {}
    resetAll();
    dispatch(logout());
  };

  const handleAvatarChange = async (avatarPath: string) => {
    if (!userInfo) return;
    setSavingAvatar(true);
    try {
      const res = await updateUser({ avatar: avatarPath, name: userInfo.name, email: userInfo.email }).unwrap();
      // Merge response into existing userInfo so other fields (streak, etc.) are preserved
      dispatch(setUserInfo({ ...userInfo, ...res }));
      setShowAvatarPicker(false);
    } catch {}
    setSavingAvatar(false);
  };

  const nameLastUpdated = userInfo?.nameLastUpdated ? new Date(userInfo.nameLastUpdated) : null;
  const daysUntilNameChange = nameLastUpdated
    ? Math.ceil(7 - (Date.now() - nameLastUpdated.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const canChangeName = daysUntilNameChange <= 0;

  const handleNameSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === userInfo?.name) {
      setEditingName(false);
      return;
    }
    setSavingName(true);
    try {
      const res = await updateUser({ name: trimmed, avatar: userInfo?.avatar, email: userInfo?.email }).unwrap();
      dispatch(setUserInfo({ ...userInfo, ...res }));
      setEditingName(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t.toastFailedUpdateName, { position: "top-center" });
    }
    setSavingName(false);
  };

  const breakdown = [
    { label: t.fromExploring, value: derived.explorePoints, icon: Compass },
    { label: t.fromQuizzes, value: derived.quizPoints, icon: Brain },
    { label: t.fromContributions, value: derived.contributionPoints, icon: BookMarked },
    { label: t.fromVoting, value: derived.votePoints, icon: ThumbsUp },
  ];

  const stats = [
    { label: t.statExplored, value: `${state.exploredAreas.length}/${GOVERNORATES.length}` },
    { label: t.statQuizzes, value: state.quizGamesPlayed },
    { label: t.statWords, value: state.submittedWords.length },
    { label: t.statVotes, value: state.votedWords.length },
  ];

  const levelName = lang === "ar" ? derived.level.ar : derived.level.en;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={() => setRegisterOpen(true)}
      />
      <RegisterModal
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={() => setLoginOpen(true)}
      />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 sadu-pattern opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
          <h1 className="text-balance text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {t.profileTitle}
          </h1>

          {/* Guest prompt — shown when not logged in */}
          {!userInfo && (
            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-dashed border-border bg-secondary/30 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">{t.guestPromptTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.guestPromptDesc}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setLoginOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-secondary transition-colors">
                  <LogIn className="size-4" aria-hidden="true" />
                  {t.loginBtn}
                </button>
                <button
                  onClick={() => setRegisterOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  <UserPlus className="size-4" aria-hidden="true" />
                  {t.registerBtn}
                </button>
              </div>
            </div>
          )}

          {/* Logged-in user info */}
          {userInfo && (
            <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-4">
                {/* Avatar with edit button */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => setShowAvatarPicker(true)}
                    className="group relative block size-16 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Change avatar"
                  >
                    {userInfo.avatar ? (
                      <img
                        src={`/avatar/${userInfo.avatar}`}
                        alt={userInfo.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-primary text-primary-foreground text-xl font-extrabold uppercase">
                        {userInfo.name?.[0] ?? "U"}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="size-5 text-white" aria-hidden="true" />
                    </div>
                  </button>
                </div>

                <div>
                  {editingName ? (
                    <form onSubmit={handleNameSave} className="flex items-center gap-1.5">
                      <input
                        autoFocus
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        maxLength={40}
                        className="h-7 rounded-md border border-border bg-background px-2 text-sm font-bold text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary w-36"
                      />
                      <button
                        type="submit"
                        disabled={savingName}
                        className="flex items-center justify-center size-7 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      >
                        {savingName ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingName(false)}
                        className="flex items-center justify-center size-7 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <X className="size-3.5" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-foreground text-lg">{userInfo.name}</p>
                      <button
                        onClick={() => { setNameInput(userInfo.name); setEditingName(true); }}
                        disabled={!canChangeName}
                        title={canChangeName ? "Edit name" : `Available in ${daysUntilNameChange} day${daysUntilNameChange === 1 ? "" : "s"}`}
                        className="flex items-center justify-center size-5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                  {!canChangeName && !editingName && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {lang === "ar"
                        ? `يمكن تغيير الاسم بعد ${daysUntilNameChange} ${daysUntilNameChange === 1 ? "يوم" : "أيام"}`
                        : `Name change available in ${daysUntilNameChange} day${daysUntilNameChange === 1 ? "" : "s"}`}
                    </p>
                  )}
                  <button
                    onClick={() => setShowAvatarPicker(true)}
                    className="mt-1 text-xs text-primary hover:underline font-medium"
                  >
                    {lang === "ar" ? "تغيير الصورة الشخصية" : "Change avatar"}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <LogOut className="size-4" aria-hidden="true" />
                {t.logoutBtn}
              </button>
            </div>
          )}

          {/* Level card */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <Crown className="size-7" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.level} {derived.level.index + 1}
                  </p>
                  <p className="text-xl font-extrabold text-foreground">{levelName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-accent/20 px-4 py-2 text-lg font-extrabold text-accent-foreground">
                <Gem className="size-5" aria-hidden="true" />
                {derived.totalPoints}
                <span className="text-xs font-medium text-muted-foreground">{t.totalPoints}</span>
              </div>
            </div>

            <div className="mt-5">
              <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.round(derived.levelProgress * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                {derived.nextLevel
                  ? `${derived.nextLevel.min - derived.totalPoints} ${t.pointsLabel} ${t.nextLevel}`
                  : t.maxLevel}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Points breakdown */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-foreground">{t.pointsBreakdown}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {breakdown.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.label} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      {b.label}
                    </span>
                    <span className="text-base font-extrabold text-foreground">{b.value}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Achievements / stats */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-foreground">{t.achievements}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-secondary/40 p-4 text-center">
                  <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                  <p className="mt-1 text-xs font-medium leading-snug text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Badges */}
        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-foreground">{t.badges}</h2>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              {derived.unlockedBadges.length} / {BADGES.length} {t.badgesUnlocked}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {BADGES.map((badge) => {
              const unlocked = derived.unlockedBadges.includes(badge.id);
              const Icon = unlocked ? (BADGE_ICONS[badge.icon] ?? Sparkles) : Lock;
              return (
                <div
                  key={badge.id}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors",
                    unlocked
                      ? "border-accent/40 bg-accent/10"
                      : "border-border bg-secondary/30 opacity-70",
                  )}>
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full",
                      unlocked
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground",
                    )}>
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-bold text-foreground">
                    {lang === "ar" ? badge.ar : badge.en}
                  </p>
                  <p className="text-xs leading-snug text-muted-foreground">
                    {unlocked ? (lang === "ar" ? badge.descAr : badge.descEn) : t.locked}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Completed exams */}
        {allExams.length > 0 && (
          <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Brain className="size-5 text-primary" aria-hidden="true" />
                {lang === "ar" ? "الاختبارات" : "Quizzes"}
              </h2>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                {state.completedQuizzes.length} / {allExams.length}{" "}
                {lang === "ar" ? "مكتمل" : "completed"}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {allExams.map((exam) => {
                const done = state.completedQuizzes.includes(exam._id);
                const title = lang === "ar" ? exam.title?.ar : exam.title?.en;
                return (
                  <div
                    key={exam._id}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors",
                      done
                        ? "border-chart-3/40 bg-chart-3/5"
                        : "border-border bg-secondary/20",
                    )}>
                    <div className="flex items-center gap-3 min-w-0">
                      {done ? (
                        <CheckCircle2 className="size-5 shrink-0 text-chart-3" aria-hidden="true" />
                      ) : (
                        <Circle className="size-5 shrink-0 text-muted-foreground/40" aria-hidden="true" />
                      )}
                      <div className="min-w-0">
                        <p className={cn("text-sm font-semibold truncate", done ? "text-foreground" : "text-muted-foreground")}>
                          {title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {exam.questions?.length ?? 0}{" "}
                          {lang === "ar" ? "أسئلة" : "questions"}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold",
                      done
                        ? "bg-chart-3/15 text-chart-3"
                        : "bg-secondary text-muted-foreground",
                    )}>
                      {done
                        ? (lang === "ar" ? "مكتمل" : "Done")
                        : (lang === "ar" ? "لم يُكتمل" : "Not done")}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        {t.brand} · {t.brandSub}
      </footer>

      {/* Avatar picker modal */}
      {showAvatarPicker && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => !savingAvatar && setShowAvatarPicker(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="relative w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-foreground">
                  {lang === "ar" ? "اختر صورة شخصية" : "Choose your avatar"}
                </h2>
                <button
                  onClick={() => setShowAvatarPicker(false)}
                  disabled={savingAvatar}
                  className="rounded-full p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                >
                  <X className="size-4" />
                </button>
              </div>

              {savingAvatar && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                  <Loader2 className="size-4 animate-spin" />
                  {lang === "ar" ? "جاري الحفظ..." : "Saving..."}
                </div>
              )}

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {AVATARS.map((src) => {
                  const active = userInfo?.avatar === src;
                  return (
                    <button
                      key={src}
                      onClick={() => handleAvatarChange(src)}
                      disabled={savingAvatar}
                      className={cn(
                        "group relative rounded-full overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50",
                        active
                          ? "border-primary ring-2 ring-primary ring-offset-2 scale-105"
                          : "border-transparent hover:border-primary/50 hover:scale-105",
                      )}
                      aria-label={`Avatar ${src}`}
                    >
                      <img
                        src={`/avatar/${src}`}
                        alt=""
                        className="size-full object-cover aspect-square"
                      />
                      {active && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                          <CheckCircle2 className="size-5 text-primary drop-shadow" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
