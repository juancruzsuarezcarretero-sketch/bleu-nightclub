"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useMounted } from "@/lib/useMounted";
import { useReservation } from "@/context/ReservationContext";

const TITLE = "LA NOCHE ES TUYA";

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let width = 0;
    let height = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
    }

    let particles: Particle[] = [];

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 102, 255, 0.4)";
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 170, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      aria-hidden="true"
    />
  );
}

export default function Hero() {
  const mounted = useMounted();
  const { clearReservation, goToContact } = useReservation();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleReserveMesa = () => {
    clearReservation();
    goToContact();
  };

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const animateTitle = mounted && !reduceMotion;

  return (
    <section className="relative flex min-h-[100dvh] min-h-screen items-center justify-center overflow-hidden bg-[#050508]">
      <div className="absolute inset-0 z-0 bg-[#050508]">
        <div
          className="absolute inset-0 bg-[#050508]"
          aria-hidden="true"
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="h-full w-full object-cover opacity-40"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%23050508' width='1920' height='1080'/%3E%3C/svg%3E"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-crowd-of-people-at-a-nightclub-4630-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/80 via-[#050508]/50 to-[#050508]" />
      </div>

      {mounted && <ParticleCanvas />}

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-24 text-center">
        {animateTitle ? (
          <motion.h1
            className="font-bebas text-5xl leading-none tracking-wider text-[#F0F0F0] sm:text-7xl md:text-8xl lg:text-[96px] text-glow"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.03 } },
            }}
          >
            {TITLE.split("").map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="inline-block"
                style={{ width: char === " " ? "0.3em" : undefined }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
        ) : (
          <h1 className="font-bebas text-5xl leading-none tracking-wider text-[#F0F0F0] sm:text-7xl md:text-8xl lg:text-[96px] text-glow">
            {TITLE}
          </h1>
        )}

        <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-[#F0F0F0]/60 sm:text-sm">
          Córdoba, Argentina
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleReserveMesa}
            className="w-full rounded-none border border-[#0066FF] bg-[#0066FF] px-8 py-3 font-mono text-xs uppercase tracking-widest text-[#F0F0F0] transition-all hover:bg-[#0066FF]/90 sm:w-auto"
          >
            Reservar Mesa
          </button>
          <button
            type="button"
            onClick={() => scrollTo("#eventos")}
            className="w-full rounded-none border border-[#F0F0F0]/30 bg-transparent px-8 py-3 font-mono text-xs uppercase tracking-widest text-[#F0F0F0] transition-all hover:border-[#00AAFF] hover:text-[#00AAFF] sm:w-auto"
          >
            Ver Eventos
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <ChevronDown
          size={28}
          className="animate-bounce-scroll text-[#F0F0F0]/40"
        />
      </div>
    </section>
  );
}
