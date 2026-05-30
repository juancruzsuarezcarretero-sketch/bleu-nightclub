"use client";

import { useState, useEffect, useCallback } from "react";
import { FadeIn } from "@/components/FadeIn";
import MesaDetailPanel, { type MesaInfo } from "@/components/MesaDetailPanel";

type TableStatus = "available" | "reserved" | "selected";

interface Table extends MesaInfo {
  cx: number;
  cy: number;
}

const WHATSAPP_NUMBER = "5493512345678";

const TABLES: Table[] = [
  { id: "V1", label: "V1", tier: "vip", cx: 500, cy: 55 },
  { id: "V2", label: "V2", tier: "vip", cx: 500, cy: 95 },
  { id: "V3", label: "V3", tier: "vip", cx: 500, cy: 135 },
  { id: "V4", label: "V4", tier: "vip", cx: 820, cy: 75 },
  { id: "V5", label: "V5", tier: "vip", cx: 820, cy: 125 },
  { id: "U1", label: "U1", tier: "ultra", cx: 610, cy: 280 },
  { id: "U2", label: "U2", tier: "ultra", cx: 610, cy: 340 },
  { id: "U3", label: "U3", tier: "ultra", cx: 720, cy: 380 },
];

const INITIAL_RESERVED = new Set(["V1", "U2"]);

const statusColors: Record<
  TableStatus,
  { fill: string; stroke: string; glow?: string }
> = {
  available: { fill: "#166534", stroke: "#22c55e" },
  reserved: { fill: "#7f1d1d", stroke: "#ef4444" },
  selected: {
    fill: "#0066FF",
    stroke: "#00AAFF",
    glow: "0 0 12px rgba(0,170,255,0.8)",
  },
};

export interface MapaVIPProps {
  highlightSector?: string | null;
  preselectedPackage?: "Silver" | "Gold" | "Ultra" | null;
}

export default function MapaVIP({
  highlightSector: externalSector,
}: MapaVIPProps) {
  const [tableStatuses, setTableStatuses] = useState<
    Record<string, TableStatus>
  >(() => {
    const initial: Record<string, TableStatus> = {};
    TABLES.forEach((t) => {
      initial[t.id] = INITIAL_RESERVED.has(t.id) ? "reserved" : "available";
    });
    return initial;
  });
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [highlightSector, setHighlightSector] = useState<string | null>(null);

  useEffect(() => {
    if (externalSector) {
      setHighlightSector(externalSector);
      const timer = setTimeout(() => setHighlightSector(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [externalSector]);

  const handleTableClick = useCallback(
    (table: Table) => {
      if (tableStatuses[table.id] === "reserved") return;

      setTableStatuses((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((id) => {
          if (next[id] === "selected") next[id] = "available";
        });
        next[table.id] = "selected";
        return next;
      });

      setSelectedTable(table);
      setPanelOpen(true);
    },
    [tableStatuses]
  );

  const handleSectorClick = (sector: string) => {
    const message = encodeURIComponent(
      `Hola! Quiero consultar disponibilidad en ${sector}`
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const closePanel = () => {
    setPanelOpen(false);
    if (selectedTable) {
      setTableStatuses((prev) => {
        const next = { ...prev };
        if (next[selectedTable.id] === "selected") {
          next[selectedTable.id] = "available";
        }
        return next;
      });
    }
    setSelectedTable(null);
  };

  const isHighlighted = (sector: string) =>
    highlightSector?.toLowerCase().includes(sector.toLowerCase().slice(0, 6));

  return (
    <section
      id="reservas"
      className="min-h-[520px] bg-[#050508] py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <h2 className="mb-4 font-bebas text-4xl tracking-wider text-[#F0F0F0] sm:text-5xl md:text-6xl">
            RESERVÁ TU MESA
          </h2>
          <p className="mb-8 font-mono text-xs text-[#F0F0F0]/50">
            Seleccioná tu mesa · Verde: disponible · Rojo: reservada · Azul:
            seleccionada
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="overflow-x-auto scrollbar-hide touch-pan-x">
            <div className="min-w-[700px] glass-card rounded-xl p-4 sm:p-6">
              <svg
                viewBox="0 0 900 650"
                className="h-auto w-full"
                role="img"
                aria-label="Mapa interactivo del boliche Bleu Nightclub"
              >
                <g
                  className={`cursor-pointer transition-opacity ${isHighlighted("Entrepiso") && !isHighlighted("VIP") ? "opacity-100" : ""}`}
                  onClick={() => handleSectorClick("Entrepiso")}
                >
                  <rect
                    x="10"
                    y="10"
                    width="400"
                    height="170"
                    rx="4"
                    fill="#0b1522"
                    stroke="#1a3050"
                    strokeWidth="1"
                  />
                  <text
                    x="210"
                    y="100"
                    textAnchor="middle"
                    fill="#F0F0F0"
                    opacity="0.5"
                    fontSize="14"
                    fontFamily="monospace"
                  >
                    ENTREPISO
                  </text>
                </g>

                <g>
                  <rect
                    x="420"
                    y="10"
                    width="470"
                    height="170"
                    rx="4"
                    fill="#1a1402"
                    stroke="#C89020"
                    strokeWidth="1"
                    opacity={isHighlighted("Entrepiso VIP") ? 1 : 0.9}
                  />
                  <text
                    x="655"
                    y="30"
                    textAnchor="middle"
                    fill="#C89020"
                    fontSize="11"
                    fontFamily="monospace"
                    letterSpacing="2"
                  >
                    ENTREPISO VIP
                  </text>
                  <line
                    x1="660"
                    y1="10"
                    x2="660"
                    y2="180"
                    stroke="#C89020"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </g>

                <g
                  className="cursor-pointer"
                  onClick={() => handleSectorClick("VIP N3")}
                >
                  <rect
                    x="10"
                    y="190"
                    width="150"
                    height="290"
                    rx="4"
                    fill="#15100a"
                    stroke="#C89020"
                    strokeWidth="0.5"
                    opacity={isHighlighted("VIP N3") ? 1 : 0.9}
                  />
                  <text
                    x="85"
                    y="220"
                    textAnchor="middle"
                    fill="#C89020"
                    fontSize="10"
                    fontFamily="monospace"
                    letterSpacing="1"
                  >
                    VIP N3
                  </text>
                  {[250, 290, 330, 370, 410].map((y) => (
                    <rect
                      key={y}
                      x="30"
                      y={y}
                      width="110"
                      height="25"
                      rx="3"
                      fill="#1a1402"
                      stroke="#C89020"
                      strokeWidth="0.3"
                      opacity="0.6"
                    />
                  ))}
                  <text
                    x="85"
                    y="460"
                    textAnchor="middle"
                    fill="#F0F0F0"
                    opacity="0.3"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    BANQUETAS
                  </text>
                </g>

                <g>
                  <rect
                    x="170"
                    y="190"
                    width="380"
                    height="240"
                    rx="4"
                    fill="#050b16"
                    stroke="#0066FF"
                    strokeWidth="0.5"
                  />
                  <text
                    x="360"
                    y="310"
                    textAnchor="middle"
                    fill="#F0F0F0"
                    opacity="0.4"
                    fontSize="16"
                    fontFamily="monospace"
                    letterSpacing="3"
                  >
                    PISTA PRINCIPAL
                  </text>
                  <rect
                    x="280"
                    y="440"
                    width="160"
                    height="40"
                    rx="4"
                    fill="#0b1522"
                    stroke="#00AAFF"
                    strokeWidth="0.5"
                  />
                  <text
                    x="360"
                    y="465"
                    textAnchor="middle"
                    fill="#00AAFF"
                    fontSize="11"
                    fontFamily="monospace"
                    letterSpacing="2"
                  >
                    CABINA
                  </text>
                </g>

                <g>
                  <rect
                    x="560"
                    y="190"
                    width="200"
                    height="290"
                    rx="4"
                    fill="#0e0820"
                    stroke="#9933cc"
                    strokeWidth="0.5"
                    opacity={isHighlighted("Ultra") ? 1 : 0.9}
                  />
                  <text
                    x="660"
                    y="210"
                    textAnchor="middle"
                    fill="#9933cc"
                    fontSize="10"
                    fontFamily="monospace"
                    letterSpacing="1"
                  >
                    ULTRA VIP
                  </text>
                  <rect
                    x="570"
                    y="220"
                    width="85"
                    height="130"
                    rx="3"
                    fill="#120a28"
                    stroke="#9933cc"
                    strokeWidth="0.3"
                  />
                  <text
                    x="612"
                    y="235"
                    textAnchor="middle"
                    fill="#9933cc"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    PALCO 2
                  </text>
                  <rect
                    x="665"
                    y="220"
                    width="85"
                    height="130"
                    rx="3"
                    fill="#120a28"
                    stroke="#9933cc"
                    strokeWidth="0.3"
                  />
                  <text
                    x="707"
                    y="235"
                    textAnchor="middle"
                    fill="#9933cc"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    PALCO 3
                  </text>
                </g>

                <g
                  className="cursor-pointer"
                  onClick={() => handleSectorClick("Barra")}
                >
                  <rect
                    x="770"
                    y="190"
                    width="120"
                    height="290"
                    rx="4"
                    fill="#050e0e"
                    stroke="#166534"
                    strokeWidth="0.5"
                  />
                  <text
                    x="830"
                    y="340"
                    textAnchor="middle"
                    fill="#F0F0F0"
                    opacity="0.4"
                    fontSize="12"
                    fontFamily="monospace"
                    letterSpacing="2"
                    transform="rotate(-90 830 340)"
                  >
                    BARRA
                  </text>
                </g>

                <g
                  className="cursor-pointer"
                  onClick={() => handleSectorClick("Backstage VIP")}
                >
                  <rect
                    x="10"
                    y="490"
                    width="880"
                    height="150"
                    rx="4"
                    fill="#180204"
                    stroke="#aa0022"
                    strokeWidth="1.5"
                    opacity={isHighlighted("Backstage") ? 1 : 0.95}
                  />
                  <text
                    x="450"
                    y="575"
                    textAnchor="middle"
                    fill="#aa0022"
                    fontSize="18"
                    fontFamily="monospace"
                    letterSpacing="4"
                  >
                    BACKSTAGE VIP
                  </text>
                </g>

                {TABLES.map((table) => {
                  const status = tableStatuses[table.id];
                  const colors = statusColors[status];
                  const isVip = table.id.startsWith("V");
                  const r = isVip ? 18 : 16;

                  return (
                    <g
                      key={table.id}
                      className={`transition-transform ${status !== "reserved" ? "cursor-pointer hover:scale-105" : "cursor-not-allowed"}`}
                      style={{
                        transformOrigin: `${table.cx}px ${table.cy}px`,
                      }}
                      onClick={() => handleTableClick(table)}
                    >
                      <circle
                        cx={table.cx}
                        cy={table.cy}
                        r={r}
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth="2"
                        style={{
                          filter: colors.glow
                            ? `drop-shadow(${colors.glow})`
                            : undefined,
                        }}
                      />
                      <text
                        x={table.cx}
                        y={table.cy + 4}
                        textAnchor="middle"
                        fill="#F0F0F0"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                        pointerEvents="none"
                      >
                        {table.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </FadeIn>
      </div>

      <MesaDetailPanel
        mesa={selectedTable}
        isOpen={panelOpen}
        onClose={closePanel}
      />
    </section>
  );
}
