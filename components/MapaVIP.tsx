"use client";

import { useState, useCallback } from "react";
import { FadeIn } from "@/components/FadeIn";
import SectorReservationPanel from "@/components/SectorReservationPanel";
import {
  MAP_SECTORS,
  type MapSectorId,
  type MapSectorSelection,
} from "@/lib/map-sectors";

const BOX_IDS: MapSectorId[] = [
  "box-1",
  "box-2",
  "box-3",
  "box-4",
  "box-5",
];

function SofaIcon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x}, ${y})`} fill={color} opacity={0.85}>
      <rect x={0} y={10} width={36} height={12} rx={2} />
      <rect x={-2} y={4} width={10} height={18} rx={2} />
      <rect x={28} y={4} width={10} height={18} rx={2} />
      <rect x={2} y={0} width={32} height={8} rx={2} />
    </g>
  );
}

function StairsMarker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text x={0} y={0} textAnchor="middle" fill="white" fontSize={18} fontFamily="Bebas Neue, sans-serif">↑</text>
      <text x={0} y={14} textAnchor="middle" fill="white" fillOpacity={0.5} fontSize={7} fontFamily="DM Mono, monospace" letterSpacing={1}>ESCALERAS</text>
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
          ? `drop-shadow(0 0 10px ${config.accent}) drop-shadow(0 0 20px ${config.accent}80)`
          : hovered
            ? `drop-shadow(0 0 6px ${config.accent}60)`
            : undefined,
      }}
    >
      {children}
    </g>
  );
}

function DecorativeLabel({ x, y, lines, size = 11, anchor = "middle" }: { x: number; y: number; lines: string[]; size?: number; anchor?: "middle" | "start"; }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill="white" fillOpacity={0.55} fontSize={size} fontFamily="Bebas Neue, sans-serif" letterSpacing={2}>
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : size + 2}>{line}</tspan>
      ))}
    </text>
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

  const handleClose = useCallback(() => {
    setPanelOpen(false);
  }, []);

  const panelSelection: MapSectorSelection | null = selectedId ? { sectorId: selectedId } : null;

  const sectorFill = (id: MapSectorId) => {
    const c = MAP_SECTORS[id];
    if (selectedId === id) return c.hoverFill;
    if (hoveredId === id) return c.hoverFill;
    return c.fill;
  };

  const sectorStroke = (id: MapSectorId) => {
    const c = MAP_SECTORS[id];
    return selectedId === id ? "#FFFFFF" : c.stroke;
  };

  const sectorStrokeWidth = (id: MapSectorId) => selectedId === id ? 3 : 1.5;

  // Layout dimensions
  // viewBox: 0 0 900 720
  // Left column (boxes VIP): x=12, w=110
  // Center (pista): x=132, w=380
  // Right column (ultra boxes): x=522, w=260
  // Far right (barra): x=792, w=48
  // Total used: ~840

  const BOX_W = 110;
  const BOX_H = 72;
  const BOX_X = 12;
  const PISTA_X = 132;
  const PISTA_W = 380;
  const ULTRA_X = 522;
  const ULTRA_W = 260;
  const BARRA_X = 792;
  const BARRA_W = 48;

  return (
    <section id="reservas" className="relative bg-[#050508] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#F0F0F0]/40">Plano del local</p>
            <h2 className="mt-2 font-bebas text-4xl tracking-wider text-[#F0F0F0] md:text-5xl">Mapa VIP Interactivo</h2>
            <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-[#F0F0F0]/50">Tocá un sector reservable para ver precios e iniciar tu reserva</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="overflow-x-auto rounded-xl border border-white/15 bg-[#050508] p-2 md:p-4">
            <svg viewBox="0 0 850 720" className="mx-auto w-full min-w-[320px] max-w-4xl" aria-label="Mapa VIP del boliche Bleu">
              <rect width={850} height={720} fill="#050508" />

              {/* ── FILA SUPERIOR ── */}

              {/* Barra Cañada */}
              <rect x={BOX_X} y={12} width={380} height={70} fill="#0c0c10" stroke="white" strokeWidth={1.5} strokeOpacity={0.35} />
              <DecorativeLabel x={202} y={52} lines={["BARRA CAÑADA"]} size={14} />

              {/* Golden — forma de L: banda superior ancha + columna derecha */}
              <Reservable id="golden" selected={selectedId === "golden"} hovered={hoveredId === "golden"} onSelect={handleSelect} onHover={setHoveredId}>
                {/* parte horizontal arriba */}
                <path
                  d={`M ${PISTA_X + PISTA_W + 10} 12 H ${BARRA_X - 4} V 82 H ${PISTA_X + PISTA_W + 10} Z`}
                  fill={sectorFill("golden")}
                  stroke={sectorStroke("golden")}
                  strokeWidth={sectorStrokeWidth("golden")}
                />
                {/* columna derecha bajando */}
                <path
                  d={`M ${ULTRA_X + ULTRA_W + 4} 82 H ${BARRA_X - 4} V 260 H ${ULTRA_X + ULTRA_W + 4} Z`}
                  fill={sectorFill("golden")}
                  stroke={sectorStroke("golden")}
                  strokeWidth={sectorStrokeWidth("golden")}
                />
                <text x={660} y={44} textAnchor="middle" fill="white" fontSize={15} fontFamily="Bebas Neue, sans-serif" letterSpacing={3}>GOLDEN</text>
                <text x={660} y={62} textAnchor="middle" fill={MAP_SECTORS.golden.accent} fontSize={9} fontFamily="DM Mono, monospace">$35.000 / persona</text>
                {/* sofás en la columna derecha */}
                <SofaIcon x={805} y={100} color={MAP_SECTORS.golden.accent} />
                <SofaIcon x={805} y={160} color={MAP_SECTORS.golden.accent} />
                <SofaIcon x={805} y={210} color={MAP_SECTORS.golden.accent} />
              </Reservable>

              {/* ── ENTREPISO ── */}
              <rect x={BOX_X} y={92} width={380} height={50} fill="#0c0c10" stroke="white" strokeWidth={1} strokeOpacity={0.3} />
              <DecorativeLabel x={202} y={122} lines={["ENTREPISO"]} size={12} />
              {/* escaleras */}
              <StairsMarker x={170} y={108} />
              <StairsMarker x={340} y={108} />

              {/* ── COLUMNA IZQUIERDA: 5 Boxes VIP ── */}
              {BOX_IDS.map((id, i) => {
                const config = MAP_SECTORS[id];
                const num = id.replace("box-", "");
                const y = 152 + i * (BOX_H + 6);
                return (
                  <Reservable key={id} id={id} selected={selectedId === id} hovered={hoveredId === id} onSelect={handleSelect} onHover={setHoveredId}>
                    <rect x={BOX_X} y={y} width={BOX_W} height={BOX_H} fill={sectorFill(id)} stroke={sectorStroke(id)} strokeWidth={sectorStrokeWidth(id)} />
                    <text x={BOX_X + BOX_W / 2} y={y + 22} textAnchor="middle" fill="white" fontSize={13} fontFamily="Bebas Neue, sans-serif" letterSpacing={2}>BOX {num}</text>
                    <SofaIcon x={BOX_X + BOX_W / 2 - 18} y={y + 28} color={config.accent} />
                    <text x={BOX_X + BOX_W / 2} y={y + BOX_H - 8} textAnchor="middle" fill={config.accent} fontSize={7} fontFamily="DM Mono, monospace">$700.000</text>
                  </Reservable>
                );
              })}

              {/* ── PISTA PRINCIPAL ── */}
              <rect x={PISTA_X} y={152} width={PISTA_W} height={350} fill="#0a0a0e" stroke="white" strokeWidth={1.5} strokeOpacity={0.35} />
              <DecorativeLabel x={PISTA_X + PISTA_W / 2} y={320} lines={["PISTA PRINCIPAL", "NIVEL 1"]} size={18} />

              {/* ── COLUMNA DERECHA: 3 Ultra Boxes ── */}

              {/* Palco 2 label */}
              <text x={BARRA_X - 10} y={200} textAnchor="end" fill="white" fillOpacity={0.4} fontSize={9} fontFamily="Bebas Neue, sans-serif" letterSpacing={2} transform={`rotate(90, ${BARRA_X - 10}, 200)`}>PALCO 2</text>

              {/* Ultra Box 1 */}
              <Reservable id="ultra-box-1" selected={selectedId === "ultra-box-1"} hovered={hoveredId === "ultra-box-1"} onSelect={handleSelect} onHover={setHoveredId}>
                <rect x={ULTRA_X} y={82} width={ULTRA_W} height={80} fill={sectorFill("ultra-box-1")} stroke={sectorStroke("ultra-box-1")} strokeWidth={sectorStrokeWidth("ultra-box-1")} />
                <text x={ULTRA_X + ULTRA_W / 2} y={116} textAnchor="middle" fill="white" fontSize={12} fontFamily="Bebas Neue, sans-serif" letterSpacing={2}>BOX 1</text>
                <SofaIcon x={ULTRA_X + ULTRA_W / 2 - 18} y={122} color={MAP_SECTORS["ultra-box-1"].accent} />
              </Reservable>

              {/* Ultra Box 2 */}
              <Reservable id="ultra-box-2" selected={selectedId === "ultra-box-2"} hovered={hoveredId === "ultra-box-2"} onSelect={handleSelect} onHover={setHoveredId}>
                <rect x={ULTRA_X} y={170} width={ULTRA_W} height={80} fill={sectorFill("ultra-box-2")} stroke={sectorStroke("ultra-box-2")} strokeWidth={sectorStrokeWidth("ultra-box-2")} />
                <text x={ULTRA_X + ULTRA_W / 2} y={204} textAnchor="middle" fill="white" fontSize={12} fontFamily="Bebas Neue, sans-serif" letterSpacing={2}>BOX 2</text>
                <SofaIcon x={ULTRA_X + ULTRA_W / 2 - 18} y={210} color={MAP_SECTORS["ultra-box-2"].accent} />
              </Reservable>

              {/* Palco 3 label */}
              <text x={BARRA_X - 10} y={360} textAnchor="end" fill="white" fillOpacity={0.4} fontSize={9} fontFamily="Bebas Neue, sans-serif" letterSpacing={2} transform={`rotate(90, ${BARRA_X - 10}, 360)`}>PALCO 3</text>

              {/* Ultra Box 3 */}
              <Reservable id="ultra-box-3" selected={selectedId === "ultra-box-3"} hovered={hoveredId === "ultra-box-3"} onSelect={handleSelect} onHover={setHoveredId}>
                <rect x={ULTRA_X} y={258} width={ULTRA_W} height={80} fill={sectorFill("ultra-box-3")} stroke={sectorStroke("ultra-box-3")} strokeWidth={sectorStrokeWidth("ultra-box-3")} />
                <text x={ULTRA_X + ULTRA_W / 2} y={292} textAnchor="middle" fill="white" fontSize={12} fontFamily="Bebas Neue, sans-serif" letterSpacing={2}>BOX 3</text>
                <SofaIcon x={ULTRA_X + ULTRA_W / 2 - 18} y={298} color={MAP_SECTORS["ultra-box-3"].accent} />
              </Reservable>

              {/* Ultra Standing */}
              <Reservable id="ultra-standing" selected={selectedId === "ultra-standing"} hovered={hoveredId === "ultra-standing"} onSelect={handleSelect} onHover={setHoveredId}>
                <rect x={ULTRA_X} y={346} width={ULTRA_W} height={156} fill={sectorFill("ultra-standing")} stroke={sectorStroke("ultra-standing")} strokeWidth={sectorStrokeWidth("ultra-standing")} />
                <text x={ULTRA_X + ULTRA_W / 2} y={418} textAnchor="middle" fill="white" fontSize={13} fontFamily="Bebas Neue, sans-serif" letterSpacing={2}>ULTRA STANDING</text>
                <text x={ULTRA_X + ULTRA_W / 2} y={436} textAnchor="middle" fill={MAP_SECTORS["ultra-standing"].accent} fontSize={8} fontFamily="DM Mono, monospace">$100.000 / persona</text>
              </Reservable>

              {/* ── BARRA DERECHA ── */}
              <rect x={BARRA_X} y={82} width={BARRA_W} height={500} fill="#0c0c10" stroke="white" strokeWidth={1.5} strokeOpacity={0.35} />
              <text x={BARRA_X + BARRA_W / 2} y={340} textAnchor="middle" fill="white" fillOpacity={0.45} fontSize={11} fontFamily="Bebas Neue, sans-serif" letterSpacing={3} transform={`rotate(90, ${BARRA_X + BARRA_W / 2}, 340)`}>BARRA</text>

              {/* ── FILA INFERIOR ── */}

              {/* VIP Nivel 3 Standing */}
              <Reservable id="vip-n3-standing" selected={selectedId === "vip-n3-standing"} hovered={hoveredId === "vip-n3-standing"} onSelect={handleSelect} onHover={setHoveredId}>
                <rect x={BOX_X} y={512} width={110} height={196} fill={sectorFill("vip-n3-standing")} stroke={sectorStroke("vip-n3-standing")} strokeWidth={sectorStrokeWidth("vip-n3-standing")} />
                <text x={67} y={596} textAnchor="middle" fill="white" fontSize={13} fontFamily="Bebas Neue, sans-serif" letterSpacing={2} transform="rotate(-90, 67, 596)">VIP NIVEL 3</text>
                <text x={67} y={612} textAnchor="middle" fill="white" fillOpacity={0.7} fontSize={10} fontFamily="Bebas Neue, sans-serif" letterSpacing={2} transform="rotate(-90, 67, 612)">STANDING</text>
                <text x={BOX_X + 55} y={698} textAnchor="middle" fill={MAP_SECTORS["vip-n3-standing"].accent} fontSize={7} fontFamily="DM Mono, monospace">$50.000 / persona</text>
              </Reservable>

              {/* Cabina */}
              <rect x={132} y={512} width={120} height={80} fill="#0a0a0e" stroke="white" strokeWidth={1.5} strokeOpacity={0.35} />
              <DecorativeLabel x={192} y={557} lines={["CABINA"]} size={13} />

              {/* Backstage VIP Nivel 4 */}
              <Reservable id="backstage" selected={selectedId === "backstage"} hovered={hoveredId === "backstage"} onSelect={handleSelect} onHover={setHoveredId}>
                <path
                  d={`M 262 512 H ${BARRA_X - 4} V 708 H 262 Z`}
                  fill={sectorFill("backstage")}
                  stroke={sectorStroke("backstage")}
                  strokeWidth={sectorStrokeWidth("backstage")}
                  strokeLinejoin="round"
                />
                <text x={527} y={602} textAnchor="middle" fill="white" fontSize={16} fontFamily="Bebas Neue, sans-serif" letterSpacing={3}>BACKSTAGE VIP</text>
                <text x={527} y={622} textAnchor="middle" fill="white" fillOpacity={0.7} fontSize={12} fontFamily="Bebas Neue, sans-serif" letterSpacing={2}>NIVEL 4</text>
                <text x={527} y={642} textAnchor="middle" fill={MAP_SECTORS.backstage.accent} fontSize={9} fontFamily="DM Mono, monospace">$1.500.000</text>
              </Reservable>

              {/* Líneas escaleras abajo */}
              <StairsMarker x={178} y={506} />
              <StairsMarker x={360} y={506} />

            </svg>
          </div>
        </FadeIn>

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
