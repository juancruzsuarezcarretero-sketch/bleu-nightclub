"use client";

import { MessageCircle } from "lucide-react";
import { InstagramIcon, TikTokIcon } from "@/components/icons/SocialIcons";
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
            href="#"
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

        <p className="mt-8 font-mono text-xs text-[#F0F0F0]/40">
          © 2025 Bleu Nightclub · Córdoba, Argentina
        </p>
        <p className="mt-2 font-mono text-xs text-[#F0F0F0]/30">
          Av. Marcelo T. de Alvear 635
        </p>
      </div>
    </footer>
  );
}
