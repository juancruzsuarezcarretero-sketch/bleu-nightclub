"use client";

import { useRef } from "react";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import type { PackageId } from "@/lib/whatsapp";
import { reservationFromPackage } from "@/lib/reservation-selection";
import { useReservation } from "@/context/ReservationContext";

const packages: {
  id: PackageId;
  name: string;
  tagline: string;
  badge: string | null;
  price: string;
  features: string[];
  accent: string;
  glow: string;
  priceColor: string;
}[] = [
  {
    id: "vip-gold",
    name: "VIP GOLD",
    tagline: "Acceso VIP premium",
    badge: "MÁS ELEGIDO",
    price: "$35.000 por persona",
    features: ["Acceso sector VIP Gold", "Sin límite de personas"],
    accent: "border-[#C89020]/40",
    glow: "hover:shadow-[0_0_20px_rgba(200,144,32,0.25)]",
    priceColor: "text-[#C89020]",
  },
  {
    id: "vip-standing",
    name: "VIP STANDING",
    tagline: "La experiencia standing",
    badge: null,
    price: "$50.000 por persona",
    features: ["Acceso VIP Standing", "Sin límite de personas"],
    accent: "border-[#C89020]/40",
    glow: "hover:shadow-[0_0_20px_rgba(200,144,32,0.25)]",
    priceColor: "text-[#C89020]",
  },
  {
    id: "ultra",
    name: "ULTRA",
    tagline: "Acceso Ultra VIP",
    badge: null,
    price: "$100.000 por persona",
    features: ["Acceso Ultra VIP", "Sin límite de personas"],
    accent: "border-[#9933cc]/40",
    glow: "hover:shadow-[0_0_20px_rgba(153,51,204,0.25)]",
    priceColor: "text-[#9933cc]",
  },
  {
    id: "mesa-vip",
    name: "MESA VIP",
    tagline: "Tu mesa en el sector VIP",
    badge: null,
    price: "$700.000 mesa completa",
    features: [
      "Hasta 10 personas",
      "Lugar reservado",
      "Cristalería individual",
      "Moza a disposición",
    ],
    accent: "border-[#C89020]/40",
    glow: "hover:shadow-[0_0_20px_rgba(200,144,32,0.25)]",
    priceColor: "text-[#C89020]",
  },
  {
    id: "mesa-ultra",
    name: "MESA ULTRA VIP",
    tagline: "La experiencia definitiva",
    badge: null,
    price: "$1.200.000 mesa completa",
    features: [
      "Hasta 10 personas",
      "Lugar reservado",
      "Cristalería individual",
      "Moza a disposición",
    ],
    accent: "border-[#9933cc]/40",
    glow: "hover:shadow-[0_0_20px_rgba(153,51,204,0.25)]",
    priceColor: "text-[#9933cc]",
  },
];

export default function Packages() {
  const { startReservation } = useReservation();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  const handleReserve = (packageId: PackageId) => {
    startReservation(reservationFromPackage(packageId));
  };

  return (
    <section className="min-h-[480px] bg-[#050508]/80 py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <h2 className="mb-12 font-bebas text-4xl tracking-wider text-[#F0F0F0] sm:text-5xl md:text-6xl">
            EXPERIENCIAS
          </h2>
        </FadeIn>

        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
        {(["prev", "next"] as const).map((side) => (
          <button
            key={side}
            type="button"
            aria-label={side === "prev" ? "Anterior" : "Siguiente"}
            onClick={() => scrollByCard(side === "prev" ? -1 : 1)}
            className={`group/arrow absolute inset-y-0 z-10 hidden w-24 items-center text-[#F0F0F0]/70 transition hover:text-white sm:flex lg:w-32 ${
              side === "prev"
                ? "left-0 justify-start bg-gradient-to-r from-[#050508]/80 to-transparent pl-3"
                : "right-0 justify-end bg-gradient-to-l from-[#050508]/80 to-transparent pr-3"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-16 w-16 drop-shadow-[0_0_12px_rgba(0,102,255,0.6)] transition-transform group-hover/arrow:scale-110" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d={side === "prev" ? "M15 4l-8 8 8 8" : "M9 4l8 8-8 8"} />
            </svg>
          </button>
        ))}
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pt-4 pb-4 scroll-px-4 sm:px-6 sm:scroll-px-6 lg:px-8 lg:scroll-px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {packages.map((pkg, index) => (
            <FadeIn
              key={pkg.id}
              delay={index * 0.08}
              className="w-[280px] flex-shrink-0 snap-start"
            >
              <article
                className={`glass-card relative flex h-full flex-col rounded-xl border p-6 transition-all duration-300 ${pkg.accent} ${pkg.glow}`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3 left-6 border border-[#C89020] bg-[#C89020]/20 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#C89020]">
                    {pkg.badge}
                  </span>
                )}

                <h3 className="font-bebas text-3xl tracking-wider text-[#F0F0F0]">
                  {pkg.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-[#F0F0F0]/50">
                  {pkg.tagline}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 font-mono text-xs text-[#F0F0F0]/70"
                    >
                      <Check
                        size={14}
                        className="mt-0.5 flex-shrink-0 text-[#00AAFF]"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <p className={`mt-6 font-bebas text-xl leading-tight ${pkg.priceColor}`}>
                  {pkg.price}
                </p>

                <button
                  type="button"
                  onClick={() => handleReserve(pkg.id)}
                  className="mt-4 w-full border border-[#0066FF]/50 py-2.5 font-mono text-xs uppercase tracking-widest text-[#F0F0F0] transition-all hover:border-[#0066FF] hover:text-[#00AAFF]"
                >
                  Reservar
                </button>
              </article>
            </FadeIn>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
