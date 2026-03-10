
-- Drop all restrictive policies and recreate as permissive

-- customers table
DROP POLICY IF EXISTS "Customers can be inserted by anyone" ON public.customers;
DROP POLICY IF EXISTS "Customers can be read by anyone" ON public.customers;

CREATE POLICY "Customers can be read by anyone" ON public.customers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Customers can be inserted by anyone" ON public.customers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Customers can be updated by anyone" ON public.customers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- orders table
DROP POLICY IF EXISTS "Orders can be inserted by anyone" ON public.orders;
DROP POLICY IF EXISTS "Orders can be read by anyone" ON public.orders;

CREATE POLICY "Orders can be read by anyone" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Orders can be inserted by anyone" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

-- payments table
DROP POLICY IF EXISTS "Payments can be inserted by anyone" ON public.payments;
DROP POLICY IF EXISTS "Payments can be read by anyone" ON public.payments;

CREATE POLICY "Payments can be read by anyone" ON public.payments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Payments can be inserted by anyone" ON public.payments FOR INSERT TO anon, authenticated WITH CHECK (true);
