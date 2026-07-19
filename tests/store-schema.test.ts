import { describe, expect, it } from "vitest";

import { storeSchema } from "@/modules/stores/schemas";

const validStore = { name: "Mi tienda", slug: "mi-tienda", email: "hola@tienda.local", country: "PY", currency: "PYG", language: "es", timezone: "America/Asuncion", primaryColor: "#6d5dfc", secondaryColor: "#111827", themeKey: "modern-minimal" };

describe("validación de tiendas", () => {
  it("acepta una configuración válida", () => expect(storeSchema.safeParse(validStore).success).toBe(true));
  it("normaliza espacios, acentos y distintos tipos de guion", () => {
    const parsed = storeSchema.safeParse({ ...validStore, slug: "  Mí–Tienda Nueva  " });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.slug).toBe("mi-tienda-nueva");
  });
  it("elimina segmentos de ruta y nunca los conserva en el slug", () => {
    const parsed = storeSchema.safeParse({ ...validStore, slug: "Tienda ajena/../" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.slug).toBe("tienda-ajena");
  });
  it("rechaza identificadores sin letras ni números", () => expect(storeSchema.safeParse({ ...validStore, slug: "../" }).success).toBe(false));
  it("rechaza colores y emails inválidos", () => expect(storeSchema.safeParse({ ...validStore, email: "no-email", primaryColor: "red" }).success).toBe(false));
});
