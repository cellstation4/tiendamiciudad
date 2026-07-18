"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { requireStoreAccess, requireUser } from "@/modules/authorization/access";
import { invitationSchema, storeSchema, type StoreInput } from "@/modules/stores/schemas";

export type ActionState = { error?: string; success?: string; fields?: Record<string, string[]> };

function formToStoreInput(formData: FormData): StoreInput {
  return {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    addressLine1: String(formData.get("addressLine1") ?? ""),
    country: String(formData.get("country") ?? "PY"),
    state: String(formData.get("state") ?? ""),
    city: String(formData.get("city") ?? ""),
    currency: String(formData.get("currency") ?? "PYG"),
    language: String(formData.get("language") ?? "es"),
    timezone: String(formData.get("timezone") ?? "America/Asuncion"),
    primaryColor: String(formData.get("primaryColor") ?? "#6d5dfc"),
    secondaryColor: String(formData.get("secondaryColor") ?? "#111827"),
    themeKey: String(formData.get("themeKey") ?? "modern-minimal") as StoreInput["themeKey"],
  };
}

export async function createStoreAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireUser();
  const parsed = storeSchema.safeParse(formToStoreInput(formData));
  if (!parsed.success) return { error: "Revisá los campos marcados.", fields: parsed.error.flatten().fieldErrors };

  const exists = await db.store.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (exists) return { error: "Ese identificador ya está en uso." };

  const store = await db.$transaction(async (tx) => {
    const created = await tx.store.create({ data: { ...parsed.data, createdById: session.user.id } });
    await tx.storeMember.create({ data: { storeId: created.id, userId: session.user.id, role: "OWNER" } });
    await tx.activityLog.create({
      data: { storeId: created.id, actorId: session.user.id, action: "store.created", entityType: "Store", entityId: created.id },
    });
    return created;
  });

  redirect(`/admin/${store.slug}`);
}

export async function updateStoreAction(slug: string, _state: ActionState, formData: FormData): Promise<ActionState> {
  const { session, store } = await requireStoreAccess(slug, "store:update");
  const parsed = storeSchema.safeParse(formToStoreInput(formData));
  if (!parsed.success) return { error: "Revisá los campos marcados.", fields: parsed.error.flatten().fieldErrors };

  const collision = await db.store.findFirst({ where: { slug: parsed.data.slug, id: { not: store.id } }, select: { id: true } });
  if (collision) return { error: "Ese identificador ya está en uso." };

  await db.$transaction([
    db.store.update({ where: { id: store.id }, data: parsed.data }),
    db.activityLog.create({ data: { storeId: store.id, actorId: session.user.id, action: "store.updated", entityType: "Store", entityId: store.id } }),
  ]);
  revalidatePath(`/admin/${slug}`);
  if (slug !== parsed.data.slug) redirect(`/admin/${parsed.data.slug}/settings`);
  return { success: "Datos de la tienda actualizados." };
}

export async function toggleStoreStatusAction(slug: string) {
  const { session, store } = await requireStoreAccess(slug, "store:delete");
  const nextStatus = store.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  await db.$transaction([
    db.store.update({ where: { id: store.id }, data: { status: nextStatus } }),
    db.activityLog.create({ data: { storeId: store.id, actorId: session.user.id, action: `store.${nextStatus.toLowerCase()}`, entityType: "Store", entityId: store.id } }),
  ]);
  revalidatePath(`/admin/${slug}`);
}

export async function inviteMemberAction(slug: string, _state: ActionState, formData: FormData): Promise<ActionState> {
  const { session, store } = await requireStoreAccess(slug, "members:manage");
  const parsed = invitationSchema.safeParse({ email: formData.get("email"), role: formData.get("role") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invitación inválida." };
  if (parsed.data.email === session.user.email.toLowerCase()) return { error: "Ya sos miembro de esta tienda." };

  const existingUser = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existingUser) {
    const alreadyMember = await db.storeMember.findUnique({ where: { storeId_userId: { storeId: store.id, userId: existingUser.id } } });
    if (alreadyMember) return { error: "Este usuario ya es miembro." };
    await db.$transaction([
      db.storeMember.create({ data: { storeId: store.id, userId: existingUser.id, role: parsed.data.role } }),
      db.activityLog.create({ data: { storeId: store.id, actorId: session.user.id, action: "member.added", entityType: "StoreMember", metadata: { email: parsed.data.email, role: parsed.data.role } } }),
    ]);
    revalidatePath(`/admin/${slug}/members`);
    return { success: "El usuario existente fue agregado al equipo." };
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const inviteUrl = `${process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/invitations/${token}`;
  await db.$transaction([
    db.storeInvitation.create({ data: { storeId: store.id, email: parsed.data.email, role: parsed.data.role, tokenHash, invitedById: session.user.id, expiresAt: new Date(Date.now() + 7 * 86_400_000) } }),
    db.activityLog.create({ data: { storeId: store.id, actorId: session.user.id, action: "member.invited", entityType: "StoreInvitation", metadata: { email: parsed.data.email, role: parsed.data.role } } }),
    db.devEmail.create({ data: { recipient: parsed.data.email, subject: `Invitación a ${store.name}`, html: `<p>Te invitaron a ${store.name}.</p><p><a href="${inviteUrl}">Aceptar invitación</a></p>` } }),
  ]);

  revalidatePath(`/admin/${slug}/members`);
  return { success: "Invitación creada en el buzón local de desarrollo." };
}

export async function acceptInvitationAction(token: string) {
  const session = await requireUser();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const invitation = await db.storeInvitation.findUnique({ where: { tokenHash }, include: { store: true } });
  if (!invitation || invitation.acceptedAt || invitation.expiresAt <= new Date()) redirect("/admin?error=invalid-invitation");
  if (invitation.email.toLowerCase() !== session.user.email.toLowerCase()) redirect("/admin?error=wrong-invitation-user");

  await db.$transaction(async (tx) => {
    await tx.storeMember.upsert({
      where: { storeId_userId: { storeId: invitation.storeId, userId: session.user.id } },
      update: { role: invitation.role },
      create: { storeId: invitation.storeId, userId: session.user.id, role: invitation.role },
    });
    await tx.storeInvitation.update({ where: { id: invitation.id }, data: { acceptedAt: new Date() } });
    await tx.activityLog.create({ data: { storeId: invitation.storeId, actorId: session.user.id, action: "member.joined", entityType: "StoreMember" } });
  });
  redirect(`/admin/${invitation.store.slug}`);
}
