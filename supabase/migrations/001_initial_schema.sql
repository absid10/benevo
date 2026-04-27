-- Benevo initial schema
create extension if not exists "pgcrypto";

create type public.subscription_plan as enum ('monthly', 'yearly');
create type public.subscription_status as enum ('active', 'inactive', 'past_due', 'canceled');
create type public.draw_mode as enum ('random', 'weighted');
create type public.draw_status as enum ('draft', 'published');
create type public.payout_status as enum ('pending', 'approved', 'paid', 'rejected');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'subscriber' check (role in ('subscriber', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.charities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  events jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan public.subscription_plan not null,
  status public.subscription_status not null default 'inactive',
  price_cents integer not null check (price_cents > 0),
  charity_percent numeric(5,2) not null default 10 check (charity_percent >= 10 and charity_percent <= 100),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_charity_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  charity_id uuid not null references public.charities(id),
  charity_percent numeric(5,2) not null default 10 check (charity_percent >= 10 and charity_percent <= 100),
  updated_at timestamptz not null default now()
);

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score_date date not null,
  stableford_score integer not null check (stableford_score >= 1 and stableford_score <= 45),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, score_date)
);

create table if not exists public.draws (
  id uuid primary key default gen_random_uuid(),
  draw_month date not null unique,
  mode public.draw_mode not null,
  winning_numbers integer[] not null,
  status public.draw_status not null default 'draft',
  notes text,
  created_by uuid references public.profiles(id),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.draw_entries (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references public.draws(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  entry_numbers integer[] not null,
  matched_count integer not null default 0,
  tier text not null default 'none' check (tier in ('none', '3-match', '4-match', '5-match')),
  unique (draw_id, user_id)
);

create table if not exists public.prize_pools (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null unique references public.draws(id) on delete cascade,
  total_pool_cents integer not null default 0,
  pool_5_match_cents integer not null default 0,
  pool_4_match_cents integer not null default 0,
  pool_3_match_cents integer not null default 0,
  rollover_5_match_cents integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.winners (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references public.draws(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  tier text not null check (tier in ('3-match', '4-match', '5-match')),
  payout_cents integer not null default 0,
  proof_url text,
  status public.payout_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  charity_id uuid not null references public.charities(id),
  amount_cents integer not null check (amount_cents > 0),
  source text not null default 'independent' check (source in ('subscription', 'independent')),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  channel text not null default 'email' check (channel in ('email', 'in_app')),
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_scores_user_created_at on public.scores (user_id, created_at desc);
create index if not exists idx_subscriptions_user on public.subscriptions (user_id);
create index if not exists idx_draw_entries_draw on public.draw_entries (draw_id);
create index if not exists idx_donations_user on public.donations (user_id);
create index if not exists idx_notifications_user on public.notifications (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.charities enable row level security;
alter table public.subscriptions enable row level security;
alter table public.user_charity_preferences enable row level security;
alter table public.scores enable row level security;
alter table public.draws enable row level security;
alter table public.draw_entries enable row level security;
alter table public.prize_pools enable row level security;
alter table public.winners enable row level security;
alter table public.donations enable row level security;
alter table public.notifications enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p where p.id = uid and p.role = 'admin'
  );
$$;

create policy "users can read own profile" on public.profiles
for select using (auth.uid() = id);

create policy "users can upsert own profile" on public.profiles
for insert with check (auth.uid() = id);

create policy "users can update own profile" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "admins can read all profiles" on public.profiles
for select using (public.is_admin(auth.uid()));

create policy "users can read charities" on public.charities
for select using (true);

create policy "users can read own subscription" on public.subscriptions
for select using (auth.uid() = user_id);

create policy "users can create own subscription" on public.subscriptions
for insert with check (auth.uid() = user_id);

create policy "users can update own subscription" on public.subscriptions
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "admins can manage subscriptions" on public.subscriptions
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "users can read own charity preference" on public.user_charity_preferences
for select using (auth.uid() = user_id);

create policy "users can modify own charity preference" on public.user_charity_preferences
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users can read own scores" on public.scores
for select using (auth.uid() = user_id);

create policy "users can modify own scores" on public.scores
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "authenticated can read published draws" on public.draws
for select using (status = 'published' or auth.uid() = created_by);

create policy "users can read own draw entries" on public.draw_entries
for select using (auth.uid() = user_id);

create policy "admins can read all draw entries" on public.draw_entries
for select using (public.is_admin(auth.uid()));

create policy "users can read own winner records" on public.winners
for select using (auth.uid() = user_id);

create policy "users can update own winner proof" on public.winners
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "admins can manage winners" on public.winners
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "admins can manage draws" on public.draws
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "admins can manage prize pools" on public.prize_pools
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "users can create own donations" on public.donations
for insert with check (auth.uid() = user_id);

create policy "users can read own donations" on public.donations
for select using (auth.uid() = user_id);

create policy "admins can read all donations" on public.donations
for select using (public.is_admin(auth.uid()));

create policy "users can read own notifications" on public.notifications
for select using (auth.uid() = user_id);

create policy "admins can manage notifications" on public.notifications
for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
