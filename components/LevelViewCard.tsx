"use client";

import { X } from "lucide-react";
import { MAP_LEVELS } from "@/lib/map-levels";

/** Tarjeta de la vista desde un punto de un piso (pista, entrepiso...): dice dónde se está parado y deja volver al mapa. */
export default function LevelViewCard({ level, onBack }: { level: number; onBack: () => void }) {
  const lv = MAP_LEVELS[level];
  return (
    <div
      className="absolute inset-x-2 bottom-2 z-20 mx-auto flex max-w-md items-center gap-3 rounded-xl border bg-black/75 p-3 backdrop-blur"
      style={{ borderColor: `${lv.accent}66` }}
    >
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/50">Vista desde acá</span>
        <span className="block truncate font-bebas text-2xl tracking-wide text-[#F0F0F0]">
          {lv.label} · {lv.name}
        </span>
      </span>
      <button
        type="button"
        onClick={onBack}
        aria-label="Volver al mapa"
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/15 text-[#F0F0F0]/70 transition hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}
