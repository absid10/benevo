# Benevo — Where Performance Meets Purpose

A modern web platform that combines golf score tracking with charitable impact and monthly prize draws. Built with Next.js, Supabase, and Stripe.

## Overview

Benevo lets golfers turn their game into a force for good. Subscribers enter their Stableford scores, which automatically become entries into monthly prize draws. A portion of every subscription goes directly to a charity of the user's choice.

**Key features:**
- Rolling 5-score tracker with Stableford format (1–45)
- Monthly prize draws (random or weighted by player scores)
- Charity directory with user-controlled contribution percentages
- Admin panel for draw management, charity curation, and winner verification
- Stripe-powered subscription billing with webhook lifecycle sync

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Backend | Next.js API Routes (serverless) |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Payments | Stripe (Checkout, Webhooks, Billing Portal) |
| Deployment | Vercel |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx        # Login
│   ├── signup/page.tsx       # Signup
│   ├── dashboard/page.tsx    # Subscriber dashboard
│   ├── admin/page.tsx        # Admin panel
│   ├── charities/page.tsx    # Charity directory
│   ├── components/           # Navbar, Footer
│   └── api/
│       ├── auth/             # Authentication
│       ├── scores/           # Score CRUD (rolling 5)
│       ├── draw/             # Simulate & publish draws
│       ├── charities/        # Charity CRUD
│       ├── charity-preference/ # User charity selection
│       ├── subscriptions/    # Subscription management
│       ├── billing/          # Stripe checkout/portal/webhook
│       ├── winners/          # Winner verification
│       ├── dashboard/        # Dashboard summary
│       └── admin/            # Reports & analytics
├── lib/
│   ├── draw.ts               # Draw engine (random + weighted)
│   ├── schemas.ts            # Zod validation schemas
│   ├── stripe.ts             # Stripe client
│   ├── supabase.ts           # Admin Supabase client
│   ├── env.ts                # Environment validation
│   └── format.ts             # Currency formatting
├── utils/supabase/           # Supabase SSR clients
│   ├── client.ts             # Browser client
│   ├── server.ts             # Server client
│   └── middleware.ts         # Middleware client
├── middleware.ts              # Auth session refresh
supabase/
└── migrations/
    └── 001_initial_schema.sql # Full database schema with RLS
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Stripe account (optional for local dev)

### 1. Install dependencies

```bash
git clone https://github.com/absid10/Benevo-Where-performance-meets-purpose.git
cd benevo-app
npm install
```

### 2. Set up the database

1. Open your Supabase project → **SQL Editor**
2. Paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run** — this creates all tables, indexes, and RLS policies

### 3. Configure environment

Copy `.env.example` to `.env.local` and fill in your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_API_SECRET=your-admin-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Pages

| Page | URL | Access |
|------|-----|--------|
| Homepage | `/` | Public |
| Login | `/login` | Public |
| Signup | `/signup` | Public |
| Charities | `/charities` | Public |
| Dashboard | `/dashboard` | Subscriber |
| Admin Panel | `/admin` | Admin |

## Database Schema

The schema includes 11 tables with Row Level Security:

- **profiles** — User identity and role (subscriber / admin)
- **charities** — Charity directory with featured flag
- **subscriptions** — Stripe-synced payment lifecycle
- **user_charity_preferences** — Per-user charity selection and contribution %
- **scores** — Golf scores (rolling 5, Stableford 1–45)
- **draws** — Monthly draw configuration and mode
- **draw_entries** — User entries per draw (built from scores)
- **prize_pools** — Pool calculations and tier distribution
- **winners** — Winner records with verification workflow
- **donations** — Independent donation records
- **notifications** — System notifications

## Draw System

The draw engine supports two modes:

- **Random**: Standard lottery-style number generation (1–45 range)
- **Weighted**: Numbers biased by the most frequently occurring user scores

Prize pool distribution:
| Tier | Pool Share | Rollover |
|------|-----------|----------|
| 5-Number Match | 40% | Yes (Jackpot) |
| 4-Number Match | 35% | No |
| 3-Number Match | 25% | No |

Multiple winners in the same tier split the pool equally. The 5-match jackpot carries forward if unclaimed.

## Deployment

1. Push the repo to GitHub
2. Import into Vercel — set root directory to `benevo-app`
3. Add all environment variables from `.env.example`
4. Deploy

Make sure to run the migration SQL in your Supabase project before deploying.

## License

MIT
