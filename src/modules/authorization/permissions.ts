export const STORE_ROLES = ["OWNER", "ADMIN", "EDITOR", "SALES", "VIEWER"] as const;
export type StoreRole = (typeof STORE_ROLES)[number];

export const STORE_PERMISSIONS = [
  "store:read",
  "store:update",
  "store:delete",
  "members:read",
  "members:manage",
  "catalog:read",
  "catalog:write",
  "orders:read",
  "orders:write",
] as const;
export type StorePermission = (typeof STORE_PERMISSIONS)[number];

const rolePermissions: Record<StoreRole, ReadonlySet<StorePermission>> = {
  OWNER: new Set(STORE_PERMISSIONS),
  ADMIN: new Set(STORE_PERMISSIONS.filter((permission) => permission !== "store:delete")),
  EDITOR: new Set(["store:read", "catalog:read", "catalog:write", "orders:read"]),
  SALES: new Set(["store:read", "catalog:read", "orders:read", "orders:write"]),
  VIEWER: new Set(["store:read", "catalog:read", "orders:read"]),
};

export function isStoreRole(value: string): value is StoreRole {
  return STORE_ROLES.includes(value as StoreRole);
}

export function hasPermission(role: string, permission: StorePermission) {
  return isStoreRole(role) && rolePermissions[role].has(permission);
}

export const roleLabels: Record<StoreRole, string> = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  EDITOR: "Editor",
  SALES: "Vendedor",
  VIEWER: "Solo lectura",
};

