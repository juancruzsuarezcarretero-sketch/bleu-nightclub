import type { Metadata } from "next";
import { Bebas_Neue, DM_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bleu Nightclub | La noche es tuya — Córdoba, Argentina",
  description:
    "Bleu Nightclub — La experiencia nocturna más exclusiva de Córdoba. Eventos, reservas VIP y las mejores noches del Centro.",
  keywords: ["nightclub", "Córdoba", "Bleu", "fiestas", "VIP", "eventos"],
  openGraph: {
    title: "Bleu Nightclub",
    description: "La noche es tuya — Córdoba, Argentina",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${dmMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#050508] text-[#F0F0F0] antialiased">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
