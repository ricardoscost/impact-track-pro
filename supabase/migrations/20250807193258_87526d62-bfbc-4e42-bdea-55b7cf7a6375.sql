-- Create youtube_videos table for managing YouTube video links
CREATE TABLE public.youtube_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to youtube_videos" 
ON public.youtube_videos 
FOR SELECT 
USING (true);

-- Create policies for authenticated users to manage videos
CREATE POLICY "Allow all operations for authenticated users on youtube_videos" 
ON public.youtube_videos 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create results table that references events
CREATE TABLE public.results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  pilot_name TEXT NOT NULL,
  position INTEGER NOT NULL,
  points INTEGER DEFAULT 0,
  time_result TEXT,
  category TEXT,
  bike_info TEXT,
  observations TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_results_event FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to results" 
ON public.results 
FOR SELECT 
USING (true);

-- Create policies for authenticated users to manage results
CREATE POLICY "Allow all operations for authenticated users on results" 
ON public.results 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add trigger for updating timestamps
CREATE TRIGGER update_youtube_videos_updated_at
BEFORE UPDATE ON public.youtube_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_results_updated_at
BEFORE UPDATE ON public.results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();