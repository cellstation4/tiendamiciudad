import { db } from "@/lib/db";
import { initials } from "@/lib/utils";
import { requireStoreAccess } from "@/modules/authorization/access";
import { hasPermission, roleLabels, type StoreRole } from "@/modules/authorization/permissions";
import { inviteMemberAction } from "@/modules/stores/actions";
import { InviteForm } from "@/modules/stores/invite-form";

export default async function MembersPage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await params;
  const { store, membership } = await requireStoreAccess(storeSlug, "members:read");
  const [members, invitations] = await Promise.all([
    db.storeMember.findMany({ where: { storeId: store.id }, include: { user: true }, orderBy: { createdAt: "asc" } }),
    db.storeInvitation.findMany({ where: { storeId: store.id, acceptedAt: null, expiresAt: { gt: new Date() } }, orderBy: { createdAt: "desc" } }),
  ]);
  return <div className="mx-auto max-w-5xl"><div className="mb-7"><p className="text-sm font-semibold text-violet-600">Acceso y permisos</p><h1 className="text-3xl font-bold tracking-tight">Miembros</h1><p className="mt-1 text-zinc-500">Cada rol tiene permisos definidos en el dominio, no solo en la interfaz.</p></div>
    {hasPermission(membership.role, "members:manage") ? <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><h2 className="mb-4 font-semibold">Invitar miembro</h2><InviteForm action={inviteMemberAction.bind(null, storeSlug)} /></section> : null}
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"><div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800"><h2 className="font-semibold">Equipo actual</h2></div><div className="divide-y divide-zinc-100 dark:divide-zinc-800">{members.map((item) => <div key={item.id} className="flex items-center gap-3 px-5 py-4"><span className="grid size-10 place-items-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">{initials(item.user.name)}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.user.name}</p><p className="truncate text-xs text-zinc-500">{item.user.email}</p></div><span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium dark:bg-zinc-800">{roleLabels[item.role as StoreRole]}</span></div>)}</div></section>
    {invitations.length ? <section className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-5 dark:border-zinc-700"><h2 className="mb-3 font-semibold">Invitaciones pendientes</h2>{invitations.map((item) => <div key={item.id} className="flex justify-between py-2 text-sm"><span>{item.email}</span><span className="text-zinc-500">{roleLabels[item.role as StoreRole]}</span></div>)}</section> : null}
  </div>;
}

