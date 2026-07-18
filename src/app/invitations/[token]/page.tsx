import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/modules/authorization/access";
import { acceptInvitationAction } from "@/modules/stores/actions";

export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await getCurrentSession();
  return <main className="grid min-h-screen place-items-center bg-violet-50 p-4 dark:bg-zinc-950"><section className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-xl dark:bg-zinc-900"><span className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl bg-violet-600 text-xl font-bold text-white">N</span><h1 className="text-2xl font-bold">Invitación a una tienda</h1>{session ? <><p className="my-5 text-sm text-zinc-500">Vas a aceptar esta invitación como <strong>{session.user.email}</strong>.</p><form action={acceptInvitationAction.bind(null, token)}><Button type="submit">Aceptar invitación</Button></form></> : <><p className="my-5 text-sm text-zinc-500">Iniciá sesión o registrate con el email invitado. Luego volvé a abrir este enlace.</p><div className="flex justify-center gap-2"><Link className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white" href="/login">Iniciar sesión</Link><Link className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold dark:border-zinc-700" href="/register">Registrarme</Link></div></>}</section></main>;
}
