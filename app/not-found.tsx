import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#050508] px-4 text-center">
      <p className="font-mono text-xs tracking-[0.3em] text-[#00AAFF]">ERROR 404</p>
      <h1 className="mt-4 font-bebas text-6xl tracking-[0.15em] text-[#F0F0F0] sm:text-8xl">
        Esta página no existe
      </h1>
      <p className="mt-4 max-w-md font-mono text-sm text-[#F0F0F0]/60">
        El link puede estar roto o la página se movió. La noche sigue en el inicio.
      </p>
      <Link
        href="/"
        className="mt-10 border border-[#00AAFF] px-8 py-3 font-mono text-xs tracking-[0.2em] text-[#00AAFF] transition-colors hover:bg-[#00AAFF] hover:text-[#050508]"
      >
        VOLVER AL INICIO
      </Link>
    </main>
  );
}
