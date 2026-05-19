# Deployment: GitHub → Vercel → Neon

The app is a standard **Next.js** stack: **GitHub** hosts the source, **Vercel** builds and runs it, **Neon** provides **PostgreSQL** for Prisma.

You can use a **new** Vercel account and a **new** Neon project without changing this wiring—only accounts, env vars, and integrations change.

## 1. Neon (new PostgreSQL project)

1. Sign in at [Neon](https://neon.tech) with the account you want to use (or create one).
2. Create a **new project** and database.
3. Copy the connection strings:
   - **Pooled** URL → use as `DATABASE_URL` on Vercel (recommended for serverless).
   - **Direct** URL → optional `DATABASE_URL_UNPOOLED` for local `prisma migrate` if Neon recommends it.

**Security:** never commit real URLs or passwords. Use `.env.example` as a template and set values only in `.env` (local) and in the Vercel dashboard (production).

## 2. Vercel (new project, new GitHub connection)

1. Sign in at [Vercel](https://vercel.com) with your **new** Vercel account.
2. **Add New Project** → **Import** the GitHub repository for this app.
3. Grant Vercel access to that repo if prompted (GitHub OAuth / app installation).
4. **Root directory:** repository root (default), **Framework Preset:** Next.js.
5. Under **Environment Variables**, add at least:

| Name | Notes |
|------|--------|
| `DATABASE_URL` | Neon pooled connection string |
| `DATABASE_URL_UNPOOLED` | Optional; direct Neon URL for migrations from CI or local |
| `JWT_SECRET` | Long random string |
| `NEXT_PUBLIC_APP_NAME` | Shown in UI and emails (e.g. `MealNetworks`) |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Optional; public contact email |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | If you use maps; see `docs/GOOGLE_MAPS_SETUP.md` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Optional; for outgoing mail |

Apply to **Production** (and **Preview** if you use previews).

6. Deploy. After first deploy, run migrations against the new DB (from your machine with `DATABASE_URL` pointing at Neon, or via a one-off command):

   ```bash
   npx prisma migrate deploy
   ```

7. Optional: create the first superadmin (with `.env` containing the new `DATABASE_URL` and `SUPERADMIN_EMAIL`):

   ```bash
   node scripts/create-superadmin.js
   ```

## 3. Google Cloud / Maps (if used)

Update **HTTP referrers** and any domain allowlists to your **new** Vercel hostname (`*.vercel.app` and your custom domain). See `docs/GOOGLE_MAPS_SETUP.md`.

## 4. Retire the old stack (optional)

- In the **old** Vercel project: disconnect the repo or delete the project so it no longer deploys from the old GitHub link.
- In the **old** Neon project: pause or delete if you no longer need that data (export first if you need a backup).
- **Rotate** any database passwords that were ever committed or shared; treat old keys as compromised.

## 5. Local development

```bash
cp .env.example .env
# Edit .env with your Neon URLs and secrets
npm install
npm run dev
```

`.env` and `.env.local` are **gitignored**—they must not be committed.
