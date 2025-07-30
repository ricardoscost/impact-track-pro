-- Add bike fields to pilots table
ALTER TABLE public.pilots 
ADD COLUMN bike_make text,
ADD COLUMN bike_model text;