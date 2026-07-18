"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({ email: z.email("Email inválido."), password: z.string().min(8, "Mínimo 8 caracteres.") });
const registerSchema = loginSchema.extend({ name: z.string().trim().min(2, "Ingresá tu nombre.").max(80) });
type LoginInput = z.infer<typeof loginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const schema = mode === "login" ? loginSchema : registerSchema;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput & Partial<RegisterInput>>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: LoginInput & Partial<RegisterInput>) => {
    setServerError("");
    const result = mode === "login"
      ? await authClient.signIn.email({ email: values.email, password: values.password })
      : await authClient.signUp.email({ name: values.name ?? "", email: values.email, password: values.password });
    if (result.error) {
      setServerError(result.error.message ?? "No pudimos completar la operación.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      {mode === "register" ? <Field label="Nombre" autoComplete="name" {...register("name")} error={errors.name?.message} /> : null}
      <Field label="Email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
      <Field label="Contraseña" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} {...register("password")} error={errors.password?.message} />
      {serverError ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{serverError}</p> : null}
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="size-4 animate-spin" />Procesando…</> : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</Button>
      <div className="flex justify-between text-sm text-zinc-500">
        <Link className="hover:text-violet-600" href={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Crear una cuenta" : "Ya tengo cuenta"}</Link>
        {mode === "login" ? <Link className="hover:text-violet-600" href="/forgot-password">Olvidé mi contraseña</Link> : null}
      </div>
    </form>
  );
}

