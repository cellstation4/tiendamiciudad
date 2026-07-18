import { describe, expect, it } from "vitest";

import { storeSchema } from "@/modules/stores/schemas";

const validStore = { name: "Mi tienda", slug: "mi-tienda", email: "hola@tienda.local", country: "PY", currency: "PYG", language: "es", timezone: "America/Asuncion", primaryColor: "#6d5dfc", secondaryColor: "#111827", themeKey: "modern-minimal" };

describe("validación de tiendas", () => {
  it("acepta una configuración válida", () => expect(storeSchema.safeParse(validStore).success).toBe(true));
  it("rechaza slugs inseguros", () => expect(storeSchema.safeParse({ ...validStore, slug: "Tienda ajena/../" }).success).toBe(false));
  it("rechaza colores y emails inválidos", () => expect(storeSchema.safeParse({ ...validStore, email: "no-email", primaryColor: "red" }).success).toBe(false));
});
