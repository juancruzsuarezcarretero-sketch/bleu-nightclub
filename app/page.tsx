import HomePage from "@/components/HomePage";
import { SITE_NAME, SITE_URL, SITE_ADDRESS, INSTAGRAM_URL } from "@/lib/site";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NightClub",
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  telephone: `+${WHATSAPP_NUMBER}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE_ADDRESS.street,
    addressLocality: SITE_ADDRESS.city,
    addressRegion: SITE_ADDRESS.region,
    addressCountry: SITE_ADDRESS.country,
  },
  sameAs: [INSTAGRAM_URL],
};

export default function Page() {
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
