import { AuthForm } from "@/modules/auth/auth-form";

export default function LoginPage() {
  return <><p className="mb-2 text-sm font-semibold text-violet-600">Bienvenido de nuevo</p><h1 className="text-2xl font-bold">Ingresá a tu panel</h1><p className="mb-6 mt-2 text-sm text-zinc-500">Administrá todas tus tiendas desde un solo lugar.</p><AuthForm mode="login" /></>;
}

