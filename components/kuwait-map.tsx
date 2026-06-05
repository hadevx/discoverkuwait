"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { GOVERNORATES } from "@/lib/kuwait-data";
import { useLanguage } from "@/lib/language-context";

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
  isExplored: (id: string) => boolean;
};

export function KuwaitMap({ selectedId, onSelect, isExplored }: Props) {
  const { tr, t } = useLanguage();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full">
      <svg
        viewBox="30 80 500 490"
        className="h-auto w-full select-none"
        role="group"
        aria-label={t.navMap}>
        <defs>
          <linearGradient id="gulf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.07 215)" />
            <stop offset="100%" stopColor="oklch(0.72 0.1 220)" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="6"
              floodColor="oklch(0.3 0.04 230)"
              floodOpacity="0.18"
            />
          </filter>
        </defs>

        {/* Arabian Gulf backdrop */}
        <rect x="0" y="0" width="560" height="600" fill="url(#gulf)" opacity="0.18" rx="24" />

        {/* decorative waves on the gulf side */}
        {[440, 470, 500].map((x) => (
          <path
            key={x}
            d={`M ${x} 120 q 14 18 0 36 q -14 18 0 36`}
            fill="none"
            stroke="oklch(0.6 0.1 220)"
            strokeOpacity="0.25"
            strokeWidth="2"
          />
        ))}

        {/* islands */}
        <circle cx="500" cy="430" r="9" fill="oklch(0.8 0.06 80)" opacity="0.7" />
        <circle cx="520" cy="470" r="5" fill="oklch(0.8 0.06 80)" opacity="0.6" />

        {/* governorate regions */}
        {GOVERNORATES.map((g) => {
          const active = selectedId === g.id;
          const isHovered = hovered === g.id;
          const explored = isExplored(g.id);
          return (
            <g key={g.id}>
              <polygon
                points={g.shape}
                fill={active || isHovered ? g.colorActive : g.color}
                stroke="oklch(0.99 0.008 85)"
                strokeWidth={active ? 4 : 2.5}
                filter={active || isHovered ? "url(#soft)" : undefined}
                tabIndex={0}
                role="button"
                aria-pressed={active}
                aria-label={tr(g.name)}
                onClick={() => onSelect(g.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(g.id);
                  }
                }}
                onMouseEnter={() => setHovered(g.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer outline-none transition-[fill,transform] duration-200 focus-visible:stroke-foreground"
                style={{
                  transformOrigin: `${g.label.x}px ${g.label.y}px`,
                  transform: active || isHovered ? "scale(1.015)" : "scale(1)",
                }}
              />
              {/* explored badge */}
              {explored && (
                <g transform={`translate(${g.label.x}, ${g.label.y - 26})`} pointerEvents="none">
                  <circle r="11" fill="oklch(0.99 0.008 85)" />
                  <circle r="11" fill="oklch(0.55 0.13 150)" opacity="0.18" />
                  <foreignObject x="-7" y="-7" width="14" height="14">
                    <Check className="size-3.5 text-[oklch(0.5_0.14_150)]" strokeWidth={3} />
                  </foreignObject>
                </g>
              )}
              {/* label */}
              <text
                x={g.label.x}
                y={g.label.y + (explored ? 4 : 0)}
                textAnchor="middle"
                pointerEvents="none"
                className="fill-[oklch(0.22_0.03_240)] text-[15px] sm:text-[15px] font-extrabold"
                style={{ fontFamily: "var(--font-cairo)" }}>
                {tr(g.name)}
              </text>
            </g>
          );
        })}

        {/* compass */}
        <g transform="translate(56, 545)" pointerEvents="none" opacity="0.7">
          <circle r="18" fill="none" stroke="oklch(0.52 0.03 230)" strokeWidth="1.5" />
          <path d="M 0 -13 L 5 4 L 0 0 L -5 4 Z" fill="oklch(0.57 0.13 28)" />
          <text
            y="-20"
            textAnchor="middle"
            className="fill-[oklch(0.4_0.03_230)] text-[10px] font-bold">
            N
          </text>
        </g>
      </svg>

      <p className="mt-2 text-center text-xs font-medium text-muted-foreground">{t.tapHint}</p>
    </div>
  );
}
