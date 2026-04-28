# Benevo - Where Performance Meets Purpose

A full-stack web application that combines competitive golf scoring with charitable giving. Users enter their golf scores monthly, participate in draws, and automatically support their chosen charities.

## 🎯 Live Demo

- **Website:** https://benevo-bice.vercel.app/
- **User Dashboard:** https://benevo-bice.vercel.app/dashboard
- **Admin Panel:** https://benevo-bice.vercel.app/admin

## ✨ Key Features

- ✅ **Golf Score Tracking** - Monthly score entry and history management
- ✅ **Monthly Draws** - Automatic participation with random winner selection
- ✅ **Charity Support** - Select charities and set contribution percentages
- ✅ **User Authentication** - Email/password signup & Google OAuth login
- ✅ **Dashboard** - Personal stats, winnings, and charity contributions
- ✅ **Billing Integration** - Stripe subscriptions (monthly/yearly)
- ✅ **Admin Panel** - Manage draws, charities, and verify winners

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript 5.9, Tailwind CSS |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | Supabase (PostgreSQL) with RLS |
| **Authentication** | Supabase Auth (JWT-based) |
| **Payments** | Stripe API |
| **Deployment** | Vercel |

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── login/page.tsx           # Login
│   ├── signup/page.tsx          # Signup
│   ├── charities/page.tsx       # Charities directory
│   ├── dashboard/page.tsx       # User dashboard
│   ├── admin/page.tsx           # Admin panel
│   ├── components/              # Reusable UI components
│   ├── api/                     # 13 API endpoints
│   └── globals.css              # Design system & styles
├── lib/                         # Utilities (draw, schemas, stripe)
├── utils/supabase/              # Supabase client setup
└── middleware.ts                # Auth middleware
supabase/
└── migrations/
    └── 001_initial_schema.sql   # Database schema
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/absid10/benevo.git
   cd benevo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the variables:
   - Supabase URL and Keys
   - Stripe Publishable and Secret Keys
   - Admin Secret for access control

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 📝 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```
