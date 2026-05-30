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

const SITE_URL = "https://bleu-nightclub.vercel.app";

export const metadata: Metadata = {
  title: "BLEU Nightclub",
  description: "La noche es tuya — Córdoba, Argentina",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "BLEU Nightclub",
    description: "La noche es tuya — Córdoba, Argentina",
    url: SITE_URL,
    siteName: "BLEU Nightclub",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BLEU Nightclub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BLEU Nightclub",
    description: "La noche es tuya — Córdoba, Argentina",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
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
