import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation2, DollarSign } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import RequireAuth from "@/components/RequireAuth";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationPicker } from "@/components/ui/location-picker";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const schema = z.object({
  pickup: z.string().trim().min(2, "Pickup required").max(200),
  pickup_lat: z.number(),
  pickup_lon: z.number(),
  dropoff: z.string().trim().min(2, "Drop-off required").max(200),
  dropoff_lat: z.number(),
  dropoff_lon: z.number(),
  notes: z.string().max(500).optional(),
  offered_fare: z.coerce.number().positive("Fare must be positive").max(100000),
});

const RequestRide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pickup, setPickup] = useState("");
  const [pickupLat, setPickupLat] = useState<number | undefined>();
  const [pickupLon, setPickupLon] = useState<number | undefined>();
  const [dropoff, setDropoff] = useState("");
  const [dropoffLat, setDropoffLat] = useState<number | undefined>();
  const [dropoffLon, setDropoffLon] = useState<number | undefined>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      pickup,
      pickup_lat: pickupLat,
      pickup_lon: pickupLon,
      dropoff,
      dropoff_lat: dropoffLat,
      dropoff_lon: dropoffLon,
      notes: fd.get("notes"),
      offered_fare: fd.get("offered_fare"),
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("rides")
        .insert({
          rider_id: user.id,
          pickup: parsed.data.pickup,
          pickup_lat: parsed.data.pickup_lat,
          pickup_lon: parsed.data.pickup_lon,
          pickup_location: `POINT(${parsed.data.pickup_lon} ${parsed.data.pickup_lat})`,
          dropoff: parsed.data.dropoff,
          dropoff_lat: parsed.data.dropoff_lat,
          dropoff_lon: parsed.data.dropoff_lon,
          dropoff_location: `POINT(${parsed.data.dropoff_lon} ${parsed.data.dropoff_lat})`,
          notes: parsed.data.notes || null,
          offered_fare: parsed.data.offered_fare,
          source: "web",
        })
        .select("id")
        .single();

      if (error) throw error;

      // Trigger matching endpoint to notify nearby drivers
      try {
        const matchRes = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/match-ride`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ride_id: data.id,
              pickup_lat: parsed.data.pickup_lat,
              pickup_lon: parsed.data.pickup_lon,
              radius_km: 5,
            }),
          }
        );
        const matchData = await matchRes.json();
        console.log("Matching result:", matchData);
      } catch (matchError) {
        console.error("Matching error:", matchError);
      }

      toast.success("Ride posted — waiting for drivers");
      navigate(`/app/ride/${data.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to post ride");
    } finally {
      setLoading(false);
    }
  
  };

  return (
    <RequireAuth>
      <AppShell>
        <div className="container-wide py-8 md:py-12 max-w-2xl">
          <Link to="/app" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Request a ride</h1>
          <p className="text-muted-foreground mb-8">Tell us where to and what you'd like to pay.</p>

          <form onSubmit={onSubmit} className="space-y-5 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-soft">
            <LocationPicker
              label="Pickup location"
              value={pickup}
              lat={pickupLat}
              lon={pickupLon}
              onLocationChange={(location, lat, lon) => {
                setPickup(location);
                setPickupLat(lat);
                setPickupLon(lon);
              }}
              placeholder="Enter pickup location or use current location"
            />
            <LocationPicker
              label="Drop-off location"
              value={dropoff}
              lat={dropoffLat}
              lon={dropoffLon}
              onLocationChange={(location, lat, lon) => {
                setDropoff(location);
                setDropoffLat(lat);
                setDropoffLon(lon);
              }}
              placeholder="Enter drop-off location"
            />
            <div className="space-y-2">
              <Label htmlFor="offered_fare" className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /> Your fare offer (USD)</Label>
              <Input id="offered_fare" name="offered_fare" type="number" step="0.01" min="0.5" placeholder="8.00" required />
              <p className="text-xs text-muted-foreground">Drivers will accept or send a counter-offer.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" name="notes" placeholder="Luggage, child seat, etc." rows={3} />
            </div>
            <Button type="submit" disabled={loading || !pickupLat || !dropoffLat} className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
              {loading ? "Posting…" : "Post ride"}
            </Button>
          </form>
        </div>
      </AppShell>
    </RequireAuth>
  );
};

export default RequestRide;
