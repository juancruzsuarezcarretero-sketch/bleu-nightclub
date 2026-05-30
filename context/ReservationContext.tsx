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

interface ReservationContextValue {
  selection: ReservationSelection | null;
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

  const clearReservation = useCallback(() => {
    setSelection(null);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(INTENT_KEY);
  }, []);

  const goToContact = useCallback(() => {
    document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const startReservation = useCallback(
    (next: ReservationSelection) => {
      setSelection(next);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      sessionStorage.setItem(INTENT_KEY, "1");
      goToContact();
    },
    [goToContact]
  );

  useEffect(() => {
    const intent = sessionStorage.getItem(INTENT_KEY);
    const stored = sessionStorage.getItem(STORAGE_KEY);
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
      value={{ selection, startReservation, clearReservation, goToContact }}
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
