import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, CheckCircle2 } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const BecomeDriver = () => {
  const { user, roles, refreshRoles } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isDriver = roles.includes("driver");

  const enable = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "driver" });
    setLoading(false);
    if (error && !error.message.includes("duplicate")) return toast.error(error.message);
    await refreshRoles();
    toast.success("You're a driver now!");
    navigate("/app/drive");
  };

  return (
    <RequireAuth>
      <AppShell>
        <div className="container-wide py-12 max-w-xl">
          <div className="rounded-3xl bg-surface text-white p-8 md:p-12 bg-mesh shadow-soft">
            <div className="h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow mb-6">
              <Car className="h-7 w-7 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Drive with SwiftGo</h1>
            <p className="text-white/70 mb-8 leading-relaxed">
              Earn on your own schedule. Accept the rides that work for you. Get paid in cash or directly to your account.
            </p>
            <ul className="space-y-3 mb-8 text-sm">
              {["No commissions on cash trips", "Set your own counter-offers", "Live ride feed", "Verified rider profiles"].map((b) => (
                <li key={b} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> {b}</li>
              ))}
            </ul>
            {isDriver ? (
              <p className="text-primary font-semibold">You're already a driver. ✓</p>
            ) : (
              <Button onClick={enable} disabled={loading} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
                {loading ? "Activating…" : "Activate driver mode"}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            In production we'd verify license & background. For this demo, activation is instant.
          </p>
        </div>
      </AppShell>
    </RequireAuth>
  );
};

export default BecomeDriver;
