import { ForgotPasswordForm } from "@/modules/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return <><h1 className="text-2xl font-bold">Recuperar contraseña</h1><p className="mb-6 mt-2 text-sm text-zinc-500">En desarrollo, el enlace queda guardado en SQLite y nunca se imprime en logs.</p><ForgotPasswordForm /></>;
}
