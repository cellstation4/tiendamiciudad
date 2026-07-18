import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Field({ label, error, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
      {label}
      <input className={cn("h-11 rounded-xl border border-zinc-200 bg-white px-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-3 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white", error && "border-red-500", className)} {...props} />
      {error ? <span className="text-xs font-normal text-red-600">{error}</span> : null}
    </label>
  );
}

export function TextareaField({ label, error, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
      {label}
      <textarea className={cn("min-h-28 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-950 outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white", error && "border-red-500", className)} {...props} />
      {error ? <span className="text-xs font-normal text-red-600">{error}</span> : null}
    </label>
  );
}

export function SelectField({ label, children, className, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
      {label}
      <select className={cn("h-11 rounded-xl border border-zinc-200 bg-white px-3 text-zinc-950 outline-none focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white", className)} {...props}>{children}</select>
    </label>
  );
}

