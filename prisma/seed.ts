import { auth } from "../src/lib/auth";
import { db } from "../src/lib/db";

const demoUsers = [
  { name: "Admin Demo", email: "admin@nexo.local", password: "DemoLocal123!" },
  { name: "Editora Demo", email: "editor@nexo.local", password: "DemoLocal123!" },
];

async function ensureUser(input: (typeof demoUsers)[number]) {
  const existing = await db.user.findUnique({ where: { email: input.email } });
  if (existing) return existing;
  await auth.api.signUpEmail({ body: input });
  const created = await db.user.findUnique({ where: { email: input.email } });
  if (!created) throw new Error(`No se pudo crear el usuario de desarrollo ${input.email}`);
  return created;
}

async function seed() {
  const [admin, editor] = await Promise.all(demoUsers.map(ensureUser));
  const stores = [
    { name: "Casa Aurora", slug: "casa-aurora", description: "Objetos simples para espacios con identidad.", email: "hola@aurora.local", themeKey: "modern-minimal", primaryColor: "#6d5dfc" },
    { name: "Mercado Norte", slug: "mercado-norte", description: "Catálogo comercial para todos los días.", email: "ventas@norte.local", themeKey: "commerce-catalog", primaryColor: "#ea580c" },
  ];

  for (const input of stores) {
    const store = await db.store.upsert({
      where: { slug: input.slug },
      update: {},
      create: { ...input, createdById: admin.id },
    });
    await db.storeMember.upsert({ where: { storeId_userId: { storeId: store.id, userId: admin.id } }, update: { role: "OWNER" }, create: { storeId: store.id, userId: admin.id, role: "OWNER" } });
    if (input.slug === "casa-aurora") {
      await db.storeMember.upsert({ where: { storeId_userId: { storeId: store.id, userId: editor.id } }, update: { role: "EDITOR" }, create: { storeId: store.id, userId: editor.id, role: "EDITOR" } });
    }
    const activityExists = await db.activityLog.findFirst({ where: { storeId: store.id, action: "seed.created" } });
    if (!activityExists) await db.activityLog.create({ data: { storeId: store.id, actorId: admin.id, action: "seed.created", entityType: "Store", entityId: store.id } });
  }
}

seed().then(() => db.$disconnect()).catch(async (error: unknown) => { console.error(error instanceof Error ? error.message : "Seed falló"); await db.$disconnect(); process.exit(1); });

