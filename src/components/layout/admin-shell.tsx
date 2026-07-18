import { ChevronDown, CircleGauge, LayoutTemplate, Menu, Package, Settings, ShoppingCart, Tags, Truck, UsersRound, Warehouse } from "lucide-react";
import Link from "next/link";

import { AccountActions } from "@/components/layout/account-menu";
import { initials } from "@/lib/utils";
import type { listAccessibleStores } from "@/modules/authorization/access";

type Stores = Awaited<ReturnType<typeof listAccessibleStores>>;

const futureModules = [
  [Package, "Productos", "Etapa 2"], [Tags, "Categorías", "Etapa 2"], [Warehouse, "Inventario", "Etapa 2"],
  [LayoutTemplate, "Plantillas", "Etapa 3"], [ShoppingCart, "Pedidos", "Etapa 4"], [Truck, "Envíos", "Etapa 4"],
] as const;

export function AdminShell({ children, stores, activeSlug, user }: { children: React.ReactNode; stores: Stores; activeSlug: string; user: { name: string; email: string } }) {
  const active = stores.find(({ store }) => store.slug === activeSlug)?.store;
  return <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
    <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 lg:flex lg:flex-col">
        <Link href="/admin" className="mb-5 flex items-center gap-2 px-2 text-lg font-bold"><span className="grid size-9 place-items-center rounded-xl bg-violet-600 text-white">N</span>Nexo</Link>
        <details className="group mb-5" open>
          <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl border border-zinc-200 p-3 dark:border-zinc-700">
            <span className="grid size-9 place-items-center rounded-xl bg-violet-100 font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">{initials(active?.name ?? "Tienda")}</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{active?.name}</span><span className="block text-xs text-zinc-500">Cambiar tienda</span></span><ChevronDown className="size-4" />
          </summary>
          <div className="mt-2 grid gap-1 rounded-xl bg-zinc-50 p-2 dark:bg-zinc-950">{stores.map(({ store }) => <Link key={store.id} className="rounded-lg px-3 py-2 text-sm hover:bg-white dark:hover:bg-zinc-800" href={`/admin/${store.slug}`}>{store.name}</Link>)}<Link href="/admin/stores/new" className="rounded-lg px-3 py-2 text-sm font-medium text-violet-600">+ Crear tienda</Link></div>
        </details>
        <nav className="grid gap-1 text-sm">
          <Link className="flex items-center gap-3 rounded-xl bg-violet-50 px-3 py-2.5 font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300" href={`/admin/${activeSlug}`}><CircleGauge className="size-4" />Dashboard</Link>
          <p className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Comercio</p>
          {futureModules.map(([Icon, label, stage]) => <div key={label} className="flex items-center gap-3 rounded-xl px-3 py-2 text-zinc-400" title={`${label} se implementará en ${stage}`}><Icon className="size-4" /><span className="flex-1">{label}</span><span className="text-[10px]">{stage.replace("Etapa ", "E")}</span></div>)}
          <p className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Administración</p>
          <Link className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800" href={`/admin/${activeSlug}/members`}><UsersRound className="size-4" />Miembros</Link>
          <Link className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800" href={`/admin/${activeSlug}/settings`}><Settings className="size-4" />Configuración</Link>
        </nav>
        <div className="mt-auto flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800"><span className="grid size-9 place-items-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">{initials(user.name)}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{user.name}</span><span className="block truncate text-xs text-zinc-500">{user.email}</span></span></div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-zinc-200 bg-white/90 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 md:px-7">
          <details className="relative lg:hidden"><summary className="grid size-10 cursor-pointer list-none place-items-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Abrir menú"><Menu className="size-5" /></summary><nav className="absolute left-0 top-12 grid w-64 gap-1 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"><Link className="rounded-xl px-3 py-2 text-sm font-medium" href={`/admin/${activeSlug}`}>Dashboard</Link><Link className="rounded-xl px-3 py-2 text-sm" href={`/admin/${activeSlug}/members`}>Miembros</Link><Link className="rounded-xl px-3 py-2 text-sm" href={`/admin/${activeSlug}/settings`}>Configuración</Link><Link className="rounded-xl px-3 py-2 text-sm text-violet-600" href="/admin/stores/new">Crear tienda</Link></nav></details>
          <Link href="/admin" className="ml-2 mr-auto flex items-center gap-2 font-bold lg:hidden"><span className="grid size-8 place-items-center rounded-lg bg-violet-600 text-white">N</span>{active?.name}</Link><div className="ml-auto"><AccountActions /></div>
        </header>
        <main className="p-4 md:p-7">{children}</main>
      </div>
    </div>
  </div>;
}
