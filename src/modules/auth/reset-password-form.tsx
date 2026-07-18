"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";

export function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  return <form className="grid gap-4" onSubmit={async (event) => { event.preventDefault(); const result = await authClient.resetPassword({ token, newPassword }); setMessage(result.error ? result.error.message ?? "Enlace inválido o vencido." : "Contraseña actualizada. Ya podés iniciar sesión."); }}>
    <Field label="Nueva contraseña" type="password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
    {message ? <p className="text-sm text-violet-600">{message}</p> : null}
    <Button type="submit" disabled={!token}>Guardar contraseña</Button>
  </form>;
}

