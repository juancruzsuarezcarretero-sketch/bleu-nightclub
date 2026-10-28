"use client";

import { createContext, useContext } from "react";
import type { Content } from "@/lib/content";

const ContentContext = createContext<Content | null>(null);

export function ContentProvider({ value, children }: { value: Content; children: React.ReactNode }) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): Content {
  const content = useContext(ContentContext);
  if (!content) throw new Error("useContent debe usarse dentro de ContentProvider");
  return content;
}
