"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SubmitButton({ children, pendingLabel = "Guardando…" }: { children: React.ReactNode; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? <><LoaderCircle className="size-4 animate-spin" />{pendingLabel}</> : children}</Button>;
}

