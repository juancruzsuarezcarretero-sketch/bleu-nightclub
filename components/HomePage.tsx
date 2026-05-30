"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Eventos from "@/components/Eventos";
import NuestrasNoches from "@/components/NuestrasNoches";
import MapaVIP from "@/components/MapaVIP";
import Packages from "@/components/Packages";
import type { PackageSelection } from "@/components/Packages";
import Nosotros from "@/components/Nosotros";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [mapSelection, setMapSelection] = useState<PackageSelection | null>(
    null
  );

  const handlePackageReserve = (selection: PackageSelection) => {
    setMapSelection(selection);
  };

  return (
    <>
      <Navbar />
      <main className="relative z-0 w-full bg-[#050508]">
        <Hero />
        <Eventos />
        <NuestrasNoches />
        <MapaVIP
          highlightSector={mapSelection?.sector ?? null}
          preselectedPackage={mapSelection?.package ?? null}
        />
        <Packages onReserve={handlePackageReserve} />
        <Nosotros />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
