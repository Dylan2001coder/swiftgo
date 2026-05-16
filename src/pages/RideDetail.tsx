import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation2, X, Check, Car } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  accepted: "bg-primary/15 text-primary",
  in_progress: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-destructive/15 text-destructive",
};

const RideDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ride, setRide] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!id) return;
    const { data } = await supabase.from("rides").select("*").eq("id", id).maybeSingle();
    setRide(data);
    if (data?.driver_id) {
      const { data: d } = await supabase.from("profiles").select("full_name,phone").eq("id", data.driver_id).maybeSingle();
      setDriver(d);
    }
    const { data: o } = await supabase
      .from("ride_offers")
      .select("*, profiles:driver_id(full_name)")
      .eq("ride_id", id)
      .order("created_at", { ascending: false });
    setOffers((o ?? []) as any);
    setLoading(false);
  };

  useEffect(() => {
    load();
    if (!id) return;
    const channel = supabase
      .channel(`ride-${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "rides", filter: `id=eq.${id}` }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "ride_offers", filter: `ride_id=eq.${id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const cancel = async () => {
    if (!confirm("Cancel this ride?")) return;
    const { error } = await supabase.from("rides").update({ status: "cancelled" }).eq("id", id!);
    if (error) toast.error(error.message);
    else { toast.success("Ride cancelled"); load(); }
  };

  const acceptOffer = async (offer: any) => {
    const { error: e1 } = await supabase.from("rides").update({
      driver_id: offer.driver_id,
      final_fare: offer.amount,
      status: "accepted",
    }).eq("id", id!);
    if (e1) return toast.error(e1.message);
    await supabase.from("ride_offers").update({ status: "accepted" }).eq("id", offer.id);
    toast.success("Offer accepted");
    load();
  };

  if (loading) return (
    <RequireAuth><AppShell><div className="container-wide py-12">Loading…</div></AppShell></RequireAuth>
  );

  if (!ride) return (
    <RequireAuth><AppShell><div className="container-wide py-12">Ride not found</div></AppShell></RequireAuth>
  );

  const isRider = ride.rider_id === user?.id;
  const canCancel = isRider && ["pending", "accepted"].includes(ride.status);

  return (
    <RequireAuth>
      <AppShell>
        <div className="container-wide py-8 md:py-12 max-w-3xl">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft mb-6">
            <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Ride</p>
                <h1 className="text-2xl md:text-3xl font-bold">${Number(ride.final_fare ?? ride.offered_fare).toFixed(2)}</h1>
              </div>
              <Badge className={`${statusColor[ride.status]} border-0 capitalize px-3 py-1`}>{ride.status.replace("_", " ")}</Badge>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-7 w-7 rounded-full bg-primary/15 grid place-items-center shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pickup</p>
                  <p className="font-medium">{ride.pickup}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-7 w-7 rounded-full bg-foreground/10 grid place-items-center shrink-0">
                  <Navigation2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Drop-off</p>
                  <p className="font-medium">{ride.dropoff}</p>
                </div>
              </div>
            </div>

            {ride.notes && (
              <div className="text-sm bg-secondary rounded-xl p-3 mb-6">
                <span className="text-muted-foreground">Notes: </span>{ride.notes}
              </div>
            )}

            {driver && (
              <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 mb-6">
                <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2 flex items-center gap-2"><Car className="h-3.5 w-3.5" /> Driver</p>
                <p className="font-bold">{driver.full_name}</p>
                {driver.phone && <p className="text-sm text-muted-foreground">{driver.phone}</p>}
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              {canCancel && (
                <Button variant="outline" onClick={cancel} className="rounded-full">
                  <X className="h-4 w-4 mr-2" /> Cancel ride
                </Button>
              )}
              {isRider && ride.status === "accepted" && (
                <Button onClick={async () => {
                  await supabase.from("rides").update({ status: "in_progress" }).eq("id", id!);
                  load();
                }} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Start trip
                </Button>
              )}
              {isRider && ride.status === "in_progress" && (
                <Button onClick={async () => {
                  await supabase.from("rides").update({ status: "completed" }).eq("id", id!);
                  load();
                }} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Mark completed
                </Button>
              )}
            </div>
          </div>

          {/* Offers */}
          {isRider && ride.status === "pending" && (
            <div className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft">
              <h2 className="font-bold text-lg mb-4">Driver offers</h2>
              {offers.length === 0 ? (
                <p className="text-sm text-muted-foreground">Waiting for drivers to respond…</p>
              ) : (
                <ul className="space-y-3">
                  {offers.map((o) => (
                    <li key={o.id} className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-secondary/60">
                      <div>
                        <p className="font-bold">{o.profiles?.full_name ?? "Driver"}</p>
                        {o.message && <p className="text-sm text-muted-foreground">{o.message}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold">${Number(o.amount).toFixed(2)}</span>
                        <Button size="sm" onClick={() => acceptOffer(o)} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                          <Check className="h-4 w-4 mr-1" /> Accept
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
};

export default RideDetail;
