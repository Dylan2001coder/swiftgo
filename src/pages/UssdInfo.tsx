import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Wifi } from "lucide-react";

const UssdInfo = () => {
  const ussdEndpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ussd-handler`;
  return (
    <div className="min-h-screen bg-background">
      <div className="container-wide py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <span className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-[0.2em] font-semibold mb-3">
          <Wifi className="h-3.5 w-3.5" /> Offline mode
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Ride without data — via USSD</h1>
        <p className="text-muted-foreground text-lg mb-10">
          USSD lets any phone — even a basic Nokia — request a SwiftGo ride. There's no app to install and no internet required. Just dial the short code your network operator assigns.
        </p>

        <div className="rounded-3xl bg-card border border-border p-6 md:p-8 mb-6 shadow-soft">
          <h2 className="font-bold text-xl mb-3 flex items-center gap-2"><Phone className="h-5 w-5 text-primary" /> How it works</h2>
          <ol className="space-y-3 list-decimal pl-5 text-sm leading-relaxed">
            <li>Rider dials <code className="bg-secondary px-2 py-0.5 rounded">*123#</code> on any phone.</li>
            <li>Our USSD gateway (e.g. Africa's Talking) forwards each menu step to the SwiftGo backend.</li>
            <li>Backend creates a ride request in the same database the web/mobile drivers see.</li>
            <li>The rider receives an SMS once a driver accepts.</li>
          </ol>
        </div>

        <div className="rounded-3xl bg-secondary p-6 md:p-8">
          <h2 className="font-bold text-xl mb-3 text-foreground">For operators</h2>
          <p className="text-muted-foreground mb-4">Point your USSD gateway callback to:</p>
          <code className="block bg-background rounded-xl p-4 text-primary text-sm break-all">{ussdEndpoint}</code>
          <p className="text-xs text-muted-foreground mt-4">
            Compatible with Africa's Talking USSD format (POST with sessionId, phoneNumber, text). Easily adapted for Twilio, Hubtel, etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UssdInfo;
