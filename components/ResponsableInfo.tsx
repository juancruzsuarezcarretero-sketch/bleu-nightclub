import { LEGAL } from "@/lib/legal";
import { SITE_ADDRESS, INSTAGRAM_URL } from "@/lib/site";
import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/whatsapp";

export default function ResponsableInfo() {
  return (
    <ul>
      <li>
        Responsable: {LEGAL.razonSocial || "Bleu Nightclub"}
        {LEGAL.cuit ? ` (CUIT ${LEGAL.cuit})` : ""}
      </li>
      <li>
        Domicilio: {SITE_ADDRESS.street}, {SITE_ADDRESS.city}, Argentina
      </li>
      <li>
        WhatsApp:{" "}
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          {WHATSAPP_DISPLAY}
        </a>
      </li>
      {LEGAL.email && (
        <li>
          Email: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        </li>
      )}
      <li>
        Instagram:{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          @bleu.club
        </a>
      </li>
    </ul>
  );
}
