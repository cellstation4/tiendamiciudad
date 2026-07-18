"use client";

import { useActionState } from "react";

import { Field, SelectField } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ActionState } from "@/modules/stores/actions";

export function InviteForm({ action }: { action: (state: ActionState, data: FormData) => Promise<ActionState> }) {
  const [state, formAction] = useActionState(action, {});
  return <form action={formAction} className="grid gap-4 sm:grid-cols-[1fr_190px_auto] sm:items-end">
    <Field name="email" type="email" label="Email del miembro" placeholder="persona@ejemplo.com" required />
    <SelectField name="role" label="Rol" defaultValue="VIEWER"><option value="ADMIN">Administrador</option><option value="EDITOR">Editor</option><option value="SALES">Vendedor</option><option value="VIEWER">Solo lectura</option></SelectField>
    <SubmitButton pendingLabel="Invitando…">Invitar</SubmitButton>
    {state.error ? <p className="text-sm text-red-600 sm:col-span-3">{state.error}</p> : null}
    {state.success ? <p className="text-sm text-emerald-600 sm:col-span-3">{state.success}</p> : null}
  </form>;
}

