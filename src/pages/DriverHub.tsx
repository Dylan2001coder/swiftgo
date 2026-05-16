import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Navigation2, Send } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import AppShell from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DriverHub = () => {
  const { user, roles } = useAuth();
  const [rides, setRides] = useState<any[]>([]);
  const [counterAmount, setCounterAmount] = useState<Record<string, string>>({});
  const isDriver = roles.includes("driver");

  const load = () => {
    supabase
      .from("rides")
      .select("*, profiles:rider_id(full_name)")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => setRides((data ?? []) as any));
  };

  useEffect(() => {
    if (!isDriver) return;
    load();
    const ch = supabase
      .channel("driver-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "rides" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [isDriver]);

  const accept = async (ride: any) => {
    const { error } = await supabase.from("rides").update({
      driver_id: user!.id,
      final_fare: ride.offered_fare,
      status: "accepted",
    }).eq("id", ride.id).eq("status", "pending");
    if (error) return toast.error(error.message);
    toast.success("Ride accepted!");
    load();
  };

  const sendCounter = async (ride: any) => {
    const amt = parseFloat(counterAmount[ride.id] ?? "");
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    const { error } = await supabase.from("ride_offers").insert({
      ride_id: ride.id,
      driver_id: user!.id,
      amount: amt,
    });
    if (error) return toast.error(error.message);
    toast.success("Counter offer sent");
    setCounterAmount((s) => ({ ...s, [ride.id]: "" }));
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
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Driver hub</h1>
            <p className="text-muted-foreground mt-1">Live ride requests in your area.</p>
          </div>

          {rides.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No open requests right now. Stay tuned — new rides appear instantly.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {rides.map((r) => (
                <div key={r.id} className="rounded-3xl bg-card border border-border p-6 hover:shadow-soft transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Rider</p>
                      <p className="font-bold">{r.profiles?.full_name ?? "Rider"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Offer</p>
                      <p className="text-2xl font-extrabold text-primary">${Number(r.offered_fare).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm mb-5">
                    <div className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span>{r.pickup}</span></div>
                    <div className="flex items-start gap-2"><Navigation2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" /><span>{r.dropoff}</span></div>
                  </div>
                  {r.notes && <p className="text-xs text-muted-foreground bg-secondary rounded-lg p-2 mb-4">{r.notes}</p>}
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={() => accept(r)} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex-1">
                      Accept ${Number(r.offered_fare).toFixed(2)}
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number" step="0.01" placeholder="Counter $"
                      value={counterAmount[r.id] ?? ""}
                      onChange={(e) => setCounterAmount((s) => ({ ...s, [r.id]: e.target.value }))}
                      className="rounded-full"
                    />
                    <Button variant="outline" size="icon" onClick={() => sendCounter(r)} className="rounded-full shrink-0">
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
