import { z } from "zod";

/**
 * Contenido editable de la web (tabla `site_content` de Supabase, que se maneja desde Madre).
 * Cada sección se valida por separado: si algo viene roto, esa sección vuelve a los valores de
 * `DEFAULT_CONTENT` y la web sigue funcionando.
 */

const texto = (max: number) => z.string().trim().min(1).max(max);

const hostPermitido = (hosts: string[]) => (valor: string) => {
  try {
    const u = new URL(valor);
    return u.protocol === "https:" && hosts.includes(u.hostname);
  } catch {
    return false;
  }
};

const hostSupabase = () => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return "";
  }
};

/** Solo imágenes de dominios que `next.config.ts` deja cargar; otro dominio rompería la página. */
export const imagenPermitida = (valor: string) =>
  hostPermitido(["images.unsplash.com", "plus.unsplash.com", hostSupabase()].filter(Boolean))(valor);

const instagram = z.string().trim().refine(hostPermitido(["instagram.com", "www.instagram.com"]), "Link de Instagram inválido");
const tiktok = z.union([
  z.literal(""),
  z.string().trim().refine(hostPermitido(["tiktok.com", "www.tiktok.com"]), "Link de TikTok inválido"),
]);

export const contactoSchema = z.object({
  whatsapp: z.string().regex(/^\d{8,15}$/, "Solo números, con código de país"),
  whatsappDisplay: texto(30),
  instagram,
  tiktok,
  direccion: z.object({ calle: texto(80), ciudad: texto(40), region: texto(40), pais: z.string().length(2) }),
  horarios: texto(120),
});

export const CATEGORIAS = ["House", "Techno", "Latin", "Open Format", "Bass House", "Reggaeton/Latin"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const eventoSchema = z.object({
  id: z.number().int(),
  name: texto(60),
  date: texto(20),
  dateShort: texto(20),
  category: z.enum(CATEGORIAS),
  image: z.string().refine(imagenPermitida, "Imagen de un dominio no permitido"),
});

export const paqueteSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{2,30}$/),
  nombre: texto(30),
  etiqueta: texto(40),
  sector: texto(40),
  tagline: texto(60),
  badge: texto(20).nullable(),
  precio: z.number().int().min(1).max(100_000_000),
  unidad: z.enum(["persona", "mesa"]),
  features: z.array(texto(60)).min(1).max(8),
  tema: z.enum(["gold", "purple"]),
});

export type Contacto = z.infer<typeof contactoSchema>;
export type Evento = z.infer<typeof eventoSchema>;
export type Paquete = z.infer<typeof paqueteSchema>;

export interface Content {
  contacto: Contacto;
  eventos: Evento[];
  paquetes: Paquete[];
}

const MESA = ["Hasta 10 personas", "Lugar reservado", "Cristalería individual", "Moza a disposición"];

export const DEFAULT_CONTENT: Content = {
  contacto: {
    whatsapp: "5493544433834",
    whatsappDisplay: "+54 9 354 443-3834",
    instagram: "https://instagram.com/bleu.club",
    tiktok: "",
    direccion: { calle: "Av. Marcelo T. de Alvear 635", ciudad: "Córdoba", region: "Córdoba", pais: "AR" },
    horarios: "Viernes y Sábados · 00:00 a 05:00 hs",
  },
  eventos: [
    { id: 1, name: "FISHER", date: "Vie 20/06", dateShort: "VIE 20.06", category: "Techno", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=800&fit=crop" },
    { id: 2, name: "OPEN FORMAT NIGHT", date: "Sáb 21/06", dateShort: "SÁB 21.06", category: "Open Format", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=800&fit=crop" },
    { id: 3, name: "VALENTINO KHAN", date: "Vie 27/06", dateShort: "VIE 27.06", category: "Bass House", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=800&fit=crop" },
    { id: 4, name: "NOCHE LATINA", date: "Sáb 28/06", dateShort: "SÁB 28.06", category: "Reggaeton/Latin", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=800&fit=crop" },
  ],
  paquetes: [
    { id: "vip-gold", nombre: "VIP GOLD", etiqueta: "VIP Gold", sector: "VIP Gold", tagline: "Acceso VIP premium", badge: "MÁS ELEGIDO", precio: 35000, unidad: "persona", features: ["Acceso sector VIP Gold", "Sin límite de personas"], tema: "gold" },
    { id: "vip-standing", nombre: "VIP STANDING", etiqueta: "VIP Standing", sector: "VIP Standing", tagline: "La experiencia standing", badge: null, precio: 50000, unidad: "persona", features: ["Acceso VIP Standing", "Sin límite de personas"], tema: "gold" },
    { id: "ultra", nombre: "ULTRA", etiqueta: "Ultra VIP", sector: "Ultra VIP", tagline: "Acceso Ultra VIP", badge: null, precio: 100000, unidad: "persona", features: ["Acceso Ultra VIP", "Sin límite de personas"], tema: "purple" },
    { id: "mesa-vip", nombre: "MESA VIP", etiqueta: "Mesa VIP", sector: "Mesas VIP", tagline: "Tu mesa en el sector VIP", badge: null, precio: 700000, unidad: "mesa", features: MESA, tema: "gold" },
    { id: "mesa-ultra", nombre: "MESA ULTRA VIP", etiqueta: "Mesa Ultra VIP", sector: "Mesas Ultra VIP", tagline: "La experiencia definitiva", badge: null, precio: 1200000, unidad: "mesa", features: MESA, tema: "purple" },
  ],
};

/** Usuario de Instagram a partir del link (`https://instagram.com/bleu.club` → `@bleu.club`). */
export const usuarioInstagram = (url: string) => `@${url.replace(/\/+$/, "").split("/").pop() ?? ""}`;

function lista<T>(valor: unknown, esquema: z.ZodType<T>, porDefecto: T[]): T[] {
  if (!Array.isArray(valor)) return porDefecto;
  return valor.flatMap((v) => {
    const r = esquema.safeParse(v);
    return r.success ? [r.data] : [];
  });
}

/** Arma el contenido a partir de las filas de `site_content`; lo que falte o esté roto queda con su valor por defecto. */
export function parseContent(filas: unknown): Content {
  const porClave = new Map<string, unknown>();
  if (Array.isArray(filas)) {
    for (const f of filas) {
      if (f && typeof f === "object" && "key" in f && "value" in f) porClave.set(String((f as { key: unknown }).key), (f as { value: unknown }).value);
    }
  }
  const contacto = contactoSchema.safeParse(porClave.get("contacto"));
  return {
    contacto: contacto.success ? contacto.data : DEFAULT_CONTENT.contacto,
    eventos: lista(porClave.get("eventos"), eventoSchema, DEFAULT_CONTENT.eventos),
    paquetes: lista(porClave.get("paquetes"), paqueteSchema, DEFAULT_CONTENT.paquetes),
  };
}
