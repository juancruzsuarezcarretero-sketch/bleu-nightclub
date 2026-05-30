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

export const reservationFormSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100),
  whatsapp: z
    .string()
    .min(8, "Ingresá un WhatsApp válido")
    .max(20),
  fecha: z.string().min(1, "Seleccioná una fecha"),
  personas: z.coerce
    .number()
    .min(1, "Mínimo 1 persona")
    .max(99, "Máximo 99 personas"),
  mensaje: z.string().max(500).optional(),
  motivo: z.literal("Reservas"),
  website: z.string().max(0, "Campo inválido").optional(),
});

export type ReservationFormData = z.infer<typeof reservationFormSchema>;
