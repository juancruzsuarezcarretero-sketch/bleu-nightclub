"use client";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { FadeIn } from "@/components/FadeIn";
import { whatsappUrl } from "@/lib/whatsapp";

const photos = [
  "https://images.unsplash.com/photo-1566737238500-ac588a25a0a8?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdcbed?w=600&h=400&fit=crop",
];

export default function Nosotros() {
  return (
    <section
      id="nosotros"
      className="min-h-[480px] bg-[#050508] py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <h2 className="font-bebas text-4xl tracking-wider text-[#F0F0F0] sm:text-5xl">
              NOSOTROS
            </h2>
            <p className="mt-6 font-bebas text-2xl leading-snug text-[#00AAFF] sm:text-3xl">
              BLEU es más que un boliche. Es la noche de Córdoba.
            </p>
            <p className="mt-4 font-mono text-sm leading-relaxed text-[#F0F0F0]/60">
              Desde 2018, redefinimos la experiencia nocturna en el corazón de
              la ciudad. Música de primer nivel, producción de lujo y el
              ambiente más exclusivo del Centro.
            </p>
            <div className="mt-8 space-y-3 font-mono text-xs text-[#F0F0F0]/50">
              <p>
                <span className="text-[#00AAFF]">Horarios:</span> Viernes y
                Sábados · 00:00 a 05:00 hs
              </p>
              <p>
                <span className="text-[#00AAFF]">Dirección:</span> Av. Marcelo
                T. de Alvear 635, Córdoba
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <a
                href="https://instagram.com/bleu.club"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#F0F0F0]/60 transition-all hover:border-[#0066FF] hover:text-[#00AAFF]"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#F0F0F0]/60 transition-all hover:border-[#25D366] hover:text-[#25D366]"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              {photos.map((src, i) => (
                <div
                  key={i}
                  className="group relative aspect-[3/2] min-h-[120px] overflow-hidden rounded-lg"
                >
                  <Image
                    src={src}
                    alt={`Bleu Nightclub ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-[#0066FF]/0 transition-colors duration-300 group-hover:bg-[#0066FF]/10" />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-[#0066FF]/40 bg-[#0066FF]/5 p-8">
              <p className="font-mono text-xs tracking-widest text-[#0066FF]/60">
                VIERNES
              </p>
              <h3 className="mt-2 font-bebas text-5xl tracking-wider text-[#F0F0F0]">
                BLEU
              </h3>
              <p className="mt-3 font-mono text-sm text-[#F0F0F0]/50">
                La noche azul de Córdoba. Música electrónica, ambiente premium
                y la mejor producción del centro.
              </p>
            </div>
            <div className="rounded-lg border border-[#C89020]/40 bg-[#C89020]/5 p-8">
              <p className="font-mono text-xs tracking-widest text-[#C89020]/60">
                SÁBADOS
              </p>
              <h3 className="mt-2 font-bebas text-5xl tracking-wider text-[#F0F0F0]">
                BARTO
              </h3>
              <p className="mt-3 font-mono text-sm text-[#F0F0F0]/50">
                El sábado tiene otro nombre. Reggaeton, Latin y la energía más
                alta de la semana.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}