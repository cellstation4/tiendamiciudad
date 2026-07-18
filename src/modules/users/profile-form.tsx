"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";

export function ProfileForm({ initialName, email }: { initialName: string; email: string }) {
  const [name, setName] = useState(initialName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  return <div className="grid gap-6">
    <form className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900" onSubmit={async (event) => { event.preventDefault(); setPending(true); const result = await authClient.updateUser({ name }); setMessage(result.error ? result.error.message ?? "No se pudo actualizar." : "Perfil actualizado."); setPending(false); }}>
      <div><h2 className="font-semibold">Datos personales</h2><p className="text-sm text-zinc-500">El email se usa como identificador de acceso.</p></div>
      <Field label="Nombre" value={name} onChange={(event) => setName(event.target.value)} required />
      <Field label="Email" value={email} disabled />
      <div><Button type="submit" disabled={pending}>{pending ? "Guardando…" : "Guardar perfil"}</Button></div>
    </form>
    <form className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900" onSubmit={async (event) => { event.preventDefault(); setPending(true); const result = await authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true }); setMessage(result.error ? result.error.message ?? "No se pudo cambiar." : "Contraseña actualizada y otras sesiones cerradas."); if (!result.error) { setCurrentPassword(""); setNewPassword(""); } setPending(false); }}>
      <div><h2 className="font-semibold">Seguridad</h2><p className="text-sm text-zinc-500">Al cambiarla se cierran las demás sesiones.</p></div>
      <Field label="Contraseña actual" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
      <Field label="Nueva contraseña" type="password" autoComplete="new-password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
      <div><Button type="submit" disabled={pending}>{pending ? "Actualizando…" : "Cambiar contraseña"}</Button></div>
    </form>
    {message ? <p className="rounded-xl bg-violet-50 p-3 text-sm text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">{message}</p> : null}
  </div>;
}

