-- ============================================================
-- شركاء — Seed Data (بيانات تجريبية للتطوير)
-- ملاحظة: شغّل هذا الملف بعد DATABASE_SCHEMA.sql
-- ملاحظة: يجب أن تكون مسجلًا دخولك وأن يكون user_id صحيحًا
-- ============================================================

-- لاستخدام هذا الملف:
-- 1. سجّل دخولك إلى تطبيق شركاء
-- 2. انسخ user_id من Supabase → Authentication → Users
-- 3. استبدل 'YOUR_USER_ID_HERE' بالـ ID الحقيقي
-- 4. شغّل الملف في Supabase SQL Editor

do $$
declare
  v_owner_id uuid := 'YOUR_USER_ID_HERE'; -- غيّر هذا بـ user_id الحقيقي
  v_biz_id uuid;
  v_biz2_id uuid;
  v_branch1_id uuid;
  v_branch2_id uuid;
  v_emp1_id uuid;
  v_emp2_id uuid;
  v_cust1_id uuid;
  v_cust2_id uuid;
  v_cust3_id uuid;
  v_wallet1_id uuid;
  v_wallet2_id uuid;
  v_wallet3_id uuid;
  v_lp_id uuid;
  v_reward_id uuid;
begin

  -- ── نشاط تجاري 1: مقهى قهوتنا ──────────────────────────────
  insert into public.businesses (owner_id, business_name, category, phone, address, brand_color, description, plan_slug, subscription_status, onboarding_completed)
  values (v_owner_id, 'مقهى قهوتنا', 'مقهى', '+968 9100 1234', 'مسقط، شارع المطار', '#6B4226', 'مقهى متخصص بالقهوة العربية الأصيلة', 'growth', 'active', true)
  returning id into v_biz_id;

  -- ── فروع النشاط الأول ──────────────────────────────────────
  insert into public.branches (business_id, branch_name, address, phone)
  values (v_biz_id, 'فرع المطار', 'مطار مسقط الدولي', '+968 9100 1235')
  returning id into v_branch1_id;

  insert into public.branches (business_id, branch_name, address, phone)
  values (v_biz_id, 'فرع بوشر', 'بوشر، مسقط', '+968 9100 1236')
  returning id into v_branch2_id;

  -- ── موظفون ────────────────────────────────────────────────
  insert into public.employees (business_id, branch_id, name, phone, email, role)
  values (v_biz_id, v_branch1_id, 'محمد الحارثي', '+968 9100 1237', 'mohammed@qahwatna.com', 'manager')
  returning id into v_emp1_id;

  insert into public.employees (business_id, branch_id, name, phone, email, role)
  values (v_biz_id, v_branch2_id, 'سعيد المنذري', '+968 9100 1238', 'saeed@qahwatna.com', 'employee')
  returning id into v_emp2_id;

  -- ── عملاء ─────────────────────────────────────────────────
  insert into public.customers (business_id, name, phone, email, points_balance, stamps_balance, total_visits, birthday)
  values (v_biz_id, 'أحمد محمود', '+968 9200 1111', 'ahmed@example.com', 450, 7, 23, '1990-05-15')
  returning id into v_cust1_id;

  insert into public.customers (business_id, name, phone, email, points_balance, stamps_balance, total_visits, birthday)
  values (v_biz_id, 'فاطمة الزهراء', '+968 9200 2222', 'fatima@example.com', 280, 3, 11, '1995-09-22')
  returning id into v_cust2_id;

  insert into public.customers (business_id, name, phone, email, points_balance, stamps_balance, total_visits, birthday)
  values (v_biz_id, 'نور الهدى', '+968 9200 3333', 'nour@example.com', 920, 9, 45, '1988-12-01')
  returning id into v_cust3_id;

  -- ── محافظ رقمية ──────────────────────────────────────────
  insert into public.wallets (customer_id, business_id)
  values (v_cust1_id, v_biz_id)
  returning id into v_wallet1_id;

  insert into public.wallets (customer_id, business_id)
  values (v_cust2_id, v_biz_id)
  returning id into v_wallet2_id;

  insert into public.wallets (customer_id, business_id)
  values (v_cust3_id, v_biz_id)
  returning id into v_wallet3_id;

  -- ── برنامج ولاء ───────────────────────────────────────────
  insert into public.loyalty_programs (business_id, type, name, description, required_stamps, reward_description, status)
  values (v_biz_id, 'stamps', 'برنامج الطوابع', 'اجمع 10 طوابع واحصل على قهوة مجانية', 10, 'قهوة عربية مجانية', 'active')
  returning id into v_lp_id;

  -- ── مكافأة ─────────────────────────────────────────────────
  insert into public.rewards (business_id, loyalty_program_id, name, description, required_stamps)
  values (v_biz_id, v_lp_id, 'قهوة مجانية', 'احصل على كوب قهوة عربية مجاني', 10)
  returning id into v_reward_id;

  -- ── عمليات ────────────────────────────────────────────────
  insert into public.transactions (business_id, customer_id, wallet_id, employee_id, branch_id, type, stamps, points, amount)
  values
    (v_biz_id, v_cust1_id, v_wallet1_id, v_emp1_id, v_branch1_id, 'stamp', 1, 10, 5.00),
    (v_biz_id, v_cust1_id, v_wallet1_id, v_emp1_id, v_branch1_id, 'stamp', 1, 10, 5.00),
    (v_biz_id, v_cust2_id, v_wallet2_id, v_emp2_id, v_branch2_id, 'stamp', 1, 10, 4.50),
    (v_biz_id, v_cust3_id, v_wallet3_id, v_emp1_id, v_branch1_id, 'stamp', 1, 10, 5.00),
    (v_biz_id, v_cust3_id, v_wallet3_id, v_emp1_id, v_branch1_id, 'reward', 0, 0, 0),
    (v_biz_id, v_cust1_id, v_wallet1_id, v_emp2_id, v_branch2_id, 'points', 0, 50, 25.00);

  -- ── تقييمات ───────────────────────────────────────────────
  insert into public.reviews (business_id, customer_id, branch_id, employee_id, rating, comment)
  values
    (v_biz_id, v_cust1_id, v_branch1_id, v_emp1_id, 5, 'خدمة ممتازة وقهوة رائعة!'),
    (v_biz_id, v_cust3_id, v_branch2_id, v_emp2_id, 4, 'تجربة جيدة جدًا'),
    (v_biz_id, v_cust2_id, v_branch1_id, v_emp1_id, 5, 'أفضل مقهى في مسقط');

  -- ── نشاط تجاري 2 لاختبار العزل ───────────────────────────
  insert into public.businesses (owner_id, business_name, category, phone, address, plan_slug, subscription_status, onboarding_completed)
  values (v_owner_id, 'مطعم البيت', 'مطعم', '+968 9100 5678', 'صلالة، ظفار', 'starter', 'trialing', false)
  returning id into v_biz2_id;

  raise notice '✅ تم إنشاء البيانات التجريبية بنجاح';
  raise notice '   - نشاطان تجاريان';
  raise notice '   - فرعان';
  raise notice '   - موظفان';
  raise notice '   - 3 عملاء مع محافظ ومعاملات';

end $$;
