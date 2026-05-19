import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Navigation2, Send, Navigation } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import AppShell from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationPicker } from "@/components/ui/location-picker";
import { toast } from "sonner";

const DriverHub = () => {
  const { user, roles } = useAuth();
  const [rides, setRides] = useState<any[]>([]);
  const [counterAmount, setCounterAmount] = useState<Record<string, string>>({});
  const [isOnline, setIsOnline] = useState(false);
  const [driverLat, setDriverLat] = useState<number | undefined>();
  const [driverLon, setDriverLon] = useState<number | undefined>();
  const [location, setLocation] = useState("");
  const isDriver = roles.includes("driver");

  const updateDriverLocation = async (lat: number, lon: number) => {
    if (!user) return;
    const { error } = await supabase.rpc("update_driver_location", {
      driver_id: user.id,
      lat,
      lon,
    });
    if (error) {
      console.error("Location update error:", error);
      return;
    }
    setDriverLat(lat);
    setDriverLon(lon);
    
    // Load nearby rides
    loadNearbyRides(lat, lon);
  };

  const loadNearbyRides = async (lat: number, lon: number) => {
    // Get rides within 10km
    const { data, error } = await supabase.rpc("match_ride_with_drivers", {
      ride_id: "00000000-0000-0000-0000-000000000000", // dummy - we'll fetch differently
    });
    
    // Alternative: Fetch all pending rides (we'll filter client-side or use a better RPC)
    const { data: rides } = await supabase
      .from("rides")
      .select("id, pickup, dropoff, offered_fare, rider_id, profiles:rider_id(full_name), notes, pickup_lat, pickup_lon")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(30);
    
    // Filter by distance (within 10km)
    if (rides) {
      const nearby = rides.filter((r) => {
        if (!r.pickup_lat || !r.pickup_lon) return true; // Show if no coordinates
        const dist = Math.sqrt(
          Math.pow((lat - r.pickup_lat) * 111, 2) +
          Math.pow((lon - r.pickup_lon) * 111, 2)
        ); // rough km calculation
        return dist < 10;
      });
      setRides(nearby as any);
    }
  };

  useEffect(() => {
    if (!isDriver) return;
    
    // Check if driver is already online
    const checkOnlineStatus = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_active, current_lat, current_lon")
        .eq("id", user!.id)
        .single();
      
      if (profile?.is_active && profile.current_lat && profile.current_lon) {
        setIsOnline(true);
        setDriverLat(profile.current_lat);
        setDriverLon(profile.current_lon);
        loadNearbyRides(profile.current_lat, profile.current_lon);
      }
    };
    
    checkOnlineStatus();

    // Subscribe to real-time updates
    const ch = supabase
      .channel("rides-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "rides", filter: `status=eq.pending` },
        (payload) => {
          const newRide = payload.new as any;
          if (driverLat && driverLon && newRide.pickup_lat && newRide.pickup_lon) {
            const dist = Math.sqrt(
              Math.pow((driverLat - newRide.pickup_lat) * 111, 2) +
              Math.pow((driverLon - newRide.pickup_lon) * 111, 2)
            );
            if (dist < 10) {
              setRides((prev) => [newRide, ...prev].slice(0, 30));
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(ch);
    };
  }, [isDriver, user, driverLat, driverLon]);

  const goOnline = (lat: number, lon: number) => {
    if (!user) return;
    supabase
      .from("profiles")
      .update({ is_active: true, current_lat: lat, current_lon: lon })
      .eq("id", user.id)
      .then(() => {
        setIsOnline(true);
        updateDriverLocation(lat, lon);
        toast.success("You're online! Ride requests coming your way 📍");
      });
  };

  const goOffline = () => {
    if (!user) return;
    supabase
      .from("profiles")
      .update({ is_active: false })
      .eq("id", user.id)
      .then(() => {
        setIsOnline(false);
        setRides([]);
        toast.success("You're offline");
      });
  };

  const accept = async (ride: any) => {
    if (!user) return;
    const { error } = await supabase
      .from("rides")
      .update({
        driver_id: user.id,
        final_fare: ride.offered_fare,
        status: "accepted",
      })
      .eq("id", ride.id)
      .eq("status", "pending");
    
    if (error) return toast.error(error.message);
    toast.success("Ride accepted!");
    setRides((prev) => prev.filter((r) => r.id !== ride.id));
  };

  const sendCounter = async (ride: any) => {
    if (!user) return;
    const amt = parseFloat(counterAmount[ride.id] ?? "");
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    
    // Create a ride offer (if table exists) or update rides table
    const { error } = await supabase
      .from("rides")
      .update({
        driver_id: user.id,
        final_fare: amt,
        status: "accepted",
      })
      .eq("id", ride.id)
      .eq("status", "pending");
    
    if (error) return toast.error(error.message);
    toast.success("Counter offer sent");
    setCounterAmount((s) => ({ ...s, [ride.id]: "" }));
    setRides((prev) => prev.filter((r) => r.id !== ride.id));
  };

  if (!isDriver) {
    return (
      <RequireAuth>
        <AppShell>
          <div className="container-wide py-12 max-w-xl text-center">
            <h1 className="text-2xl font-bold mb-3">Drivers only</h1>
            <p className="text-muted-foreground mb-6">You need a driver account to access the hub.</p>
            <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/app/become-driver">Become a driver</Link>
            </Button>
          </div>
        </AppShell>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <AppShell>
        <div className="container-wide py-8 md:py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Driver hub</h1>
              <p className="text-muted-foreground mt-1">
                {isOnline ? "✅ Online — accepting ride requests" : "🔴 Offline"}
              </p>
            </div>
            <div>
              <Button
                onClick={isOnline ? goOffline : undefined}
                disabled={!isOnline}
                variant={isOnline ? "destructive" : "outline"}
                className="rounded-full"
              >
                {isOnline ? "Go offline" : "Come online"}
              </Button>
            </div>
          </div>

          {!isOnline && (
            <div className="mb-8 rounded-3xl bg-primary/10 border border-primary/30 p-6">
              <h2 className="font-bold text-lg mb-4 text-foreground">Set your location to start</h2>
              <LocationPicker
                label="Your current location"
                value={location}
                lat={driverLat}
                lon={driverLon}
                onLocationChange={(loc, lat, lon) => {
                  setLocation(loc);
                  goOnline(lat, lon);
                }}
                placeholder="Enter your location or use GPS"
              />
            </div>
          )}

          {rides.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
              {isOnline
                ? "No open requests nearby right now. Stay tuned — new rides appear instantly."
                : "Come online to see ride requests in your area."}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {rides.map((r) => (
                <div
                  key={r.id}
                  className="rounded-3xl bg-card border border-border p-6 hover:shadow-soft transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Rider</p>
                      <p className="font-bold text-foreground">
                        {r.profiles?.full_name ?? "Rider"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Offer</p>
                      <p className="text-2xl font-extrabold text-primary">
                        ${Number(r.offered_fare).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm mb-5">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span className="text-foreground">{r.pickup}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Navigation2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <span className="text-foreground">{r.dropoff}</span>
                    </div>
                  </div>
                  {r.notes && (
                    <p className="text-xs text-muted-foreground bg-secondary rounded-lg p-2 mb-4">
                      {r.notes}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => accept(r)}
                      className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
                    >
                      Accept ${Number(r.offered_fare).toFixed(2)}
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Counter $"
                      value={counterAmount[r.id] ?? ""}
                      onChange={(e) =>
                        setCounterAmount((s) => ({ ...s, [r.id]: e.target.value }))
                      }
                      className="rounded-full"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => sendCounter(r)}
                      className="rounded-full shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
};

export default DriverHub;
