# Benevo

Benevo is a full-stack platform that combines:

- Stableford score tracking (last 5 only)
- Monthly draw engine (random or weighted)
- Charity contribution logic
- User and admin web experiences

Stack:

- Next.js (App Router, TypeScript)
- Supabase (Postgres + auth-ready schema)
- Vercel deployment target

## Implemented Modules

- Landing page with charity-first product narrative
- User dashboard for score operations
- Admin dashboard for draw simulation/publishing and charity creation
- API routes:
	- `GET/POST/PUT/DELETE /api/scores`
	- `POST /api/draw/simulate`
	- `POST /api/draw/publish`
	- `GET/POST /api/charities`
	- `POST /api/charity-preference`
	- `GET /api/dashboard/summary`
	- `GET/POST/PUT /api/winners`
	- `GET /api/admin/reports`
	- `POST /api/subscriptions`
	- `POST /api/billing/checkout`
	- `POST /api/billing/portal`
	- `POST /api/billing/webhook`
- Supabase schema and RLS baseline in `supabase/migrations/001_initial_schema.sql`
- PRD traceability checklist in `docs/PRD_COMPLIANCE_CHECKLIST.md`

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env.local
```

3. Fill `.env.local` values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_API_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_MONTHLY_PRICE_ID`
- `STRIPE_YEARLY_PRICE_ID`

4. Apply SQL migration in Supabase SQL editor:

- Run `supabase/migrations/001_initial_schema.sql`

5. Run the app:

```bash
npm run dev
```

## Vercel Deployment

1. Create a new Vercel project from this repository.
2. Set all environment variables from `.env.example` in Vercel project settings.
3. Deploy.

## Notes

- Draw publish endpoint handles monthly uniqueness and jackpot rollover behavior.
- Score endpoint enforces one score per date and rolling top-5 retention.
- Winner proof, admin verification, and payout status transitions are implemented.
- Configure project-specific Vercel and Supabase environments before deploying to production.
