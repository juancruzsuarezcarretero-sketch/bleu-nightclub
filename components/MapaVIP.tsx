"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FadeIn } from "@/components/FadeIn";
import SectorReservationPanel from "@/components/SectorReservationPanel";
import {
  MAP_SECTORS,
  getSectorPriceLabel,
  type MapSectorId,
  type MapSectorSelection,
} from "@/lib/map-sectors";
import { MAP_LEVELS, levelOfSector } from "@/lib/map-levels";

gsap.registerPlugin(ScrollTrigger);

const GAP = 110; // separación en Z entre pisos (px) cuando el mapa está expandido
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Sillón (vista en planta) — tipo el del plano arquitectónico */
function Couch({ x, y, w = 40, h = 32, color }: { x: number; y: number; w?: number; h?: number; color: string }) {
  const s = w / 3;
  return (
    <g transform={`translate(${x}, ${y})`} fill="none" stroke={color} strokeWidth={1.4} opacity={0.95}>
      <rect x={0} y={0} width={w} height={h} rx={2} />
      <line x1={s} y1={4} x2={s} y2={h - 4} />
      <line x1={s * 2} y1={4} x2={s * 2} y2={h - 4} />
      <line x1={4} y1={h / 2} x2={w - 4} y2={h / 2} />
    </g>
  );
}

interface ReservableProps {
  id: MapSectorId;
  selected: boolean;
  hovered: boolean;
  onSelect: (id: MapSectorId) => void;
  onHover: (id: MapSectorId | null) => void;
  children: React.ReactNode;
}

function Reservable({ id, selected, hovered, onSelect, onHover, children }: ReservableProps) {
  const config = MAP_SECTORS[id];
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={config.name}
      className="cursor-pointer outline-none"
      onClick={() => onSelect(id)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(id); } }}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
      style={{
        filter: selected
          ? `drop-shadow(0 0 8px ${config.accent}) drop-shadow(0 0 16px ${config.accent}80)`
          : hovered
            ? `drop-shadow(0 0 5px ${config.accent}70)`
            : undefined,
        transition: "filter 0.2s",
        pointerEvents: "auto",
      }}
    >
      {children}
    </g>
  );
}

/* Losa de un piso: mismo viewBox para todos, así los pisos quedan alineados al apilarse */
function Slab({ label, accent, children }: { label: string; accent: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 780 980"
      className="block h-full w-full"
      style={{ strokeLinejoin: "round", strokeLinecap: "round", pointerEvents: "none" }}
      aria-label={label}
    >
      <rect x={4} y={4} width={772} height={972} rx={18} fill="rgba(6,6,12,0.55)" stroke={accent} strokeOpacity={0.45} strokeWidth={2} />
      <text x={28} y={38} fill={accent} fontSize={22} letterSpacing={4} style={{ fontFamily: "Bebas Neue, sans-serif" }}>
        {label.toUpperCase()}
      </text>
      {children}
    </svg>
  );
}

export default function MapaVIP() {
  const [selectedId, setSelectedId] = useState<MapSectorId | null>(null);
  const [hoveredId, setHoveredId] = useState<MapSectorId | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const sceneRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  // p: progreso de scroll (0 compacto → 1 expandido), f: foco en un piso (0 → 1), idx: piso enfocado
  const cam = useRef({ p: 0, f: 0, idx: 0 });

  const render = useCallback(() => {
    const { p, f, idx } = cam.current;
    gsap.set(rigRef.current, { rotateX: mix(mix(76, 58, p), 46, f), scale: mix(mix(0.72, 1, p), 0.92, f), y: p * (1 - f) * GAP * 0.6 });
    gsap.set(spinRef.current, { rotateZ: mix(mix(-6, -30, p), 0, f) });
    gsap.set(worldRef.current, { z: -idx * GAP * p * f });
    wrapRefs.current.forEach((el, i) => el && gsap.set(el, { z: i * GAP * p }));
  }, []);

  // Parallax de scroll: el mapa se despliega al entrar en pantalla
  useEffect(() => {
    if (prefersReducedMotion()) {
      cam.current.p = 1;
      render();
      return;
    }
    const st = ScrollTrigger.create({
      trigger: sceneRef.current,
      start: "top 90%",
      end: "center 55%",
      onUpdate: (s) =>
        gsap.to(cam.current, { p: s.progress, duration: 0.9, ease: "power2.out", overwrite: "auto", onUpdate: render }),
    });
    cam.current.p = st.progress;
    render();
    const tween = cam.current;
    return () => {
      st.kill();
      gsap.killTweensOf(tween);
    };
  }, [render]);

  // Zoom de cámara al piso elegido
  useEffect(() => {
    const d = prefersReducedMotion() ? 0 : 1.1;
    if (focus !== null) cam.current.idx = focus;
    gsap.to(cam.current, { f: focus === null ? 0 : 1, duration: d, ease: "power3.inOut", overwrite: "auto", onUpdate: render });
    innerRefs.current.forEach((el, i) => {
      if (el) gsap.to(el, { opacity: focus === null || focus === i ? 1 : 0.05, duration: d * 0.6 });
    });
  }, [focus, render]);

  const focusLevel = useCallback((i: number | null) => {
    setFocus(i);
    if (i === null) setSelectedId(null);
    else setSelectedId((cur) => (cur && levelOfSector(cur) === i ? cur : null));
  }, []);

  const handleSelect = useCallback((id: MapSectorId) => {
    setSelectedId(id);
    setFocus(levelOfSector(id));
  }, []);

  const panelSelection: MapSectorSelection | null = selectedId ? { sectorId: selectedId } : null;

  const fill = (id: MapSectorId) => {
    const c = MAP_SECTORS[id];
    return (selectedId === id || hoveredId === id) ? c.hoverFill : c.fill;
  };
  const stroke = (id: MapSectorId) => (selectedId === id ? "#FFFFFF" : MAP_SECTORS[id].stroke);
  const sw = (id: MapSectorId) => (selectedId === id ? 2.6 : 1.6);
  const R = (id: MapSectorId, children: React.ReactNode) => (
    <Reservable key={id} id={id} selected={selectedId === id} hovered={hoveredId === id} onSelect={handleSelect} onHover={setHoveredId}>
      {children}
    </Reservable>
  );

  const bebas = { fontFamily: "Bebas Neue, sans-serif" } as const;
  const mono = { fontFamily: "DM Mono, monospace" } as const;

  const boxVip: MapSectorId[] = ["box-1", "box-2", "box-3", "box-4", "box-5"];
  const ultraBoxes: { id: MapSectorId; n: string; y: number }[] = [
    { id: "ultra-box-1", n: "1", y: 350 },
    { id: "ultra-box-2", n: "2", y: 450 },
    { id: "ultra-box-3", n: "3", y: 550 },
  ];
  const UX = 505, UW = 108; // ultra boxes col

  const levelContent: React.ReactNode[] = [
    /* ════ PISO 1 ════ */
    <>
      <g role="button" tabIndex={0} aria-label="Pista principal" className="cursor-pointer outline-none" style={{ pointerEvents: "auto" }}
        onClick={() => focusLevel(0)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); focusLevel(0); } }}>
        <path d="M 245 350 L 470 350 L 525 405 L 525 655 L 245 655 Z" fill="#08080d" stroke="white" strokeWidth={1.6} strokeOpacity={0.9} />
        <text x={385} y={490} textAnchor="middle" fill="white" fillOpacity={0.9} fontSize={20} style={bebas} letterSpacing={3}>PISTA</text>
        <text x={385} y={514} textAnchor="middle" fill="white" fillOpacity={0.9} fontSize={20} style={bebas} letterSpacing={3}>PRINCIPAL</text>
        <text x={385} y={536} textAnchor="middle" fill="white" fillOpacity={0.7} fontSize={13} style={bebas} letterSpacing={2}>NIVEL 1</text>
      </g>
      <path d="M 245 705 L 510 705 L 510 800 L 245 800 Z" fill="#0a0a0e" stroke="white" strokeWidth={1.5} strokeOpacity={0.9} />
      <text x={377} y={757} textAnchor="middle" fill="white" fillOpacity={0.85} fontSize={15} style={bebas} letterSpacing={3}>CABINA</text>
      <rect x={625} y={745} width={45} height={150} fill="#0a0a0e" stroke="white" strokeWidth={1.5} strokeOpacity={0.9} />
      <text x={647} y={820} textAnchor="middle" fill="white" fillOpacity={0.7} fontSize={12} style={bebas} letterSpacing={2} transform="rotate(90, 647, 820)">BARRA</text>
    </>,

    /* ════ SEGUNDO PISO: ENTREPISO + GOLDEN ════ */
    <>
      <path d="M 150 50 L 340 50 L 340 165 L 95 165 L 150 50 Z" fill="#0a0a0e" stroke="white" strokeWidth={1.6} strokeOpacity={0.9} />
      <text x={240} y={100} textAnchor="middle" fill="white" fontSize={17} style={bebas} letterSpacing={2}>BARRA</text>
      <text x={240} y={122} textAnchor="middle" fill="white" fontSize={17} style={bebas} letterSpacing={2}>CAÑADA</text>
      {R("golden", <>
        <path d="M 345 50 L 665 50 L 665 490 L 615 490 L 615 165 L 345 165 Z" fill={fill("golden")} stroke={stroke("golden")} strokeWidth={sw("golden")} />
        <text x={560} y={92} textAnchor="middle" fill="white" fontSize={18} style={bebas} letterSpacing={3}>GOLDEN</text>
        <text x={560} y={112} textAnchor="middle" fill={MAP_SECTORS.golden.accent} fontSize={10} style={mono}>$35.000 / persona</text>
        <Couch x={360} y={62} w={42} color={MAP_SECTORS.golden.accent} />
        <Couch x={412} y={62} w={42} color={MAP_SECTORS.golden.accent} />
        <Couch x={622} y={200} w={38} color={MAP_SECTORS.golden.accent} />
        <Couch x={622} y={300} w={38} color={MAP_SECTORS.golden.accent} />
        <Couch x={622} y={400} w={38} color={MAP_SECTORS.golden.accent} />
      </>)}
      <text x={300} y={250} textAnchor="middle" fill="white" fillOpacity={0.85} fontSize={16} style={bebas} letterSpacing={3}>ENTREPISO</text>
      {[300, 310, 320, 330].map((yy, i) => (
        <line key={yy} x1={70 + i * 4} y1={yy} x2={200} y2={yy} stroke="white" strokeWidth={1.2} strokeOpacity={0.85} />
      ))}
    </>,

    /* ════ TERCER PISO: BOX AZULES + VIP NIVEL 3 ════ */
    <>
      {boxVip.map((id, i) => {
        const config = MAP_SECTORS[id];
        const num = id.replace("box-", "");
        const y = 350 + i * 66;
        const bx = 70, bw = 128, bh = 60;
        return R(id, <>
          <rect x={bx} y={y} width={bw} height={bh} fill={fill(id)} stroke={stroke(id)} strokeWidth={sw(id)} />
          <text x={bx + 34} y={y + 26} textAnchor="middle" fill="white" fontSize={13} style={bebas} letterSpacing={1.5}>BOX {num}</text>
          <Couch x={bx + bw - 50} y={y + 15} w={36} h={30} color={config.accent} />
          <text x={bx + 34} y={y + 48} textAnchor="middle" fill={config.accent} fontSize={7} style={mono}>$700.000</text>
        </>);
      })}
      {[358, 367, 376, 385].map((yy) => (
        <line key={yy} x1={205} y1={yy} x2={245} y2={yy} stroke="white" strokeWidth={1} strokeOpacity={0.7} />
      ))}
      {R("vip-n3-standing", <>
        <path d="M 70 655 L 195 655 L 245 705 L 245 905 L 70 905 Z" fill={fill("vip-n3-standing")} stroke={stroke("vip-n3-standing")} strokeWidth={sw("vip-n3-standing")} />
        <text x={140} y={800} textAnchor="middle" fill="white" fontSize={15} style={bebas} letterSpacing={2} transform="rotate(-90, 140, 800)">VIP NIVEL 3</text>
        <text x={180} y={888} textAnchor="middle" fill={MAP_SECTORS["vip-n3-standing"].accent} fontSize={7.5} style={mono}>$50.000 / persona</text>
      </>)}
    </>,

    /* ════ CUARTO PISO: BOX VIOLETAS + BACKSTAGE ════ */
    <>
      {ultraBoxes.map(({ id, n, y }) =>
        R(id, <>
          <rect x={UX} y={y} width={UW} height={92} fill={fill(id)} stroke={stroke(id)} strokeWidth={sw(id)} />
          <text x={UX + 32} y={y + 42} textAnchor="middle" fill="white" fontSize={13} style={bebas} letterSpacing={1.5}>BOX</text>
          <text x={UX + 58} y={y + 42} textAnchor="middle" fill="white" fontSize={13} style={bebas} letterSpacing={1.5}>{n}</text>
          <Couch x={UX + UW - 42} y={y + 26} w={36} h={40} color={MAP_SECTORS[id].accent} />
        </>)
      )}
      <text x={690} y={445} textAnchor="middle" fill="white" fillOpacity={0.6} fontSize={11} style={bebas} letterSpacing={2} transform="rotate(90, 690, 445)">PALCO 2</text>
      <text x={690} y={595} textAnchor="middle" fill="white" fillOpacity={0.6} fontSize={11} style={bebas} letterSpacing={2} transform="rotate(90, 690, 595)">PALCO 3</text>
      {R("ultra-standing", <>
        <path d="M 505 646 L 613 646 L 613 740 L 525 740 L 505 720 Z" fill={fill("ultra-standing")} stroke={stroke("ultra-standing")} strokeWidth={sw("ultra-standing")} />
        <text x={559} y={688} textAnchor="middle" fill="white" fontSize={10} style={bebas} letterSpacing={1}>ULTRA STANDING</text>
        <text x={559} y={702} textAnchor="middle" fill={MAP_SECTORS["ultra-standing"].accent} fontSize={7} style={mono}>$100.000 / p.</text>
      </>)}
      {[520, 530, 540].map((xx) => (
        <line key={xx} x1={xx} y1={745} x2={xx} y2={800} stroke="white" strokeWidth={1} strokeOpacity={0.7} />
      ))}
      {R("backstage", <>
        <path d="M 245 803 L 560 803 L 560 835 L 505 905 L 245 905 Z" fill={fill("backstage")} stroke={stroke("backstage")} strokeWidth={sw("backstage")} />
        <text x={400} y={850} textAnchor="middle" fill="white" fontSize={18} style={bebas} letterSpacing={2}>BACKSTAGE VIP</text>
        <text x={400} y={870} textAnchor="middle" fill="white" fillOpacity={0.7} fontSize={12} style={bebas} letterSpacing={2}>NIVEL 4</text>
        <text x={400} y={888} textAnchor="middle" fill={MAP_SECTORS.backstage.accent} fontSize={8} style={mono}>$1.500.000</text>
      </>)}
    </>,
  ];

  const level = focus !== null ? MAP_LEVELS[focus] : null;
  const sector = selectedId ? MAP_SECTORS[selectedId] : null;

  return (
    <section id="reservas" className="relative overflow-hidden bg-[#050508] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#F0F0F0]/40">Plano del local</p>
            <h2 className="mt-2 font-bebas text-4xl tracking-wider text-[#F0F0F0] md:text-5xl">Mapa VIP Interactivo</h2>
            <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-[#F0F0F0]/50">
              Recorré los cuatro pisos del local. Tocá un sector para ver su vista, precios y reservar
            </p>
          </div>
        </FadeIn>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Escena 3D */}
          <div
            ref={sceneRef}
            className="relative mx-auto aspect-[780/880] w-full max-w-[600px] rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.10),transparent_65%)]"
            style={{ perspective: "1800px" }}
          >
            <div ref={rigRef} className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]">
              <div ref={spinRef} className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]">
                <div ref={worldRef} className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]">
                  {MAP_LEVELS.map((lv, i) => (
                    <div
                      key={lv.index}
                      ref={(el) => { wrapRefs.current[i] = el; }}
                      className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]"
                    >
                      <div
                        ref={(el) => { innerRefs.current[i] = el; }}
                        className="pointer-events-none h-full w-full"
                        inert={focus !== null && focus !== i}
                      >
                        <Slab label={`${lv.label} · ${lv.name}`} accent={lv.accent}>{levelContent[i]}</Slab>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Selector de pisos + tarjeta de vista */}
          <aside className="space-y-3 lg:sticky lg:top-24">
            {[...MAP_LEVELS].reverse().map((lv) => {
              const active = focus === lv.index;
              return (
                <button
                  key={lv.index}
                  type="button"
                  onClick={() => focusLevel(active ? null : lv.index)}
                  aria-pressed={active}
                  className="group flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors"
                  style={{
                    borderColor: active ? lv.accent : "rgba(255,255,255,0.1)",
                    backgroundColor: active ? `${lv.accent}1f` : "transparent",
                  }}
                >
                  <span className="h-8 w-1 rounded-full" style={{ backgroundColor: lv.accent }} />
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#F0F0F0]/40">{lv.label}</span>
                    <span className="block font-bebas text-xl tracking-wider text-[#F0F0F0]">{lv.name}</span>
                  </span>
                </button>
              );
            })}

            {focus !== null && (
              <button
                type="button"
                onClick={() => focusLevel(null)}
                className="w-full rounded-lg border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/60 transition-colors hover:text-[#F0F0F0]"
              >
                Ver todos los pisos
              </button>
            )}

            <div
              className="rounded-xl border bg-black/60 p-5 backdrop-blur"
              style={{ borderColor: level ? `${level.accent}66` : "rgba(255,255,255,0.1)" }}
              aria-live="polite"
            >
              {level ? (
                <>
                  {level.photo && (
                    <Image src={level.photo} alt={`Vista desde ${level.name}`} width={600} height={340} className="mb-4 aspect-video w-full rounded-lg object-cover" />
                  )}
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: level.accent }}>
                    Vista · {level.label}
                  </p>
                  <h3 className="mt-1 font-bebas text-2xl tracking-wider text-[#F0F0F0]">{sector ? sector.name : level.name}</h3>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-[#F0F0F0]/60">{level.view}</p>
                  {sector ? (
                    <>
                      <p className="mt-3 font-mono text-xs text-[#F0F0F0]/80">
                        {getSectorPriceLabel(sector)} · {sector.capacityLabel}
                      </p>
                      <button
                        type="button"
                        onClick={() => setPanelOpen(true)}
                        className="mt-4 w-full rounded-lg py-3 font-bebas text-lg tracking-widest text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: sector.accent }}
                      >
                        Reservar {sector.name}
                      </button>
                    </>
                  ) : level.sectors.length > 0 ? (
                    <p className="mt-3 font-mono text-xs text-[#F0F0F0]/40">Tocá un sector de este piso para reservar.</p>
                  ) : null}
                </>
              ) : (
                <p className="font-mono text-xs leading-relaxed text-[#F0F0F0]/50">
                  Elegí un piso o tocá un sector del plano para acercarte y ver su vista.
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* Leyenda */}
        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-wrap justify-center gap-4 font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/50">
            {([
              { color: "#C89020", label: "Golden" },
              { color: "#0066FF", label: "Box VIP / Nivel 3" },
              { color: "#9933CC", label: "Ultra" },
              { color: "#AA0022", label: "Backstage" },
            ] as const).map(({ color, label }) => (
              <span key={label} className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-sm border border-white/20" style={{ backgroundColor: color }} />
                {label}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>

      <SectorReservationPanel selection={panelSelection} isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
    </section>
  );
}
