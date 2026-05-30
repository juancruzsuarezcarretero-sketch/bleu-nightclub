"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FadeIn } from "@/components/FadeIn";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  reservationFormSchema,
  type ContactFormData,
  type ReservationFormData,
} from "@/lib/validations";
import { Clock, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import {
  whatsappUrl,
  WHATSAPP_DISPLAY,
  buildReservationWhatsAppMessage,
} from "@/lib/whatsapp";
import {
  calculateReservationPrice,
  SELECTION_THEME_STYLES,
} from "@/lib/reservation-selection";
import { useReservation, INTENT_KEY } from "@/context/ReservationContext";

const MAX_SUBMISSIONS = 3;
const SESSION_KEY = "bleu_contact_submissions";

export default function Contacto() {
  const sectionRef = useRef<HTMLElement>(null);
  const { selection, clearReservation } = useReservation();
  const isReservationMode = Boolean(selection);

  const [submitStatus, setSubmitStatus] = useState
    "idle" | "loading" | "success" | "error" | "rate-limited"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const generalForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { motivo: "Reservas" },
  });

  const reservationForm = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      motivo: "Reservas",
      personas: 2,
    },
  });

  useEffect(() => {
    setSubmitStatus("idle");
    setErrorMessage("");
  }, [selection]);

  useEffect(() => {
    if (selection?.defaultPersons) {
      reservationForm.setValue("personas", selection.defaultPersons);
    }
    if (selection) {
      reservationForm.setValue("motivo", "Reservas");
    }
  }, [selection, reservationForm]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const hasIntent = sessionStorage.getItem(INTENT_KEY) === "1";
        if (hasIntent) {
          sessionStorage.removeItem(INTENT_KEY);
        } else {
          clearReservation();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [clearReservation]);

  const onGeneralSubmit = async (data: ContactFormData) => {
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
      generalForm.reset({ motivo: "Reservas" });
    } catch {
      setSubmitStatus("error");
      setErrorMessage("Error de conexión. Intentá de nuevo.");
    }
  };

  const onReservationSubmit = async (data: ReservationFormData) => {
    if (!selection) return;
    if (data.website) return;
    setSubmitStatus("loading");
    setErrorMessage("");
    const price = calculateReservationPrice(selection, data.personas);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          sector: selection.sector,
          seleccion: selection.displayLabel,
          precio: price,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Error al guardar la reserva");
        return;
      }
      const message = buildReservationWhatsAppMessage({
        sector: selection.sector,
        nombre: data.nombre,
        fecha: data.fecha,
        personas: data.personas,
        price,
        mensaje: data.mensaje,
      });
      window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
      setSubmitStatus("success");
      clearReservation();
      reservationForm.reset({ motivo: "Reservas", personas: 2 });
    } catch {
      setSubmitStatus("error");
      setErrorMessage("Error de conexión. Intentá de nuevo.");
    }
  };

  const themeStyles = selection ? SELECTION_THEME_STYLES[selection.theme] : null;

  return (
    <section
      ref={sectionRef}
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
            {isReservationMode && selection ? (
              <form
                onSubmit={reservationForm.handleSubmit(onReservationSubmit)}
                className="relative space-y-4"
              >
                <input
                  {...reservationForm.register("website")}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />
                <div>
                  <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/60">
                    Motivo *
                  </label>
                  <input
                    {...reservationForm.register("motivo")}
                    readOnly
                    className="w-full border border-white/10 bg-[#050508]/50 px-4 py-2.5 font-mono text-sm text-[#F0F0F0]/70 outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/60">
                    Selección
                  </label>
                  <input
                    readOnly
                    value={selection.displayLabel}
                    className={`w-full border px-4 py-3 font-mono text-sm outline-none ${themeStyles?.border} ${themeStyles?.bg} ${themeStyles?.text}`}
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/60">
                    Nombre completo *
                  </label>
                  <input
                    {...reservationForm.register("nombre")}
                    className="w-full border border-white/10 bg-[#050508]/50 px-4 py-2.5 font-mono text-sm text-[#F0F0F0] outline-none focus:border-[#0066FF]"
                  />
                  {reservationForm.formState.errors.nombre && (
                    <p className="mt-1 font-mono text-xs text-red-400">
                      {reservationForm.formState.errors.nombre.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/60">
                    WhatsApp *
                  </label>
                  <input
                    {...reservationForm.register("whatsapp")}
                    className="w-full border border-white/10 bg-[#050508]/50 px-4 py-2.5 font-mono text-sm text-[#F0F0F0] outline-none focus:border-[#0066FF]"
                  />
                  {reservationForm.formState.errors.whatsapp && (
                    <p className="mt-1 font-mono text-xs text-red-400">
                      {reservationForm.formState.errors.whatsapp.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/60">
                      Fecha deseada *
                    </label>
                    <input
                      type="date"
                      {...reservationForm.register("fecha")}
                      className="w-full border border-white/10 bg-[#050508]/50 px-4 py-2.5 font-mono text-sm text-[#F0F0F0] outline-none focus:border-[#0066FF]"
                    />
                    {reservationForm.formState.errors.fecha && (
                      <p className="mt-1 font-mono text-xs text-red-400">
                        {reservationForm.formState.errors.fecha.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/60">
                      Personas *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      {...reservationForm.register("personas", {
                        valueAsNumber: true,
                      })}
                      className="w-full border border-white/10 bg-[#050508]/50 px-4 py-2.5 font-mono text-sm text-[#F0F0F0] outline-none focus:border-[#0066FF]"
                    />
                    {reservationForm.formState.errors.personas && (
                      <p className="mt-1 font-mono text-xs text-red-400">
                        {reservationForm.formState.errors.personas.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/60">
                    Mensaje (opcional)
                  </label>
                  <textarea
                    {...reservationForm.register("mensaje")}
                    rows={4}
                    className="w-full resize-none border border-white/10 bg-[#050508]/50 px-4 py-2.5 font-mono text-sm text-[#F0F0F0] outline-none focus:border-[#0066FF]"
                  />
                </div>
                {submitStatus === "success" && (
                  <p className="font-mono text-sm text-green-400">
                    ✓ WhatsApp abierto. Completá el envío para confirmar tu reserva.
                  </p>
                )}
                {submitStatus === "error" && (
                  <p className="font-mono text-sm text-red-400">{errorMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className={`w-full py-3 font-mono text-xs uppercase tracking-widest text-[#F0F0F0] transition-all disabled:opacity-50 ${
                    selection.theme === "purple"
                      ? "bg-[#9933cc] hover:bg-[#9933cc]/90"
                      : "bg-[#C89020] hover:bg-[#C89020]/90"
                  }`}
                >
                  {submitStatus === "loading" ? "Guardando..." : "Enviar"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={generalForm.handleSubmit(onGeneralSubmit)}
                className="relative space-y-4"
              >
                <input
                  {...generalForm.register("website")}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />
                <div>
                  <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/60">
                    Nombre completo *
                  </label>
                  <input
                    {...generalForm.register("nombre")}
                    className="w-full border border-white/10 bg-[#050508]/50 px-4 py-2.5 font-mono text-sm text-[#F0F0F0] outline-none focus:border-[#0066FF]"
                  />
                  {generalForm.formState.errors.nombre && (
                    <p className="mt-1 font-mono text-xs text-red-400">
                      {generalForm.formState.errors.nombre.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/60">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    {...generalForm.register("telefono")}
                    className="w-full border border-white/10 bg-[#050508]/50 px-4 py-2.5 font-mono text-sm text-[#F0F0F0] outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/60">
                    Motivo *
                  </label>
                  <select
                    {...generalForm.register("motivo")}
                    className="w-full border border-white/10 bg-[#050508]/50 px-4 py-2.5 font-mono text-sm text-[#F0F0F0] outline-none focus:border-[#0066FF]"
                  >
                    <option value="Reservas">Reservas</option>
                    <option value="Eventos Privados">Eventos Privados</option>
                    <option value="Artistas">Artistas</option>
                    <option value="Prensa">Prensa</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/60">
                    Mensaje *
                  </label>
                  <textarea
                    {...generalForm.register("mensaje")}
                    rows={5}
                    className="w-full resize-none border border-white/10 bg-[#050508]/50 px-4 py-2.5 font-mono text-sm text-[#F0F0F0] outline-none focus:border-[#0066FF]"
                  />
                  {generalForm.formState.errors.mensaje && (
                    <p className="mt-1 font-mono text-xs text-red-400">
                      {generalForm.formState.errors.mensaje.message}
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
                  className="w-full border border-[#0066FF] bg-[#0066FF] py-3 font-mono text-xs uppercase tracking-widest text-[#F0F0F0] transition-all hover:shadow-glow disabled:opacity-50"
                >
                  {submitStatus === "loading" ? "Enviando..." : "Enviar"}
                </button>
              </form>
            )}
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="glass-card rounded-xl p-8">
              <h3 className="font-bebas text-2xl tracking-wider text-[#F0F0F0]">
                INFORMACIÓN
              </h3>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <Clock size={18} className="mt-0.5 text-[#00AAFF]" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/40">
                      Horarios
                    </p>
                    <p className="mt-1 font-mono text-sm text-[#F0F0F0]/70">
                      Viernes y Sábados · 00:00 a 05:00 hs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MessageCircle size={18} className="mt-0.5 text-[#25D366]" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/40">
                      WhatsApp
                    </p>
                    
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 font-mono text-sm text-[#F0F0F0]/70 hover:text-[#25D366]"
                    >
                      {WHATSAPP_DISPLAY}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <InstagramIcon size={18} className="mt-0.5 text-[#00AAFF]" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-[#F0F0F0]/40">
                      Redes sociales
                    </p>
                    <div className="mt-2 flex flex-col gap-1">
                      
                        href="https://instagram.com/bleu.club"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-[#F0F0F0]/70 hover:text-[#00AAFF]"
                      >
                        @bleu.club — Instagram
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