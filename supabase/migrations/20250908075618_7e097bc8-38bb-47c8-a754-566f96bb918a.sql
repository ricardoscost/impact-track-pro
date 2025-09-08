-- Fix security warnings by adding search_path to functions
CREATE OR REPLACE FUNCTION get_album_cover_image(album_uuid UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT image_url FROM public.gallery_items 
     WHERE album_id = album_uuid 
     ORDER BY created_at DESC 
     LIMIT 1),
    '/placeholder.svg'
  );
$$;

-- Fix the existing function with proper search_path
CREATE OR REPLACE FUNCTION public.get_current_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;