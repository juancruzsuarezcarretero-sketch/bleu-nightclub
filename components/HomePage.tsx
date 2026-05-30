"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Eventos from "@/components/Eventos";
import NuestrasNoches from "@/components/NuestrasNoches";
import MapaVIP from "@/components/MapaVIP";
import Packages from "@/components/Packages";
import Nosotros from "@/components/Nosotros";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import { ReservationProvider } from "@/context/ReservationContext";

export default function HomePage() {
  return (
    <ReservationProvider>
      <Navbar />
      <main className="relative z-0 w-full bg-[#050508]">
        <Hero />
        <Eventos />
        <NuestrasNoches />
        <MapaVIP />
        <Packages />
        <Nosotros />
        <Contacto />
      </main>
      <Footer />
    </ReservationProvider>
  );
}
