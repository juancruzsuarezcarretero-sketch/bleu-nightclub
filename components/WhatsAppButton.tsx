"use client";

import { MessageCircle } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { whatsappUrl } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  const { contacto } = useContent();
  return (
    <a
      href={whatsappUrl(contacto.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 animate-pulse-green"
    >
      <MessageCircle size={28} fill="white" strokeWidth={0} />
    </a>
  );
}
