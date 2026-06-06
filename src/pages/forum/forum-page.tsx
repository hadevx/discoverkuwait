import { useState, useEffect, useRef, useCallback } from "react";
import {
  Heart, Trash2, ImagePlus, X, Loader2, Check, Images, Clock,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/lib/language-context";
import { useProgress } from "@/lib/progress-context";
import { cn } from "@/lib/utils";
import { LoginModal } from "@/src/pages/auth/Login";
import { RegisterModal } from "@/src/pages/auth/RegisterModal";

const API_BASE =
  import.meta.env.VITE_ENVIRONMENT === "development"
    ? import.meta.env.VITE_API_LOCALHOST
    : import.meta.env.VITE_API_URL;

type Author = { _id: string; name: string; avatar: string };
type Post = {
  _id: string;
  author: Author;
  imageUrl: string;
  caption: string;
  votes: string[];
  isApproved: boolean;
  createdAt: string;
};

function timeAgo(date: string, lang: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return lang === "ar" ? "الآن" : "just now";
  if (m < 60) return lang === "ar" ? `${m} د` : `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return lang === "ar" ? `${h} س` : `${h}h`;
  const d = Math.floor(h / 24);
  return lang === "ar" ? `${d} ي` : `${d}d`;
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
type LightboxProps = {
  posts: Post[];
  initialIndex: number;
  userId: string | null;
  onVote: (id: string) => void;
  onClose: () => void;
  lang: string;
};

function ImageLightbox({ posts, initialIndex, userId, onVote, onClose, lang }: LightboxProps) {
  const [idx, setIdx] = useState(initialIndex);
  const post = posts[idx];
  const hasVoted = userId ? post.votes.includes(userId) : false;
  const canPrev = idx > 0;
  const canNext = idx < posts.length - 1;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && canNext) setIdx((i) => i + 1);
      if (e.key === "ArrowLeft" && canPrev) setIdx((i) => i - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, canPrev, canNext]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="relative flex flex-col w-full max-w-2xl rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex size-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 backdrop-blur-sm transition-colors">
          <X className="size-4" />
        </button>

        {/* Counter */}
        {posts.length > 1 && (
          <div className="absolute top-3 left-3 z-20 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
            {idx + 1} / {posts.length}
          </div>
        )}

        {/* Image area */}
        <div className="relative flex items-center justify-center bg-black min-h-48 max-h-[65vh] overflow-hidden">
          <img
            key={post._id}
            src={post.imageUrl}
            alt={post.caption || ""}
            className="max-h-[65vh] max-w-full object-contain"
          />

          {/* Prev arrow */}
          {canPrev && (
            <button
              onClick={() => setIdx((i) => i - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm transition-colors">
              <ChevronLeft className="size-5" />
            </button>
          )}

          {/* Next arrow */}
          {canNext && (
            <button
              onClick={() => setIdx((i) => i + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm transition-colors">
              <ChevronRight className="size-5" />
            </button>
          )}
        </div>

        {/* Info panel */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-zinc-900">
          <div className="flex items-center gap-2.5 min-w-0">
            {post.author?.avatar ? (
              <img
                src={`/avatar/${post.author.avatar}`}
                alt={post.author.name}
                className="size-8 rounded-full object-cover shrink-0 ring-1 ring-white/20"
              />
            ) : (
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase ring-1 ring-white/20">
                {post.author?.name?.[0] ?? "?"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{post.author?.name}</p>
              {post.caption ? (
                <p className="text-xs text-white/50 truncate max-w-[240px]">{post.caption}</p>
              ) : (
                <p className="text-[11px] text-white/30">{timeAgo(post.createdAt, lang)}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {post.caption && (
              <span className="text-[11px] text-white/30">{timeAgo(post.createdAt, lang)}</span>
            )}
            <button
              onClick={() => onVote(post._id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-all",
                hasVoted
                  ? "bg-rose-500 text-white shadow-lg"
                  : "bg-white/10 text-white/80 hover:bg-rose-500 hover:text-white",
              )}>
              <Heart className={cn("size-4 transition-transform", hasVoted && "fill-white scale-110")} />
              {post.votes.length}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Post Card (uniform square grid) ────────────────────────────────────────
type PostCardProps = {
  post: Post;
  userId: string | null;
  onVote: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: () => void;
  lang: string;
};

function PostCard({ post, userId, onVote, onDelete, onClick, lang }: PostCardProps) {
  const hasVoted = userId ? post.votes.includes(userId) : false;
  const isOwn = userId === post.author?._id;
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-zinc-900 shadow-sm cursor-pointer aspect-square"
      onClick={onClick}>
      {/* Image */}
      <img
        src={post.imageUrl}
        alt={post.caption || ""}
        className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />

      {/* Bottom info — always visible */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-3 pt-10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {post.author?.avatar ? (
              <img
                src={`/avatar/${post.author.avatar}`}
                alt={post.author.name}
                className="size-6 rounded-full object-cover ring-1 ring-white/30 shrink-0"
              />
            ) : (
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase">
                {post.author?.name?.[0] ?? "?"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate leading-tight">{post.author?.name}</p>
              {post.caption && (
                <p className="text-white/55 text-[10px] truncate leading-tight">{post.caption}</p>
              )}
            </div>
          </div>

          {/* Vote button — stopPropagation so it doesn't open lightbox */}
          <button
            onClick={(e) => { e.stopPropagation(); onVote(post._id); }}
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-bold pointer-events-auto transition-all",
              hasVoted
                ? "bg-rose-500 text-white shadow-lg"
                : "bg-black/50 text-white/90 hover:bg-rose-500 backdrop-blur-sm",
            )}>
            <Heart className={cn("size-3.5 transition-transform", hasVoted && "fill-white scale-110")} />
            {post.votes.length}
          </button>
        </div>
      </div>

      {/* Delete — top-right on hover, stopPropagation */}
      {isOwn && (
        <div className="absolute top-2.5 right-2.5 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => { onDelete(post._id); setConfirmDelete(false); }}
                className="flex items-center gap-1 rounded-full bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 shadow-lg">
                <Check className="size-3" />
                {lang === "ar" ? "تأكيد" : "Confirm"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex size-6 items-center justify-center rounded-full bg-black/60 text-white">
                <X className="size-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-rose-500 transition-all backdrop-blur-sm">
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pending Post Card ────────────────────────────────────────────────────────
function PendingCard({ post, onDelete, lang }: { post: Post; onDelete: (id: string) => void; lang: string }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-xl shadow-sm aspect-square">
      <img
        src={post.imageUrl}
        alt={post.caption || ""}
        className="w-full h-full object-cover block grayscale-[30%]"
        loading="lazy"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Pending badge */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
        <Clock className="size-3" />
        {lang === "ar" ? "قيد المراجعة" : "Pending"}
      </div>

      {/* Delete — top-right */}
      <div className="absolute top-2.5 right-2.5" onClick={(e) => e.stopPropagation()}>
        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => { onDelete(post._id); setConfirmDelete(false); }}
              className="flex items-center gap-1 rounded-full bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 shadow-lg">
              <Check className="size-3" />
              {lang === "ar" ? "تأكيد" : "Confirm"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex size-6 items-center justify-center rounded-full bg-black/60 text-white">
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-rose-500 transition-all backdrop-blur-sm">
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>

      {/* Author name — bottom */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
        <p className="text-white text-xs font-semibold truncate">{post.author?.name}</p>
        {post.caption && (
          <p className="text-white/50 text-[10px] truncate">{post.caption}</p>
        )}
      </div>
    </div>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
type UploadModalProps = { onClose: () => void; onSuccess: (post: Post) => void; lang: string; t: any };

function UploadModal({ onClose, onSuccess, lang, t }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) { toast.error("Images only"); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("caption", caption.trim());

      const res = await fetch(`${API_BASE}/api/forum`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Upload failed");
      const post: Post = await res.json();
      onSuccess(post);
      onClose();
      toast.success(lang === "ar" ? "تم رفع الصورة! ستظهر بعد موافقة المشرف." : "Photo uploaded! It will appear after admin approval.", { duration: 5000 });
    } catch (err: any) {
      toast.error(err.message || t.toastErrorOccurred);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl animate-card-enter-3d" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-bold text-foreground">{t.sharePhoto}</h2>
          <button onClick={onClose} className="flex size-7 items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {preview ? (
            <div className="relative">
              <img src={preview} alt="preview" className="w-full rounded-xl object-cover max-h-72" />
              <button type="button" onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors">
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-secondary/30 py-12 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                <ImagePlus className="size-7" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  {lang === "ar" ? "اضغط أو اسحب صورة هنا" : "Click or drag an image here"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WEBP · max 10 MB</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          )}

          <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2.5">
            <Clock className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-snug">
              {lang === "ar"
                ? "ستخضع صورتك للمراجعة قبل نشرها للعموم."
                : "Your photo will be reviewed by an admin before it goes public."}
            </p>
          </div>

          <textarea
            placeholder={t.captionPlaceholder}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={2}
            maxLength={300}
            dir="auto"
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {loading ? (
              <><Loader2 className="size-4 animate-spin" />{t.posting}</>
            ) : (
              <><ImagePlus className="size-4" />{t.sharePhoto}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Forum Page ───────────────────────────────────────────────────────────────
export function ForumPage() {
  const { t, lang, dir } = useLanguage();
  const { recordActivity } = useProgress();
  const userInfo = useSelector((state: any) => state.auth?.userInfo);

  const [posts, setPosts] = useState<Post[]>([]);
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchPosts = useCallback(async (p: number, replace: boolean) => {
    p === 1 ? setLoading(true) : setLoadingMore(true);
    try {
      const res = await fetch(`${API_BASE}/api/forum?page=${p}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPosts((prev) => (replace ? data.posts : [...prev, ...data.posts]));
      setHasMore(data.page < data.pages);
    } catch {
      toast.error(t.toastErrorOccurred);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [t.toastErrorOccurred]);

  const fetchMyPending = useCallback(async () => {
    if (!userInfo) return;
    try {
      const res = await fetch(`${API_BASE}/api/forum/my-pending`, { credentials: "include" });
      if (res.ok) setPendingPosts(await res.json());
    } catch {}
  }, [userInfo]);

  useEffect(() => { fetchPosts(1, true); }, [fetchPosts]);
  useEffect(() => { fetchMyPending(); }, [fetchMyPending]);

  const handleVote = async (postId: string) => {
    if (!userInfo) {
      toast(t.loginToVote, { action: { label: t.loginBtn, onClick: () => setLoginOpen(true) } });
      return;
    }
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const voted = p.votes.includes(userInfo._id);
        return { ...p, votes: voted ? p.votes.filter((v) => v !== userInfo._id) : [...p.votes, userInfo._id] };
      }),
    );
    try {
      await fetch(`${API_BASE}/api/forum/${postId}/vote`, { method: "PATCH", credentials: "include" });
    } catch {
      fetchPosts(1, true);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/forum/${postId}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      if (lightboxIndex !== null) setLightboxIndex(null);
      toast.success(lang === "ar" ? "تم حذف الصورة" : "Post deleted");
    } catch {
      toast.error(t.toastErrorOccurred);
    }
  };

  const handleDeletePending = async (postId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/forum/${postId}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error();
      setPendingPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success(lang === "ar" ? "تم حذف الصورة" : "Post deleted");
    } catch {
      toast.error(t.toastErrorOccurred);
    }
  };

  const handleUploadSuccess = (post: Post) => {
    setPendingPosts((prev) => [post, ...prev]);
    recordActivity();
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <SiteHeader />

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onSwitchToRegister={() => setRegisterOpen(true)} />
      <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} onSwitchToLogin={() => setLoginOpen(true)} />

      {uploadOpen && (
        <UploadModal onClose={() => setUploadOpen(false)} onSuccess={handleUploadSuccess} lang={lang} t={t} />
      )}

      {lightboxIndex !== null && (
        <ImageLightbox
          posts={posts}
          initialIndex={lightboxIndex}
          userId={userInfo?._id ?? null}
          onVote={handleVote}
          onClose={() => setLightboxIndex(null)}
          lang={lang}
        />
      )}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 sadu-pattern opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Images className="size-3.5" aria-hidden="true" />
                {posts.length > 0 ? `${posts.length}+ ${lang === "ar" ? "صورة" : "photos"}` : ""}
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {t.forumTitle}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground max-w-md">{t.forumSubtitle}</p>
            </div>

            {userInfo ? (
              <button
                onClick={() => setUploadOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                <ImagePlus className="size-4" />
                {t.sharePhoto}
              </button>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <ImagePlus className="size-4" />
                {t.loginToPost}
              </button>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">

        {/* My pending posts */}
        {pendingPosts.length > 0 && (
          <section className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="size-4 text-amber-500" />
              <h2 className="text-sm font-bold text-foreground">
                {lang === "ar" ? "صوري قيد المراجعة" : "My pending photos"}
              </h2>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                {pendingPosts.length}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {pendingPosts.map((post) => (
                <PendingCard key={post._id} post={post} onDelete={handleDeletePending} lang={lang} />
              ))}
            </div>
            <div className="mt-6 border-b border-border" />
          </section>
        )}

        {/* Approved posts grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Images className="size-8" />
            </div>
            <p className="text-base font-semibold text-muted-foreground">{t.noForumPosts}</p>
            {userInfo && (
              <button
                onClick={() => setUploadOpen(true)}
                className="mt-1 flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                <ImagePlus className="size-4" />
                {t.sharePhoto}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {posts.map((post, i) => (
                <PostCard
                  key={post._id}
                  post={post}
                  userId={userInfo?._id ?? null}
                  onVote={handleVote}
                  onDelete={handleDelete}
                  onClick={() => setLightboxIndex(i)}
                  lang={lang}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => { const next = page + 1; setPage(next); fetchPosts(next, false); }}
                  disabled={loadingMore}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary disabled:opacity-50 transition-colors">
                  {loadingMore ? <Loader2 className="size-4 animate-spin" /> : null}
                  {lang === "ar" ? "تحميل المزيد" : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        {t.brand} · {t.brandSub}
      </footer>
    </div>
  );
}
