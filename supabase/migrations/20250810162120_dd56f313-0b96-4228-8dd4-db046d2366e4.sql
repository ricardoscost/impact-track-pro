-- Add pilot_id column to results table to link with pilots
ALTER TABLE public.results 
ADD COLUMN pilot_id uuid REFERENCES public.pilots(id);

-- Create index for better performance
CREATE INDEX idx_results_pilot_id ON public.results(pilot_id);

-- Update existing results to link with pilots where possible
-- This will try to match existing pilot_name with pilots.name
UPDATE public.results 
SET pilot_id = pilots.id 
FROM public.pilots 
WHERE results.pilot_name = pilots.name;