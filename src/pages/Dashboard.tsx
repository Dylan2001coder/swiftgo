import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Car, History as HistoryIcon, MapPin, Navigation2, Sparkles } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Ride {
  id: string;
  pickup: string;
  dropoff: string;
  status: string;
  offered_fare: number;
  created_at: string;
}

const Dashboard = () => {
  const { user, roles } = useAuth();
  const [active, setActive] = useState<Ride | null>(null);
  const [recent, setRecent] = useState<Ride[]>([]);
  const isDriver = roles.includes("driver");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("rides")
      .select("id,pickup,dropoff,status,offered_fare,created_at")
      .eq("rider_id", user.id)
      .in("status", ["pending", "accepted", "in_progress"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setActive(data as any));

    supabase
      .from("rides")
      .select("id,pickup,dropoff,status,offered_fare,created_at")
      .eq("rider_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setRecent((data ?? []) as any));
  }, [user]);

  return (
    <RequireAuth>
      <AppShell>
        <div className="container-wide py-8 md:py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Hello{user?.email ? `, ${user.email.split("@")[0]}` : ""} 👋</h1>
            <p className="text-muted-foreground mt-1">Where to today?</p>
          </div>

          {/* Quick action card */}
          <div className="relative overflow-hidden rounded-3xl bg-surface text-white p-8 md:p-10 bg-mesh shadow-soft mb-8">
            <div className="relative max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" /> Quick request
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Need a ride?</h2>
              <p className="text-white/70 mb-6 max-w-md">Set your pickup, drop-off and the fare you want to pay. Drivers respond in seconds.</p>
              <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
                <Link to="/app/request">Request a ride <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <Car className="absolute -right-8 -bottom-8 h-64 w-64 text-white/5" strokeWidth={1} />
          </div>

          {/* Active ride */}
          {active && (
            <Link to={`/app/ride/${active.id}`} className="block mb-8">
              <div className="rounded-3xl border-2 border-primary bg-primary/5 p-6 hover:bg-primary/10 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-bold">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Active ride · {active.status}
                  </span>
                  <span className="font-bold">${Number(active.offered_fare).toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-3 items-center text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="truncate">{active.pickup}</span>
                  <Navigation2 className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{active.dropoff}</span>
                </div>
              </div>
            </Link>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent rides */}
            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <HistoryIcon className="h-4 w-4" /> Recent rides
                </h3>
                <Link to="/app/history" className="text-sm text-primary hover:underline">All</Link>
              </div>
              {recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">No rides yet. Take your first one!</p>
              ) : (
                <ul className="space-y-3">
                  {recent.map((r) => (
                    <li key={r.id}>
                      <Link to={`/app/ride/${r.id}`} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-secondary transition-colors">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{r.pickup} → {r.dropoff}</p>
                          <p className="text-xs text-muted-foreground capitalize">{r.status}</p>
                        </div>
                        <span className="font-semibold text-sm">${Number(r.offered_fare).toFixed(2)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Driver card */}
            <div className="rounded-3xl border border-border bg-card p-6">
              {isDriver ? (
                <>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Navigation2 className="h-4 w-4" /> Driver hub
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">See ride requests near you and start earning.</p>
                  <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                    <Link to="/app/drive">Open driver hub</Link>
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg mb-2">Drive with SwiftGo</h3>
                  <p className="text-sm text-muted-foreground mb-4">Set your own hours. Accept fares that work for you. No commissions on cash trips.</p>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/app/become-driver">Become a driver</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
};

export default Dashboard;
