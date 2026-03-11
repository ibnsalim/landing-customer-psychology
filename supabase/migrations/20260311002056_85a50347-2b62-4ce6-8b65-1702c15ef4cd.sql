
-- Create admin role enum
CREATE TYPE public.admin_role_enum AS ENUM ('super_admin', 'order_manager', 'email_manager');

-- admin_users table
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  role admin_role_enum NOT NULL DEFAULT 'order_manager',
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin users readable by authenticated" ON public.admin_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin users updatable by authenticated" ON public.admin_users FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin users insertable by authenticated" ON public.admin_users FOR INSERT TO authenticated WITH CHECK (true);

-- activity_logs table
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activity logs readable by authenticated" ON public.activity_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Activity logs insertable by authenticated" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (true);

-- site_settings table
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings readable by anyone" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Site settings updatable by authenticated" ON public.site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Site settings insertable by authenticated" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);

-- Add missing columns to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_manual boolean NOT NULL DEFAULT false;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS ebook_sent_at timestamptz;

-- Allow authenticated users to update orders (for admin status changes)
CREATE POLICY "Orders updatable by authenticated" ON public.orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Dashboard views
CREATE OR REPLACE VIEW public.vw_dashboard_summary AS
SELECT
  COUNT(*)::int AS total_orders,
  COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed_orders,
  COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_orders,
  COALESCE(SUM(amount) FILTER (WHERE status = 'confirmed'), 0)::numeric AS total_revenue,
  COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE)::int AS today_orders,
  COUNT(*) FILTER (WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE))::int AS this_month_orders
FROM public.orders;

CREATE OR REPLACE VIEW public.vw_daily_order_summary AS
SELECT
  created_at::date AS date,
  COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed_orders,
  COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_orders,
  COALESCE(SUM(amount) FILTER (WHERE status = 'confirmed'), 0)::numeric AS revenue
FROM public.orders
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY created_at::date
ORDER BY date;

CREATE OR REPLACE VIEW public.vw_weekly_order_summary AS
SELECT
  date_trunc('week', created_at)::date AS week_start,
  COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed_orders,
  COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_orders,
  COALESCE(SUM(amount) FILTER (WHERE status = 'confirmed'), 0)::numeric AS revenue
FROM public.orders
WHERE created_at >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY date_trunc('week', created_at)
ORDER BY week_start;

CREATE OR REPLACE VIEW public.vw_monthly_order_summary AS
SELECT
  date_trunc('month', created_at)::date AS month_start,
  COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed_orders,
  COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_orders,
  COALESCE(SUM(amount) FILTER (WHERE status = 'confirmed'), 0)::numeric AS revenue
FROM public.orders
WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY date_trunc('month', created_at)
ORDER BY month_start;

CREATE OR REPLACE VIEW public.vw_payment_method_breakdown AS
SELECT
  payment_method,
  COUNT(*)::int AS order_count,
  COALESCE(SUM(amount), 0)::numeric AS total_revenue
FROM public.orders
GROUP BY payment_method;

CREATE OR REPLACE VIEW public.vw_recent_orders AS
SELECT id, order_number, full_name, email, phone, payment_method, amount, status, created_at
FROM public.orders
ORDER BY created_at DESC
LIMIT 5;

-- Enable realtime for orders (for new order notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
