import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasPermission, type StorePermission } from "@/modules/authorization/permissions";
import { accessibleStoreWhere } from "@/modules/authorization/scope";

export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireUser() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireStoreAccess(slug: string, permission: StorePermission = "store:read") {
  const session = await requireUser();
  const membership = await db.storeMember.findFirst({
    where: accessibleStoreWhere(session.user.id, slug),
    include: { store: true },
  });

  if (!membership || !hasPermission(membership.role, permission)) redirect("/admin?error=forbidden");

  return { session, membership, store: membership.store };
}

export async function listAccessibleStores(userId: string) {
  return db.storeMember.findMany({
    where: { userId, store: { deletedAt: null } },
    include: { store: true },
    orderBy: { store: { createdAt: "asc" } },
  });
}
