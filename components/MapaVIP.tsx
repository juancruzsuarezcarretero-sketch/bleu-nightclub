"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { FadeIn } from "@/components/FadeIn";
import SectorReservationPanel from "@/components/SectorReservationPanel";
import { MAP_SECTORS, formatARS, type MapSectorId, type MapSectorSelection } from "@/lib/map-sectors";
import { MAP_LEVELS, levelOfSector } from "@/lib/map-levels";
import { useSectores } from "@/context/ContentContext";

const MapaScene3D = dynamic(() => import("@/components/MapaScene3D"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 animate-pulse rounded-xl bg-white/[0.03]" aria-hidden />,
});

const arrow = (d: string) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

let webglSoportado: boolean | undefined;
function hasWebGL() {
  if (webglSoportado === undefined) {
    try {
      const c = document.createElement("canvas");
      webglSoportado = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglSoportado = false;
    }
  }
  return webglSoportado;
}
const noSubscribe = () => () => {};

export default function MapaVIP() {
  const sectores = useSectores();
  const precio = (id: MapSectorId) => formatARS(sectores[id].pricePerPerson ?? sectores[id].fixedPrice ?? 0);
  const [selectedId, setSelectedId] = useState<MapSectorId | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const webgl = useSyncExternalStore(noSubscribe, hasWebGL, () => true);

  const focusLevel = useCallback((i: number | null) => {
    setFocus(i);
    if (i === null) setSelectedId(null);
    else setSelectedId((cur) => (cur && levelOfSector(cur) === i ? cur : null));
  }, []);

  const handleSelect = useCallback((id: MapSectorId) => {
    setSelectedId(id);
    setFocus(levelOfSector(id));
    setPanelOpen(true);
  }, []);

  const panelSelection: MapSectorSelection | null = selectedId ? { sectorId: selectedId } : null;
  const precios = Object.fromEntries((Object.keys(MAP_SECTORS) as MapSectorId[]).map((id) => [id, precio(id)])) as Record<MapSectorId, string>;

  return (
    <section id="reservas" className="relative overflow-hidden bg-[#050508]/80 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#F0F0F0]/40">Plano del local</p>
            <h2 className="mt-2 font-bebas text-4xl tracking-wider text-[#F0F0F0] md:text-5xl">Mapa VIP Interactivo</h2>
            <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-[#F0F0F0]/50">
              Girá el local, recorré los cuatro pisos y tocá un sector para ver su precio y reservar
            </p>
          </div>
        </FadeIn>

        {webgl && (
          <div className="relative mx-auto aspect-[4/5] max-h-[80vh] w-full max-w-4xl rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.10),transparent_65%)] md:aspect-[16/10]">
            <nav aria-label="Pisos" className="absolute left-1 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-2 lg:-left-14">
              <button
                type="button"
                aria-label="Piso siguiente"
                disabled={focus === null || focus >= MAP_LEVELS.length - 1}
                onClick={() => focus !== null && focusLevel(focus + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-[#F0F0F0]/70 backdrop-blur transition hover:text-white disabled:opacity-30"
              >
                {arrow("M5 15l7-7 7 7")}
              </button>
              {[...MAP_LEVELS].reverse().map((lv) => {
                const active = focus === lv.index;
                return (
                  <button
                    key={lv.index}
                    type="button"
                    aria-label={`${lv.label} · ${lv.name}`}
                    aria-pressed={active}
                    onClick={() => focusLevel(active ? null : lv.index)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border bg-black/60 font-bebas text-lg text-[#F0F0F0] backdrop-blur transition"
                    style={{ borderColor: active ? lv.accent : "rgba(255,255,255,0.15)", backgroundColor: active ? `${lv.accent}40` : undefined }}
                  >
                    {lv.index + 1}
                  </button>
                );
              })}
              <button
                type="button"
                aria-label="Piso anterior"
                disabled={focus === null || focus <= 0}
                onClick={() => focus !== null && focusLevel(focus - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-[#F0F0F0]/70 backdrop-blur transition hover:text-white disabled:opacity-30"
              >
                {arrow("M5 9l7 7 7-7")}
              </button>
            </nav>
            <MapaScene3D precios={precios} selectedId={selectedId} focus={focus} onSelect={handleSelect} onFocusLevel={focusLevel} />
            <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/35">
              Arrastrá de costado para girar
            </p>
          </div>
        )}

        {/* Sin WebGL no hay mapa 3D: la lista de sectores es la única forma de reservar */}
        {!webgl && (
        <FadeIn delay={0.2}>
          <div className="mx-auto mt-10 grid max-w-4xl gap-x-8 gap-y-5 sm:grid-cols-2">
            {[...MAP_LEVELS].reverse().map((lv) => (
              <div key={lv.index}>
                <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/50">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm border border-white/20" style={{ backgroundColor: lv.accent }} />
                  {lv.label} · {lv.name}
                </p>
                {lv.sectors.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => focusLevel(lv.index)}
                    className="rounded border border-white/10 px-2.5 py-1 font-mono text-xs text-[#F0F0F0]/70 transition hover:border-white/30 hover:text-white"
                  >
                    Ver pista
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {lv.sectors.map((id) => (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={selectedId === id}
                        onClick={() => handleSelect(id)}
                        className="rounded border px-2.5 py-1 font-mono text-xs text-[#F0F0F0]/80 transition hover:text-white"
                        style={{ borderColor: selectedId === id ? MAP_SECTORS[id].accent : "rgba(255,255,255,0.12)" }}
                      >
                        {MAP_SECTORS[id].name} · {precio(id)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeIn>
        )}
      </div>

      <SectorReservationPanel selection={panelSelection} isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
    </section>
  );
}
