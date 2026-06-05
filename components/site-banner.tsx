"use client";

import { useState } from "react";
// import { X } from "lucide-react";

type Props = {
  message: string;
  bgColor?: string;
  textColor?: string;
};

export function SiteBanner({ message, bgColor = "#18181b", textColor = "#ffffff" }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !message.trim()) return null;

  return (
    <div
      className="relative z-50 w-full px-4 py-2.5"
      style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 sm:px-6">
        {/* <Megaphone className="size-4 shrink-0 opacity-80" aria-hidden="true" /> */}
        <p className="flex-1 text-center text-sm font-medium">{message}</p>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-full p-1 transition-colors hover:bg-white/20"
          aria-label="Dismiss">
          {/* <X className="size-3.5" /> */}
        </button>
      </div>
    </div>
  );
}
