"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FadeIn } from "@/components/FadeIn";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { Clock, Mail, MessageCircle } from "lucide-react";
import { InstagramIcon, TikTokIcon } from "@/components/icons/SocialIcons";

const MAX_SUBMISSIONS = 3;
const SESSION_KEY = "bleu_contact_submissions";

export default function Contacto() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error" | "rate-limited"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { motivo: "Reservas" },
  });

  const onSubmit = async (data: ContactFormData) => {
    const count = parseInt(sessionStorage.getItem(SESSION_KEY) || "0", 10);
    if (count >= MAX_SUBMISSIONS) {
      setSubmitStatus("rate-limited");
      return;
    }

    if (data.website) return;

    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Error al enviar el mensaje");
        return;
      }

      sessionStorage.setItem(SESSION_KEY, String(count + 1));
      setSubmitStatus("success");
      reset();
    } catch {
      setSubmitStatus("error");
      setErrorMessage("Error de conexión. Intentá de nuevo.");
    }
  };

  return (
    <section
      id="contacto"
      className="min-h-[480px] bg-[#050508] py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <h2 className="mb-12 font-bebas text-4xl tracking-wider text-[#F0F0F0] sm:text-5xl md:text-6xl">
            HABLEMOS
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <FadeIn delay={0.05}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative space-y-4"
          >
            {/* Honeypot */}
            <input
              {...register("website")}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-bleu-white/60">
                Nombre completo *
              </label>
              <input
                {...register("nombre")}
                className="w-full border border-white/10 bg-bleu-black/50 px-4 py-2.5 font-mono text-sm text-bleu-white outline-none focus:border-bleu-electric"
              />
              {errors.nombre && (
                <p className="mt-1 font-mono text-xs text-red-400">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-bleu-white/60">
                Email *
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full border border-white/10 bg-bleu-black/50 px-4 py-2.5 font-mono text-sm text-bleu-white outline-none focus:border-bleu-electric"
              />
              {errors.email && (
                <p className="mt-1 font-mono text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-bleu-white/60">
                Teléfono / WhatsApp
              </label>
              <input
                {...register("telefono")}
                className="w-full border border-white/10 bg-bleu-black/50 px-4 py-2.5 font-mono text-sm text-bleu-white outline-none focus:border-bleu-electric"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-bleu-white/60">
                Motivo *
              </label>
              <select
                {...register("motivo")}
                className="w-full border border-white/10 bg-bleu-black/50 px-4 py-2.5 font-mono text-sm text-bleu-white outline-none focus:border-bleu-electric"
              >
                <option value="Reservas">Reservas</option>
                <option value="Eventos Privados">Eventos Privados</option>
                <option value="Artistas">Artistas</option>
                <option value="Prensa">Prensa</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-bleu-white/60">
                Mensaje *
              </label>
              <textarea
                {...register("mensaje")}
                rows={5}
                className="w-full resize-none border border-white/10 bg-bleu-black/50 px-4 py-2.5 font-mono text-sm text-bleu-white outline-none focus:border-bleu-electric"
              />
              {errors.mensaje && (
                <p className="mt-1 font-mono text-xs text-red-400">
                  {errors.mensaje.message}
                </p>
              )}
            </div>

            {submitStatus === "success" && (
              <p className="font-mono text-sm text-green-400">
                ✓ Mensaje enviado. Te respondemos pronto.
              </p>
            )}
            {submitStatus === "error" && (
              <p className="font-mono text-sm text-red-400">{errorMessage}</p>
            )}
            {submitStatus === "rate-limited" && (
              <p className="font-mono text-sm text-yellow-400">
                Límite de envíos alcanzado. Contactanos por WhatsApp.
              </p>
            )}

            <button
              type="submit"
              disabled={submitStatus === "loading"}
              className="w-full border border-bleu-electric bg-bleu-electric py-3 font-mono text-xs uppercase tracking-widest text-bleu-white transition-all hover:shadow-glow disabled:opacity-50"
            >
              {submitStatus === "loading" ? "Enviando..." : "Enviar"}
            </button>
          </form>
          </FadeIn>

          <FadeIn delay={0.1}>
          <div className="glass-card rounded-xl p-8">
            <h3 className="font-bebas text-2xl tracking-wider text-bleu-white">
              INFORMACIÓN
            </h3>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <Clock size={18} className="mt-0.5 text-bleu-cyan" />
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-bleu-white/40">
                    Horarios de atención
                  </p>
                  <p className="mt-1 font-mono text-sm text-bleu-white/70">
                    Lun — Vie · 10:00 a 20:00 hs
                    <br />
                    Sáb · 12:00 a 18:00 hs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail size={18} className="mt-0.5 text-bleu-cyan" />
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-bleu-white/40">
                    Email
                  </p>
                  <a
                    href="mailto:info@bleu.com.ar"
                    className="mt-1 font-mono text-sm text-bleu-white/70 hover:text-bleu-cyan"
                  >
                    info@bleu.com.ar
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageCircle size={18} className="mt-0.5 text-[#25D366]" />
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-bleu-white/40">
                    WhatsApp
                  </p>
                  <a
                    href="https://wa.me/5493512345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 font-mono text-sm text-bleu-white/70 hover:text-[#25D366]"
                  >
                    +54 9 351 234-5678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <InstagramIcon size={18} className="mt-0.5 text-bleu-cyan" />
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-bleu-white/40">
                    Redes sociales
                  </p>
                  <div className="mt-2 flex flex-col gap-1">
                    <a
                      href="#"
                      className="font-mono text-sm text-bleu-white/70 hover:text-bleu-cyan"
                    >
                      @bleuoficial — Instagram
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-1.5 font-mono text-sm text-bleu-white/70 hover:text-bleu-cyan"
                    >
                      <TikTokIcon /> @bleuoficial — TikTok
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
