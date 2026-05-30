"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";
import { useMounted } from "@/lib/useMounted";

type EventCategory = "House" | "Techno" | "Latin" | "Open Format" | "Bass House";

interface Event {
  id: number;
  name: string;
  date: string;
  dateShort: string;
  category: EventCategory;
  filterCategory: "House" | "Techno" | "Latin" | "Open Format";
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
      "https://images.unsplash.com/photo-1571266028243-e4733b3f597b?w=600&h=800&fit=crop",
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

const filters = ["Todos", "House", "Techno", "Latin", "Open Format"] as const;
type Filter = (typeof filters)[number];

const categoryColors: Record<string, string> = {
  House: "bg-bleu-electric/20 text-bleu-cyan border-bleu-electric/30",
  Techno: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Open Format": "bg-bleu-cyan/20 text-bleu-cyan border-bleu-cyan/30",
  "Bass House": "bg-bleu-gold/20 text-bleu-gold border-bleu-gold/30",
  "Reggaeton/Latin": "bg-pink-500/20 text-pink-300 border-pink-500/30",
};

export default function Eventos() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Todos");
  const mounted = useMounted();

  const filtered =
    activeFilter === "Todos"
      ? events
      : events.filter((e) => e.filterCategory === activeFilter);

  return (
    <section
      id="eventos"
      className="min-h-[480px] bg-[#050508] py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <h2 className="mb-4 font-bebas text-4xl tracking-wider text-[#F0F0F0] sm:text-5xl md:text-6xl">
            PRÓXIMAS NOCHES
          </h2>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="mb-10 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-none border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all ${
                  activeFilter === filter
                    ? "border-[#0066FF] bg-[#0066FF]/20 text-[#00AAFF]"
                    : "border-white/10 text-[#F0F0F0]/50 hover:border-white/30 hover:text-[#F0F0F0]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((event) => (
              <motion.article
                key={event.id}
                layout={mounted}
                initial={mounted ? { opacity: 0, scale: 0.98 } : false}
                animate={{ opacity: 1, scale: 1 }}
                exit={mounted ? { opacity: 0, scale: 0.98 } : undefined}
                transition={{ duration: 0.3 }}
                className="group relative aspect-[3/4] min-h-[320px] overflow-hidden rounded-lg"
              >
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                    className={`mt-3 inline-block w-fit border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${categoryColors[event.category] ?? categoryColors["House"]}`}
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
    </section>
  );
}
