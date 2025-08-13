-- Add links column to events table
ALTER TABLE public.events 
ADD COLUMN links jsonb DEFAULT '[]'::jsonb;