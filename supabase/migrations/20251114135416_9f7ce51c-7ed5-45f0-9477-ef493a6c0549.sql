-- Add new fields to saved_calculations table for detailed club fitting data
ALTER TABLE public.saved_calculations
ADD COLUMN player_height NUMERIC,
ADD COLUMN wrist_to_floor NUMERIC,
ADD COLUMN hand_size TEXT,
ADD COLUMN gender TEXT,
ADD COLUMN handgrip_issues TEXT,
ADD COLUMN ball_flight_tendency TEXT,
ADD COLUMN club_length_adjustment TEXT,
ADD COLUMN lie_angle_adjustment TEXT,
ADD COLUMN shaft_preference TEXT,
ADD COLUMN swing_weight_adjustment TEXT,
ADD COLUMN grip_sizes TEXT;

-- Create feedback table for user experience ratings
CREATE TABLE public.user_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  calculation_id UUID REFERENCES public.saved_calculations(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on feedback table
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_feedback
CREATE POLICY "Users can insert their own feedback"
ON public.user_feedback
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own feedback"
ON public.user_feedback
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all feedback"
ON public.user_feedback
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update saved_calculations RLS to allow admins to view all
CREATE POLICY "Admins can view all calculations"
ON public.saved_calculations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policy to allow updating saved_calculations
CREATE POLICY "Users can update their own calculations"
ON public.saved_calculations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);