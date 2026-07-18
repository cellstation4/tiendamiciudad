import { Suspense } from "react";

import { ResetPasswordForm } from "@/modules/auth/reset-password-form";

export default function ResetPasswordPage() {
  return <><h1 className="text-2xl font-bold">Nueva contraseña</h1><p className="mb-6 mt-2 text-sm text-zinc-500">Elegí una contraseña de al menos 8 caracteres.</p><Suspense fallback={<p>Cargando…</p>}><ResetPasswordForm /></Suspense></>;
}

