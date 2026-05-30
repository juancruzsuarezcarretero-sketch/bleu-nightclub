"use client";

import { Check } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

export interface PackageSelection {
  sector: string;
  package: "Silver" | "Gold" | "Ultra";
}

interface PackagesProps {
  onReserve: (selection: PackageSelection) => void;
}

const packages = [
  {
    id: "silver",
    name: "SILVER",
    tagline: "La entrada perfecta",
    badge: "MÁS ELEGIDO",
    price: "Desde $85.000",
    features: [
      "Mesa en Entrepiso VIP",
      "1 botella premium nacional",
      "6 mixers",
      "Hasta 4 personas",
    ],
    sector: "Entrepiso VIP",
    package: "Silver" as const,
    accent: "border-bleu-gold/40",
    glow: "hover:shadow-glow-gold",
  },
  {
    id: "gold",
    name: "GOLD",
    tagline: "La experiencia completa",
    badge: null,
    price: "Desde $150.000",
    features: [
      "Mesa en Ultra VIP Palco 2 o 3",
      "2 botellas premium (nacional o importada)",
      "8 mixers + botella de agua",
      "Hasta 6 personas",
    ],
    sector: "Ultra VIP",
    package: "Gold" as const,
    accent: "border-bleu-electric/40",
    glow: "hover:shadow-glow",
  },
  {
    id: "ultra",
    name: "ULTRA",
    tagline: "La noche sin límites",
    badge: null,
    price: "Desde $280.000",
    features: [
      "Mesa Backstage VIP",
      "3 botellas importadas a elección",
      "Mixers ilimitados + snacks",
      "Hasta 10 personas",
      "Host personal dedicada",
      "Acceso prioritario",
    ],
    sector: "Backstage VIP",
    package: "Ultra" as const,
    accent: "border-red-800/40",
    glow: "hover:shadow-[0_0_20px_rgba(170,0,34,0.4)]",
  },
];

export default function Packages({ onReserve }: PackagesProps) {
  const handleReserve = (pkg: (typeof packages)[0]) => {
    onReserve({ sector: pkg.sector, package: pkg.package });
    document.querySelector("#reservas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-[480px] bg-[#050508] py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <h2 className="mb-12 font-bebas text-4xl tracking-wider text-[#F0F0F0] sm:text-5xl md:text-6xl">
            EXPERIENCIAS
          </h2>
        </FadeIn>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">
          {packages.map((pkg, index) => (
            <FadeIn key={pkg.id} delay={index * 0.08} className="min-w-[300px] flex-shrink-0 snap-center md:min-w-0">
              <article
                className={`glass-card relative h-full rounded-xl border p-6 transition-all duration-300 ${pkg.accent} ${pkg.glow}`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3 left-6 border border-bleu-gold bg-bleu-gold/20 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-bleu-gold">
                    {pkg.badge}
                  </span>
                )}

                <h3 className="font-bebas text-3xl tracking-wider text-[#F0F0F0]">
                  {pkg.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-[#F0F0F0]/50">
                  {pkg.tagline}
                </p>

                <ul className="mt-6 space-y-3">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 font-mono text-xs text-[#F0F0F0]/70"
                    >
                      <Check size={14} className="mt-0.5 flex-shrink-0 text-[#00AAFF]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 font-bebas text-2xl text-[#C89020]">
                  {pkg.price}
                </p>

                <button
                  type="button"
                  onClick={() => handleReserve(pkg)}
                  className="mt-4 w-full border border-[#0066FF]/50 py-2.5 font-mono text-xs uppercase tracking-widest text-[#F0F0F0] transition-all hover:border-[#0066FF]"
                >
                  Reservar
                </button>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
