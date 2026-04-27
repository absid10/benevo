# Benevo — Where Performance Meets Purpose

A subscription-driven web platform combining golf performance tracking, charity fundraising, and monthly draw-based rewards.

## 🏗️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Payments**: Stripe (Checkout, Webhooks, Billing Portal)
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx             # Landing page (public)
│   ├── login/page.tsx       # Login page
│   ├── signup/page.tsx      # Signup page
│   ├── dashboard/page.tsx   # Subscriber dashboard
│   ├── admin/page.tsx       # Admin control panel
│   ├── charities/page.tsx   # Charity directory
│   ├── components/          # Shared components (Navbar, Footer)
│   └── api/                 # API routes
│       ├── auth/            # Demo login
│       ├── scores/          # Score CRUD (rolling 5)
│       ├── draw/            # Simulate + publish draws
│       ├── charities/       # Charity CRUD
│       ├── charity-preference/ # User charity selection
│       ├── subscriptions/   # Subscription management
│       ├── billing/         # Stripe checkout/portal/webhook
│       ├── winners/         # Winner verification
│       ├── dashboard/       # Dashboard summary
│       └── admin/           # Admin reports
├── lib/                     # Business logic
│   ├── draw.ts              # Draw engine (random + weighted)
│   ├── schemas.ts           # Zod validation schemas
│   ├── stripe.ts            # Stripe client
│   ├── supabase.ts          # Admin Supabase client
│   ├── env.ts               # Environment validation
│   └── format.ts            # Currency formatting
├── utils/supabase/          # Supabase SSR clients
│   ├── client.ts            # Browser client
│   ├── server.ts            # Server client
│   └── middleware.ts        # Middleware client
├── middleware.ts             # Auth session refresh
supabase/
└── migrations/
    └── 001_initial_schema.sql  # Full database schema
```

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/absid10/Benevo-Where-performance-meets-purpose.git
cd benevo-app
npm install
```

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to **SQL Editor** in the Supabase dashboard
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor and click **Run**
5. Get your project keys from **Settings → API**

### 3. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_API_SECRET=your-admin-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (optional for local dev)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Create Test Admin User

Use the API to create an admin profile:

```bash
curl -X POST http://localhost:3000/api/auth/demo-login \
  -H "Content-Type: application/json" \
  -d '{"userId": "YOUR_SUPABASE_USER_ID", "role": "admin", "fullName": "Admin User"}'
```

## 🔑 Pages & Credentials

| Page | URL | Access |
|------|-----|--------|
| Homepage | `/` | Public |
| Login | `/login` | Public |
| Signup | `/signup` | Public |
| Charities | `/charities` | Public |
| Dashboard | `/dashboard` | Subscriber |
| Admin | `/admin` | Admin |

## 📊 Database Schema

- `profiles` — User identity and role (subscriber/admin)
- `charities` — Charity directory with featured flag
- `subscriptions` — Payment lifecycle (Stripe-synced)
- `user_charity_preferences` — Charity selection per user
- `scores` — Golf scores (rolling 5, Stableford 1-45)
- `draws` — Monthly draw configuration
- `draw_entries` — User entries per draw
- `prize_pools` — Pool calculations per draw
- `winners` — Winner records and verification
- `donations` — Independent donations
- `notifications` — System notifications

## 🎲 Draw System

- Users' 5 latest scores become their draw entry numbers
- **Random mode**: Lottery-style number generation (1-45)
- **Weighted mode**: Numbers biased by most frequent user scores
- **Prize tiers**: 5-match (40%), 4-match (35%), 3-match (25%)
- **Jackpot rollover**: 5-match pool carries forward if unclaimed

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set root directory to `benevo-app`
4. Add all environment variables
5. Deploy!

## 📄 License

Built for the Digital Heroes selection process.
