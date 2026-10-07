import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de cookies | BLEU Nightclub",
  description: "Uso de cookies y almacenamiento del navegador en el sitio de BLEU Nightclub.",
  alternates: { canonical: "/cookies" },
};

export default function Page() {
  return (
    <LegalPage title="Política de cookies">
      <section>
        <h2>Qué usamos</h2>
        <p>
          Este sitio <strong>no usa cookies de seguimiento, publicidad ni
          analítica</strong>. No instalamos herramientas que te identifiquen o
          sigan tu actividad entre sitios.
        </p>
      </section>

      <section>
        <h2>Almacenamiento técnico</h2>
        <p>
          Para que el formulario de reserva funcione, el sitio guarda
          temporalmente en tu navegador (sessionStorage) la selección de sector
          y un indicador de que estás reservando. Esa información se borra
          cuando cerrás la pestaña, no se envía a ningún servidor y no sirve
          para identificarte.
        </p>
      </section>

      <section>
        <h2>Servicios de terceros</h2>
        <p>
          Las imágenes y videos que se cargan desde otros servicios (por
          ejemplo Unsplash o Mixkit), y el hosting en Vercel, pueden registrar
          datos técnicos de la conexión como la dirección IP. Más detalles en la{" "}
          <Link href="/privacidad">política de privacidad</Link>.
        </p>
      </section>

      <section>
        <h2>Cambios</h2>
        <p>
          Si en el futuro incorporáramos analítica u otras cookies, vamos a
          actualizar esta política y a pedir tu consentimiento cuando
          corresponda.
        </p>
      </section>
    </LegalPage>
  );
}
