"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/lib/language-context"
import { useProgress } from "@/lib/progress-context"
import { useSubmitWordMutation } from "@/src/redux/queries/wordsApi"
import { WORD_CATEGORIES, type WordCategory } from "@/lib/dictionary-data"

export function SubmitWordDialog() {
  const { t, tr } = useLanguage()
  const { submitWord } = useProgress()
  const userInfo = useSelector((state: any) => state.auth.userInfo)
  const [submitWordApi, { isLoading }] = useSubmitWordMutation()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    word: "",
    pronunciation: "",
    meaningAr: "",
    meaningEn: "",
    example: "",
    category: "slang" as WordCategory,
  })

  const valid = form.word.trim() && form.meaningAr.trim() && form.meaningEn.trim()

  function reset() {
    setForm({
      word: "",
      pronunciation: "",
      meaningAr: "",
      meaningEn: "",
      example: "",
      category: "slang",
    })
  }

  async function handleSubmit() {
    if (!valid) return

    if (userInfo) {
      // Logged in — send to API (lands in pending queue)
      try {
        await submitWordApi({
          kuwaitiWord: form.word.trim(),
          arabicMeaning: form.meaningAr.trim(),
          englishMeaning: form.meaningEn.trim(),
          example: form.example.trim(),
          category: form.category,
        }).unwrap()
        toast.success(t.wordSubmitted)
        reset()
        setOpen(false)
      } catch (err: any) {
        toast.error(err?.data?.message || t.toastFailedSubmitWord, { position: "top-center" })
      }
    } else {
      // Guest — save locally
      submitWord({ word: form.word, meaningAr: form.meaningAr, meaningEn: form.meaningEn })
      toast.success(t.wordSubmitted)
      reset()
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full font-bold">
          <Plus className="size-4" aria-hidden="true" />
          {t.submitWord}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle>{t.submitWordTitle}</DialogTitle>
          <DialogDescription>{t.submitWordDesc}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <Field label={t.wordField} required>
            <Input
              value={form.word}
              onChange={(e) => setForm({ ...form, word: e.target.value })}
              placeholder="..."
            />
          </Field>
          <Field label={t.pronunciationField}>
            <Input
              value={form.pronunciation}
              onChange={(e) => setForm({ ...form, pronunciation: e.target.value })}
              dir="ltr"
            />
          </Field>
          <Field label={t.meaningArField} required>
            <Input
              value={form.meaningAr}
              onChange={(e) => setForm({ ...form, meaningAr: e.target.value })}
            />
          </Field>
          <Field label={t.meaningEnField} required>
            <Input
              value={form.meaningEn}
              onChange={(e) => setForm({ ...form, meaningEn: e.target.value })}
              dir="ltr"
            />
          </Field>
          <Field label={t.exampleField}>
            <Textarea
              value={form.example}
              onChange={(e) => setForm({ ...form, example: e.target.value })}
              rows={2}
            />
          </Field>
          <Field label={t.categoryField}>
            <Select
              value={form.category}
              onValueChange={(v) => setForm({ ...form, category: v as WordCategory })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WORD_CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {tr(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full bg-background">
            {t.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={!valid || isLoading} className="rounded-full font-bold">
            {isLoading ? "..." : t.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  )
}
