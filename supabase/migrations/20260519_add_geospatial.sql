-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Add location columns to profiles (driver locations)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS vehicle_type TEXT,
ADD COLUMN IF NOT EXISTS current_lat NUMERIC(10,8),
ADD COLUMN IF NOT EXISTS current_lon NUMERIC(11,8),
ADD COLUMN IF NOT EXISTS location geography(POINT,4326);

-- Add location columns to rides
ALTER TABLE public.rides
ADD COLUMN IF NOT EXISTS pickup_lat NUMERIC(10,8),
ADD COLUMN IF NOT EXISTS pickup_lon NUMERIC(11,8),
ADD COLUMN IF NOT EXISTS dropoff_lat NUMERIC(10,8),
ADD COLUMN IF NOT EXISTS dropoff_lon NUMERIC(11,8),
ADD COLUMN IF NOT EXISTS pickup_location geography(POINT,4326),
ADD COLUMN IF NOT EXISTS dropoff_location geography(POINT,4326);

-- Index for nearby driver queries (spatial index)
CREATE INDEX IF NOT EXISTS profiles_location_idx ON public.profiles USING GIST(location);

-- Index for active drivers
CREATE INDEX IF NOT EXISTS profiles_active_idx ON public.profiles(is_active) WHERE is_active = true;

-- Index for pending rides
CREATE INDEX IF NOT EXISTS rides_pickup_location_idx ON public.rides USING GIST(pickup_location) WHERE status = 'pending';

-- Function to find nearby active drivers
CREATE OR REPLACE FUNCTION public.get_nearby_drivers(
  pickup_lat NUMERIC,
  pickup_lon NUMERIC,
  radius_km NUMERIC DEFAULT 5
)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  phone TEXT,
  vehicle_type TEXT,
  distance_km NUMERIC
) LANGUAGE SQL STABLE AS $$
  SELECT 
    p.id,
    p.full_name,
    p.phone,
    p.vehicle_type,
    (ST_Distance(
      geography(ST_Point(pickup_lon, pickup_lat)),
      p.location
    ) / 1000.0)::NUMERIC(10,2) as distance_km
  FROM public.profiles p
  JOIN public.user_roles ur ON p.id = ur.user_id AND ur.role = 'driver'
  WHERE p.is_active = true
    AND p.location IS NOT NULL
    AND ST_DWithin(
      geography(ST_Point(pickup_lon, pickup_lat)),
      p.location,
      radius_km * 1000
    )
  ORDER BY distance_km ASC
  LIMIT 20;
$$;

-- Function to update driver location
CREATE OR REPLACE FUNCTION public.update_driver_location(
  driver_id UUID,
  lat NUMERIC,
  lon NUMERIC
)
RETURNS void LANGUAGE SQL AS $$
  UPDATE public.profiles
  SET 
    current_lat = lat,
    current_lon = lon,
    location = geography(ST_Point(lon, lat))
  WHERE id = driver_id;
$$;

-- Function to match a ride with nearby drivers
CREATE OR REPLACE FUNCTION public.match_ride_with_drivers(
  ride_id UUID,
  radius_km NUMERIC DEFAULT 5
)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  phone TEXT,
  vehicle_type TEXT,
  distance_km NUMERIC
) LANGUAGE SQL STABLE AS $$
  SELECT 
    p.id,
    p.full_name,
    p.phone,
    p.vehicle_type,
    (ST_Distance(
      r.pickup_location,
      p.location
    ) / 1000.0)::NUMERIC(10,2) as distance_km
  FROM public.profiles p
  JOIN public.user_roles ur ON p.id = ur.user_id AND ur.role = 'driver'
  CROSS JOIN public.rides r
  WHERE r.id = ride_id
    AND r.status = 'pending'
    AND p.is_active = true
    AND p.location IS NOT NULL
    AND ST_DWithin(
      r.pickup_location,
      p.location,
      radius_km * 1000
    )
  ORDER BY distance_km ASC
  LIMIT 20;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_nearby_drivers(NUMERIC, NUMERIC, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_driver_location(UUID, NUMERIC, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION public.match_ride_with_drivers(UUID, NUMERIC) TO authenticated;

-- RLS policy for driver location updates
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Drivers update own location"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id AND public.has_role(auth.uid(), 'driver'))
WITH CHECK (auth.uid() = id AND public.has_role(auth.uid(), 'driver'));

-- Create notifications table for ride matching
CREATE TABLE IF NOT EXISTS public.ride_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'sent', -- sent, accepted, rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '2 minutes'),
  UNIQUE(ride_id, driver_id)
);
ALTER TABLE public.ride_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers see own notifications"
ON public.ride_notifications FOR SELECT TO authenticated
USING (auth.uid() = driver_id);

CREATE POLICY "Drivers update own notifications"
ON public.ride_notifications FOR UPDATE TO authenticated
USING (auth.uid() = driver_id)
WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "System creates notifications"
ON public.ride_notifications FOR INSERT TO authenticated
WITH CHECK (true);

CREATE INDEX ride_notifications_expires_idx ON public.ride_notifications(expires_at);
