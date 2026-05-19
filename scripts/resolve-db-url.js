/** Align DATABASE_URL with Vercel Neon integration variable names (for Prisma CLI). */
if (!process.env.DATABASE_URL?.trim()) {
  const fallback =
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.DATABASE_URL_UNPOOLED?.trim();
  if (fallback) process.env.DATABASE_URL = fallback;
}
