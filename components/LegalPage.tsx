import Link from "next/link";
import { LEGAL } from "@/lib/legal";

const LINKS = [
  { href: "/terminos", label: "Términos y condiciones" },
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/cookies", label: "Política de cookies" },
];

export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050508] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="font-mono text-xs tracking-widest text-[#F0F0F0]/50 transition-colors hover:text-[#00AAFF]"
        >
          ← VOLVER A BLEU
        </Link>

        <h1 className="mt-10 font-bebas text-5xl tracking-[0.15em] text-[#F0F0F0] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-3 font-mono text-xs text-[#F0F0F0]/40">
          Última actualización: {LEGAL.actualizado}
        </p>

        <div className="mt-10 space-y-8 font-mono text-sm leading-relaxed text-[#F0F0F0]/70 [&_a]:text-[#00AAFF] [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:mb-3 [&_h2]:font-bebas [&_h2]:text-2xl [&_h2]:tracking-[0.12em] [&_h2]:text-[#F0F0F0] [&_li]:ml-5 [&_li]:list-disc [&_ul]:mt-2 [&_ul]:space-y-1">
          {children}
        </div>

        <nav
          aria-label="Documentos legales"
          className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/5 pt-8 font-mono text-xs"
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[#F0F0F0]/50 transition-colors hover:text-[#00AAFF]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
