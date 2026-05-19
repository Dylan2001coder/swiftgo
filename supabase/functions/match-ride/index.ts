// Matching engine for SwiftGo
// Finds nearby drivers and notifies them of a new ride

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

const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return respond({ error: "Invalid method" }, 405);

  try {
    const { ride_id, pickup_lat, pickup_lon, radius_km = 5 } = await req.json();
    if (!ride_id || !pickup_lat || !pickup_lon) {
      return respond(
        { error: "Missing ride_id, pickup_lat, or pickup_lon" },
        400
      );
    }

    // Get nearby drivers
    const { data: nearby_drivers, error: driverError } = await supabase.rpc(
      "match_ride_with_drivers",
      { ride_id, radius_km }
    );
    if (driverError) throw new Error(driverError.message);

    // Create notifications for up to 10 nearby drivers
    const notificationPromises = nearby_drivers
      .slice(0, 10)
      .map(async (driver) => {
        const { error: notifError } = await supabase
          .from("ride_notifications")
          .insert({
            ride_id,
            driver_id: driver.user_id,
            status: "sent",
            expires_at: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
          })
          .select();
        if (notifError && !notifError.message.includes("duplicate")) {
          console.error("Notification error:", notifError);
        }
      });

    await Promise.all(notificationPromises);

    return respond({
      success: true,
      drivers_notified: Math.min(nearby_drivers.length, 10),
      nearby_drivers: nearby_drivers.map((d) => ({
        user_id: d.user_id,
        full_name: d.full_name,
        distance_km: d.distance_km,
      })),
    });
  } catch (error) {
    console.error("Matching error:", error);
    return respond({ error: String(error) }, 500);
  }
});
