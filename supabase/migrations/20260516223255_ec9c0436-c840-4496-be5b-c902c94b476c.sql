-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('rider', 'driver', 'admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles
FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'))
WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own profile"
ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile"
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Auto-create profile + default rider role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'rider');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Rides
CREATE TYPE public.ride_status AS ENUM ('pending','accepted','in_progress','completed','cancelled');

CREATE TABLE public.rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  pickup TEXT NOT NULL,
  dropoff TEXT NOT NULL,
  notes TEXT,
  offered_fare NUMERIC(10,2) NOT NULL CHECK (offered_fare > 0),
  final_fare NUMERIC(10,2),
  status public.ride_status NOT NULL DEFAULT 'pending',
  source TEXT NOT NULL DEFAULT 'web', -- 'web' or 'ussd'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

CREATE INDEX rides_status_idx ON public.rides(status);
CREATE INDEX rides_rider_idx ON public.rides(rider_id);
CREATE INDEX rides_driver_idx ON public.rides(driver_id);

CREATE POLICY "Riders see own rides"
ON public.rides FOR SELECT TO authenticated
USING (auth.uid() = rider_id OR auth.uid() = driver_id
  OR (status = 'pending' AND public.has_role(auth.uid(),'driver')));

CREATE POLICY "Riders create own rides"
ON public.rides FOR INSERT TO authenticated
WITH CHECK (auth.uid() = rider_id);

CREATE POLICY "Rider or driver update ride"
ON public.rides FOR UPDATE TO authenticated
USING (auth.uid() = rider_id OR auth.uid() = driver_id
  OR (status = 'pending' AND public.has_role(auth.uid(),'driver')));

CREATE TRIGGER rides_touch BEFORE UPDATE ON public.rides
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Ride offers (driver counter-offers)
CREATE TABLE public.ride_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending/accepted/rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(ride_id, driver_id)
);
ALTER TABLE public.ride_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Driver creates own offers"
ON public.ride_offers FOR INSERT TO authenticated
WITH CHECK (auth.uid() = driver_id AND public.has_role(auth.uid(),'driver'));

CREATE POLICY "View offers if involved"
ON public.ride_offers FOR SELECT TO authenticated
USING (
  auth.uid() = driver_id
  OR EXISTS (SELECT 1 FROM public.rides r WHERE r.id = ride_id AND r.rider_id = auth.uid())
);

CREATE POLICY "Rider updates offers on own ride"
ON public.ride_offers FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.rides r WHERE r.id = ride_id AND r.rider_id = auth.uid()));

-- Realtime
ALTER TABLE public.rides REPLICA IDENTITY FULL;
ALTER TABLE public.ride_offers REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rides;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ride_offers;