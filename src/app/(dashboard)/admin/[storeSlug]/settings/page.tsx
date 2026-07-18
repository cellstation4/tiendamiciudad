import { Button } from "@/components/ui/button";
import { requireStoreAccess } from "@/modules/authorization/access";
import { hasPermission } from "@/modules/authorization/permissions";
import { toggleStoreStatusAction, updateStoreAction } from "@/modules/stores/actions";
import { StoreForm } from "@/modules/stores/store-form";

export default async function StoreSettingsPage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await params;
  const { store, membership } = await requireStoreAccess(storeSlug, "store:update");
  const updateAction = updateStoreAction.bind(null, storeSlug);
  const toggleAction = toggleStoreStatusAction.bind(null, storeSlug);
  return <div className="mx-auto max-w-5xl"><div className="mb-7"><p className="text-sm font-semibold text-violet-600">Configuración</p><h1 className="text-3xl font-bold tracking-tight">Datos de {store.name}</h1><p className="mt-1 text-zinc-500">Estos valores pertenecen únicamente a esta tienda.</p></div><StoreForm action={updateAction} values={store} submitLabel="Guardar cambios" />
    {hasPermission(membership.role, "store:delete") ? <section className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30"><h2 className="font-semibold text-red-800 dark:text-red-300">Estado de la tienda</h2><p className="mb-4 mt-1 text-sm text-red-700/80 dark:text-red-300/80">Desactivar conserva todos los datos y bloquea la publicación. No se elimina físicamente.</p><form action={toggleAction}><Button variant={store.status === "ACTIVE" ? "danger" : "secondary"} type="submit">{store.status === "ACTIVE" ? "Desactivar tienda" : "Reactivar tienda"}</Button></form></section> : null}
  </div>;
}

