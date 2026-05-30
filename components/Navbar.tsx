"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useMounted } from "@/lib/useMounted";

const navLinks = [
  { label: "Eventos", href: "#eventos" },
  { label: "Reservas", href: "#reservas" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const mounted = useMounted();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const mobileMenu = (
    <ul className="flex flex-col gap-1 px-4 py-4">
      {navLinks.map((link) => (
        <li key={link.href}>
          <button
            type="button"
            onClick={() => handleNavClick(link.href)}
            className="block w-full py-3 text-left font-mono text-sm uppercase tracking-widest text-[#F0F0F0]/80 transition-colors hover:text-[#00AAFF]"
          >
            {link.label}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-bebas text-3xl tracking-[0.2em] text-[#F0F0F0]"
        >
          BLEU
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="font-mono text-xs uppercase tracking-widest text-[#F0F0F0]/70 transition-colors hover:text-[#00AAFF]"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="text-[#F0F0F0] md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="glass border-b border-white/5 md:hidden">
          {mobileMenu}
        </div>
      )}
    </header>
  );
}
