import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  document.fonts.addEventListener("loadingdone", cb);
  return () => document.fonts.removeEventListener("loadingdone", cb);
};
const loaded = () => document.fonts.status === "loaded";

/** Verdadero cuando ya cargaron las tipografías de la página (para dibujarlas en un canvas). */
export const useFontsReady = () => useSyncExternalStore(subscribe, loaded, () => false);

/** Valor de una variable CSS (`next/font` deja ahí el nombre real de cada familia). */
export const cssVar = (name: string) => getComputedStyle(document.body).getPropertyValue(name).trim();

export const fontBebas = () => `${cssVar("--font-bebas") || "Bebas Neue"}, sans-serif`;
export const fontMono = () => `${cssVar("--font-dm-mono") || "DM Mono"}, monospace`;
