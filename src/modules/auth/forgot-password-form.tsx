"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  return <form className="grid gap-4" onSubmit={async (event) => {
    event.preventDefault();
    setPending(true);
    await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    setMessage("Si la cuenta existe, la solicitud quedó guardada en el buzón local de desarrollo.");
    setPending(false);
  }}>
    <Field label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
    {message ? <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{message}</p> : null}
    <Button type="submit" disabled={pending}>{pending ? "Enviando…" : "Solicitar recuperación"}</Button>
  </form>;
}

