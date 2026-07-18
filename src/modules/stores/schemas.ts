import { z } from "zod";

const optionalText = z.string().trim().max(160).optional().or(z.literal(""));

export const storeSchema = z.object({
  name: z.string().trim().min(2, "Ingresá al menos 2 caracteres.").max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usá minúsculas, números y guiones."),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  email: z.email("Ingresá un email válido."),
  phone: optionalText,
  whatsapp: optionalText,
  addressLine1: optionalText,
  country: z.string().trim().length(2).default("PY"),
  state: optionalText,
  city: optionalText,
  currency: z.string().trim().length(3).default("PYG"),
  language: z.string().trim().min(2).max(5).default("es"),
  timezone: z.string().trim().min(3).max(80).default("America/Asuncion"),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  themeKey: z.enum(["modern-minimal", "commerce-catalog"]),
});

export const invitationSchema = z.object({
  email: z.email("Ingresá un email válido.").transform((value) => value.toLowerCase()),
  role: z.enum(["ADMIN", "EDITOR", "SALES", "VIEWER"]),
});

export type StoreInput = z.infer<typeof storeSchema>;

