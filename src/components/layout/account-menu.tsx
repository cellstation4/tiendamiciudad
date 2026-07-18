"use client";

import { LogOut, Moon, Sun, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function AccountActions() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  return <div className="flex items-center gap-1">
    <Button type="button" variant="ghost" className="size-10 px-0" aria-label="Cambiar tema" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>{resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}</Button>
    <Link href="/profile" className="grid size-10 place-items-center rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Perfil"><UserRound className="size-4" /></Link>
    <Button type="button" variant="ghost" className="size-10 px-0" aria-label="Cerrar sesión" onClick={async () => { await authClient.signOut(); router.push("/login"); router.refresh(); }}><LogOut className="size-4" /></Button>
  </div>;
}

