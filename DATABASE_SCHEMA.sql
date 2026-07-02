-- ============================================================
-- شركاء — Database Schema
-- قاعدة بيانات مشروع شركاء الكاملة
-- شغّل هذا الملف في Supabase SQL Editor
-- ============================================================

-- تفعيل الإضافات المطلوبة
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- 1. user_profiles — ملفات المستخدمين
-- ─────────────────────────────────────────────────────────────
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  email text not null,
  role text default 'business_owner' check (role in ('admin', 'business_owner', 'employee', 'customer')),
  phone text,
  avatar_url text,
  status text default 'active' check (status in ('active', 'inactive', 'suspended')),
  email_verified boolean default false,
  first_login_completed boolean default false,
  last_login_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_profiles enable row level security;

create policy "users_select_own" on public.user_profiles for select to authenticated using (auth.uid() = id);
create policy "users_insert_own" on public.user_profiles for insert to authenticated with check (auth.uid() = id);
create policy "users_update_own" on public.user_profiles for update to authenticated using (auth.uid() = id);
create policy "users_delete_own" on public.user_profiles for delete to authenticated using (auth.uid() = id);

-- Trigger: إنشاء ملف المستخدم تلقائيًا عند التسجيل
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, username, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'business_owner')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 2. plans — باقات الاشتراك
-- ─────────────────────────────────────────────────────────────
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  name_en text,
  monthly_price numeric(10,2) not null,
  currency text default 'OMR',
  max_loyalty_programs integer default 1,
  max_branches integer default 1,
  max_customers integer default 300,
  max_employees integer default 1,
  monthly_notifications_limit integer default 500,
  unlimited_customers boolean default false,
  unlimited_notifications boolean default false,
  features jsonb default '[]',
  stripe_product_id text,
  stripe_price_id text,
  is_popular boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.plans enable row level security;
create policy "plans_public_read" on public.plans for select to anon using (true);
create policy "plans_auth_read" on public.plans for select to authenticated using (true);

-- Seed: إضافة الباقات الافتراضية
insert into public.plans (slug, name, name_en, monthly_price, max_loyalty_programs, max_branches, max_customers, max_employees, monthly_notifications_limit, unlimited_customers, features, is_popular, sort_order)
values
  ('starter', 'انطلاقة', 'Starter', 8.00, 1, 1, 300, 1, 500, false,
   '[{"text": "برنامج ولاء واحد", "included": true}, {"text": "فرع واحد", "included": true}, {"text": "حتى 300 عميل", "included": true}, {"text": "بطاقة طوابع رقمية", "included": true}, {"text": "QR Code للعملاء", "included": true}, {"text": "موظف واحد", "included": true}, {"text": "إحصائيات أساسية", "included": true}, {"text": "تجربة مجانية 14 يوم", "included": true}, {"text": "إشعارات تلقائية", "included": false}, {"text": "تقارير تفصيلية", "included": false}]',
   false, 1),
  ('growth', 'نمو', 'Growth', 18.00, 3, 3, 2000, 10, 5000, false,
   '[{"text": "حتى 3 برامج ولاء", "included": true}, {"text": "حتى 3 فروع", "included": true}, {"text": "حتى 2000 عميل", "included": true}, {"text": "نظام نقاط وطوابع", "included": true}, {"text": "كوبونات خصم", "included": true}, {"text": "حتى 10 موظفين", "included": true}, {"text": "تقييمات العملاء", "included": true}, {"text": "تقارير تفصيلية", "included": true}, {"text": "إشعارات تلقائية", "included": false}, {"text": "تصدير CSV", "included": false}]',
   true, 2),
  ('partners_plus', 'شركاء بلس', 'Partners Plus', 39.00, 10, 10, 99999, 50, 99999, true,
   '[{"text": "حتى 10 برامج ولاء", "included": true}, {"text": "حتى 10 فروع", "included": true}, {"text": "عملاء غير محدودين", "included": true}, {"text": "حتى 50 موظفًا", "included": true}, {"text": "إشعارات تلقائية", "included": true}, {"text": "حملات تسويقية متقدمة", "included": true}, {"text": "تقارير متقدمة", "included": true}, {"text": "تصدير CSV / Excel", "included": true}, {"text": "دعم مميز", "included": true}, {"text": "ربط API مستقبلي", "included": true}]',
   false, 3)
on conflict (slug) do update
  set monthly_price = excluded.monthly_price,
      features = excluded.features,
      updated_at = now();

-- ─────────────────────────────────────────────────────────────
-- 3. businesses — الأعمال التجارية
-- ─────────────────────────────────────────────────────────────
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.user_profiles(id) on delete cascade,
  business_name text not null,
  logo_url text,
  category text,
  phone text,
  address text,
  latitude numeric(10,8),
  longitude numeric(11,8),
  brand_color text default '#0D1F3C',
  description text,
  working_hours jsonb,
  social_links jsonb,
  plan_slug text default 'starter',
  subscription_status text default 'trialing' check (subscription_status in ('trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_ends_at timestamptz default (now() + interval '14 days'),
  onboarding_completed boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_businesses_owner_id on public.businesses(owner_id);

alter table public.businesses enable row level security;
create policy "businesses_owner_select" on public.businesses for select to authenticated using (owner_id = auth.uid());
create policy "businesses_owner_insert" on public.businesses for insert to authenticated with check (owner_id = auth.uid());
create policy "businesses_owner_update" on public.businesses for update to authenticated using (owner_id = auth.uid());
create policy "businesses_owner_delete" on public.businesses for delete to authenticated using (owner_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- 4. branches — الفروع
-- ─────────────────────────────────────────────────────────────
create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_name text not null,
  address text,
  latitude numeric(10,8),
  longitude numeric(11,8),
  phone text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_branches_business_id on public.branches(business_id);
alter table public.branches enable row level security;
create policy "branches_business_owner" on public.branches for all to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- 5. employees — الموظفون
-- ─────────────────────────────────────────────────────────────
create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  user_id uuid references public.user_profiles(id) on delete set null,
  name text not null,
  phone text,
  email text,
  role text default 'employee' check (role in ('manager', 'employee', 'cashier')),
  permissions jsonb default '["can_scan_qr", "can_add_stamps"]',
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_employees_business_id on public.employees(business_id);
alter table public.employees enable row level security;
create policy "employees_business_owner" on public.employees for all to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- 6. customers — العملاء
-- ─────────────────────────────────────────────────────────────
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  birthday date,
  points_balance integer default 0,
  stamps_balance integer default 0,
  total_visits integer default 0,
  total_rewards_redeemed integer default 0,
  last_visit_at timestamptz,
  notes text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_customers_business_id on public.customers(business_id);
alter table public.customers enable row level security;
create policy "customers_business_owner" on public.customers for all to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()));
create policy "customers_anon_read_wallet" on public.customers for select to anon using (false);

-- ─────────────────────────────────────────────────────────────
-- 7. wallets — المحافظ الرقمية
-- ─────────────────────────────────────────────────────────────
create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  qr_token text not null unique default encode(gen_random_bytes(24), 'base64'),
  status text default 'active' check (status in ('active', 'inactive', 'blocked')),
  apple_wallet_pass_url text,
  google_wallet_pass_url text,
  apple_wallet_status text default 'not_created',
  google_wallet_status text default 'not_created',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(customer_id, business_id)
);

create index if not exists idx_wallets_qr_token on public.wallets(qr_token);
alter table public.wallets enable row level security;
create policy "wallets_business_owner" on public.wallets for all to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()));
create policy "wallets_anon_read_by_token" on public.wallets for select to anon using (true);

-- ─────────────────────────────────────────────────────────────
-- 8. wallet_passes — بطاقات Apple/Google Wallet
-- ─────────────────────────────────────────────────────────────
create table if not exists public.wallet_passes (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid references public.wallets(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,
  provider text not null check (provider in ('apple', 'google', 'web')),
  pass_type text default 'loyalty',
  pass_id text,
  pass_url text,
  status text default 'pending' check (status in ('pending', 'active', 'expired', 'error')),
  payload_json jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_wallet_passes_wallet_id on public.wallet_passes(wallet_id);
create index if not exists idx_wallet_passes_customer_id on public.wallet_passes(customer_id);
alter table public.wallet_passes enable row level security;
create policy "wallet_passes_business_owner" on public.wallet_passes for all to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()));
create policy "wallet_passes_anon_read" on public.wallet_passes for select to anon using (true);

-- ─────────────────────────────────────────────────────────────
-- 9. loyalty_programs — برامج الولاء
-- ─────────────────────────────────────────────────────────────
create table if not exists public.loyalty_programs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type text not null default 'stamps' check (type in ('stamps', 'points', 'cashback', 'tiered')),
  name text not null,
  description text,
  required_stamps integer default 10,
  points_per_currency numeric(10,2) default 1,
  reward_description text,
  min_purchase_amount numeric(10,2),
  expiry_days integer,
  status text default 'active' check (status in ('active', 'inactive', 'archived')),
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_loyalty_programs_business_id on public.loyalty_programs(business_id);
alter table public.loyalty_programs enable row level security;
create policy "loyalty_programs_business_owner" on public.loyalty_programs for all to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()));
create policy "loyalty_programs_anon_read" on public.loyalty_programs for select to anon using (true);

-- ─────────────────────────────────────────────────────────────
-- 10. rewards — المكافآت
-- ─────────────────────────────────────────────────────────────
create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  loyalty_program_id uuid references public.loyalty_programs(id) on delete set null,
  name text not null,
  description text,
  required_points integer default 0,
  required_stamps integer default 0,
  discount_percent numeric(5,2),
  discount_amount numeric(10,2),
  expiry_date date,
  status text default 'active' check (status in ('active', 'inactive', 'expired')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_rewards_business_id on public.rewards(business_id);
alter table public.rewards enable row level security;
create policy "rewards_business_owner" on public.rewards for all to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()));
create policy "rewards_anon_read" on public.rewards for select to anon using (true);

-- ─────────────────────────────────────────────────────────────
-- 11. transactions — العمليات
-- ─────────────────────────────────────────────────────────────
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  wallet_id uuid references public.wallets(id) on delete set null,
  employee_id uuid references public.employees(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  type text not null check (type in ('stamp', 'points', 'reward', 'cashback', 'adjustment')),
  points integer default 0,
  stamps integer default 0,
  reward_id uuid references public.rewards(id) on delete set null,
  amount numeric(10,2),
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_transactions_business_id on public.transactions(business_id);
create index if not exists idx_transactions_customer_id on public.transactions(customer_id);
alter table public.transactions enable row level security;
create policy "transactions_business_owner" on public.transactions for all to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- 12. notifications — الإشعارات
-- ─────────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null,
  message text not null,
  audience_type text default 'all' check (audience_type in ('all', 'segment', 'individual')),
  audience_filters jsonb,
  type text default 'manual' check (type in ('manual', 'automated', 'birthday', 'reward')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  status text default 'draft' check (status in ('draft', 'scheduled', 'sent', 'failed')),
  recipients_count integer default 0,
  engagement_rate numeric(5,2) default 0,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;
create policy "notifications_business_owner" on public.notifications for all to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- 13. reviews — التقييمات
-- ─────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  employee_id uuid references public.employees(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  product_or_service text,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;
create policy "reviews_business_owner" on public.reviews for all to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()));
create policy "reviews_anon_read" on public.reviews for select to anon using (true);

-- ─────────────────────────────────────────────────────────────
-- 14. subscriptions — الاشتراكات
-- ─────────────────────────────────────────────────────────────
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  user_id uuid references public.user_profiles(id) on delete cascade,
  user_email text,
  plan_slug text,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  stripe_product_id text,
  status text default 'trialing' check (status in ('trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_ends_at timestamptz,
  canceled_at timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_subscriptions_business_id on public.subscriptions(business_id);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
alter table public.subscriptions enable row level security;
create policy "subscriptions_owner_read" on public.subscriptions for select to authenticated using (user_id = auth.uid());
create policy "subscriptions_owner_insert" on public.subscriptions for insert to authenticated with check (user_id = auth.uid());
create policy "subscriptions_owner_update" on public.subscriptions for update to authenticated using (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- 15. invoices — الفواتير
-- ─────────────────────────────────────────────────────────────
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  stripe_invoice_id text unique,
  amount numeric(10,2) not null,
  currency text default 'OMR',
  status text default 'open' check (status in ('open', 'paid', 'void', 'uncollectible')),
  hosted_invoice_url text,
  invoice_pdf text,
  stripe_payment_intent_id text,
  issued_at timestamptz,
  paid_at timestamptz,
  due_date timestamptz,
  created_at timestamptz default now()
);

alter table public.invoices enable row level security;
create policy "invoices_owner_read" on public.invoices for select to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- 16. payment_events — أحداث Stripe Webhook
-- ─────────────────────────────────────────────────────────────
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  event_type text not null,
  business_id uuid references public.businesses(id) on delete set null,
  payload jsonb,
  status text default 'pending' check (status in ('pending', 'processed', 'failed')),
  error_message text,
  processed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.payment_events enable row level security;
create policy "payment_events_auth_read" on public.payment_events for select to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- 17. login_otps — سجل رموز OTP
-- ─────────────────────────────────────────────────────────────
create table if not exists public.login_otps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete cascade,
  email text not null,
  otp_hash text not null,
  expires_at timestamptz not null,
  used boolean default false,
  attempts integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_login_otps_email on public.login_otps(email);
create index if not exists idx_login_otps_expires on public.login_otps(expires_at);
alter table public.login_otps enable row level security;
-- لا يسمح بالوصول المباشر من الـ Frontend — فقط عبر Edge Functions

-- ─────────────────────────────────────────────────────────────
-- 18. audit_logs — سجل العمليات الأمنية
-- ─────────────────────────────────────────────────────────────
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete set null,
  business_id uuid references public.businesses(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  description text,
  metadata jsonb,
  ip_address text,
  created_at timestamptz default now()
);

create index if not exists idx_audit_logs_business_id on public.audit_logs(business_id);
alter table public.audit_logs enable row level security;
create policy "audit_logs_business_owner_read" on public.audit_logs for select to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()));
create policy "audit_logs_insert" on public.audit_logs for insert with check (true);

-- ─────────────────────────────────────────────────────────────
-- انتهى — تم إنشاء 18 جدولاً
-- ─────────────────────────────────────────────────────────────
