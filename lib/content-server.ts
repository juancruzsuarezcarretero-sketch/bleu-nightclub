import { DEFAULT_CONTENT, parseContent, type Content } from "@/lib/content";

/**
 * Lee el contenido publicado desde Supabase (solo lectura, con la clave pública).
 * Next lo cachea y lo refresca como mucho cada 60 segundos. Ante cualquier falla devuelve
 * los valores por defecto: la web nunca depende de que Supabase responda.
 */
export async function getContent(): Promise<Content> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !clave) return DEFAULT_CONTENT;
  try {
    const res = await fetch(`${url}/rest/v1/site_content?select=key,value`, {
      headers: { apikey: clave, Authorization: `Bearer ${clave}` },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return DEFAULT_CONTENT;
    return parseContent(await res.json());
  } catch {
    return DEFAULT_CONTENT;
  }
}
