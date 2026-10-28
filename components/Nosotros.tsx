"use client";
import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { FadeIn } from "@/components/FadeIn";
import NuestrasNoches from "@/components/NuestrasNoches";
import { whatsappUrl } from "@/lib/whatsapp";
import { useContent } from "@/context/ContentContext";


export default function Nosotros() {
  const { contacto } = useContent();
  const MAP_QUERY = encodeURIComponent(`${contacto.direccion.calle}, ${contacto.direccion.ciudad}, Argentina`);
  return (
    <section
      id="nosotros"
      className="min-h-[480px] bg-[#050508]/80 py-24 px-4 sm:px-6 lg:px-8"
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
                <span className="text-[#00AAFF]">Horarios:</span> {contacto.horarios}
              </p>
              <p>
                <span className="text-[#00AAFF]">Dirección:</span> {contacto.direccion.calle}, {contacto.direccion.ciudad}
              </p>
              <p>
                <span className="text-[#00AAFF]">Ingreso:</span> +18 · DNI
                obligatorio · Dress code elegante sport
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <a
                href={contacto.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#F0F0F0]/60 transition-all hover:border-[#0066FF] hover:text-[#00AAFF]"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={whatsappUrl(contacto.whatsapp)}
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
            <div className="grid grid-cols-1 gap-6">
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

        <NuestrasNoches />

        <FadeIn delay={0.15}>
          <div className="overflow-hidden rounded-lg border border-white/10">
            <iframe
              title="Mapa: cómo llegar a BLEU Nightclub"
              src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[320px] w-full border-0 opacity-80 [filter:invert(90%)_hue-rotate(180deg)_contrast(0.9)] sm:h-[400px]"
            />
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block font-mono text-xs text-[#00AAFF] transition-colors hover:text-[#F0F0F0]"
          >
            Cómo llegar →
          </a>
        </FadeIn>
      </div>
    </section>
  );
}