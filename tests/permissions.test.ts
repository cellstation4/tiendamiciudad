import { describe, expect, it } from "vitest";

import { hasPermission } from "@/modules/authorization/permissions";
import { accessibleStoreWhere } from "@/modules/authorization/scope";

describe("autorización multitienda", () => {
  it("incluye usuario, slug y exclusión lógica en todo acceso", () => {
    expect(accessibleStoreWhere("user-a", "tienda-a")).toEqual({ userId: "user-a", store: { slug: "tienda-a", deletedAt: null } });
  });

  it("impide que administradores eliminen la tienda", () => {
    expect(hasPermission("ADMIN", "store:update")).toBe(true);
    expect(hasPermission("ADMIN", "store:delete")).toBe(false);
  });

  it("limita correctamente los roles de lectura y ventas", () => {
    expect(hasPermission("VIEWER", "catalog:write")).toBe(false);
    expect(hasPermission("SALES", "orders:write")).toBe(true);
    expect(hasPermission("EDITOR", "members:manage")).toBe(false);
  });
});

