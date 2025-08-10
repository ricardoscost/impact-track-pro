-- Criar tabela para álbuns de galeria
CREATE TABLE public.gallery_albums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para associar pilotos a itens da galeria (many-to-many)
CREATE TABLE public.gallery_item_pilots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_item_id UUID NOT NULL REFERENCES public.gallery_items(id) ON DELETE CASCADE,
  pilot_id UUID NOT NULL REFERENCES public.pilots(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(gallery_item_id, pilot_id)
);

-- Adicionar album_id à tabela gallery_items
ALTER TABLE public.gallery_items ADD COLUMN album_id UUID REFERENCES public.gallery_albums(id) ON DELETE SET NULL;

-- Criar trigger para updated_at em gallery_albums
CREATE TRIGGER update_gallery_albums_updated_at
  BEFORE UPDATE ON public.gallery_albums
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_item_pilots ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para gallery_albums
CREATE POLICY "Allow all operations on gallery_albums" 
ON public.gallery_albums 
FOR ALL 
USING (true);

CREATE POLICY "Allow public read access to gallery_albums" 
ON public.gallery_albums 
FOR SELECT 
USING (true);

-- Criar políticas RLS para gallery_item_pilots
CREATE POLICY "Allow all operations on gallery_item_pilots" 
ON public.gallery_item_pilots 
FOR ALL 
USING (true);

CREATE POLICY "Allow public read access to gallery_item_pilots" 
ON public.gallery_item_pilots 
FOR SELECT 
USING (true);

-- Criar índices para performance
CREATE INDEX idx_gallery_albums_event_id ON public.gallery_albums(event_id);
CREATE INDEX idx_gallery_albums_sort_order ON public.gallery_albums(sort_order);
CREATE INDEX idx_gallery_items_album_id ON public.gallery_items(album_id);
CREATE INDEX idx_gallery_item_pilots_gallery_item_id ON public.gallery_item_pilots(gallery_item_id);
CREATE INDEX idx_gallery_item_pilots_pilot_id ON public.gallery_item_pilots(pilot_id);