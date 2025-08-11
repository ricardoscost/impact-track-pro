-- Secure quotes table: restrict access to admins only
-- 1) Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.get_current_user_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false);
$$;

-- 2) Ensure RLS is enabled
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- 3) Drop overly permissive policy
DROP POLICY IF EXISTS "Allow public access" ON public.quotes;

-- 4) Create strict policy: only admins can access/manage quotes
CREATE POLICY "Admins can manage quotes"
ON public.quotes
FOR ALL
USING (public.get_current_user_is_admin())
WITH CHECK (public.get_current_user_is_admin());