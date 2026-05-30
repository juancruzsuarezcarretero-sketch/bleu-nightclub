"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useMounted } from "@/lib/useMounted";

const WHATSAPP_NUMBER = "5493512345678";

export type MesaTier = "vip" | "ultra";

export interface MesaInfo {
  id: string;
  label: string;
  tier: MesaTier;
}

const TIER_CONFIG: Record<
  MesaTier,
  {
    sectorName: string;
    capacity: string;
    price: string;
    includes: string[];
    accent: string;
    accentBorder: string;
    accentBg: string;
    accentGlow: string;
    buttonBg: string;
    buttonHover: string;
  }
> = {
  vip: {
    sectorName: "VIP Nivel 3",
    capacity: "hasta 10 personas",
    price: "$700.000",
    includes: [
      "Lugar reservado",
      "Cristalería individual",
      "Moza a disposición",
    ],
    accent: "#C89020",
    accentBorder: "border-[#C89020]/40",
    accentBg: "bg-[#1a1402]/80",
    accentGlow: "shadow-[0_0_30px_rgba(200,144,32,0.15)]",
    buttonBg: "bg-[#C89020]",
    buttonHover: "hover:bg-[#C89020]/90 hover:shadow-[0_0_20px_rgba(200,144,32,0.4)]",
  },
  ultra: {
    sectorName: "Ultra VIP Nivel 4",
    capacity: "hasta 10 personas",
    price: "$700.000",
    includes: [
      "Lugar reservado",
      "Cristalería individual",
      "Moza a disposición",
    ],
    accent: "#9933cc",
    accentBorder: "border-[#9933cc]/40",
    accentBg: "bg-[#0e0820]/80",
    accentGlow: "shadow-[0_0_30px_rgba(153,51,204,0.15)]",
    buttonBg: "bg-[#9933cc]",
    buttonHover: "hover:bg-[#9933cc]/90 hover:shadow-[0_0_20px_rgba(153,51,204,0.4)]",
  },
};

interface MesaDetailPanelProps {
  mesa: MesaInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

function PanelContent({
  mesa,
  onClose,
}: {
  mesa: MesaInfo;
  onClose: () => void;
}) {
  const config = TIER_CONFIG[mesa.tier];

  const handleReserve = () => {
    const message = encodeURIComponent(
      `Hola! Quiero reservar la Mesa ${mesa.label} para la próxima noche`
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      className={`relative flex max-h-[90dvh] flex-col overflow-y-auto rounded-t-2xl border p-6 md:max-h-none md:rounded-xl ${config.accentBorder} ${config.accentBg} ${config.accentGlow} backdrop-blur-xl`}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: config.accent }}
          >
            {config.sectorName}
          </p>
          <h3 className="mt-1 font-bebas text-3xl tracking-wider text-[#F0F0F0]">
            Mesa {mesa.label}
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
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-white/10 bg-[#050508]/50 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/40">
              Sector
            </p>
            <p className="mt-1 font-mono text-sm text-[#F0F0F0]">
              {config.sectorName}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#050508]/50 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/40">
              Capacidad
            </p>
            <p className="mt-1 font-mono text-sm text-[#F0F0F0]">
              {config.capacity}
            </p>
          </div>
        </div>

        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: `${config.accent}40`,
            backgroundColor: `${config.accent}10`,
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#F0F0F0]/40">
            Precio
          </p>
          <p
            className="mt-1 font-bebas text-3xl tracking-wide"
            style={{ color: config.accent }}
          >
            {config.price}
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
                  style={{ color: config.accent }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={handleReserve}
        className={`mt-8 w-full py-3.5 font-mono text-xs uppercase tracking-widest text-[#F0F0F0] transition-all ${config.buttonBg} ${config.buttonHover}`}
      >
        Reservar Esta Mesa
      </button>
    </div>
  );
}

export default function MesaDetailPanel({
  mesa,
  isOpen,
  onClose,
}: MesaDetailPanelProps) {
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted || !isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, mounted]);

  if (!mesa || !isOpen) return null;

  if (!mounted) {
    return (
      <>
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 md:inset-y-0 md:left-auto md:right-0 md:flex md:w-full md:max-w-md md:items-center md:p-6">
          <PanelContent mesa={mesa} onClose={onClose} />
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
        <PanelContent mesa={mesa} onClose={onClose} />
      </motion.div>
      <motion.div
        key="panel-desktop"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="fixed inset-y-0 right-0 z-50 hidden w-full max-w-md items-center p-6 md:flex"
      >
        <PanelContent mesa={mesa} onClose={onClose} />
      </motion.div>
    </AnimatePresence>
  );
}
