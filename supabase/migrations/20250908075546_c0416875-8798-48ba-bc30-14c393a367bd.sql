-- Add date field to gallery_items table for editable dates
ALTER TABLE public.gallery_items 
ADD COLUMN item_date TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing items to use event date if associated with album/event
UPDATE public.gallery_items 
SET item_date = events.date
FROM public.gallery_albums 
JOIN public.events ON gallery_albums.event_id = events.id
WHERE gallery_items.album_id = gallery_albums.id
AND gallery_items.item_date = gallery_items.created_at;

-- Create function to get actual album cover image
CREATE OR REPLACE FUNCTION get_album_cover_image(album_uuid UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE
AS $$
  SELECT COALESCE(
    (SELECT image_url FROM public.gallery_items 
     WHERE album_id = album_uuid 
     ORDER BY created_at DESC 
     LIMIT 1),
    '/placeholder.svg'
  );
$$;