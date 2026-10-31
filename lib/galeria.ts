import type { Foto } from "@/lib/content";

export interface Carpeta {
  clave: string;
  eventName: string;
  date: string;
  fotos: Foto[];
}

/**
 * Agrupa las fotos publicadas en carpetas, una por noche (mismo nombre y misma fecha).
 * Respeta el orden en que aparece cada noche por primera vez; la portada es su primera foto.
 */
export function agruparCarpetas(fotos: Foto[]): Carpeta[] {
  const carpetas = new Map<string, Carpeta>();
  for (const foto of fotos) {
    const clave = `${foto.date}|${foto.eventName}`;
    const existente = carpetas.get(clave);
    if (existente) existente.fotos.push(foto);
    else carpetas.set(clave, { clave, eventName: foto.eventName, date: foto.date, fotos: [foto] });
  }
  return [...carpetas.values()];
}
