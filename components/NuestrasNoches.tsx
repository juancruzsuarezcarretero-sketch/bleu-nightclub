"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { useMounted } from "@/lib/useMounted";

interface NightPhoto {
  id: number;
  date: string;
  eventName: string;
  image: string;
  aspect: "tall" | "wide" | "square";
}

const ALL_PHOTOS: NightPhoto[] = [
  {
    id: 1,
    date: "VIE 15.05",
    eventName: "BLEU × SPEED LIDER",
    image:
      "https://images.unsplash.com/photo-1566737238500-ac588a25a0a8?w=800&h=1000&fit=crop",
    aspect: "tall",
  },
  {
    id: 2,
    date: "SÁB 16.05",
    eventName: "TECHNO NIGHT",
    image:
      "https://images.unsplash.com/photo-1571266028243-e4733b3f597b?w=800&h=600&fit=crop",
    aspect: "wide",
  },
  {
    id: 3,
    date: "VIE 22.05",
    eventName: "LATIN SESSION",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop",
    aspect: "square",
  },
  {
    id: 4,
    date: "SÁB 23.05",
    eventName: "OPEN FORMAT",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=1100&fit=crop",
    aspect: "tall",
  },
  {
    id: 5,
    date: "VIE 29.05",
    eventName: "BLEU × MARTIN GARRIX",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
    aspect: "wide",
  },
  {
    id: 6,
    date: "SÁB 30.05",
    eventName: "NOCHE DORADA VIP",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50c?w=800&h=900&fit=crop",
    aspect: "tall",
  },
  {
    id: 7,
    date: "VIE 05.06",
    eventName: "HOUSE AFFAIRS",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=800&fit=crop",
    aspect: "square",
  },
  {
    id: 8,
    date: "SÁB 06.06",
    eventName: "BLEU × W&W",
    image:
      "https://images.unsplash.com/photo-1429962714451-bb934ecdcbed?w=800&h=600&fit=crop",
    aspect: "wide",
  },
  {
    id: 9,
    date: "VIE 12.06",
    eventName: "BASS HOUSE SESSION",
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=1000&fit=crop",
    aspect: "tall",
  },
  {
    id: 10,
    date: "SÁB 13.06",
    eventName: "REGGAETON NIGHT",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=800&fit=crop",
    aspect: "square",
  },
  {
    id: 11,
    date: "VIE 19.06",
    eventName: "BLEU ANNIVERSARY",
    image:
      "https://images.unsplash.com/photo-1545128485-c400e7702797?w=800&h=600&fit=crop",
    aspect: "wide",
  },
  {
    id: 12,
    date: "SÁB 20.06",
    eventName: "CLOSING SUMMER",
    image:
      "https://images.unsplash.com/photo-1598387993288-934d9bbd4729?w=800&h=1100&fit=crop",
    aspect: "tall",
  },
];

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 4;

const aspectClasses: Record<NightPhoto["aspect"], string> = {
  tall: "aspect-[3/4] sm:aspect-[4/5]",
  wide: "aspect-[4/3]",
  square: "aspect-square",
};

interface LightboxProps {
  photos: NightPhoto[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ photos, index, onClose, onPrev, onNext }: LightboxProps) {
  const photo = photos[index];
  const mounted = useMounted();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onPrev, onNext]);

  const content = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-[#F0F0F0]/70 transition-colors hover:bg-white/10 hover:text-[#F0F0F0]"
        aria-label="Cerrar"
      >
        <X size={24} />
      </button>

      <button
        type="button"
        onClick={onPrev}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-[#F0F0F0]/70 transition-colors hover:bg-white/10 hover:text-[#F0F0F0] sm:left-4"
        aria-label="Foto anterior"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        type="button"
        onClick={onNext}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-[#F0F0F0]/70 transition-colors hover:bg-white/10 hover:text-[#F0F0F0] sm:right-4"
        aria-label="Foto siguiente"
      >
        <ChevronRight size={32} />
      </button>

      <div className="relative mx-auto h-[70vh] w-full max-w-5xl px-12 sm:px-16">
        <Image
          src={photo.image}
          alt={photo.eventName}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="font-mono text-xs tracking-widest text-[#00AAFF]">
          {photo.date}
        </p>
        <p className="mt-1 font-bebas text-2xl tracking-wider text-[#F0F0F0] sm:text-3xl">
          {photo.eventName}
        </p>
        <p className="mt-2 font-mono text-xs text-[#F0F0F0]/40">
          {index + 1} / {photos.length}
        </p>
      </div>
    </>
  );

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95">
        {content}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </motion.div>
  );
}

function GalleryItem({
  photo,
  index,
  onOpen,
}: {
  photo: NightPhoto;
  index: number;
  onOpen: () => void;
}) {
  const mounted = useMounted();

  const card = (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative w-full overflow-hidden rounded-lg ${aspectClasses[photo.aspect]}`}
    >
      <Image
        src={photo.image}
        alt={photo.eventName}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      <div className="absolute inset-0 bg-[#050508]/70 transition-colors duration-300 group-hover:bg-[#050508]/45" />

      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <Expand
          size={28}
          className="mb-3 text-[#F0F0F0] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
        />
        <span className="font-mono text-xs tracking-widest text-[#00AAFF]">
          {photo.date}
        </span>
        <span className="mt-1 font-bebas text-xl tracking-wide text-[#F0F0F0] sm:text-2xl">
          {photo.eventName}
        </span>
      </div>
    </button>
  );

  if (!mounted) {
    return <div>{card}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.07, ease: "easeOut" }}
    >
      {card}
    </motion.div>
  );
}

export default function NuestrasNoches() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visiblePhotos = ALL_PHOTOS.slice(0, visibleCount);
  const hasMore = visibleCount < ALL_PHOTOS.length;

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + visiblePhotos.length) % visiblePhotos.length
    );
  }, [visiblePhotos.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % visiblePhotos.length
    );
  }, [visiblePhotos.length]);

  const loadMore = () => {
    setVisibleCount((c) => Math.min(c + LOAD_MORE_COUNT, ALL_PHOTOS.length));
  };

  return (
    <section
      id="galeria"
      className="min-h-[480px] bg-[#050508] py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <h2 className="mb-4 font-bebas text-4xl tracking-wider text-[#F0F0F0] sm:text-5xl md:text-6xl">
            NUESTRAS NOCHES
          </h2>
          <p className="mb-12 font-mono text-xs text-[#F0F0F0]/50">
            Reviví las mejores noches de Bleu
          </p>
        </FadeIn>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {visiblePhotos.map((photo, index) => (
            <div key={photo.id} className="mb-4 break-inside-avoid">
              <GalleryItem
                photo={photo}
                index={index}
                onOpen={() => openLightbox(index)}
              />
            </div>
          ))}
        </div>

        {hasMore && (
          <FadeIn delay={0.2}>
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                className="border border-[#0066FF]/50 px-10 py-3 font-mono text-xs uppercase tracking-widest text-[#F0F0F0] transition-all hover:border-[#0066FF] hover:text-[#00AAFF]"
              >
                Ver Más
              </button>
            </div>
          </FadeIn>
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={visiblePhotos}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
