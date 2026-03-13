
-- Create vw_customers_enriched view
CREATE OR REPLACE VIEW public.vw_customers_enriched AS
SELECT
  c.id,
  c.full_name,
  c.email,
  c.phone,
  c.created_at,
  COALESCE(agg.total_orders, 0) AS total_orders,
  COALESCE(agg.total_spent, 0) AS total_spent,
  agg.last_purchase
FROM public.customers c
LEFT JOIN (
  SELECT
    customer_id,
    COUNT(*)::integer AS total_orders,
    SUM(amount) AS total_spent,
    MAX(created_at) AS last_purchase
  FROM public.orders
  GROUP BY customer_id
) agg ON agg.customer_id = c.id;

-- Products: allow authenticated to INSERT and UPDATE
CREATE POLICY "Products insertable by authenticated" ON public.products
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Products updatable by authenticated" ON public.products
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Payments: allow authenticated to UPDATE
CREATE POLICY "Payments updatable by authenticated" ON public.payments
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Orders: allow authenticated to DELETE
CREATE POLICY "Orders deletable by authenticated" ON public.orders
  FOR DELETE TO authenticated USING (true);
