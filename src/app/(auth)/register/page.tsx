import { AuthForm } from "@/modules/auth/auth-form";

export default function RegisterPage() {
  return <><p className="mb-2 text-sm font-semibold text-violet-600">Empezá gratis en local</p><h1 className="text-2xl font-bold">Creá tu cuenta</h1><p className="mb-6 mt-2 text-sm text-zinc-500">Tu primera tienda estará lista en pocos pasos.</p><AuthForm mode="register" /></>;
}

