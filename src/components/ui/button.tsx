import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" };

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-55",
        variant === "primary" && "bg-violet-600 text-white shadow-sm hover:bg-violet-700",
        variant === "secondary" && "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        variant === "ghost" && "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
        className,
      )}
      {...props}
    />
  );
}

