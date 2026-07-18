import Link from "next/link";

import { createStoreAction } from "@/modules/stores/actions";
import { StoreForm } from "@/modules/stores/store-form";
import { requireUser } from "@/modules/authorization/access";

export default async function NewStorePage() {
  await requireUser();
  return <main className="min-h-screen bg-zinc-50 p-4 dark:bg-zinc-950 md:p-8"><div className="mx-auto max-w-4xl"><Link href="/admin" className="text-sm font-medium text-violet-600">← Volver al panel</Link><div className="mb-7 mt-4"><p className="text-sm font-semibold text-violet-600">Nueva tienda</p><h1 className="text-3xl font-bold tracking-tight">Configurá tu espacio comercial</h1><p className="mt-2 text-zinc-500">Todo se puede editar más adelante.</p></div><StoreForm action={createStoreAction} /></div></main>;
}

