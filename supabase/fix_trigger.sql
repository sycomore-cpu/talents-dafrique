-- ─── Fix handle_new_user trigger ─────────────────────────────────────────────
-- Run this in the Supabase SQL Editor if Google OAuth signup fails with
-- "Database error saving new user"

-- 1. Add INSERT policy for profiles (needed even with SECURITY DEFINER in some Supabase configs)
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;
CREATE POLICY "System can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- 2. Recreate trigger function with explicit search_path and better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_parrain_code TEXT;
BEGIN
  -- Generate unique 8-char referral code
  LOOP
    v_parrain_code := upper(substring(md5(random()::text) from 1 for 8));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE parrain_code = v_parrain_code);
  END LOOP;

  INSERT INTO profiles (id, name, parrain_code, kory_balance)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Nouveau membre'),
    v_parrain_code,
    10
  );

  -- Welcome Kory bonus
  INSERT INTO kory_transactions (user_id, amount, reason)
  VALUES (NEW.id, 10, 'Bienvenue sur Talents d''Afrique !');

  RETURN NEW;
EXCEPTION WHEN others THEN
  -- Log error but don't block signup
  RAISE WARNING 'handle_new_user failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- 3. Recreate trigger (in case it got dropped)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
