"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { InstagramIcon, TikTokIcon } from "@/components/icons/SocialIcons";
import { INSTAGRAM_URL } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="min-h-[200px] border-t border-white/5 bg-[#050508] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="font-bebas text-5xl tracking-[0.3em] text-[#F0F0F0] sm:text-6xl">
          BLEU
        </p>

        <div className="mt-8 flex items-center justify-center gap-6">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[#F0F0F0]/40 transition-colors hover:text-[#00AAFF]"
          >
            <InstagramIcon size={22} />
          </a>
          <a
            href="#"
            aria-label="TikTok"
            className="text-[#F0F0F0]/40 transition-colors hover:text-[#00AAFF]"
          >
            <TikTokIcon size={22} />
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-[#F0F0F0]/40 transition-colors hover:text-[#25D366]"
          >
            <MessageCircle size={22} />
          </a>
        </div>

        <nav
          aria-label="Documentos legales"
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs"
        >
          <Link href="/terminos" className="text-[#F0F0F0]/40 transition-colors hover:text-[#00AAFF]">
            Términos y condiciones
          </Link>
          <Link href="/privacidad" className="text-[#F0F0F0]/40 transition-colors hover:text-[#00AAFF]">
            Privacidad
          </Link>
          <Link href="/cookies" className="text-[#F0F0F0]/40 transition-colors hover:text-[#00AAFF]">
            Cookies
          </Link>
        </nav>

        <p className="mt-6 font-mono text-xs text-[#F0F0F0]/50">
          Solo mayores de 18 años · Beber con moderación · Prohibida la venta de alcohol a menores de 18
        </p>
        <p className="mt-3 font-mono text-xs text-[#F0F0F0]/40">
          © {new Date().getFullYear()} Bleu Nightclub · Córdoba, Argentina
        </p>
        <p className="mt-2 font-mono text-xs text-[#F0F0F0]/30">
          Av. Marcelo T. de Alvear 635
        </p>
      </div>
    </footer>
  );
}
