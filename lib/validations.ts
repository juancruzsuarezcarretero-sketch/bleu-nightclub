import { z } from "zod";

export const contactSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  email: z.string().email("Ingresá un email válido"),
  telefono: z.string().optional(),
  motivo: z.enum([
    "Reservas",
    "Eventos Privados",
    "Artistas",
    "Prensa",
    "Otro",
  ]),
  mensaje: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(2000, "El mensaje es demasiado largo"),
  website: z.string().max(0, "Campo inválido").optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const reservationSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100),
  whatsapp: z
    .string()
    .min(8, "Ingresá un WhatsApp válido")
    .max(20),
  personas: z.coerce
    .number()
    .min(2, "Mínimo 2 personas")
    .max(20, "Máximo 20 personas"),
  fecha: z.string().min(1, "Seleccioná una fecha"),
  sector: z.string().min(1),
  mesa: z.string().optional(),
  package: z.enum(["Silver", "Gold", "Ultra"]),
  mensaje: z.string().max(500).optional(),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;
