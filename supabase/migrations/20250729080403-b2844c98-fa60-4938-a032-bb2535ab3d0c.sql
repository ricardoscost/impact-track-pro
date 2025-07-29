-- Create pilots table
CREATE TABLE public.pilots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  biography TEXT,
  photo_url TEXT,
  birth_date DATE,
  nationality TEXT,
  team TEXT,
  championships INTEGER DEFAULT 0,
  victories INTEGER DEFAULT 0,
  podiums INTEGER DEFAULT 0,
  website TEXT,
  instagram TEXT,
  facebook TEXT,
  twitter TEXT,
  linkedin TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pilots ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to pilots" 
ON public.pilots 
FOR SELECT 
USING (true);

-- Create policies for all operations (for admin use)
CREATE POLICY "Allow all operations on pilots" 
ON public.pilots 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pilots_updated_at
BEFORE UPDATE ON public.pilots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();