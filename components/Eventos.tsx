"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";
import { useMounted } from "@/lib/useMounted";

type EventCategory =
  | "House"
  | "Techno"
  | "Latin"
  | "Open Format"
  | "Bass House"
  | "Reggaeton/Latin";

type FilterCategory = "House" | "Techno" | "Latin" | "Open Format";

interface Event {
  id: number;
  name: string;
  date: string;
  dateShort: string;
  category: EventCategory;
  filterCategory: FilterCategory;
  image: string;
}

const events: Event[] = [
  {
    id: 1,
    name: "FISHER",
    date: "Vie 20/06",
    dateShort: "VIE 20.06",
    category: "Techno",
    filterCategory: "Techno",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=800&fit=crop",
  },
  {
    id: 2,
    name: "OPEN FORMAT NIGHT",
    date: "Sáb 21/06",
    dateShort: "SÁB 21.06",
    category: "Open Format",
    filterCategory: "Open Format",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=800&fit=crop",
  },
  {
    id: 3,
    name: "VALENTINO KHAN",
    date: "Vie 27/06",
    dateShort: "VIE 27.06",
    category: "Bass House",
    filterCategory: "House",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=800&fit=crop",
  },
  {
    id: 4,
    name: "NOCHE LATINA",
    date: "Sáb 28/06",
    dateShort: "SÁB 28.06",
    category: "Reggaeton/Latin",
    filterCategory: "Latin",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=800&fit=crop",
  },
];

const categoryColors: Record<EventCategory, string> = {
  House: "bg-bleu-electric/20 text-bleu-cyan border-bleu-electric/30",
  Techno: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Latin: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Open Format": "bg-bleu-cyan/20 text-bleu-cyan border-bleu-cyan/30",
  "Bass House": "bg-bleu-gold/20 text-bleu-gold border-bleu-gold/30",
  "Reggaeton/Latin": "bg-pink-500/20 text-pink-300 border-pink-500/30",
};

export default function Eventos() {
  const mounted = useMounted();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };


  return (
    <section
      id="eventos"
      className="min-h-[480px] bg-[#050508] py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <h2 className="mb-10 font-bebas text-4xl tracking-wider text-[#F0F0F0] sm:text-5xl md:text-6xl">
            PRÓXIMAS NOCHES
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
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 scroll-px-4 sm:px-6 sm:scroll-px-6 lg:px-8 lg:scroll-px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <AnimatePresence mode="popLayout">
            {events.map((event) => (
              <motion.article
                key={event.id}
                layout={mounted}
                initial={mounted ? { opacity: 0, scale: 0.98 } : false}
                animate={{ opacity: 1, scale: 1 }}
                exit={mounted ? { opacity: 0, scale: 0.98 } : undefined}
                transition={{ duration: 0.3 }}
                className="group relative aspect-[3/4] min-h-[320px] w-[72vw] shrink-0 snap-start overflow-hidden rounded-lg sm:w-[320px] lg:w-[360px]"
              >
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 72vw, 360px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/60 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="font-mono text-xs tracking-widest text-[#00AAFF]">
                    {event.dateShort}
                  </span>
                  <h3 className="mt-1 font-bebas text-3xl tracking-wide text-[#F0F0F0] sm:text-4xl">
                    {event.name}
                  </h3>
                  <span
                    className={`mt-3 inline-block w-fit border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${categoryColors[event.category]}`}
                  >
                    {event.category}
                  </span>
                  <button
                    type="button"
                    className="mt-4 w-fit border border-[#0066FF]/50 px-5 py-2 font-mono text-xs uppercase tracking-widest text-[#F0F0F0]"
                  >
                    Entradas
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
        </div>
      </div>
    </section>
  );
}
