"use client"

import { useState } from "react"
import { X, Megaphone } from "lucide-react"

export function SiteBanner({ message }: { message: string }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !message.trim()) return null

  return (
    <div className="relative z-50 w-full bg-primary px-4 py-2.5 text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <Megaphone className="size-4 shrink-0 opacity-80" aria-hidden="true" />
          <p className="text-sm font-medium truncate">{message}</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-full p-1 hover:bg-white/20 transition-colors"
          aria-label="Dismiss"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
