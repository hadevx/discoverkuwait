import { useState, useEffect, useRef } from "react";
import { SEO } from "@/src/components/seo";
import {
  useGetForumPostsQuery,
  useGetMyPendingPostsQuery,
  useGetCompetitionStatusQuery,
  useVoteForumPostMutation,
  useDeleteForumPostMutation,
  useCreateForumPostMutation,
  useGetTopicsQuery,
  useCreateTopicMutation,
} from "@/src/redux/queries/forumApi";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Trash2,
  ImagePlus,
  X,
  Loader2,
  Check,
  Images,
  Clock,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Plus,
  Lock,
  Trophy,
  CheckCircle2,
  Pin,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/lib/language-context";
import { useProgress } from "@/lib/progress-context";
import { cn } from "@/lib/utils";
import { LoginModal } from "@/src/pages/auth/Login";
import { RegisterModal } from "@/src/pages/auth/RegisterModal";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "general", en: "General", ar: "عام" },
  { value: "restaurants", en: "Restaurants", ar: "مطاعم" },
  { value: "cafes", en: "Cafes", ar: "مقاهي" },
] as const;

const CAT_COLORS: Record<string, string> = {
  general: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  restaurants: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  cafes: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

function catLabel(value: string, lang: string) {
  const cat = CATEGORIES.find((c) => c.value === value);
  return cat ? (lang === "ar" ? cat.ar : cat.en) : value;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Author = { _id: string; name: string; avatar: string; isAdmin?: boolean };

type Post = {
  _id: string;
  author: Author;
  imageUrl: string;
  caption: string;
  votes: string[];
  isApproved: boolean;
  createdAt: string;
};

type Topic = {
  _id: string;
  author: Author;
  description: string;
  category: string;
  isClosed: boolean;
  likes: string[];
  commentCount: number;
  createdAt: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGES TAB COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Admin badge ──────────────────────────────────────────────────────────────
function AdminBadge() {
  return <img src="/premium.png" alt="admin" className="size-3.5 shrink-0 drop-shadow-sm" />;
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="relative flex flex-col w-full max-w-2xl rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex size-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 backdrop-blur-sm transition-colors">
          <X className="size-4" />
        </button>

        {posts.length > 1 && (
          <div className="absolute top-3 left-3 z-20 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
            {idx + 1} / {posts.length}
          </div>
        )}

        <div className="relative flex items-center justify-center bg-black min-h-48 max-h-[65vh] overflow-hidden">
          <img
            key={post._id}
            src={post.imageUrl}
            alt={post.caption || ""}
            className="max-h-[65vh] max-w-full object-contain"
          />
          {canPrev && (
            <button
              onClick={() => setIdx((i) => i - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm transition-colors">
              <ChevronLeft className="size-5" />
            </button>
          )}
          {canNext && (
            <button
              onClick={() => setIdx((i) => i + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm transition-colors">
              <ChevronRight className="size-5" />
            </button>
          )}
        </div>

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
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-white truncate">{post.author?.name}</p>
                {post.author?.isAdmin && <AdminBadge />}
              </div>
              {post.caption ? (
                <p className="text-xs text-white/50 truncate max-w-60">{post.caption}</p>
              ) : (
                <p className="text-[11px] text-white/30">{timeAgo(post.createdAt)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {post.caption && (
              <span className="text-[11px] text-white/30">{timeAgo(post.createdAt)}</span>
            )}
            <button
              onClick={() => onVote(post._id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-all",
                hasVoted
                  ? "bg-rose-500 text-white shadow-lg"
                  : "bg-white/10 text-white/80 hover:bg-rose-500 hover:text-white",
              )}>
              <Heart
                className={cn("size-4 transition-transform", hasVoted && "fill-white scale-110")}
              />
              {post.votes.length}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
type PostCardProps = {
  post: Post;
  userId: string | null;
  onVote: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: () => void;
  lang: string;
};

function PostCard({ post, userId, onVote, onDelete, onClick, lang: _lang }: PostCardProps) {
  const { t } = useLanguage();
  const hasVoted = userId ? post.votes.includes(userId) : false;
  const isOwn = userId === post.author?._id;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isAdmin = post.author?.isAdmin;
  console.log("test", post);
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl bg-zinc-900 shadow-sm cursor-pointer aspect-square",
        isAdmin && "ring-2 ring-amber-400/60 shadow-amber-400/10 shadow-lg",
      )}
      onClick={onClick}>
      <img
        src={post.imageUrl}
        alt={post.caption || ""}
        className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />

      {isAdmin && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-black text-white shadow">
          <img src="/premium.png" alt="admin" className="size-3" />
          Pinned
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/50 to-transparent px-3 pb-3 pt-10">
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
              <div className="flex items-center gap-1">
                <p className="text-white text-xs font-bold truncate leading-tight">
                  {post.author?.name}
                </p>
                {isAdmin && <AdminBadge />}
              </div>
              {post.caption && (
                <p className="text-white/55 text-[10px] truncate leading-tight">{post.caption}</p>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVote(post._id);
            }}
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-bold pointer-events-auto transition-all",
              hasVoted
                ? "bg-rose-500 text-white shadow-lg"
                : "bg-black/50 text-white/90 hover:bg-rose-500 backdrop-blur-sm",
            )}>
            <Heart
              className={cn("size-3.5 transition-transform", hasVoted && "fill-white scale-110")}
            />
            {post.votes.length}
          </button>
        </div>
      </div>

      {isOwn && (
        <div
          className="absolute top-2.5 right-2.5 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  onDelete(post._id);
                  setConfirmDelete(false);
                }}
                className="flex items-center gap-1 rounded-full bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 shadow-lg">
                <Check className="size-3" />
                {t.confirm}
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
function PendingCard({
  post,
  onDelete,
  lang: _lang,
}: {
  post: Post;
  onDelete: (id: string) => void;
  lang: string;
}) {
  const { t } = useLanguage();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-xl shadow-sm aspect-square">
      <img
        src={post.imageUrl}
        alt={post.caption || ""}
        className="w-full h-full object-cover block grayscale-30"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
        <Clock className="size-3" />
        {t.pending}
      </div>

      <div className="absolute top-2.5 right-2.5" onClick={(e) => e.stopPropagation()}>
        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onDelete(post._id);
                setConfirmDelete(false);
              }}
              className="flex items-center gap-1 rounded-full bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 shadow-lg">
              <Check className="size-3" />
              {t.confirm}
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

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
        <p className="text-white text-xs font-semibold truncate">{post.author?.name}</p>
        {post.caption && <p className="text-white/50 text-[10px] truncate">{post.caption}</p>}
      </div>
    </div>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
type UploadModalProps = {
  onClose: () => void;
  onSuccess: () => void;
  lang: string;
  t: any;
};

function UploadModal({ onClose, onSuccess, lang: _lang, t }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [createForumPost, { isLoading }] = useCreateForumPostMutation();

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      toast.error("Images only");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("caption", caption.trim());
      await createForumPost(fd).unwrap();
      onSuccess();
      onClose();
      toast.success(t.photoUploadSuccess, { duration: 5000 });
    } catch (err: any) {
      toast.error(err?.data?.message || t.toastErrorOccurred);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl animate-card-enter-3d"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-bold text-foreground">{t.sharePhoto}</h2>
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="preview"
                className="w-full rounded-xl object-cover max-h-72"
              />
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors">
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-secondary/30 py-12 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                <ImagePlus className="size-7" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{t.dragImageHere}</p>
                <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WEBP · max 10 MB</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          )}

          <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2.5">
            <Clock className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-snug">
              {t.photoReviewNotice}
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
            disabled={!file || isLoading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t.posting}
              </>
            ) : (
              <>
                <ImagePlus className="size-4" />
                {t.sharePhoto}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOPICS TAB COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Topic Card ───────────────────────────────────────────────────────────────
type TopicCardProps = {
  topic: Topic;
  userId: string | null;
  lang: string;
  onClick: () => void;
};

function TopicCard({ topic, userId, lang, onClick }: TopicCardProps) {
  const { t } = useLanguage();
  const liked = userId ? topic.likes.includes(userId) : false;
  const isAdmin = topic.author?.isAdmin;
  return (
    <button
      onClick={onClick}
      dir="ltr"
      className={cn(
        "w-full text-left flex gap-3 px-4 py-4 transition-colors duration-150",
        isAdmin
          ? "bg-amber-500/5 hover:bg-amber-500/10 border-l-2 border-l-amber-400"
          : "hover:bg-secondary/40",
      )}>
      <div className="shrink-0 pt-0.5">
        {topic.author?.avatar ? (
          <img
            src={`/avatar/${topic.author.avatar}`}
            alt={topic.author.name}
            className="size-15 rounded-md object-cover"
          />
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold uppercase">
            {topic.author?.name?.[0] ?? "?"}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-foreground">{topic.author?.name}</span>
            {isAdmin && <img src="/verify.png" className="size-4" alt="" />}
          </div>
          {isAdmin && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[11px] font-bold">
              <Pin className="size-3" />
              Pinned
            </span>
          )}
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground shrink-0">{timeAgo(topic.createdAt)}</span>
          {topic.isClosed && (
            <span className="flex items-center gap-1 rounded-full bg-zinc-500/15 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 text-[11px] font-bold">
              <Lock className="size-3" />
              {t.closed}
            </span>
          )}
        </div>

        <p dir="auto" className="text-sm text-foreground leading-relaxed line-clamp-3 mb-2">
          {topic.description.replace(/<[^>]*>/g, "")}
        </p>

        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
              CAT_COLORS[topic.category] ?? CAT_COLORS.general,
            )}>
            {catLabel(topic.category, lang)}
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1  text-muted-foreground">
              <MessageSquare className="size-4" />
              {topic.commentCount ?? 0}
            </span>
            <span
              className={cn(
                "flex items-center gap-1  font-medium",
                liked ? "text-rose-500" : "text-muted-foreground",
              )}>
              <Heart className={cn("size-4", liked && "fill-rose-500")} />
              {topic.likes.length}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Rich Text Editor ────────────────────────────────────────────────────────
const RICH_COLORS = [
  "#111827", "#ef4444", "#f97316", "#22c55e",
  "#3b82f6", "#a855f7", "#ec4899", "#6b7280",
];

const RICH_SIZES = [
  { label: "S", value: "12px", title: "Small" },
  { label: "M", value: "15px", title: "Normal" },
  { label: "L", value: "18px", title: "Large" },
  { label: "XL", value: "22px", title: "Extra Large" },
];

function RichEditor({ onChange, placeholder }: { onChange: (html: string) => void; placeholder: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const sync = () => {
    try {
      setBoldActive(document.queryCommandState("bold"));
      setItalicActive(document.queryCommandState("italic"));
    } catch {}
    setIsEmpty((editorRef.current?.textContent ?? "").trim() === "");
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const fmt = (e: React.MouseEvent, cmd: string, val?: string) => {
    e.preventDefault();
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    sync();
  };

  const applySize = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || sel.isCollapsed) return;
    editorRef.current?.focus();
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = size;
    try {
      range.surroundContents(span);
    } catch {
      const frag = range.extractContents();
      span.appendChild(frag);
      range.insertNode(span);
    }
    sel.removeAllRanges();
    onChange(editorRef.current?.innerHTML ?? "");
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-secondary/50 border-b border-border">
        <button
          type="button"
          onMouseDown={(e) => fmt(e, "bold")}
          title="Bold"
          className={cn(
            "flex size-7 items-center justify-center rounded-md text-sm font-black transition-colors",
            boldActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary",
          )}>
          B
        </button>
        <button
          type="button"
          onMouseDown={(e) => fmt(e, "italic")}
          title="Italic"
          className={cn(
            "flex size-7 items-center justify-center rounded-md text-sm italic font-bold transition-colors",
            italicActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary",
          )}>
          I
        </button>
        <div className="w-px h-4 bg-border mx-0.5 shrink-0" />
        {RICH_SIZES.map((sz) => (
          <button
            key={sz.value}
            type="button"
            onMouseDown={(e) => applySize(e, sz.value)}
            title={`${sz.title} — select text first`}
            className="flex size-7 items-center justify-center rounded-md text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            {sz.label}
          </button>
        ))}
        <div className="w-px h-4 bg-border mx-0.5 shrink-0" />
        {RICH_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onMouseDown={(e) => fmt(e, "foreColor", color)}
            title={color}
            style={{ backgroundColor: color }}
            className="w-4 h-4 rounded-full border border-white/20 hover:scale-110 transition-transform shrink-0"
          />
        ))}
      </div>
      <div className="relative">
        {isEmpty && (
          <span className="absolute top-2.5 left-4 text-sm text-muted-foreground pointer-events-none select-none">
            {placeholder}
          </span>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={sync}
          onKeyUp={sync}
          onMouseUp={sync}
          className="min-h-30 px-4 py-2.5 text-sm text-foreground outline-none"
          style={{ wordBreak: "break-word" }}
        />
      </div>
    </div>
  );
}

// ─── New Topic Modal ──────────────────────────────────────────────────────────
type NewTopicModalProps = {
  onClose: () => void;
  onSuccess: (topic: Topic) => void;
  lang: string;
  t: any;
  userId: string;
};

function NewTopicModal({ onClose, onSuccess, lang, t, userId: _userId }: NewTopicModalProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [createTopic, { isLoading: submitting }] = useCreateTopicMutation();

  const strippedDesc = description.replace(/<[^>]*>/g, "").trim();
  const canSubmit = strippedDesc.length > 0 && category.length > 0 && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      const topic = await createTopic({ description, category }).unwrap();
      onSuccess(topic as Topic);
      onClose();
      toast.success(t.topicCreated);
    } catch (err: any) {
      toast.error(err?.data?.message || t.toastErrorOccurred);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-bold text-foreground">{t.newTopic}</h2>
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <RichEditor onChange={setDescription} placeholder={t.topicPlaceholder} />

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold border transition-all",
                  category === cat.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground",
                )}>
                {lang === "ar" ? cat.ar : cat.en}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t.posting}
              </>
            ) : (
              <>
                <Plus className="size-4" />
                {t.postTopic}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORUM PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export function ForumPage() {
  const { t, lang, dir } = useLanguage();
  const { recordActivity } = useProgress();
  const userInfo = useSelector((state: any) => state.auth?.userInfo);
  const navigate = useNavigate();

  const [tab, setTab] = useState<"images" | "topics">("topics");
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // ── Competition ─────────────────────────────────────────────────────────────
  const { data: competition } = useGetCompetitionStatusQuery(undefined);

  // ── Forum posts (approved images) ────────────────────────────────────────
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsPage, setPostsPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: postsData, isFetching: postsFetching } = useGetForumPostsQuery(postsPage);
  console.log(postsData);
  const postsLoading = postsFetching && posts.length === 0;
  const postsLoadingMore = postsFetching && posts.length > 0;
  const postsHasMore = postsData ? postsPage < postsData.pages : false;

  useEffect(() => {
    if (!postsData?.posts) return;
    if (postsPage === 1) {
      setPosts(postsData.posts);
    } else {
      setPosts((prev) => [...prev, ...postsData.posts]);
    }
  }, [postsData, postsPage]);

  // ── Pending posts ─────────────────────────────────────────────────────────
  const { data: pendingPosts = [], refetch: refetchPending } = useGetMyPendingPostsQuery(
    undefined,
    { skip: !userInfo },
  );

  // ── Topics ────────────────────────────────────────────────────────────────
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsPage, setTopicsPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [newTopicOpen, setNewTopicOpen] = useState(false);

  const { data: topicsData, isFetching: topicsFetching } = useGetTopicsQuery(
    { pageNumber: topicsPage, category: categoryFilter },
    { skip: tab !== "topics" },
  );

  console.log(topicsData);
  const topicsLoading = topicsFetching && topics.length === 0;
  const topicsLoadingMore = topicsFetching && topics.length > 0;
  const topicsHasMore = topicsData ? topicsPage < topicsData.pages : false;

  useEffect(() => {
    if (!topicsData?.topics) return;
    if (topicsPage === 1) {
      setTopics(topicsData.topics);
    } else {
      setTopics((prev) => [...prev, ...topicsData.topics]);
    }
  }, [topicsData, topicsPage]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const [voteForumPost] = useVoteForumPostMutation();
  const [deleteForumPost] = useDeleteForumPostMutation();

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleVote = async (postId: string) => {
    if (!userInfo) {
      toast(t.loginToVote, { action: { label: t.loginBtn, onClick: () => setLoginOpen(true) } });
      return;
    }
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const voted = p.votes.includes(userInfo._id);
        return {
          ...p,
          votes: voted ? p.votes.filter((v) => v !== userInfo._id) : [...p.votes, userInfo._id],
        };
      }),
    );
    try {
      await voteForumPost(postId).unwrap();
    } catch {
      setPostsPage(1);
    }
  };

  const handleDelete = async (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    if (lightboxIndex !== null) setLightboxIndex(null);
    try {
      await deleteForumPost(postId).unwrap();
      toast.success(t.postDeleted);
    } catch {
      toast.error(t.toastErrorOccurred);
      setPostsPage(1);
    }
  };

  const handleDeletePending = async (postId: string) => {
    try {
      await deleteForumPost(postId).unwrap();
      refetchPending();
      toast.success(t.postDeleted);
    } catch {
      toast.error(t.toastErrorOccurred);
    }
  };

  const handleUploadSuccess = () => {
    recordActivity();
  };

  const handleCategoryChange = (cat: string) => {
    setTopics([]);
    setCategoryFilter(cat);
    setTopicsPage(1);
  };

  const handleNewTopicSuccess = (topic: Topic) => {
    setTopics((prev) => [topic, ...prev]);
    recordActivity();
  };

  const seoTitle =
    lang === "ar"
      ? "المنتدى والمسابقة | اكتشف الكويت"
      : "Forum & Photo Competition | Discover Kuwait";
  const seoDesc =
    lang === "ar"
      ? "شارك في مسابقة تصوير الكويت، اطّلع على مواضيع المجتمع وشارك بتجاربك وآرائك."
      : "Join Kuwait's photo competition, explore community topics, and share your experiences and opinions.";

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <SEO title={seoTitle} description={seoDesc} canonical="https://discoverkuwait.org/forum" />
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

      {uploadOpen && (
        <UploadModal
          onClose={() => setUploadOpen(false)}
          onSuccess={handleUploadSuccess}
          lang={lang}
          t={t}
        />
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

      {newTopicOpen && userInfo && (
        <NewTopicModal
          onClose={() => setNewTopicOpen(false)}
          onSuccess={handleNewTopicSuccess}
          lang={lang}
          t={t}
          userId={userInfo._id}
        />
      )}

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 sadu-pattern opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {t.forumTitle}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md">{t.forumSubtitle}</p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {/* ── Tab bar ── */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex gap-1 rounded-xl bg-secondary p-1">
            <button
              onClick={() => setTab("topics")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150",
                tab === "topics"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}>
              <MessageSquare className="size-4" />
              {t.topicsTab}
            </button>
            <button
              onClick={() => setTab("images")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150",
                tab === "images"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}>
              <Trophy className="size-4" />
              {t.imagesTab}
            </button>
          </div>

          {/* Action button */}
          {tab === "topics" ? (
            userInfo ? (
              <button
                onClick={() => setNewTopicOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                <Plus className="size-4" />
                {t.newTopic}
              </button>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <Plus className="size-4" />
                {t.loginToPost}
              </button>
            )
          ) : competition?.isOpen ? (
            userInfo ? (
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
                <Plus className="size-4" />
                {t.loginToPost}
              </button>
            )
          ) : null}
        </div>

        {/* ══ IMAGES TAB ══════════════════════════════════════════════════════ */}
        {tab === "images" && (
          <>
            {/* Competition status banner */}
            {competition && (
              <div
                className={cn(
                  "mb-6 flex items-center gap-3 rounded-2xl border px-5 py-4",
                  competition.isOpen
                    ? "bg-green-500/8 border-green-500/20"
                    : "bg-secondary border-border",
                )}>
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl",
                    competition.isOpen ? "bg-green-500/15" : "bg-secondary",
                  )}>
                  {competition.isOpen ? (
                    <CheckCircle2 className="size-5 text-green-600" />
                  ) : (
                    <Lock className="size-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-bold",
                      competition.isOpen ? "text-green-700 dark:text-green-400" : "text-foreground",
                    )}>
                    {competition.isOpen ? t.competitionOpen : t.competitionClosed}
                  </p>
                  {competition.isOpen && competition.endDate ? (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.competitionEnds}{" "}
                      {new Date(competition.endDate).toLocaleDateString(
                        lang === "ar" ? "ar-KW" : "en-GB",
                        { day: "numeric", month: "long", year: "numeric" },
                      )}
                    </p>
                  ) : !competition.isOpen ? (
                    <p className="text-xs text-muted-foreground mt-0.5">{t.competitionClosedMsg}</p>
                  ) : null}
                </div>
                <Trophy
                  className={cn(
                    "size-5 shrink-0",
                    competition.isOpen ? "text-amber-500" : "text-muted-foreground/40",
                  )}
                />
              </div>
            )}

            {(pendingPosts as Post[]).length > 0 && (
              <section className="mb-8">
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="size-4 text-amber-500" />
                  <h2 className="text-sm font-bold text-foreground">{t.competitionMyPending}</h2>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    {(pendingPosts as Post[]).length}
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {(pendingPosts as Post[]).map((post) => (
                    <PendingCard
                      key={post._id}
                      post={post}
                      onDelete={handleDeletePending}
                      lang={lang}
                    />
                  ))}
                </div>
                <div className="mt-6 border-b border-border" />
              </section>
            )}

            {postsLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                  <Images className="size-8" />
                </div>
                <p className="text-base font-semibold text-muted-foreground">{t.noForumPosts}</p>
                {userInfo && competition?.isOpen && (
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
                {postsHasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setPostsPage((p) => p + 1)}
                      disabled={postsLoadingMore}
                      className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary disabled:opacity-50 transition-colors">
                      {postsLoadingMore ? <Loader2 className="size-4 animate-spin" /> : null}
                      {t.loadMore}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ══ TOPICS TAB ══════════════════════════════════════════════════════ */}
        {tab === "topics" && (
          <>
            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              <button
                onClick={() => handleCategoryChange("")}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold border transition-all",
                  categoryFilter === ""
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground",
                )}>
                {t.allCategories}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold border transition-all",
                    categoryFilter === cat.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary hover:text-foreground",
                  )}>
                  {lang === "ar" ? cat.ar : cat.en}
                </button>
              ))}
            </div>

            {topicsLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </div>
            ) : topics.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                  <MessageSquare className="size-8" />
                </div>
                <p className="text-base font-semibold text-muted-foreground">{t.noTopics}</p>
                {userInfo && (
                  <button
                    onClick={() => setNewTopicOpen(true)}
                    className="mt-1 flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Plus className="size-4" />
                    {t.startTopic}
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
                  {topics.map((topic) => (
                    <TopicCard
                      key={topic._id}
                      topic={topic}
                      userId={userInfo?._id ?? null}
                      lang={lang}
                      onClick={() => navigate(`/forum/topics/${topic._id}`)}
                    />
                  ))}
                </div>
                {topicsHasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setTopicsPage((p) => p + 1)}
                      disabled={topicsLoadingMore}
                      className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary disabled:opacity-50 transition-colors">
                      {topicsLoadingMore ? <Loader2 className="size-4 animate-spin" /> : null}
                      {t.loadMore}
                    </button>
                  </div>
                )}
              </>
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
