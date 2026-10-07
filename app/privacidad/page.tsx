import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import ResponsableInfo from "@/components/ResponsableInfo";

export const metadata: Metadata = {
  title: "Política de privacidad | BLEU Nightclub",
  description: "Qué datos personales recopila el sitio de BLEU Nightclub, para qué los usa y cómo ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
};

export default function Page() {
  return (
    <LegalPage title="Política de privacidad">
      <section>
        <h2>1. Responsable del tratamiento</h2>
        <ResponsableInfo />
      </section>

      <section>
        <h2>2. Qué datos recopilamos</h2>
        <p>Solo los que vos nos enviás a través de los formularios del sitio:</p>
        <ul>
          <li>
            <strong>Formulario de contacto:</strong> nombre, email, teléfono
            (opcional), motivo y mensaje.
          </li>
          <li>
            <strong>Reservas:</strong> nombre, número de WhatsApp, fecha,
            cantidad de personas, mensaje (opcional) y el sector o paquete
            elegido con su precio.
          </li>
        </ul>
        <p className="mt-3">
          No pedimos documentos de identidad ni datos de pago.
        </p>
      </section>

      <section>
        <h2>3. Para qué los usamos</h2>
        <ul>
          <li>Responder tu consulta o mensaje.</li>
          <li>Gestionar y confirmar tu reserva.</li>
          <li>Cumplir obligaciones legales cuando corresponda.</li>
        </ul>
        <p className="mt-3">No vendemos tus datos ni los usamos para otros fines.</p>
      </section>

      <section>
        <h2>4. Con quién se procesan</h2>
        <p>Para que el sitio funcione usamos proveedores de servicios:</p>
        <ul>
          <li>Vercel, donde está alojado el sitio.</li>
          <li>Supabase, base de datos donde se guardan las reservas.</li>
          <li>
            WhatsApp (Meta), si elegís enviar tu reserva o consulta por ese
            medio: ese envío se rige por las condiciones de WhatsApp.
          </li>
          <li>
            Unsplash y Mixkit, desde cuyos servidores se cargan algunas
            imágenes y videos; al verlos, esos servicios pueden recibir datos
            técnicos de tu conexión, como tu dirección IP.
          </li>
        </ul>
        <p className="mt-3">
          Algunos de estos proveedores pueden almacenar información fuera de la
          Argentina.
        </p>
      </section>

      <section>
        <h2>5. Cuánto tiempo los conservamos</h2>
        <p>
          Solo el tiempo necesario para atender tu consulta o reserva y cumplir
          con las obligaciones legales aplicables.
        </p>
      </section>

      <section>
        <h2>6. Tus derechos</h2>
        <p>
          Como titular de los datos podés acceder a ellos, rectificarlos,
          actualizarlos y pedir su supresión, en los términos de la Ley 25.326
          de Protección de los Datos Personales. Para ejercer estos derechos
          escribinos por cualquiera de los canales de contacto indicados arriba.
        </p>
        <p className="mt-3">
          La Agencia de Acceso a la Información Pública, en su carácter de
          Órgano de Control de la Ley 25.326, tiene la atribución de atender
          las denuncias y reclamos que interpongan quienes resulten afectados
          en sus derechos por incumplimiento de las normas vigentes en materia
          de protección de datos personales.
        </p>
      </section>

      <section>
        <h2>7. Seguridad</h2>
        <p>
          Aplicamos medidas razonables para proteger tus datos, como el uso de
          conexión cifrada (HTTPS) y la validación de los formularios.
        </p>
      </section>

      <section>
        <h2>8. Cookies</h2>
        <p>
          Ver la <Link href="/cookies">política de cookies</Link>.
        </p>
      </section>

      <section>
        <h2>9. Cambios</h2>
        <p>
          Podemos actualizar esta política. La versión vigente es la publicada
          en esta página, con su fecha de actualización.
        </p>
      </section>
    </LegalPage>
  );
}
