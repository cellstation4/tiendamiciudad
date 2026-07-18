import { notFound } from "next/navigation";

import { db } from "@/lib/db";

export default async function StorefrontStageOnePage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await params;
  const store = await db.store.findFirst({ where: { slug: storeSlug, status: "ACTIVE", deletedAt: null } });
  if (!store) notFound();
  return <main className="min-h-screen bg-white" style={{ "--brand": store.primaryColor } as React.CSSProperties}><header className="border-b px-5 py-4"><div className="mx-auto flex max-w-6xl items-center justify-between"><strong className="text-xl">{store.name}</strong><span className="rounded-full bg-zinc-100 px-3 py-1 text-xs">Vista previa · Etapa 1</span></div></header><section className="mx-auto grid min-h-[70vh] max-w-6xl place-items-center px-5 text-center"><div><span className="mb-5 inline-grid size-14 place-items-center rounded-2xl text-2xl font-bold text-white" style={{ background: "var(--brand)" }}>{store.name[0]}</span><h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{store.name}</h1><p className="mx-auto mt-5 max-w-xl text-lg text-zinc-500">{store.description || "Estamos preparando un catálogo increíble para vos."}</p><p className="mt-8 text-sm text-zinc-400">El renderizador completo y los dos themes llegan en la Etapa 3.</p></div></section></main>;
}
