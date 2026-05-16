// USSD handler for SwiftGo (Africa's Talking format)
// Stateless: navigates by counting the steps in `text`.
// Receives x-www-form-urlencoded POST with: sessionId, phoneNumber, text
// Responds with plain text starting with "CON " (continue) or "END " (terminate).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const respond = (body: string, status = 200) =>
  new Response(body, { status, headers: { ...corsHeaders, "Content-Type": "text/plain" } });

async function ensureUssdUser(phone: string): Promise<string> {
  // Find profile by phone, or provision an anonymous-but-named user record.
  const { data: existing } = await supabase
    .from("profiles").select("id").eq("phone", phone).maybeSingle();
  if (existing) return existing.id;

  // Create an auth user (random email so the row is valid).
  const email = `ussd_${phone.replace(/\D/g, "")}@ussd.swiftgo.app`;
  const password = crypto.randomUUID();
  const { data: created, error } = await supabase.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { full_name: `USSD ${phone}`, phone },
  });
  if (error || !created.user) throw new Error(error?.message ?? "user create failed");
  return created.user.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return respond("END Invalid method", 405);

  try {
    const form = await req.formData();
    const phoneNumber = String(form.get("phoneNumber") ?? "").trim();
    const text = String(form.get("text") ?? "").trim();
    if (!phoneNumber) return respond("END Missing phone");

    const parts = text === "" ? [] : text.split("*");

    // Level 0: main menu
    if (parts.length === 0) {
      return respond(
        "CON Welcome to SwiftGo\n1. Request a ride\n2. My active ride\n3. Cancel active ride",
      );
    }

    // Option 1 — Request a ride flow
    if (parts[0] === "1") {
      if (parts.length === 1) return respond("CON Enter pickup location:");
      if (parts.length === 2) return respond("CON Enter drop-off location:");
      if (parts.length === 3) return respond("CON Your fare offer (USD):");
      if (parts.length === 4) {
        const [, pickup, dropoff, fareStr] = parts;
        const fare = parseFloat(fareStr);
        if (!isFinite(fare) || fare <= 0) return respond("END Invalid fare amount");
        try {
          const riderId = await ensureUssdUser(phoneNumber);
          const { error } = await supabase.from("rides").insert({
            rider_id: riderId,
            pickup, dropoff, offered_fare: fare, source: "ussd",
          });
          if (error) return respond(`END Error: ${error.message.slice(0, 80)}`);
          return respond(`END Ride posted for $${fare.toFixed(2)}. You'll get an SMS when a driver accepts.`);
        } catch (e: any) {
          return respond(`END Error: ${String(e?.message ?? e).slice(0, 80)}`);
        }
      }
    }

    // Option 2 — My active ride
    if (parts[0] === "2") {
      const { data: profile } = await supabase
        .from("profiles").select("id").eq("phone", phoneNumber).maybeSingle();
      if (!profile) return respond("END No SwiftGo account found for this number.");
      const { data: ride } = await supabase
        .from("rides")
        .select("status, pickup, dropoff, offered_fare, final_fare")
        .eq("rider_id", profile.id)
        .in("status", ["pending", "accepted", "in_progress"])
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (!ride) return respond("END No active rides.");
      const fare = Number(ride.final_fare ?? ride.offered_fare).toFixed(2);
      return respond(`END Status: ${ride.status}\nFrom: ${ride.pickup}\nTo: ${ride.dropoff}\nFare: $${fare}`);
    }

    // Option 3 — Cancel active ride
    if (parts[0] === "3") {
      const { data: profile } = await supabase
        .from("profiles").select("id").eq("phone", phoneNumber).maybeSingle();
      if (!profile) return respond("END No SwiftGo account found.");
      const { data: ride } = await supabase
        .from("rides").select("id")
        .eq("rider_id", profile.id)
        .in("status", ["pending", "accepted"])
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (!ride) return respond("END No cancellable ride.");
      await supabase.from("rides").update({ status: "cancelled" }).eq("id", ride.id);
      return respond("END Ride cancelled.");
    }

    return respond("END Invalid option");
  } catch (e: any) {
    console.error("ussd error", e);
    return respond("END Server error, try again.");
  }
});
