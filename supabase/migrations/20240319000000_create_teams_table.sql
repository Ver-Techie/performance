-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    lead_id UUID,
    manager_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger for teams
CREATE OR REPLACE FUNCTION public.handle_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_teams_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_teams_updated_at();

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eod_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Only allow users to read their own teams
CREATE POLICY "Users can read their own teams"
  ON public.teams
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow users to insert teams for themselves
CREATE POLICY "Users can insert teams"
  ON public.teams
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- (Optional) Allow users to update their own teams
CREATE POLICY "Users can update their own teams"
  ON public.teams
  FOR UPDATE
  USING (auth.uid() = user_id);

-- (Optional) Allow users to delete their own teams
CREATE POLICY "Users can delete their own teams"
  ON public.teams
  FOR DELETE
  USING (auth.uid() = user_id);

-- Only allow users to read their own user profile
CREATE POLICY "Allow users to read their own user profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Only allow users to update their own profile
CREATE POLICY "Allow users to update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- (Optional) Allow users to delete their own profile
CREATE POLICY "Allow users to delete their own profile"
  ON public.users
  FOR DELETE
  USING (auth.uid() = id);

-- Only allow users to view their own EOD reports
CREATE POLICY "Users can view their own EOD reports"
  ON public.eod_reports
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow users to submit their own EOD reports
CREATE POLICY "Users can submit their own EOD reports"
  ON public.eod_reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- (Optional) Allow users to update their own EOD reports
CREATE POLICY "Users can update their own EOD reports"
  ON public.eod_reports
  FOR UPDATE
  USING (auth.uid() = user_id);

-- (Optional) Allow users to delete their own EOD reports
CREATE POLICY "Users can delete their own EOD reports"
  ON public.eod_reports
  FOR DELETE
  USING (auth.uid() = user_id);

-- Only allow users to view their own attendance
CREATE POLICY "Users can view their attendance"
  ON public.attendance
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow users to log their own attendance
CREATE POLICY "Users can log their own attendance"
  ON public.attendance
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- (Optional) Allow users to update their own attendance
CREATE POLICY "Users can update their own attendance"
  ON public.attendance
  FOR UPDATE
  USING (auth.uid() = user_id);

-- (Optional) Allow users to delete their own attendance"
CREATE POLICY "Users can delete their own attendance"
  ON public.attendance
  FOR DELETE
  USING (auth.uid() = user_id);

-- 1. Create the attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    punch_in TIMESTAMPTZ,
    punch_out TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- 3. Secure policies for Firebase-authenticated users

-- Allow users to SELECT only their own attendance
CREATE POLICY "Users can view their own attendance"
  ON public.attendance
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to INSERT only their own attendance records
CREATE POLICY "Users can log their attendance"
  ON public.attendance
  FOR INSERT
  WITH CHECK (auth.uid() = user_id); 