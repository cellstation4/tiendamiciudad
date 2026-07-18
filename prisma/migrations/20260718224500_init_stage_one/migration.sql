-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "locale" TEXT DEFAULT 'es',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "addressLine1" TEXT,
    "country" TEXT NOT NULL DEFAULT 'PY',
    "state" TEXT,
    "city" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'PYG',
    "language" TEXT NOT NULL DEFAULT 'es',
    "timezone" TEXT NOT NULL DEFAULT 'America/Asuncion',
    "socialLinks" JSONB,
    "primaryColor" TEXT NOT NULL DEFAULT '#6d5dfc',
    "secondaryColor" TEXT NOT NULL DEFAULT '#111827',
    "themeKey" TEXT NOT NULL DEFAULT 'modern-minimal',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "store_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "store_member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "store_member_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "store_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "store_invitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    "tokenHash" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "acceptedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "store_invitation_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "store_invitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_log_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "activity_log_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dev_email" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "store_createdById_idx" ON "store"("createdById");

-- CreateIndex
CREATE INDEX "store_status_deletedAt_idx" ON "store"("status", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "store_slug_key" ON "store"("slug");

-- CreateIndex
CREATE INDEX "store_member_userId_idx" ON "store_member"("userId");

-- CreateIndex
CREATE INDEX "store_member_storeId_role_idx" ON "store_member"("storeId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "store_member_storeId_userId_key" ON "store_member"("storeId", "userId");

-- CreateIndex
CREATE INDEX "store_invitation_storeId_email_idx" ON "store_invitation"("storeId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "store_invitation_tokenHash_key" ON "store_invitation"("tokenHash");

-- CreateIndex
CREATE INDEX "activity_log_storeId_createdAt_idx" ON "activity_log"("storeId", "createdAt");

-- CreateIndex
CREATE INDEX "activity_log_actorId_idx" ON "activity_log"("actorId");

-- CreateIndex
CREATE INDEX "dev_email_recipient_createdAt_idx" ON "dev_email"("recipient", "createdAt");
