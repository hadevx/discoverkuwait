import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SEO } from "@/src/components/seo";
import { Heart, Trash2, Send, Lock, Loader2, ChevronLeft, ChevronRight, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import { LoginModal } from "@/src/pages/auth/Login";
import { RegisterModal } from "@/src/pages/auth/RegisterModal";
import {
  useGetTopicByIdQuery,
  useLikeTopicMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from "@/src/redux/queries/forumApi";

// ─── Types ────────────────────────────────────────────────────────────────────
type Author = { _id: string; name: string; avatar: string };

type Comment = {
  _id: string;
  author: Author;
  text: string;
  createdAt: string;
};

type TopicDetail = {
  _id: string;
  author: Author;
  description: string;
  category: string;
  isClosed: boolean;
  likes: string[];
  comments: Comment[];
  createdAt: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "general",     en: "General",     ar: "عام"   },
  { value: "restaurants", en: "Restaurants", ar: "مطاعم" },
  { value: "cafes",       en: "Cafes",       ar: "مقاهي" },
] as const;

const CAT_COLORS: Record<string, string> = {
  general:     "bg-blue-500/15 text-blue-600",
  restaurants: "bg-orange-500/15 text-orange-600",
  cafes:       "bg-amber-500/15 text-amber-600",
};

function catLabel(value: string, lang: string) {
  const cat = CATEGORIES.find((c) => c.value === value);
  return cat ? (lang === "ar" ? cat.ar : cat.en) : value;
}

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

function Avatar({ author, size = "md" }: { author: Author; size?: "sm" | "md" | "lg" }) {
  const cls = size === "sm" ? "size-7" : size === "lg" ? "size-10" : "size-8";
  return author?.avatar ? (
    <img src={`/avatar/${author.avatar}`} alt={author.name}
      className={`${cls} rounded-full object-cover shrink-0`} />
  ) : (
    <div className={`${cls} shrink-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase`}>
      {author?.name?.[0] ?? "?"}
    </div>
  );
}

function renderCommentText(text: string) {
  return text.split(/(@\S+)/g).map((part, i) =>
    part.startsWith("@")
      ? <span key={i} className="font-semibold text-primary">{part}</span>
      : part,
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export function TopicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, lang, dir } = useLanguage();
  const userInfo = useSelector((state: any) => state.auth?.userInfo);

  const { data: topic, isLoading, isError } = useGetTopicByIdQuery(id!, { skip: !id });

  const seoTitle = useMemo(() => {
    if (!topic) return lang === "ar" ? "موضوع في المنتدى | اكتشف الكويت" : "Forum Topic | Discover Kuwait"
    const desc = (topic as TopicDetail).description.replace(/<[^>]*>/g, "").trim()
    const excerpt = desc.length > 60 ? desc.slice(0, 60) + "…" : desc
    return lang === "ar" ? `${excerpt} | اكتشف الكويت` : `${excerpt} | Discover Kuwait`
  }, [topic, lang])

  const seoDesc = useMemo(() => {
    if (!topic) return lang === "ar" ? "اطّلع على هذا الموضوع وشارك في النقاش." : "Read and join the discussion on this community topic."
    return (topic as TopicDetail).description.replace(/<[^>]*>/g, "").trim().slice(0, 160)
  }, [topic, lang])

  // Local like state for optimistic updates
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (!topic) return;
    setLiked(userInfo ? (topic as TopicDetail).likes.includes(userInfo._id) : false);
    setLikesCount((topic as TopicDetail).likes.length);
  }, [topic, userInfo]);

  const [commentText, setCommentText] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const [likeTopic] = useLikeTopicMutation();
  const [addComment, { isLoading: submitting }] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const handleLike = async () => {
    if (!userInfo) { setLoginOpen(true); return; }
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount((c) => (liked ? c - 1 : c + 1));
    try {
      await likeTopic({ topicId: id! }).unwrap();
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !userInfo) return;
    try {
      await addComment({ topicId: id!, comment: { text: commentText.trim() } }).unwrap();
      setCommentText("");
      setReplyTo(null);
    } catch (err: any) {
      toast.error(err?.data?.message || t.toastErrorOccurred);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({ topicId: id!, commentId }).unwrap();
    } catch {
      toast.error(t.toastErrorOccurred);
    }
  };

  const handleReply = (authorName: string) => {
    setReplyTo(authorName);
    setCommentText(`@${authorName} `);
    setTimeout(() => {
      commentInputRef.current?.focus();
      commentInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setCommentText("");
  };

  const topicData = topic as TopicDetail | undefined;

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={`https://discoverkuwait.org/forum/topics/${id}`}
        ogType="article"
      />
      <SiteHeader />

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onSwitchToRegister={() => { setLoginOpen(false); setRegisterOpen(true); }} />
      <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} onSwitchToLogin={() => { setRegisterOpen(false); setLoginOpen(true); }} />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">

        {/* Back button */}
        <button
          onClick={() => navigate("/forum")}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          {dir === "rtl"
            ? <ChevronRight className="size-4" />
            : <ChevronLeft className="size-4" />}
          {t.backToForum}
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError || !topicData ? (
          <div className="flex flex-col items-center gap-4 py-32 text-center">
            <p className="text-muted-foreground font-semibold">{t.toastErrorOccurred}</p>
            <button onClick={() => navigate("/forum")}
              className="text-sm text-primary underline">{t.backToForum}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-0 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">

            {/* Topic header */}
            <div className="px-5 py-5 border-b border-border">
              {/* Author row — always LTR so avatar stays left */}
              <div dir="ltr" className="flex items-center gap-2.5 mb-3">
                <Avatar author={topicData.author} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{topicData.author?.name}</p>
                  <p className="text-[11px] text-muted-foreground">{timeAgo(topicData.createdAt, lang)}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold", CAT_COLORS[topicData.category] ?? CAT_COLORS.general)}>
                    {catLabel(topicData.category, lang)}
                  </span>
                  {topicData.isClosed && (
                    <span className="flex items-center gap-1 rounded-full bg-zinc-500/15 text-zinc-500 px-2.5 py-0.5 text-[11px] font-bold">
                      <Lock className="size-3" /> {t.closed}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <p dir="auto" className="text-base text-foreground leading-relaxed whitespace-pre-wrap">{topicData.description}</p>

              {/* Likes + comments count */}
              <div dir="ltr" className="mt-4 flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all",
                    liked ? "bg-rose-500 text-white shadow-sm" : "border border-border text-muted-foreground hover:border-rose-400 hover:text-rose-500",
                  )}>
                  <Heart className={cn("size-4", liked && "fill-white")} />
                  {likesCount}
                </button>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MessageSquare className="size-4" />
                  {topicData.comments.length}
                </span>
              </div>
            </div>

            {/* Comments section */}
            <div className="border-t border-border">
              <div className="px-5 pt-4 pb-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {lang === "ar"
                    ? `${topicData.comments.length} تعليق`
                    : `${topicData.comments.length} comment${topicData.comments.length !== 1 ? "s" : ""}`}
                </p>
              </div>

              {topicData.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">{t.noComments}</p>
              ) : (
                <div className="divide-y divide-border">
                  {topicData.comments.map((c) => (
                    <div key={c._id} dir="ltr" className="flex gap-3 px-5 py-4 group/comment hover:bg-secondary/20 transition-colors">
                      <Avatar author={c.author} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-bold text-foreground leading-none">{c.author?.name}</span>
                          <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo(c.createdAt, lang)}</span>
                        </div>
                        <p dir="auto" className="text-sm text-foreground leading-relaxed whitespace-pre-wrap wrap-break-word">
                          {renderCommentText(c.text)}
                        </p>
                        {userInfo && !topicData.isClosed && (
                          <button
                            onClick={() => handleReply(c.author?.name || "")}
                            className="mt-1.5 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors">
                            {lang === "ar" ? "رد" : "Reply"}
                          </button>
                        )}
                      </div>
                      {userInfo && c.author?._id === userInfo._id && (
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          className="self-start opacity-0 group-hover/comment:opacity-100 flex size-7 items-center justify-center rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all shrink-0">
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comment input */}
            <div className="border-t border-border px-5 py-4">
              {topicData.isClosed ? (
                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
                  <Lock className="size-3.5" /> {t.topicClosedMsg}
                </p>
              ) : !userInfo ? (
                <button onClick={() => setLoginOpen(true)}
                  className="w-full rounded-xl border border-dashed border-border py-2.5 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  {t.loginToComment}
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  {replyTo && (
                    <div dir="ltr" className="flex items-center justify-between rounded-lg bg-primary/8 border border-primary/20 px-3 py-1.5">
                      <span className="text-xs text-primary font-semibold">
                        {lang === "ar" ? `رد على @${replyTo}` : `Replying to @${replyTo}`}
                      </span>
                      <button onClick={handleCancelReply}
                        className="flex size-4 items-center justify-center rounded-full text-primary/60 hover:text-primary transition-colors">
                        <X className="size-3" />
                      </button>
                    </div>
                  )}
                  <form onSubmit={handleAddComment} dir="ltr" className="flex gap-2">
                    <input
                      ref={commentInputRef}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={t.commentPlaceholder}
                      dir="auto"
                      maxLength={500}
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim() || submitting}
                      className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors shrink-0">
                      {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        {t.brand} · {t.brandSub}
      </footer>
    </div>
  );
}
