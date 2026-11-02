"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReservationSelection } from "@/lib/reservation-selection";

const STORAGE_KEY = "bleu_reservation_selection";
const INTENT_KEY = "bleu_reservation_intent";
const EVENT_KEY = "bleu_reservation_event";

interface ReservationContextValue {
  selection: ReservationSelection | null;
  eventoElegido: string | null;
  elegirEvento: (evento: string) => void;
  startReservation: (selection: ReservationSelection) => void;
  clearReservation: () => void;
  goToContact: () => void;
}

const ReservationContext = createContext<ReservationContextValue | null>(null);

export function ReservationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selection, setSelection] = useState<ReservationSelection | null>(null);
  const [eventoElegido, setEventoElegido] = useState<string | null>(null);

  const clearReservation = useCallback(() => {
    setSelection(null);
    sessionStorage.removeItem(STORAGE_KEY);
    setEventoElegido(null);
    sessionStorage.removeItem(INTENT_KEY);
    sessionStorage.removeItem(EVENT_KEY);
  }, []);

  const elegirEvento = useCallback((evento: string) => {
    setEventoElegido(evento);
    sessionStorage.setItem(EVENT_KEY, evento);
  }, []);

  const goToContact = useCallback(() => {
    document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const startReservation = useCallback(
    (picked: ReservationSelection) => {
      const next = eventoElegido ? { ...picked, evento: eventoElegido } : picked;
      setSelection(next);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      sessionStorage.setItem(INTENT_KEY, "1");
      goToContact();
    },
    [goToContact, eventoElegido]
  );

  useEffect(() => {
    const intent = sessionStorage.getItem(INTENT_KEY);
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const evento = sessionStorage.getItem(EVENT_KEY);
    if (evento) setEventoElegido(evento);
    if (intent === "1" && stored) {
      try {
        setSelection(JSON.parse(stored) as ReservationSelection);
      } catch {
        clearReservation();
      }
    }
  }, [clearReservation]);

  return (
    <ReservationContext.Provider
      value={{ selection, eventoElegido, elegirEvento, startReservation, clearReservation, goToContact }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const ctx = useContext(ReservationContext);
  if (!ctx) {
    throw new Error("useReservation must be used within ReservationProvider");
  }
  return ctx;
}

export { INTENT_KEY };
