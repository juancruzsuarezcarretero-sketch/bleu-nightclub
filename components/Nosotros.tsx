"use client";
import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { FadeIn } from "@/components/FadeIn";
import NuestrasNoches from "@/components/NuestrasNoches";
import { whatsappUrl } from "@/lib/whatsapp";
import { useContent } from "@/context/ContentContext";


export default function Nosotros() {
  const { contacto, textos } = useContent();
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
            <p className="mt-6 font-bebas text-2xl leading-snug text-[#FF9A3C] sm:text-3xl">
              {textos.nosotrosBajada}
            </p>
            <p className="mt-4 font-mono text-sm leading-relaxed text-[#F0F0F0]/60">
              {textos.nosotrosDescripcion}
            </p>
            <div className="mt-8 space-y-3 font-mono text-xs text-[#F0F0F0]/50">
              <p>
                <span className="text-[#FF9A3C]">Horarios:</span> {contacto.horarios}
              </p>
              <p>
                <span className="text-[#FF9A3C]">Dirección:</span> {contacto.direccion.calle}, {contacto.direccion.ciudad}
              </p>
              <p>
                <span className="text-[#FF9A3C]">Ingreso:</span> {textos.nosotrosIngreso}
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <a
                href={contacto.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#F0F0F0]/60 transition-all hover:border-[#FF6A00] hover:text-[#FF9A3C]"
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
            <div className="rounded-lg border border-[#FF6A00]/40 bg-[#FF6A00]/5 p-8">
              <p className="font-mono text-xs tracking-widest text-[#FF6A00]/60">
                VIERNES
              </p>
              <h3 className="mt-2 font-bebas text-5xl tracking-wider text-[#F0F0F0]">
                BLEU
              </h3>
              <p className="mt-3 font-mono text-sm text-[#F0F0F0]/50">
                {textos.nocheViernes}
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
                {textos.nocheSabado}
              </p>
            </div>
            </div>
          </FadeIn>
        </div>

        <NuestrasNoches />

        <FadeIn delay={0.15}>
          <div className="overflow-hidden rounded-lg border border-white/10">
            <iframe
              title="Mapa: cómo llegar a BARTO Nightclub"
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
            className="mt-3 inline-block font-mono text-xs text-[#FF9A3C] transition-colors hover:text-[#F0F0F0]"
          >
            Cómo llegar →
          </a>
        </FadeIn>
      </div>
    </section>
  );
}