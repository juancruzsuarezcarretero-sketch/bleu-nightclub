import HomePage from "@/components/HomePage";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getContent } from "@/lib/content-server";

export default async function Page() {
  const { contacto } = await getContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    telephone: `+${contacto.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: contacto.direccion.calle,
      addressLocality: contacto.direccion.ciudad,
      addressRegion: contacto.direccion.region,
      addressCountry: contacto.direccion.pais,
    },
    sameAs: [contacto.instagram, ...(contacto.tiktok ? [contacto.tiktok] : [])],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\u003c"),
        }}
      />
      <HomePage />
    </>
  );
}
