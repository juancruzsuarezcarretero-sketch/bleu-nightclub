import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import ResponsableInfo from "@/components/ResponsableInfo";

export const metadata: Metadata = {
  title: "Términos y condiciones | BLEU Nightclub",
  description: "Reglas de uso del sitio web de BLEU Nightclub y condiciones de las reservas.",
  alternates: { canonical: "/terminos" },
};

export default function Page() {
  return (
    <LegalPage title="Términos y condiciones">
      <section>
        <h2>1. Quién es el responsable</h2>
        <p>Este sitio web es operado por:</p>
        <ResponsableInfo />
      </section>

      <section>
        <h2>2. Uso del sitio</h2>
        <p>
          Al usar este sitio aceptás estos términos. El sitio informa sobre
          eventos, sectores, paquetes y datos de contacto de BLEU Nightclub.
          Te pedimos usarlo de forma lícita y no intentar interferir con su
          funcionamiento, enviar información falsa ni usar los formularios
          para enviar spam.
        </p>
      </section>

      <section>
        <h2>3. Información publicada</h2>
        <p>
          Los eventos, fechas, precios, sectores y disponibilidad que se
          muestran son informativos y pueden cambiar sin previo aviso. Las
          imágenes y videos son ilustrativos.
        </p>
      </section>

      <section>
        <h2>4. Reservas</h2>
        <p>
          Completar el formulario de reserva o enviar el mensaje por WhatsApp
          es una solicitud: no garantiza la mesa o el sector hasta que el
          equipo de BLEU la confirme por los canales de contacto. Este sitio
          no procesa pagos. Las condiciones de cada reserva (seña, horarios,
          cancelación) se acuerdan al confirmarla.
        </p>
        <p className="mt-3">
          Si en algún momento se habilitaran pagos online, regirán los plazos
          de revocación que establece la Ley de Defensa del Consumidor
          (Ley 24.240, art. 34).
        </p>
      </section>

      <section>
        <h2>5. Ingreso al local</h2>
        <p>
          El ingreso y la permanencia en BLEU se rigen por las normas del
          local y la legislación vigente. BLEU puede reservarse el derecho de
          admisión en los términos permitidos por la ley.
        </p>
        <p className="mt-3">
          El ingreso es exclusivo para mayores de 18 años, con DNI
          obligatorio. Dress code: elegante sport. La venta y el consumo
          de alcohol están prohibidos para menores de 18 años; bebé con
          moderación.
        </p>
        <p className="mt-3">
          Dentro del local se toman fotos y videos con fines de difusión en
          redes. Si no querés aparecer, avisá al personal.
        </p>
      </section>

      <section>
        <h2>6. Propiedad intelectual</h2>
        <p>
          La marca BLEU, el diseño del sitio y sus contenidos pertenecen a sus
          titulares. No podés copiarlos ni usarlos con fines comerciales sin
          autorización. Algunas imágenes y videos provienen de servicios de
          terceros y se rigen por sus licencias.
        </p>
      </section>

      <section>
        <h2>7. Responsabilidad</h2>
        <p>
          Hacemos lo posible por mantener el sitio disponible y actualizado,
          pero no garantizamos que funcione sin interrupciones ni errores. El
          sitio puede incluir enlaces a páginas de terceros (como Instagram o
          WhatsApp), sobre cuyo contenido no tenemos control.
        </p>
      </section>

      <section>
        <h2>8. Atención y reclamos</h2>
        <p>
          Para consultas o reclamos escribinos por WhatsApp o Instagram (datos
          arriba). Además, como consumidor podés presentar reclamos ante la
          autoridad de aplicación de Defensa del Consumidor de tu jurisdicción.
        </p>
      </section>

      <section>
        <h2>9. Ley aplicable</h2>
        <p>
          Estos términos se rigen por las leyes de la República Argentina.
          Para cualquier controversia serán competentes los tribunales
          ordinarios de la ciudad de Córdoba, sin perjuicio de los derechos
          que la ley otorga a los consumidores.
        </p>
      </section>

      <section>
        <h2>10. Cambios</h2>
        <p>
          Podemos actualizar estos términos. La versión vigente es la
          publicada en esta página, con su fecha de actualización.
        </p>
      </section>
    </LegalPage>
  );
}
