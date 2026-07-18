import { redirect } from "next/navigation";

import { listAccessibleStores, requireUser } from "@/modules/authorization/access";

export default async function AdminIndexPage() {
  const session = await requireUser();
  const stores = await listAccessibleStores(session.user.id);
  redirect(stores[0] ? `/admin/${stores[0].store.slug}` : "/admin/stores/new");
}

