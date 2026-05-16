import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Navigation2 } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import AppShell from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  accepted: "bg-primary/15 text-primary",
  in_progress: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-destructive/15 text-destructive",
};

const History = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("rides")
      .select("*")
      .or(`rider_id.eq.${user.id},driver_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => setRides(data ?? []));
  }, [user]);

  return (
    <RequireAuth>
      <AppShell>
        <div className="container-wide py-8 md:py-12 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your rides</h1>
          <p className="text-muted-foreground mb-8">All your trips, past and present.</p>

          {rides.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground mb-4">No rides yet.</p>
              <Link to="/app/request" className="text-primary font-semibold hover:underline">Request your first ride →</Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {rides.map((r) => (
                <li key={r.id}>
                  <Link to={`/app/ride/${r.id}`} className="block rounded-2xl bg-card border border-border p-5 hover:border-primary/40 hover:shadow-soft transition-all">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div>
                      <Badge className={`${statusColor[r.status]} border-0 capitalize`}>{r.status.replace("_", " ")}</Badge>
                    </div>
                    <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1 items-center text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="truncate">{r.pickup}</span>
                      <span className="row-span-2 font-bold text-base">${Number(r.final_fare ?? r.offered_fare).toFixed(2)}</span>
                      <Navigation2 className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{r.dropoff}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
};

export default History;
