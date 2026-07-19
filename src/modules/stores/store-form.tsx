"use client";

import { useActionState } from "react";

import { Field, SelectField, TextareaField } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ActionState } from "@/modules/stores/actions";
import { normalizeStoreSlug } from "@/modules/stores/slug";

type StoreValues = {
  name?: string; slug?: string; description?: string | null; email?: string; phone?: string | null; whatsapp?: string | null;
  addressLine1?: string | null; country?: string; state?: string | null; city?: string | null; currency?: string; language?: string;
  timezone?: string; primaryColor?: string; secondaryColor?: string; themeKey?: string;
};

export function StoreForm({ action, values = {}, submitLabel = "Crear tienda" }: { action: (state: ActionState, data: FormData) => Promise<ActionState>; values?: StoreValues; submitLabel?: string }) {
  const [state, formAction] = useActionState(action, {});
  const error = (name: string) => state.fields?.[name]?.[0];
  return <form action={formAction} className="grid gap-7">
    <section className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div><h2 className="font-semibold">Identidad</h2><p className="text-sm text-zinc-500">Datos principales y dirección pública local.</p></div>
      <div className="grid gap-4 md:grid-cols-2"><Field name="name" label="Nombre comercial" defaultValue={values.name} required error={error("name")} /><Field name="slug" label="Identificador (slug)" defaultValue={values.slug} required placeholder="mi-tienda" onBlur={(event) => { event.currentTarget.value = normalizeStoreSlug(event.currentTarget.value); }} error={error("slug")} /></div>
      <TextareaField name="description" label="Descripción" defaultValue={values.description ?? ""} error={error("description")} />
      <div className="grid gap-4 md:grid-cols-3"><Field name="email" type="email" label="Email comercial" defaultValue={values.email} required error={error("email")} /><Field name="phone" label="Teléfono" defaultValue={values.phone ?? ""} /><Field name="whatsapp" label="WhatsApp" defaultValue={values.whatsapp ?? ""} /></div>
    </section>
    <section className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div><h2 className="font-semibold">Ubicación y operación</h2><p className="text-sm text-zinc-500">La moneda y zona horaria se usarán en pedidos e informes.</p></div>
      <Field name="addressLine1" label="Dirección" defaultValue={values.addressLine1 ?? ""} />
      <div className="grid gap-4 sm:grid-cols-3"><Field name="country" label="País (ISO)" defaultValue={values.country ?? "PY"} maxLength={2} /><Field name="state" label="Provincia / estado" defaultValue={values.state ?? ""} /><Field name="city" label="Ciudad" defaultValue={values.city ?? ""} /></div>
      <div className="grid gap-4 sm:grid-cols-3"><SelectField name="currency" label="Moneda" defaultValue={values.currency ?? "PYG"}><option value="PYG">PYG — Guaraní</option><option value="USD">USD — Dólar</option><option value="ARS">ARS — Peso argentino</option></SelectField><SelectField name="language" label="Idioma" defaultValue={values.language ?? "es"}><option value="es">Español</option><option value="en">English</option><option value="pt">Português</option></SelectField><Field name="timezone" label="Zona horaria" defaultValue={values.timezone ?? "America/Asuncion"} /></div>
    </section>
    <section className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div><h2 className="font-semibold">Apariencia inicial</h2><p className="text-sm text-zinc-500">Podrás personalizar secciones completas en la Etapa 3.</p></div>
      <div className="grid gap-4 sm:grid-cols-3"><Field name="primaryColor" type="color" label="Color principal" className="p-1" defaultValue={values.primaryColor ?? "#6d5dfc"} /><Field name="secondaryColor" type="color" label="Color secundario" className="p-1" defaultValue={values.secondaryColor ?? "#111827"} /><SelectField name="themeKey" label="Plantilla" defaultValue={values.themeKey ?? "modern-minimal"}><option value="modern-minimal">Minimalista moderna</option><option value="commerce-catalog">Catálogo comercial</option></SelectField></div>
    </section>
    {state.error ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{state.error}</p> : null}
    {state.success ? <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{state.success}</p> : null}
    <div><SubmitButton>{submitLabel}</SubmitButton></div>
  </form>;
}
