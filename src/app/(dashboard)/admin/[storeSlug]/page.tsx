import { Activity, ArrowUpRight, Box, Eye, ShieldCheck, Store, UsersRound } from "lucide-react";
import Link from "next/link";

import { db } from "@/lib/db";
import { requireStoreAccess } from "@/modules/authorization/access";
import { roleLabels, type StoreRole } from "@/modules/authorization/permissions";

export default async function DashboardPage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await params;
  const { store, membership } = await requireStoreAccess(storeSlug);
  const [memberCount, recentActivity] = await Promise.all([
    db.storeMember.count({ where: { storeId: store.id } }),
    db.activityLog.findMany({ where: { storeId: store.id }, orderBy: { createdAt: "desc" }, take: 5, include: { actor: { select: { name: true } } } }),
  ]);
  return <div className="mx-auto max-w-6xl">
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-violet-600">Resumen de la tienda</p><h1 className="text-3xl font-bold tracking-tight">Hola, {store.name}</h1><p className="mt-1 text-zinc-500">Tu base multitienda está activa y aislada.</p></div><Link href={`/store/${store.slug}`} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold dark:border-zinc-700 dark:bg-zinc-900">Ver tienda <ArrowUpRight className="size-4" /></Link></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[{ icon: Store, label: "Estado", value: store.status === "ACTIVE" ? "Activa" : "Inactiva" }, { icon: UsersRound, label: "Miembros", value: String(memberCount) }, { icon: ShieldCheck, label: "Tu rol", value: roleLabels[membership.role as StoreRole] }, { icon: Eye, label: "Plantilla", value: store.themeKey === "modern-minimal" ? "Minimalista" : "Catálogo" }].map(({ icon: Icon, label, value }) => <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950"><Icon className="size-5" /></div><p className="text-sm text-zinc-500">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>)}
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><div className="mb-4 flex items-center gap-2"><Activity className="size-5 text-violet-600" /><h2 className="font-semibold">Actividad reciente</h2></div>{recentActivity.length ? <div className="divide-y divide-zinc-100 dark:divide-zinc-800">{recentActivity.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm"><span><strong>{item.actor?.name ?? "Sistema"}</strong> · {item.action}</span><time className="whitespace-nowrap text-xs text-zinc-400">{new Intl.DateTimeFormat("es-PY", { dateStyle: "short", timeStyle: "short" }).format(item.createdAt)}</time></div>)}</div> : <p className="py-8 text-center text-sm text-zinc-500">Todavía no hay actividad.</p>}</section>
      <section className="rounded-2xl bg-zinc-900 p-5 text-white dark:bg-violet-700"><Box className="mb-5 size-7 text-violet-300" /><h2 className="text-lg font-bold">Siguiente: catálogo</h2><p className="mt-2 text-sm text-zinc-300 dark:text-violet-100">Productos, variantes e inventario se conectarán en la Etapa 2 sobre este mismo aislamiento.</p></section>
    </div>
  </div>;
}
