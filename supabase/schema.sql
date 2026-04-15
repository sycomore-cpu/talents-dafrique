-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  city TEXT NOT NULL DEFAULT '',
  phone TEXT,
  whatsapp TEXT,
  bio TEXT,
  is_talent BOOLEAN NOT NULL DEFAULT false,
  case_slug TEXT,
  sub_services TEXT[] NOT NULL DEFAULT '{}',
  availability JSONB NOT NULL DEFAULT '{}',
  photos TEXT[] NOT NULL DEFAULT '{}',
  parrain_id UUID REFERENCES public.profiles(id),
  parrain_code TEXT UNIQUE NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'observation' CHECK (status IN ('observation', 'parraine', 'suspendu')),
  trust_score DECIMAL(3,2) NOT NULL DEFAULT 0,
  kory_balance INTEGER NOT NULL DEFAULT 0,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reservations
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  description TEXT,
  requested_date DATE NOT NULL,
  requested_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'refused', 'completed', 'disputed')),
  kory_charged BOOLEAN NOT NULL DEFAULT false,
  contact_revealed BOOLEAN NOT NULL DEFAULT false,
  client_confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  cover_image TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  case_slug TEXT,
  city TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- Kory transactions
CREATE TABLE IF NOT EXISTS public.kory_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reservation_id UUID REFERENCES public.reservations(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reports
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  parrain_code TEXT;
BEGIN
  -- Generate unique 8-char parrain code
  LOOP
    parrain_code := upper(substring(md5(random()::text) from 1 for 8));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.parrain_code = parrain_code);
  END LOOP;

  INSERT INTO public.profiles (id, name, parrain_code, kory_balance)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email, ''),
    parrain_code,
    10  -- Welcome Korys
  );

  -- Log kory transaction
  INSERT INTO public.kory_transactions (user_id, amount, reason)
  VALUES (new.id, 10, 'Bienvenue sur Talents d''Afrique !');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_reservations_updated
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Reservations policies
CREATE POLICY "Users see their own reservations" ON public.reservations FOR SELECT USING (auth.uid() = client_id OR auth.uid() = talent_id);
CREATE POLICY "Authenticated users can create reservations" ON public.reservations FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Talent can update reservation status" ON public.reservations FOR UPDATE USING (auth.uid() = talent_id OR auth.uid() = client_id);

-- Reviews policies
CREATE POLICY "Reviews are public" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their completed reservations" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Blog policies
CREATE POLICY "Published posts are public" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admins can do everything with posts" ON public.blog_posts USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Kory transactions
CREATE POLICY "Users see their own transactions" ON public.kory_transactions FOR SELECT USING (auth.uid() = user_id);

-- Reports
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins see all reports" ON public.reports FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_case_slug ON public.profiles(case_slug);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_reservations_talent ON public.reservations(talent_id);
CREATE INDEX IF NOT EXISTS idx_reservations_client ON public.reservations(client_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_case ON public.blog_posts(case_slug);
