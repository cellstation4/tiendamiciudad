import Link from "next/link";

import { requireUser } from "@/modules/authorization/access";
import { ProfileForm } from "@/modules/users/profile-form";

export default async function ProfilePage() {
  const session = await requireUser();
  return <main className="min-h-screen bg-zinc-50 p-4 dark:bg-zinc-950 md:p-8"><div className="mx-auto max-w-2xl"><Link href="/admin" className="text-sm font-medium text-violet-600">← Volver al panel</Link><div className="mb-7 mt-4"><h1 className="text-3xl font-bold">Mi perfil</h1><p className="mt-1 text-zinc-500">Información personal y seguridad de la cuenta.</p></div><ProfileForm initialName={session.user.name} email={session.user.email} /></div></main>;
}

