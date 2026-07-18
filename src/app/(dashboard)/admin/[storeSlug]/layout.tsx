import { AdminShell } from "@/components/layout/admin-shell";
import { listAccessibleStores, requireStoreAccess } from "@/modules/authorization/access";

export default async function StoreAdminLayout({ children, params }: { children: React.ReactNode; params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await params;
  const { session } = await requireStoreAccess(storeSlug);
  const stores = await listAccessibleStores(session.user.id);
  return <AdminShell stores={stores} activeSlug={storeSlug} user={session.user}>{children}</AdminShell>;
}

