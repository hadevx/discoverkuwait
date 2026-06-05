"use client"

import { Volume2, ThumbsUp, TrendingUp, UserRound } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { useProgress } from "@/lib/progress-context"
import { WORD_CATEGORIES, type DialectWord } from "@/lib/dictionary-data"
import { useLikeWordMutation } from "@/src/redux/queries/wordsApi"

// MongoDB ObjectIds are 24-char hex strings
const isApiWord = (id: string) => /^[a-f\d]{24}$/i.test(id)

type Props = {
  word: DialectWord
  trending?: boolean
}

export function WordCard({ word, trending }: Props) {
  const { t, tr } = useLanguage()
  const { hasVoted, toggleVote } = useProgress()
  const [likeWord] = useLikeWordMutation()

  const voted = hasVoted(word.id)
  const apiWord = isApiWord(word.id)

  // For API words the DB is the source of truth (baseVotes = Word.likes.length).
  // For static words (no DB record) we add the local toggle as optimistic UI.
  const voteCount = apiWord ? word.baseVotes : word.baseVotes + (voted ? 1 : 0)

  const category = WORD_CATEGORIES.find((c) => c.id === word.category)

  async function handleVote() {
    const wasVoted = hasVoted(word.id)
    toggleVote(word.id)  // optimistic — immediate button + count feedback
    if (apiWord) {
      try {
        const result = await likeWord(word.id).unwrap()
        // If server's new state equals wasVoted, something was out of sync — revert.
        if (result.liked === wasVoted) {
          toggleVote(word.id)
        }
      } catch {
        toggleVote(word.id)  // revert on failure (e.g. not logged in)
      }
    }
  }

  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(word.word)
    utter.lang = "ar-SA"
    utter.rate = 0.85
    window.speechSynthesis.speak(utter)
  }

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-extrabold text-foreground">{word.word}</h3>
            {trending && (
              <span className="flex items-center gap-1 rounded-full bg-accent/25 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                <TrendingUp className="size-3" aria-hidden="true" />
                {t.trending}
              </span>
            )}
          </div>
          <p className="mt-0.5 font-mono text-sm text-muted-foreground" dir="ltr">
            /{word.pronunciation}/
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={speak}
          className="size-10 shrink-0 rounded-full bg-background"
          aria-label={t.pronounce}
        >
          <Volume2 className="size-4 text-primary" aria-hidden="true" />
        </Button>
      </div>

      <dl className="mt-4 flex flex-col gap-3 text-sm">
        <div>
          <dt className="text-xs font-semibold text-muted-foreground">{t.meaningAr}</dt>
          <dd className="mt-0.5 text-foreground">{word.meaningAr}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-muted-foreground">{t.meaningEn}</dt>
          <dd className="mt-0.5 text-foreground" dir="ltr">{word.meaningEn}</dd>
        </div>
        <div className="rounded-xl bg-secondary/60 p-3">
          <dt className="text-xs font-semibold text-muted-foreground">{t.example}</dt>
          <dd className="mt-1 font-semibold text-foreground">{word.exampleAr}</dd>
          <dd className="mt-0.5 text-xs text-muted-foreground" dir="ltr">{word.exampleEn}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <div className="flex min-w-0 flex-col gap-1">
          {category && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary w-fit">
              {tr(category)}
            </span>
          )}
          {word.submittedBy && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <UserRound className="size-3 shrink-0" aria-hidden="true" />
              {word.submittedBy}
            </span>
          )}
        </div>
        <Button
          variant={voted ? "default" : "outline"}
          size="sm"
          onClick={handleVote}
          className={cn("gap-1.5 rounded-full font-bold shrink-0", !voted && "bg-background")}
        >
          <ThumbsUp className={cn("size-4", voted && "fill-current")} aria-hidden="true" />
          {voteCount}
        </Button>
      </div>
    </article>
  )
}
