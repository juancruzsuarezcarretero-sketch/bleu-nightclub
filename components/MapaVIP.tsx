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

const BOX_LAYOUT = BOX_IDS.map((id, i) => ({
  id,
  x: 12,
  y: 108 + i * 70,
  w: 128,
  h: 64,
}));

function SofaIcon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x}, ${y})`} fill={color} opacity={0.85}>
      <rect x={4} y={14} width={28} height={10} rx={2} />
      <rect x={2} y={8} width={8} height={16} rx={2} />
      <rect x={26} y={8} width={8} height={16} rx={2} />
      <rect x={6} y={4} width={24} height={8} rx={2} />
    </g>
  );
}

function StairsMarker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        x={0}
        y={0}
        textAnchor="middle"
        fill="white"
        fontSize={18}
        fontFamily="Bebas Neue, sans-serif"
      >
        ↑
      </text>
      <text
        x={0}
        y={14}
        textAnchor="middle"
        fill="white"
        fillOpacity={0.5}
        fontSize={7}
        fontFamily="DM Mono, monospace"
        letterSpacing={1}
      >
        ESCALERAS
      </text>
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

function Reservable({
  id,
  selected,
  hovered,
  onSelect,
  onHover,
  children,
}: ReservableProps) {
  const config = MAP_SECTORS[id];

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={config.name}
      className="cursor-pointer outline-none"
      onClick={() => onSelect(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(id);
        }
      }}
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

function DecorativeLabel({
  x,
  y,
  lines,
  size = 11,
  anchor = "middle",
}: {
  x: number;
  y: number;
  lines: string[];
  size?: number;
  anchor?: "middle" | "start";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill="white"
      fillOpacity={0.55}
      fontSize={size}
      fontFamily="Bebas Neue, sans-serif"
      letterSpacing={2}
    >
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : size + 2}>
          {line}
        </tspan>
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

  const panelSelection: MapSectorSelection | null =
    selectedId ? { sectorId: selectedId } : null;

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

  const sectorStrokeWidth = (id: MapSectorId) =>
    selectedId === id ? 3 : 1.5;

  const golden = MAP_SECTORS.golden;

  return (
    <section id="mapa-vip" className="relative bg-[#050508] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#F0F0F0]/40">
              Plano del local
            </p>
            <h2 className="mt-2 font-bebas text-4xl tracking-wider text-[#F0F0F0] md:text-5xl">
              Mapa VIP Interactivo
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-[#F0F0F0]/50">
              Tocá un sector reservable para ver precios e iniciar tu reserva
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="overflow-x-auto rounded-xl border border-white/15 bg-[#050508] p-2 md:p-4">
            <svg
              viewBox="0 0 960 680"
              className="mx-auto w-full min-w-[320px] max-w-4xl"
              aria-label="Mapa VIP del boliche Bleu"
            >
              <rect width={960} height={680} fill="#050508" />

              {/* ── FILA SUPERIOR ── */}

              {/* Barra Cañada — no reservable */}
              <rect
                x={12}
                y={12}
                width={368}
                height={86}
                fill="#0c0c10"
                stroke="white"
                strokeWidth={1.5}
                strokeOpacity={0.35}
              />
              <DecorativeLabel
                x={196}
                y={58}
                lines={["BARRA CAÑADA"]}
                size={14}
              />

              {/* Golden — forma L */}
              <Reservable
                id="golden"
                selected={selectedId === "golden"}
                hovered={hoveredId === "golden"}
                onSelect={handleSelect}
                onHover={setHoveredId}
              >
                <path
                  d="M 392 12 H 948 V 186 H 896 V 66 H 392 Z"
                  fill={sectorFill("golden")}
                  stroke={sectorStroke("golden")}
                  strokeWidth={sectorStrokeWidth("golden")}
                />
                <text
                  x={620}
                  y={44}
                  textAnchor="middle"
                  fill="white"
                  fontSize={16}
                  fontFamily="Bebas Neue, sans-serif"
                  letterSpacing={3}
                >
                  GOLDEN
                </text>
                <text
                  x={620}
                  y={62}
                  textAnchor="middle"
                  fill={golden.accent}
                  fontSize={9}
                  fontFamily="DM Mono, monospace"
                >
                  $35.000 / persona
                </text>
                <SofaIcon x={900} y={90} color={golden.accent} />
                <SofaIcon x={860} y={130} color={golden.accent} />
              </Reservable>

              {/* ── FILA MEDIA ── */}

              {/* Boxes 1–5 — columna izquierda */}
              {BOX_LAYOUT.map(({ id, x, y, w, h }) => {
                const config = MAP_SECTORS[id];
                const num = id.replace("box-", "");
                return (
                  <Reservable
                    key={id}
                    id={id}
                    selected={selectedId === id}
                    hovered={hoveredId === id}
                    onSelect={handleSelect}
                    onHover={setHoveredId}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill={sectorFill(id)}
                      stroke={sectorStroke(id)}
                      strokeWidth={sectorStrokeWidth(id)}
                    />
                    <text
                      x={x + w / 2}
                      y={y + 22}
                      textAnchor="middle"
                      fill="white"
                      fontSize={13}
                      fontFamily="Bebas Neue, sans-serif"
                      letterSpacing={2}
                    >
                      BOX {num}
                    </text>
                    <SofaIcon
                      x={x + w / 2 - 18}
                      y={y + 28}
                      color={config.accent}
                    />
                    <text
                      x={x + w / 2}
                      y={y + h - 8}
                      textAnchor="middle"
                      fill={config.accent}
                      fontSize={7}
                      fontFamily="DM Mono, monospace"
                    >
                      $700.000
                    </text>
                  </Reservable>
                );
              })}

              {/* Pista Principal Nivel 1 — no reservable */}
              <rect
                x={152}
                y={108}
                width={410}
                height={347}
                fill="#0a0a0e"
                stroke="white"
                strokeWidth={1.5}
                strokeOpacity={0.35}
              />
              <DecorativeLabel
                x={357}
                y={270}
                lines={["PISTA PRINCIPAL", "NIVEL 1"]}
                size={16}
              />

              {/* Palco 2 contorno */}
              <rect
                x={572}
                y={108}
                width={148}
                height={150}
                fill="none"
                stroke="white"
                strokeWidth={1}
                strokeOpacity={0.25}
                strokeDasharray="4 3"
              />
              <text
                x={646}
                y={124}
                textAnchor="middle"
                fill="white"
                fillOpacity={0.45}
                fontSize={9}
                fontFamily="Bebas Neue, sans-serif"
                letterSpacing={2}
              >
                PALCO 2
              </text>

              {/* Ultra Box 1 — Palco 2 */}
              <Reservable
                id="ultra-box-1"
                selected={selectedId === "ultra-box-1"}
                hovered={hoveredId === "ultra-box-1"}
                onSelect={handleSelect}
                onHover={setHoveredId}
              >
                <rect
                  x={578}
                  y={130}
                  width={136}
                  height={58}
                  fill={sectorFill("ultra-box-1")}
                  stroke={sectorStroke("ultra-box-1")}
                  strokeWidth={sectorStrokeWidth("ultra-box-1")}
                />
                <text
                  x={646}
                  y={152}
                  textAnchor="middle"
                  fill="white"
                  fontSize={11}
                  fontFamily="Bebas Neue, sans-serif"
                  letterSpacing={1.5}
                >
                  BOX 1
                </text>
                <SofaIcon x={628} y={156} color={MAP_SECTORS["ultra-box-1"].accent} />
              </Reservable>

              {/* Ultra Box 2 — Palco 2 */}
              <Reservable
                id="ultra-box-2"
                selected={selectedId === "ultra-box-2"}
                hovered={hoveredId === "ultra-box-2"}
                onSelect={handleSelect}
                onHover={setHoveredId}
              >
                <rect
                  x={578}
                  y={194}
                  width={136}
                  height={58}
                  fill={sectorFill("ultra-box-2")}
                  stroke={sectorStroke("ultra-box-2")}
                  strokeWidth={sectorStrokeWidth("ultra-box-2")}
                />
                <text
                  x={646}
                  y={216}
                  textAnchor="middle"
                  fill="white"
                  fontSize={11}
                  fontFamily="Bebas Neue, sans-serif"
                  letterSpacing={1.5}
                >
                  BOX 2
                </text>
                <SofaIcon x={628} y={220} color={MAP_SECTORS["ultra-box-2"].accent} />
              </Reservable>

              {/* Palco 3 contorno */}
              <rect
                x={728}
                y={108}
                width={148}
                height={150}
                fill="none"
                stroke="white"
                strokeWidth={1}
                strokeOpacity={0.25}
                strokeDasharray="4 3"
              />
              <text
                x={802}
                y={124}
                textAnchor="middle"
                fill="white"
                fillOpacity={0.45}
                fontSize={9}
                fontFamily="Bebas Neue, sans-serif"
                letterSpacing={2}
              >
                PALCO 3
              </text>

              {/* Ultra Box 3 — Palco 3 */}
              <Reservable
                id="ultra-box-3"
                selected={selectedId === "ultra-box-3"}
                hovered={hoveredId === "ultra-box-3"}
                onSelect={handleSelect}
                onHover={setHoveredId}
              >
                <rect
                  x={734}
                  y={130}
                  width={136}
                  height={122}
                  fill={sectorFill("ultra-box-3")}
                  stroke={sectorStroke("ultra-box-3")}
                  strokeWidth={sectorStrokeWidth("ultra-box-3")}
                />
                <text
                  x={802}
                  y={182}
                  textAnchor="middle"
                  fill="white"
                  fontSize={11}
                  fontFamily="Bebas Neue, sans-serif"
                  letterSpacing={1.5}
                >
                  BOX 3
                </text>
                <SofaIcon x={784} y={188} color={MAP_SECTORS["ultra-box-3"].accent} />
              </Reservable>

              {/* Ultra Standing */}
              <Reservable
                id="ultra-standing"
                selected={selectedId === "ultra-standing"}
                hovered={hoveredId === "ultra-standing"}
                onSelect={handleSelect}
                onHover={setHoveredId}
              >
                <rect
                  x={572}
                  y={268}
                  width={304}
                  height={110}
                  fill={sectorFill("ultra-standing")}
                  stroke={sectorStroke("ultra-standing")}
                  strokeWidth={sectorStrokeWidth("ultra-standing")}
                />
                <text
                  x={724}
                  y={318}
                  textAnchor="middle"
                  fill="white"
                  fontSize={14}
                  fontFamily="Bebas Neue, sans-serif"
                  letterSpacing={3}
                >
                  ULTRA STANDING
                </text>
                <text
                  x={724}
                  y={336}
                  textAnchor="middle"
                  fill={MAP_SECTORS["ultra-standing"].accent}
                  fontSize={8}
                  fontFamily="DM Mono, monospace"
                >
                  $100.000 / persona
                </text>
              </Reservable>

              {/* Barra derecha — no reservable */}
              <rect
                x={888}
                y={108}
                width={60}
                height={560}
                fill="#0c0c10"
                stroke="white"
                strokeWidth={1.5}
                strokeOpacity={0.35}
              />
              <text
                x={918}
                y={380}
                textAnchor="middle"
                fill="white"
                fillOpacity={0.45}
                fontSize={11}
                fontFamily="Bebas Neue, sans-serif"
                letterSpacing={3}
                transform="rotate(90 918 380)"
              >
                BARRA
              </text>

              {/* Escaleras entre niveles */}
              <StairsMarker x={148} y={462} />
              <StairsMarker x={360} y={462} />

              {/* ── FILA INFERIOR ── */}

              {/* VIP Nivel 3 Standing */}
              <Reservable
                id="vip-n3-standing"
                selected={selectedId === "vip-n3-standing"}
                hovered={hoveredId === "vip-n3-standing"}
                onSelect={handleSelect}
                onHover={setHoveredId}
              >
                <rect
                  x={12}
                  y={468}
                  width={198}
                  height={200}
                  fill={sectorFill("vip-n3-standing")}
                  stroke={sectorStroke("vip-n3-standing")}
                  strokeWidth={sectorStrokeWidth("vip-n3-standing")}
                />
                <text
                  x={111}
                  y={548}
                  textAnchor="middle"
                  fill="white"
                  fontSize={14}
                  fontFamily="Bebas Neue, sans-serif"
                  letterSpacing={2}
                >
                  VIP NIVEL 3
                </text>
                <text
                  x={111}
                  y={568}
                  textAnchor="middle"
                  fill="white"
                  fillOpacity={0.7}
                  fontSize={11}
                  fontFamily="Bebas Neue, sans-serif"
                  letterSpacing={2}
                >
                  STANDING
                </text>
                <text
                  x={111}
                  y={590}
                  textAnchor="middle"
                  fill={MAP_SECTORS["vip-n3-standing"].accent}
                  fontSize={8}
                  fontFamily="DM Mono, monospace"
                >
                  $50.000 / persona
                </text>
              </Reservable>

              {/* Cabina — no reservable */}
              <rect
                x={220}
                y={468}
                width={160}
                height={130}
                fill="#0a0a0e"
                stroke="white"
                strokeWidth={1.5}
                strokeOpacity={0.35}
              />
              <DecorativeLabel
                x={300}
                y={538}
                lines={["CABINA"]}
                size={14}
              />

              {/* Backstage VIP */}
              <Reservable
                id="backstage"
                selected={selectedId === "backstage"}
                hovered={hoveredId === "backstage"}
                onSelect={handleSelect}
                onHover={setHoveredId}
              >
                <rect
                  x={390}
                  y={468}
                  width={486}
                  height={200}
                  fill={sectorFill("backstage")}
                  stroke={sectorStroke("backstage")}
                  strokeWidth={sectorStrokeWidth("backstage")}
                />
                <text
                  x={633}
                  y={558}
                  textAnchor="middle"
                  fill="white"
                  fontSize={16}
                  fontFamily="Bebas Neue, sans-serif"
                  letterSpacing={3}
                >
                  BACKSTAGE VIP
                </text>
                <text
                  x={633}
                  y={580}
                  textAnchor="middle"
                  fill={MAP_SECTORS.backstage.accent}
                  fontSize={9}
                  fontFamily="DM Mono, monospace"
                >
                  $1.500.000
                </text>
              </Reservable>
            </svg>
          </div>
        </FadeIn>

        {/* Leyenda */}
        <FadeIn delay={0.2}>
          <div className="mt-8 flex flex-wrap justify-center gap-4 font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/50">
            {(
              [
                { color: "#C89020", label: "Golden" },
                { color: "#0066FF", label: "Box VIP / Nivel 3" },
                { color: "#9933CC", label: "Ultra" },
                { color: "#AA0022", label: "Backstage" },
              ] as const
            ).map(({ color, label }) => (
              <span key={label} className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm border border-white/20"
                  style={{ backgroundColor: color }}
                />
                {label}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>

      <SectorReservationPanel
        selection={panelSelection}
        isOpen={panelOpen}
        onClose={handleClose}
      />
    </section>
  );
}
