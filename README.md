# MealNetworks (food donation)

Next.js app that connects food donors and receivers (NGOs), with Prisma and PostgreSQL (e.g. [Neon](https://neon.tech)).

## Setup

```bash
npm install
cp .env.example .env
# Edit .env: DATABASE_URL from Neon, JWT_SECRET, NEXT_PUBLIC_* , optional SMTP
npx prisma migrate deploy   # or migrate dev for local DB iteration
npm run dev
```

See **`docs/DEPLOYMENT.md`** for the full **GitHub → Vercel → Neon** checklist when moving to a new Vercel or Neon account.

## Scripts

- **`node scripts/create-superadmin.js`** — creates or resets the first `SUPERADMIN` (email from `SUPERADMIN_EMAIL` in `.env`, default `admin@mealnetworks.com`). Change the default password after first login.

## Docs

- `docs/DEPLOYMENT.md` — hosting and environment variables  
- `docs/GOOGLE_MAPS_SETUP.md` — Maps API keys and referrer restrictions  

## Learn More

This project was bootstrapped with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app). See [Next.js documentation](https://nextjs.org/docs) for framework details.
