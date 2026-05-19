import { PrismaClient } from "@prisma/client";

/** Vercel + Neon may expose POSTGRES_* instead of DATABASE_URL. */
function resolveDatabaseUrl(): void {
  if (process.env.DATABASE_URL?.trim()) return;
  const fallback =
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.DATABASE_URL_UNPOOLED?.trim();
  if (fallback) process.env.DATABASE_URL = fallback;
}

resolveDatabaseUrl();

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma: PrismaClient = globalThis.prismaGlobal ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
