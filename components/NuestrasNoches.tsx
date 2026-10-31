"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Expand, Folder, X } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { useMounted } from "@/lib/useMounted";
import { useContent } from "@/context/ContentContext";
import type { Foto } from "@/lib/content";
import { agruparCarpetas, type Carpeta } from "@/lib/galeria";

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 4;

const aspectClasses: Record<Foto["aspect"], string> = {
  tall: "aspect-[3/4] sm:aspect-[4/5]",
  wide: "aspect-[4/3]",
  square: "aspect-square",
};

interface LightboxProps {
  photos: Foto[];
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
      <div
        className="relative flex h-full w-full items-center justify-center"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
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
  photo: Foto;
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

      <div className="absolute inset-0 flex items-center justify-center bg-[#050508]/0 transition-colors duration-300 group-hover:bg-[#050508]/45">
        <Expand
          size={28}
          className="text-[#F0F0F0] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
        />
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

function CarpetaCard({ carpeta, onOpen }: { carpeta: Carpeta; onOpen: () => void }) {
  const portada = carpeta.fotos[0];
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-lg text-left"
      aria-label={`Abrir ${carpeta.eventName}, ${carpeta.fotos.length} fotos`}
    >
      <Image
        src={portada.image}
        alt={carpeta.eventName}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <span className="font-mono text-xs tracking-widest text-[#00AAFF]">{carpeta.date}</span>
        <span className="mt-1 font-bebas text-xl leading-tight tracking-wide text-[#F0F0F0] sm:text-2xl">
          {carpeta.eventName}
        </span>
        <span className="mt-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#F0F0F0]/60">
          <Folder size={12} />
          {carpeta.fotos.length} {carpeta.fotos.length === 1 ? "foto" : "fotos"}
        </span>
      </div>
    </button>
  );
}

export default function NuestrasNoches() {
  const { galeria } = useContent();
  const mounted = useMounted();
  const carpetas = useMemo(() => agruparCarpetas(galeria), [galeria]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [abierta, setAbierta] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const carpeta = carpetas.find((c) => c.clave === abierta) ?? null;
  const fotos = carpeta?.fotos ?? [];
  const visibleCarpetas = carpetas.slice(0, visibleCount);
  const hasMore = visibleCount < carpetas.length;

  const irAlInicio = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const abrirCarpeta = (clave: string) => {
    setAbierta(clave);
    irAlInicio();
  };
  const cerrarCarpeta = () => {
    setAbierta(null);
    irAlInicio();
  };

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + fotos.length) % fotos.length));
  }, [fotos.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % fotos.length));
  }, [fotos.length]);

  const loadMore = () => {
    setVisibleCount((c) => Math.min(c + LOAD_MORE_COUNT, carpetas.length));
  };

  return (
    <div ref={topRef} className="scroll-mt-24">
      <div>
        <FadeIn>
          <h3 className="mb-4 font-bebas text-3xl tracking-wider text-[#F0F0F0] sm:text-4xl">
            NUESTRAS NOCHES
          </h3>
          <p className="mb-12 font-mono text-xs text-[#F0F0F0]/50">
            Reviví las mejores noches de Bleu
          </p>
        </FadeIn>

        {carpeta ? (
          <>
            <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                type="button"
                onClick={cerrarCarpeta}
                className="flex items-center gap-2 border border-[#0066FF]/50 px-4 py-2 font-mono text-xs uppercase tracking-widest text-[#F0F0F0] transition-all hover:border-[#0066FF] hover:text-[#00AAFF]"
              >
                <ArrowLeft size={14} />
                Todas las noches
              </button>
              <div>
                <p className="font-mono text-xs tracking-widest text-[#00AAFF]">{carpeta.date}</p>
                <p className="font-bebas text-2xl tracking-wider text-[#F0F0F0] sm:text-3xl">{carpeta.eventName}</p>
              </div>
            </div>
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {fotos.map((photo, index) => (
                <div key={photo.id} className="mb-4 break-inside-avoid">
                  <GalleryItem photo={photo} index={index} onOpen={() => openLightbox(index)} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {visibleCarpetas.map((c) => (
                <CarpetaCard key={c.clave} carpeta={c} onOpen={() => abrirCarpeta(c.clave)} />
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
          </>
        )}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {lightboxIndex !== null && carpeta && (
              <Lightbox
                photos={fotos}
                index={lightboxIndex}
                onClose={closeLightbox}
                onPrev={goPrev}
                onNext={goNext}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
