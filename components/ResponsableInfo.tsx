import { LEGAL } from "@/lib/legal";
import { getContent } from "@/lib/content-server";
import { enlacesInstagram, usuarioInstagram } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";

export default async function ResponsableInfo() {
  const { contacto } = await getContent();
  return (
    <ul>
      <li>
        Responsable: {LEGAL.razonSocial || "BARTO Nightclub"}
        {LEGAL.cuit ? ` (CUIT ${LEGAL.cuit})` : ""}
      </li>
      <li>
        Domicilio: {contacto.direccion.calle}, {contacto.direccion.ciudad}, Argentina
      </li>
      <li>
        WhatsApp:{" "}
        <a href={whatsappUrl(contacto.whatsapp)} target="_blank" rel="noopener noreferrer">
          {contacto.whatsappDisplay}
        </a>
      </li>
      {LEGAL.email && (
        <li>
          Email: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        </li>
      )}
      <li>
        Instagram:{" "}
        {enlacesInstagram(contacto).map((url, i) => (
          <span key={url}>
            {i > 0 && " · "}
            <a href={url} target="_blank" rel="noopener noreferrer">
              {usuarioInstagram(url)}
            </a>
          </span>
        ))}
      </li>
    </ul>
  );
}
