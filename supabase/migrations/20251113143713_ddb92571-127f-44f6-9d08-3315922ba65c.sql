-- Add club preferences columns to saved_calculations table
ALTER TABLE public.saved_calculations
ADD COLUMN club_condition text,
ADD COLUMN grip_preference text,
ADD COLUMN look_preference text,
ADD COLUMN budget_range text,
ADD COLUMN brand_preference text;