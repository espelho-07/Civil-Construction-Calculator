-- Admin: role column + single admin email darpantrader1727@gmail.com
-- Run after 001_initial_schema.sql

-- Add role to profiles (default 'user')
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- Set admin role for the designated admin email (run after they sign up once)
-- Alternatively we check by email in app; this allows DB-level admin too.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'darpantrader1727@gmail.com'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Allow admin to read all calculations (for dashboard stats)
DROP POLICY IF EXISTS "Users can view own calculations" ON calculations;
CREATE POLICY "Users can view own calculations" ON calculations
  FOR SELECT USING (
    (user_id = auth.uid() AND is_deleted = FALSE) OR public.is_admin()
  );

-- Allow admin to read all profiles (for user list)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- Ensure trigger sets admin role for darpantrader1727@gmail.com on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        CASE WHEN NEW.email = 'darpantrader1727@gmail.com' THEN 'admin' ELSE 'user' END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
