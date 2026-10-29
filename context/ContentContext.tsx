"use client";

import { createContext, useContext, useMemo } from "react";
import type { Content } from "@/lib/content";
import { sectoresConPrecios } from "@/lib/map-sectors";

const ContentContext = createContext<Content | null>(null);

export function ContentProvider({ value, children }: { value: Content; children: React.ReactNode }) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): Content {
  const content = useContext(ContentContext);
  if (!content) throw new Error("useContent debe usarse dentro de ContentProvider");
  return content;
}

/** Sectores del mapa con los precios publicados desde Madre. */
export function useSectores() {
  const { paquetes, mapa } = useContent();
  return useMemo(() => sectoresConPrecios(paquetes, mapa), [paquetes, mapa]);
}
