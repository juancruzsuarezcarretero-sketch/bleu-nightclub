"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Minus, Plus } from "lucide-react";
import { useMounted } from "@/lib/useMounted";
import {
  MAP_SECTORS,
  MAP_THEME_STYLES,
  formatARS,
  getSectorTypeLabel,
  calculateSectorTotal,
  type MapSectorSelection,
} from "@/lib/map-sectors";
import { reservationFromMapSelection } from "@/lib/reservation-selection";
import { useReservation } from "@/context/ReservationContext";

interface SectorReservationPanelProps {
  selection: MapSectorSelection | null;
  isOpen: boolean;
  onClose: () => void;
}

function PanelContent({
  selection,
  onClose,
}: {
  selection: MapSectorSelection;
  onClose: () => void;
}) {
  const config = MAP_SECTORS[selection.sectorId];
  const theme = MAP_THEME_STYLES[config.theme];
  const perPerson = Boolean(config.pricePerPerson);
  const isTable = config.type === "mesa" && config.fixedPrice;

  const defaultPersons = perPerson ? 2 : isTable ? 4 : 2;
  const [persons, setPersons] = useState(defaultPersons);

  useEffect(() => {
    setPersons(defaultPersons);
  }, [selection.sectorId, defaultPersons]);

  const totalPrice = calculateSectorTotal(config, persons);
  const { startReservation } = useReservation();

  const handleReserve = () => {
    startReservation(reservationFromMapSelection(selection, persons));
    onClose();
  };

  const maxPersons = perPerson ? 99 : config.maxCapacity ?? 99;

  const adjustPersons = (delta: number) => {
    setPersons((prev) => Math.min(maxPersons, Math.max(1, prev + delta)));
  };

  return (
    <div
      className={`relative flex max-h-[90dvh] flex-col overflow-y-auto rounded-t-2xl border p-6 md:max-h-none md:rounded-xl ${theme.accentBorder} ${theme.accentBg} ${theme.accentGlow} backdrop-blur-xl`}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: theme.accent }}
          >
            {config.typeLabel ?? getSectorTypeLabel(config.type)}
          </p>
          <h3 className="mt-1 font-bebas text-3xl tracking-wider text-[#F0F0F0]">
            {config.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 rounded-lg p-2 text-[#F0F0F0]/60 transition-colors hover:bg-white/10 hover:text-[#F0F0F0]"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-5">
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: `${theme.accent}40`,
            backgroundColor: `${theme.accent}10`,
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/40">
            {perPerson ? "Precio por persona" : "Precio total"}
          </p>
          <p
            className="mt-1 font-bebas text-4xl tracking-wide"
            style={{ color: theme.accent }}
          >
            {perPerson
              ? formatARS(config.pricePerPerson!)
              : formatARS(config.fixedPrice!)}
          </p>
          {perPerson && (
            <p className="mt-1 font-mono text-xs text-[#F0F0F0]/50">
              por persona
            </p>
          )}
        </div>

        <div className="rounded-lg border border-white/10 bg-[#050508]/50 p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/40">
            Capacidad
          </p>
          <p className="mt-1 font-mono text-sm text-[#F0F0F0]">
            {config.capacityLabel}
          </p>
        </div>

        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/40">
            Incluye
          </p>
          <ul className="space-y-2">
            {config.includes.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 font-mono text-sm text-[#F0F0F0]/80"
              >
                <Check
                  size={14}
                  className="flex-shrink-0"
                  style={{ color: theme.accent }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#050508]/50 p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/40">
            Cantidad de personas
          </p>
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => adjustPersons(-1)}
              className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#F0F0F0] transition-colors hover:border-white/30"
              aria-label="Menos personas"
            >
              <Minus size={16} />
            </button>
            <span className="font-bebas text-3xl text-[#F0F0F0]">{persons}</span>
            <button
              type="button"
              onClick={() => adjustPersons(1)}
              className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#F0F0F0] transition-colors hover:border-white/30"
              aria-label="Más personas"
            >
              <Plus size={16} />
            </button>
          </div>
          <p className="mt-4 text-center font-mono text-sm text-[#F0F0F0]/70">
            {perPerson ? (
              <>
                {persons} {persons === 1 ? "persona" : "personas"} ×{" "}
                {formatARS(config.pricePerPerson!)} ={" "}
                <span style={{ color: theme.accent }}>
                  {formatARS(totalPrice)}
                </span>
              </>
            ) : (
              <>
                Total:{" "}
                <span style={{ color: theme.accent }}>
                  {formatARS(totalPrice)}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleReserve}
        className={`mt-8 w-full py-3.5 font-mono text-xs uppercase tracking-widest text-[#F0F0F0] transition-all ${theme.buttonBg} ${theme.buttonHover}`}
      >
        Reservar
      </button>
    </div>
  );
}

export default function SectorReservationPanel({
  selection,
  isOpen,
  onClose,
}: SectorReservationPanelProps) {
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted || !isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, mounted]);

  if (!selection || !isOpen) return null;

  if (!mounted) {
    return (
      <>
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 md:inset-y-0 md:left-auto md:right-0 md:flex md:w-full md:max-w-md md:items-center md:p-6">
          <PanelContent selection={selection} onClose={onClose} />
        </div>
      </>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="panel-mobile"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="fixed inset-x-0 bottom-0 z-50 p-4 md:hidden"
      >
        <PanelContent selection={selection} onClose={onClose} />
      </motion.div>
      <motion.div
        key="panel-desktop"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="fixed inset-y-0 right-0 z-50 hidden w-full max-w-md items-center p-6 md:flex"
      >
        <PanelContent selection={selection} onClose={onClose} />
      </motion.div>
    </AnimatePresence>
  );
}
