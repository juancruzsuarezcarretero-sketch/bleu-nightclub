"use client";

import { useState } from "react";
import { Check, ChevronUp, X } from "lucide-react";
import { MAP_SECTORS, getSectorPriceLabel, tramosCredito, type MapSectorId } from "@/lib/map-sectors";
import { useContent, useSectores } from "@/context/ContentContext";

interface Props {
  id: MapSectorId;
  onBack: () => void;
  onReserve: () => void;
}

/** Tarjeta que acompaña la vista desde un sector: nombre y precio siempre, y el detalle se despliega. */
export default function SectorViewCard({ id, onBack, onReserve }: Props) {
  const [open, setOpen] = useState(false);
  const config = useSectores()[id];
  const { mapa } = useContent();
  const accent = MAP_SECTORS[id].accent;

  return (
    <div
      className="absolute inset-x-2 bottom-2 z-20 mx-auto max-w-md rounded-xl border bg-black/75 p-3 backdrop-blur"
      style={{ borderColor: `${accent}66` }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/50">Vista desde el sector</span>
            <span className="block truncate font-bebas text-2xl tracking-wide text-[#F0F0F0]">{config.name}</span>
            <span className="block font-mono text-xs" style={{ color: accent }}>
              {getSectorPriceLabel(config)}
            </span>
          </span>
          <ChevronUp size={18} className={`flex-shrink-0 text-[#F0F0F0]/60 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
          <span className="sr-only">{open ? "Ocultar detalle" : "Ver detalle"}</span>
        </button>
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al mapa"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/15 text-[#F0F0F0]/70 transition hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
          <p className="font-mono text-xs text-[#F0F0F0]/70">{config.capacityLabel}</p>
          <ul className="space-y-1">
            {config.includes.map((item) => (
              <li key={item} className="flex items-center gap-2 font-mono text-xs text-[#F0F0F0]/80">
                <Check size={12} className="flex-shrink-0" style={{ color: accent }} />
                {item}
              </li>
            ))}
          </ul>
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/40">Crédito de consumo</p>
            {tramosCredito(mapa.creditoConsumo).map((t) => (
              <p key={t.texto} className="flex justify-between font-mono text-xs text-[#F0F0F0]/80">
                <span>{t.texto}</span>
                <span style={{ color: accent }}>{t.porcentaje}% consumible</span>
              </p>
            ))}
          </div>
          <button
            type="button"
            onClick={onReserve}
            className="w-full rounded-lg py-2.5 font-mono text-xs uppercase tracking-wider text-black transition hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            Reservar este sector
          </button>
        </div>
      )}
    </div>
  );
}
