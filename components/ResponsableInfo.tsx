import { LEGAL } from "@/lib/legal";
import { getContent } from "@/lib/content-server";
import { usuarioInstagram } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";

export default async function ResponsableInfo() {
  const { contacto } = await getContent();
  return (
    <ul>
      <li>
        Responsable: {LEGAL.razonSocial || "Bleu Nightclub"}
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
        <a href={contacto.instagram} target="_blank" rel="noopener noreferrer">
          {usuarioInstagram(contacto.instagram)}
        </a>
      </li>
    </ul>
  );
}
