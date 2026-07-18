import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-screen place-items-center bg-[#f4f2ff] p-4 dark:bg-zinc-950">
    <div className="w-full max-w-md">
      <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-lg font-bold text-zinc-900 dark:text-white"><span className="grid size-9 place-items-center rounded-xl bg-violet-600 text-white">N</span>Nexo Commerce</Link>
      <section className="rounded-3xl border border-white/70 bg-white p-7 shadow-xl shadow-violet-900/8 dark:border-zinc-800 dark:bg-zinc-900">{children}</section>
    </div>
  </main>;
}

