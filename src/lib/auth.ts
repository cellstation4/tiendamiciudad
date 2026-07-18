import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db";

export const auth = betterAuth({
  appName: "Nexo Commerce",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      if (process.env.NODE_ENV === "production") {
        throw new Error("Configure un proveedor de correo antes de usar recuperación en producción.");
      }

      await db.devEmail.create({
        data: {
          recipient: user.email,
          subject: "Restablecé tu contraseña de Nexo Commerce",
          html: `<p>Solicitud de recuperación local.</p><p><a href="${url}">Restablecer contraseña</a></p>`,
        },
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      locale: {
        type: "string",
        required: false,
        defaultValue: "es",
        input: false,
      },
    },
  },
  advanced: {
    database: { generateId: "uuid" },
    cookiePrefix: "nexo",
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
