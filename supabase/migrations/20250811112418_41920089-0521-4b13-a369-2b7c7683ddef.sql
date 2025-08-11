-- Secure clients table: restrict access to authorized admins only
-- Reuse existing admin checker function created previously: public.get_current_user_is_admin()

-- 1) Ensure RLS is enabled (idempotent)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 2) Drop overly-permissive policy if it exists
DROP POLICY IF EXISTS "Allow public access" ON public.clients;

-- 3) Create strict admin-only policy for all operations
CREATE POLICY "Admins can manage clients"
ON public.clients
FOR ALL
USING (public.get_current_user_is_admin())
WITH CHECK (public.get_current_user_is_admin());