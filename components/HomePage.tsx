"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FondoVideo from "@/components/FondoVideo";
import Eventos from "@/components/Eventos";
import MapaVIP from "@/components/MapaVIP";
import Packages from "@/components/Packages";
import Nosotros from "@/components/Nosotros";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import { ReservationProvider } from "@/context/ReservationContext";

export default function HomePage() {
  return (
    <ReservationProvider>
      <FondoVideo />
      <Navbar />
      <main className="relative z-10 w-full">
        <Hero />
        <Eventos />
        <MapaVIP />
        <Packages />
        <Nosotros />
        <Contacto />
      </main>
      <Footer />
    </ReservationProvider>
  );
}
