"use client";

import { useState, useCallback } from "react";
import { FadeIn } from "@/components/FadeIn";
import SectorReservationPanel from "@/components/SectorReservationPanel";
import {
  MAP_SECTORS,
  type MapSectorId,
  type MapSectorSelection,
} from "@/lib/map-sectors";

/* Icono de sillón (vista en planta) tipo el del plano original */
function CouchIcon({ x, y, w = 44, h = 32, color }: { x: number; y: number; w?: number; h?: number; color: string }) {
  const seat = w / 3;
  return (
    <g transform={`translate(${x}, ${y})`} fill="none" stroke={color} strokeWidth={1.4} opacity={0.9}>
      <rect x={0} y={0} width={w} height={h} rx={2} />
      <line x1={seat} y1={4} x2={seat} y2={h - 4} />
      <line x1={seat * 2} y1={4} x2={seat * 2} y2={h - 4} />
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
  const sw = (id: MapSectorId) => (selectedId === id ? 2.5 : 1.6);

  // Estilo de etiqueta blanca tipo plano (Bebas)
  const labelStyle = { fontFamily: "Bebas Neue, sans-serif" } as const;
  const monoStyle = { fontFamily: "DM Mono, monospace" } as const;

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
              viewBox="0 0 720 1000"
              className="mx-auto block w-full min-w-[300px] max-w-xl"
              aria-label="Mapa VIP del boliche Bleu"
              style={{ strokeLinejoin: "round", strokeLinecap: "round" }}
            >
              <rect width={720} height={1000} fill="#000000" />

              {/* ════════ BARRA CAÑADA (trapecio, pared izq diagonal) ════════ */}
              {/* contorno: arriba recto, izquierda diagonal hacia abajo */}
              <path
                d="M 150 120 L 360 120 L 360 230 L 95 230 L 150 120 Z"
                fill="#0a0a0e" stroke="white" strokeWidth={1.6} strokeOpacity={0.85}
              />
              <text x={265} y={170} textAnchor="middle" fill="white" fontSize={17} style={labelStyle} letterSpacing={2}>BARRA</text>
              <text x={265} y={192} textAnchor="middle" fill="white" fontSize={17} style={labelStyle} letterSpacing={2}>CAÑADA</text>

              {/* ════════ GOLDEN (forma de L con diagonal) ════════ */}
              <Reservable id="golden" selected={selectedId==="golden"} hovered={hoveredId==="golden"} onSelect={handleSelect} onHover={setHoveredId}>
                {/* banda superior + columna derecha con chaflán inferior-izquierdo */}
                <path
                  d="M 360 120 L 640 120 L 640 290 L 605 330 L 605 470 L 540 470 L 540 200 L 360 200 Z"
                  fill={fill("golden")} stroke={stroke("golden")} strokeWidth={sw("golden")}
                />
                <text x={500} y={160} textAnchor="middle" fill="white" fontSize={18} style={labelStyle} letterSpacing={3}>GOLDEN</text>
                <text x={500} y={180} textAnchor="middle" fill={MAP_SECTORS.golden.accent} fontSize={10} style={monoStyle}>$35.000 / persona</text>
                {/* sillones en banda superior */}
                <CouchIcon x={392} y={132} color={MAP_SECTORS.golden.accent} />
                <CouchIcon x={470} y={132} color={MAP_SECTORS.golden.accent} />
                {/* sillones en columna derecha */}
                <CouchIcon x={556} y={230} w={40} color={MAP_SECTORS.golden.accent} />
                <CouchIcon x={556} y={300} w={40} color={MAP_SECTORS.golden.accent} />
              </Reservable>

              {/* ════════ ENTREPISO (no reservable, zona negra) ════════ */}
              <text x={350} y={310} textAnchor="middle" fill="white" fillOpacity={0.85} fontSize={16} style={labelStyle} letterSpacing={3}>ENTREPISO</text>

              {/* ════════ ESCALERAS izquierda (líneas) ════════ */}
              <g stroke="white" strokeWidth={1.2} strokeOpacity={0.85}>
                <line x1={95} y1={345} x2={210} y2={345} />
                <line x1={95} y1={357} x2={210} y2={357} />
                <line x1={95} y1={369} x2={210} y2={369} />
                <line x1={100} y1={381} x2={210} y2={381} />
              </g>

              {/* ════════ BOX VIP 1–5 (columna izquierda) ════════ */}
              {(["box-1","box-2","box-3","box-4","box-5"] as MapSectorId[]).map((id, i) => {
                const config = MAP_SECTORS[id];
                const num = id.replace("box-", "");
                const y = 392 + i * 66;
                const x = 95, w = 130, h = 60;
                return (
                  <Reservable key={id} id={id} selected={selectedId===id} hovered={hoveredId===id} onSelect={handleSelect} onHover={setHoveredId}>
                    <rect x={x} y={y} width={w} height={h} fill={fill(id)} stroke={stroke(id)} strokeWidth={sw(id)} />
                    <text x={x + 32} y={y + 26} textAnchor="middle" fill="white" fontSize={13} style={labelStyle} letterSpacing={1.5}>BOX {num}</text>
                    <CouchIcon x={x + w - 52} y={y + 14} w={38} h={30} color={config.accent} />
                    <text x={x + 32} y={y + 48} textAnchor="middle" fill={config.accent} fontSize={6.5} style={monoStyle}>$700.000</text>
                  </Reservable>
                );
              })}

              {/* escaleras pequeñas entre boxes y pista */}
              <g stroke="white" strokeWidth={1} strokeOpacity={0.7}>
                <line x1={225} y1={400} x2={270} y2={400} />
                <line x1={225} y1={410} x2={270} y2={410} />
                <line x1={225} y1={420} x2={270} y2={420} />
                <line x1={225} y1={430} x2={270} y2={430} />
              </g>

              {/* ════════ PISTA PRINCIPAL (con chaflán esquina sup-der) ════════ */}
              <path
                d="M 270 392 L 520 392 L 575 447 L 575 690 L 540 720 L 270 720 Z"
                fill="#08080d" stroke="white" strokeWidth={1.6} strokeOpacity={0.85}
              />
              <text x={420} y={560} textAnchor="middle" fill="white" fillOpacity={0.9} fontSize={20} style={labelStyle} letterSpacing={3}>PISTA</text>
              <text x={420} y={584} textAnchor="middle" fill="white" fillOpacity={0.9} fontSize={20} style={labelStyle} letterSpacing={3}>PRINCIPAL</text>
              <text x={420} y={606} textAnchor="middle" fill="white" fillOpacity={0.7} fontSize={13} style={labelStyle} letterSpacing={2}>NIVEL 1</text>

              {/* ════════ ULTRA BOXES derecha (Palco 2: Box1,Box2 / Palco 3: Box3) ════════ */}

              {/* Ultra Box 1 */}
              <Reservable id="ultra-box-1" selected={selectedId==="ultra-box-1"} hovered={hoveredId==="ultra-box-1"} onSelect={handleSelect} onHover={setHoveredId}>
                <rect x={540} y={392} width={150} height={96} fill={fill("ultra-box-1")} stroke={stroke("ultra-box-1")} strokeWidth={sw("ultra-box-1")} />
                <text x={585} y={432} textAnchor="middle" fill="white" fontSize={14} style={labelStyle} letterSpacing={1.5}>BOX</text>
                <text x={585} y={452} textAnchor="middle" fill="white" fontSize={14} style={labelStyle} letterSpacing={1.5}>1</text>
                <CouchIcon x={628} y={418} w={44} h={44} color={MAP_SECTORS["ultra-box-1"].accent} />
              </Reservable>

              {/* Ultra Box 2 */}
              <Reservable id="ultra-box-2" selected={selectedId==="ultra-box-2"} hovered={hoveredId==="ultra-box-2"} onSelect={handleSelect} onHover={setHoveredId}>
                <rect x={540} y={494} width={150} height={96} fill={fill("ultra-box-2")} stroke={stroke("ultra-box-2")} strokeWidth={sw("ultra-box-2")} />
                <text x={585} y={534} textAnchor="middle" fill="white" fontSize={14} style={labelStyle} letterSpacing={1.5}>BOX</text>
                <text x={585} y={554} textAnchor="middle" fill="white" fontSize={14} style={labelStyle} letterSpacing={1.5}>2</text>
                <CouchIcon x={628} y={520} w={44} h={44} color={MAP_SECTORS["ultra-box-2"].accent} />
              </Reservable>

              {/* Ultra Box 3 */}
              <Reservable id="ultra-box-3" selected={selectedId==="ultra-box-3"} hovered={hoveredId==="ultra-box-3"} onSelect={handleSelect} onHover={setHoveredId}>
                <rect x={540} y={596} width={150} height={96} fill={fill("ultra-box-3")} stroke={stroke("ultra-box-3")} strokeWidth={sw("ultra-box-3")} />
                <text x={585} y={636} textAnchor="middle" fill="white" fontSize={14} style={labelStyle} letterSpacing={1.5}>BOX</text>
                <text x={585} y={656} textAnchor="middle" fill="white" fontSize={14} style={labelStyle} letterSpacing={1.5}>3</text>
                <CouchIcon x={628} y={622} w={44} h={44} color={MAP_SECTORS["ultra-box-3"].accent} />
              </Reservable>

              {/* labels PALCO 2 / PALCO 3 (rotados, a la derecha de los boxes) */}
              <text x={706} y={490} textAnchor="middle" fill="white" fillOpacity={0.6} fontSize={11} style={labelStyle} letterSpacing={2} transform="rotate(90, 706, 490)">PALCO 2</text>
              <text x={706} y={644} textAnchor="middle" fill="white" fillOpacity={0.6} fontSize={11} style={labelStyle} letterSpacing={2} transform="rotate(90, 706, 644)">PALCO 3</text>

              {/* ════════ ULTRA STANDING (entre boxes y backstage) ════════ */}
              {/* en el plano real es la franja azul vertical derecha que conecta;
                  la ubicamos como zona reservable bajo el box 3, antes de la barra */}
              <Reservable id="ultra-standing" selected={selectedId==="ultra-standing"} hovered={hoveredId==="ultra-standing"} onSelect={handleSelect} onHover={setHoveredId}>
                <path d="M 575 696 L 690 696 L 690 770 L 600 770 L 540 720 L 575 692 Z"
                  fill={fill("ultra-standing")} stroke={stroke("ultra-standing")} strokeWidth={sw("ultra-standing")} />
                <text x={628} y={734} textAnchor="middle" fill="white" fontSize={10} style={labelStyle} letterSpacing={1}>ULTRA STANDING</text>
                <text x={628} y={748} textAnchor="middle" fill={MAP_SECTORS["ultra-standing"].accent} fontSize={7} style={monoStyle}>$100.000 / p.</text>
              </Reservable>

              {/* ════════ BARRA pequeña (vertical, abajo derecha) ════════ */}
              <rect x={648} y={774} width={42} height={150} fill="#0a0a0e" stroke="white" strokeWidth={1.5} strokeOpacity={0.85} />
              <text x={669} y={849} textAnchor="middle" fill="white" fillOpacity={0.7} fontSize={12} style={labelStyle} letterSpacing={2} transform="rotate(90, 669, 849)">BARRA</text>

              {/* ════════ VIP NIVEL 3 STANDING (abajo izquierda, con diagonal) ════════ */}
              <Reservable id="vip-n3-standing" selected={selectedId==="vip-n3-standing"} hovered={hoveredId==="vip-n3-standing"} onSelect={handleSelect} onHover={setHoveredId}>
                <path d="M 95 720 L 270 720 L 320 770 L 320 930 L 95 930 Z"
                  fill={fill("vip-n3-standing")} stroke={stroke("vip-n3-standing")} strokeWidth={sw("vip-n3-standing")} />
                <text x={150} y={828} textAnchor="middle" fill="white" fontSize={15} style={labelStyle} letterSpacing={2} transform="rotate(-90, 150, 828)">VIP NIVEL 3</text>
                <text x={205} y={912} textAnchor="middle" fill={MAP_SECTORS["vip-n3-standing"].accent} fontSize={7.5} style={monoStyle}>$50.000 / persona</text>
              </Reservable>

              {/* ════════ CABINA (no reservable, centro-abajo) ════════ */}
              <path d="M 320 770 L 545 770 L 545 855 L 320 855 Z"
                fill="#0a0a0e" stroke="white" strokeWidth={1.5} strokeOpacity={0.85} />
              <text x={432} y={818} textAnchor="middle" fill="white" fillOpacity={0.85} fontSize={15} style={labelStyle} letterSpacing={3}>CABINA</text>

              {/* escaleras chiquitas debajo de la pista (las rayas verticales) */}
              <g stroke="white" strokeWidth={1} strokeOpacity={0.7}>
                <line x1={556} y1={772} x2={556} y2={830} />
                <line x1={568} y1={772} x2={568} y2={830} />
                <line x1={580} y1={772} x2={580} y2={830} />
              </g>

              {/* ════════ BACKSTAGE VIP NIVEL 4 (trapecio abajo) ════════ */}
              <Reservable id="backstage" selected={selectedId==="backstage"} hovered={hoveredId==="backstage"} onSelect={handleSelect} onHover={setHoveredId}>
                <path d="M 320 858 L 600 858 L 600 880 L 560 940 L 320 940 Z"
                  fill={fill("backstage")} stroke={stroke("backstage")} strokeWidth={sw("backstage")} />
                <text x={455} y={902} textAnchor="middle" fill="white" fontSize={18} style={labelStyle} letterSpacing={2}>BACKSTAGE VIP</text>
                <text x={455} y={922} textAnchor="middle" fill="white" fillOpacity={0.7} fontSize={12} style={labelStyle} letterSpacing={2}>NIVEL 4</text>
                <text x={455} y={939} textAnchor="middle" fill={MAP_SECTORS.backstage.accent} fontSize={8} style={monoStyle}>$1.500.000</text>
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
