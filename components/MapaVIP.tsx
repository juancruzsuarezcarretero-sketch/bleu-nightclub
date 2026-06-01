"use client";

import { useState, useCallback } from "react";
import { FadeIn } from "@/components/FadeIn";
import SectorReservationPanel from "@/components/SectorReservationPanel";
import {
  MAP_SECTORS,
  type MapSectorId,
  type MapSectorSelection,
} from "@/lib/map-sectors";

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
      }}
    >
      {children}
    </g>
  );
}

export default function MapaVIP() {
  const [selectedId, setSelectedId] = useState<MapSectorId | null>(null);
  const [hoveredId, setHoveredId] = useState<MapSectorId | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleSelect = useCallback((id: MapSectorId) => {
    setSelectedId(id);
    setPanelOpen(true);
  }, []);

  const handleClose = useCallback(() => setPanelOpen(false), []);

  const panelSelection: MapSectorSelection | null = selectedId ? { sectorId: selectedId } : null;

  const fill = (id: MapSectorId) => {
    const c = MAP_SECTORS[id];
    return (selectedId === id || hoveredId === id) ? c.hoverFill : c.fill;
  };
  const stroke = (id: MapSectorId) => (selectedId === id ? "#FFFFFF" : MAP_SECTORS[id].stroke);
  const sw = (id: MapSectorId) => (selectedId === id ? 2.6 : 1.6);

  const bebas = { fontFamily: "Bebas Neue, sans-serif" } as const;
  const mono = { fontFamily: "DM Mono, monospace" } as const;

  const boxVip: MapSectorId[] = ["box-1", "box-2", "box-3", "box-4", "box-5"];
  const ultraBoxes: { id: MapSectorId; n: string; y: number }[] = [
    { id: "ultra-box-1", n: "1", y: 350 },
    { id: "ultra-box-2", n: "2", y: 450 },
    { id: "ultra-box-3", n: "3", y: 550 },
  ];

  const UX = 505, UW = 108; // ultra boxes col

  return (
    <section id="reservas" className="relative bg-[#050508] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#F0F0F0]/40">Plano del local</p>
            <h2 className="mt-2 font-bebas text-4xl tracking-wider text-[#F0F0F0] md:text-5xl">Mapa VIP Interactivo</h2>
            <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-[#F0F0F0]/50">
              Tocá un sector reservable para ver precios e iniciar tu reserva
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-black p-3 md:p-6">
            <svg
              viewBox="0 0 780 980"
              className="mx-auto block w-full min-w-[300px] max-w-xl"
              aria-label="Mapa VIP del boliche Bleu"
              style={{ strokeLinejoin: "round", strokeLinecap: "round" }}
            >
              <rect width={780} height={980} fill="#000000" />

              {/* ════ BARRA CAÑADA (trapecio, pared izq diagonal) ════ */}
              <path d="M 150 50 L 340 50 L 340 165 L 95 165 L 150 50 Z" fill="#0a0a0e" stroke="white" strokeWidth={1.6} strokeOpacity={0.9} />
              <text x={240} y={100} textAnchor="middle" fill="white" fontSize={17} style={bebas} letterSpacing={2}>BARRA</text>
              <text x={240} y={122} textAnchor="middle" fill="white" fontSize={17} style={bebas} letterSpacing={2}>CAÑADA</text>

              {/* ════ GOLDEN (L: banda arriba + tira derecha) ════ */}
              <Reservable id="golden" selected={selectedId === "golden"} hovered={hoveredId === "golden"} onSelect={handleSelect} onHover={setHoveredId}>
                <path d="M 345 50 L 665 50 L 665 490 L 615 490 L 615 165 L 345 165 Z" fill={fill("golden")} stroke={stroke("golden")} strokeWidth={sw("golden")} />
                <text x={560} y={92} textAnchor="middle" fill="white" fontSize={18} style={bebas} letterSpacing={3}>GOLDEN</text>
                <text x={560} y={112} textAnchor="middle" fill={MAP_SECTORS.golden.accent} fontSize={10} style={mono}>$35.000 / persona</text>
                <Couch x={360} y={62} w={42} color={MAP_SECTORS.golden.accent} />
                <Couch x={412} y={62} w={42} color={MAP_SECTORS.golden.accent} />
                <Couch x={622} y={200} w={38} color={MAP_SECTORS.golden.accent} />
                <Couch x={622} y={300} w={38} color={MAP_SECTORS.golden.accent} />
                <Couch x={622} y={400} w={38} color={MAP_SECTORS.golden.accent} />
              </Reservable>

              {/* ════ ENTREPISO ════ */}
              <text x={300} y={250} textAnchor="middle" fill="white" fillOpacity={0.85} fontSize={16} style={bebas} letterSpacing={3}>ENTREPISO</text>

              {/* ════ ESCALERAS arriba-izq ════ */}
              {[300, 310, 320, 330].map((yy, i) => (
                <line key={yy} x1={70 + i * 4} y1={yy} x2={200} y2={yy} stroke="white" strokeWidth={1.2} strokeOpacity={0.85} />
              ))}

              {/* ════ BOX VIP 1–5 ════ */}
              {boxVip.map((id, i) => {
                const config = MAP_SECTORS[id];
                const num = id.replace("box-", "");
                const y = 350 + i * 66;
                const bx = 70, bw = 128, bh = 60;
                return (
                  <Reservable key={id} id={id} selected={selectedId === id} hovered={hoveredId === id} onSelect={handleSelect} onHover={setHoveredId}>
                    <rect x={bx} y={y} width={bw} height={bh} fill={fill(id)} stroke={stroke(id)} strokeWidth={sw(id)} />
                    <text x={bx + 34} y={y + 26} textAnchor="middle" fill="white" fontSize={13} style={bebas} letterSpacing={1.5}>BOX {num}</text>
                    <Couch x={bx + bw - 50} y={y + 15} w={36} h={30} color={config.accent} />
                    <text x={bx + 34} y={y + 48} textAnchor="middle" fill={config.accent} fontSize={7} style={mono}>$700.000</text>
                  </Reservable>
                );
              })}

              {/* escaleras chicas entre box y pista */}
              {[358, 367, 376, 385].map((yy) => (
                <line key={yy} x1={205} y1={yy} x2={245} y2={yy} stroke="white" strokeWidth={1} strokeOpacity={0.7} />
              ))}

              {/* ════ PISTA PRINCIPAL (chaflán sup-der) ════ */}
              <path d="M 245 350 L 470 350 L 525 405 L 525 655 L 245 655 Z" fill="#08080d" stroke="white" strokeWidth={1.6} strokeOpacity={0.9} />
              <text x={385} y={490} textAnchor="middle" fill="white" fillOpacity={0.9} fontSize={20} style={bebas} letterSpacing={3}>PISTA</text>
              <text x={385} y={514} textAnchor="middle" fill="white" fillOpacity={0.9} fontSize={20} style={bebas} letterSpacing={3}>PRINCIPAL</text>
              <text x={385} y={536} textAnchor="middle" fill="white" fillOpacity={0.7} fontSize={13} style={bebas} letterSpacing={2}>NIVEL 1</text>

              {/* ════ ULTRA BOXES (Palco 2 / Palco 3) ════ */}
              {ultraBoxes.map(({ id, n, y }) => (
                <Reservable key={id} id={id} selected={selectedId === id} hovered={hoveredId === id} onSelect={handleSelect} onHover={setHoveredId}>
                  <rect x={UX} y={y} width={UW} height={92} fill={fill(id)} stroke={stroke(id)} strokeWidth={sw(id)} />
                  <text x={UX + 32} y={y + 42} textAnchor="middle" fill="white" fontSize={13} style={bebas} letterSpacing={1.5}>BOX</text>
                  <text x={UX + 58} y={y + 42} textAnchor="middle" fill="white" fontSize={13} style={bebas} letterSpacing={1.5}>{n}</text>
                  <Couch x={UX + UW - 42} y={y + 26} w={36} h={40} color={MAP_SECTORS[id].accent} />
                </Reservable>
              ))}
              <text x={690} y={445} textAnchor="middle" fill="white" fillOpacity={0.6} fontSize={11} style={bebas} letterSpacing={2} transform="rotate(90, 690, 445)">PALCO 2</text>
              <text x={690} y={595} textAnchor="middle" fill="white" fillOpacity={0.6} fontSize={11} style={bebas} letterSpacing={2} transform="rotate(90, 690, 595)">PALCO 3</text>

              {/* ════ ULTRA STANDING (entre box3 y backstage) ════ */}
              <Reservable id="ultra-standing" selected={selectedId === "ultra-standing"} hovered={hoveredId === "ultra-standing"} onSelect={handleSelect} onHover={setHoveredId}>
                <path d="M 505 646 L 613 646 L 613 740 L 525 740 L 505 720 Z" fill={fill("ultra-standing")} stroke={stroke("ultra-standing")} strokeWidth={sw("ultra-standing")} />
                <text x={559} y={688} textAnchor="middle" fill="white" fontSize={10} style={bebas} letterSpacing={1}>ULTRA STANDING</text>
                <text x={559} y={702} textAnchor="middle" fill={MAP_SECTORS["ultra-standing"].accent} fontSize={7} style={mono}>$100.000 / p.</text>
              </Reservable>

              {/* ════ BARRA chica (abajo derecha) ════ */}
              <rect x={625} y={745} width={45} height={150} fill="#0a0a0e" stroke="white" strokeWidth={1.5} strokeOpacity={0.9} />
              <text x={647} y={820} textAnchor="middle" fill="white" fillOpacity={0.7} fontSize={12} style={bebas} letterSpacing={2} transform="rotate(90, 647, 820)">BARRA</text>

              {/* ════ VIP NIVEL 3 STANDING (diagonal sup-der) ════ */}
              <Reservable id="vip-n3-standing" selected={selectedId === "vip-n3-standing"} hovered={hoveredId === "vip-n3-standing"} onSelect={handleSelect} onHover={setHoveredId}>
                <path d="M 70 655 L 195 655 L 245 705 L 245 905 L 70 905 Z" fill={fill("vip-n3-standing")} stroke={stroke("vip-n3-standing")} strokeWidth={sw("vip-n3-standing")} />
                <text x={140} y={800} textAnchor="middle" fill="white" fontSize={15} style={bebas} letterSpacing={2} transform="rotate(-90, 140, 800)">VIP NIVEL 3</text>
                <text x={180} y={888} textAnchor="middle" fill={MAP_SECTORS["vip-n3-standing"].accent} fontSize={7.5} style={mono}>$50.000 / persona</text>
              </Reservable>

              {/* ════ CABINA (debajo de pista) ════ */}
              <path d="M 245 705 L 510 705 L 510 800 L 245 800 Z" fill="#0a0a0e" stroke="white" strokeWidth={1.5} strokeOpacity={0.9} />
              <text x={377} y={757} textAnchor="middle" fill="white" fillOpacity={0.85} fontSize={15} style={bebas} letterSpacing={3}>CABINA</text>
              {/* escaleras verticales entre cabina y backstage */}
              {[520, 530, 540].map((xx) => (
                <line key={xx} x1={xx} y1={745} x2={xx} y2={800} stroke="white" strokeWidth={1} strokeOpacity={0.7} />
              ))}

              {/* ════ BACKSTAGE VIP NIVEL 4 (trapecio) ════ */}
              <Reservable id="backstage" selected={selectedId === "backstage"} hovered={hoveredId === "backstage"} onSelect={handleSelect} onHover={setHoveredId}>
                <path d="M 245 803 L 560 803 L 560 835 L 505 905 L 245 905 Z" fill={fill("backstage")} stroke={stroke("backstage")} strokeWidth={sw("backstage")} />
                <text x={400} y={850} textAnchor="middle" fill="white" fontSize={18} style={bebas} letterSpacing={2}>BACKSTAGE VIP</text>
                <text x={400} y={870} textAnchor="middle" fill="white" fillOpacity={0.7} fontSize={12} style={bebas} letterSpacing={2}>NIVEL 4</text>
                <text x={400} y={888} textAnchor="middle" fill={MAP_SECTORS.backstage.accent} fontSize={8} style={mono}>$1.500.000</text>
              </Reservable>

            </svg>
          </div>
        </FadeIn>

        {/* Leyenda */}
        <FadeIn delay={0.2}>
          <div className="mt-8 flex flex-wrap justify-center gap-4 font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/50">
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

      <SectorReservationPanel selection={panelSelection} isOpen={panelOpen} onClose={handleClose} />
    </section>
  );
}
