import { Link } from "react-router-dom";
import { ArrowRight, Phone, Wifi, ShieldCheck, BadgePercent, Car, MapPin, Star } from "lucide-react";
import hero from "@/assets/hero-ride.jpg";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="container-wide flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Car className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">SwiftGo</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#features" className="hover:text-white">Features</a>
            <Link to="/ussd" className="hover:text-white">No internet?</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm text-white/90 hover:text-white hidden sm:inline">Sign in</Link>
            <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
              <Link to="/auth">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-end overflow-hidden">
        <img src={hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-surface/20" />
        <div className="relative container-wide pb-20 pt-32 text-white">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-wider border border-white/20 mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Live in your city
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] text-balance mb-6">
              Name your fare.<br />
              <span className="text-white">Get moving</span> in minutes.
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl mb-10 leading-relaxed">
              SwiftGo is a fair, transparent ride-hailing platform — riders set the price, drivers accept or counter. Works on the web, on your phone, and even without data via USSD.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow h-14 px-8 text-base">
                <Link to="/auth">Request a ride <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-white/30 text-white bg-white/5 hover:bg-white/10 h-14 px-8 text-base">
                <Link to="/auth">Drive with us</Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap gap-8 text-sm text-white/70">
              <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-primary text-primary" /> 4.9 avg rating</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Verified drivers</div>
              <div className="flex items-center gap-2"><BadgePercent className="h-4 w-4 text-primary" /> 0% surge pricing</div>
            </div>
          </div>
        </div>
      </section>

      {/* USSD highlight */}
      <section className="bg-secondary py-20 md:py-28">
        <div className="container-wide grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-[0.2em] mb-4">
              <Wifi className="h-4 w-4" /> Offline mode
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-balance text-foreground">
              No data, no problem. Dial <span className="text-primary">*123#</span> to ride.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
              Any basic phone can request a ride through USSD. Pick up, drop off, and fare — all in a simple text menu. Your driver gets the request instantly in the app.
            </p>
            <Link to="/ussd" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              How USSD works <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative">
            <div className="mx-auto max-w-sm bg-card rounded-[2.5rem] border border-border shadow-soft p-6 font-mono text-sm">
              <div className="text-muted-foreground mb-2 text-[10px] tracking-widest">SWIFTGO • USSD</div>
              <div className="bg-secondary rounded-2xl p-4 text-primary leading-relaxed">
                <div className="opacity-70">&gt; *123#</div>
                <div className="mt-2">Welcome to SwiftGo</div>
                <div>1. Request a ride</div>
                <div>2. My active ride</div>
                <div>3. Cancel ride</div>
                <div className="mt-2 opacity-70">&gt; 1</div>
                <div className="mt-2">Enter pickup:</div>
                <div className="opacity-70">&gt; Tema Station</div>
                <div className="mt-1">Enter drop-off:</div>
                <div className="opacity-70">&gt; Airport</div>
                <div className="mt-1">Your fare offer (USD):</div>
                <div className="opacity-70">&gt; 8</div>
                <div className="mt-3 text-primary">✓ Ride posted. SMS incoming.</div>
              </div>
            </div>
            <div className="absolute -inset-10 bg-primary/20 blur-3xl rounded-full -z-10" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 md:py-28 container-wide">
        <div className="max-w-2xl mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">How it works</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 leading-tight">Three taps. Real prices.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "01", title: "Set your fare", body: "Tell us pickup, drop-off, and how much you want to pay.", icon: MapPin },
            { n: "02", title: "Drivers respond", body: "Nearby drivers accept your offer or counter with theirs.", icon: Car },
            { n: "03", title: "Ride and rate", body: "Track your ride live, pay in cash or card, rate your driver.", icon: Star },
          ].map((s) => (
            <div key={s.n} className="group rounded-3xl bg-card border border-border p-8 hover:border-primary/40 hover:shadow-soft transition-all">
              <span className="text-primary font-bold text-sm mb-6 block">{s.n}</span>
              <s.icon className="h-8 w-8 mb-5 text-foreground" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="py-20 md:py-28 bg-secondary/50">
        <div className="container-wide">
          <div className="max-w-2xl mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Why SwiftGo</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 leading-tight">Built for the real world.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: BadgePercent, title: "Fair fares", body: "No surge. No hidden fees. You and the driver agree the price." },
              { icon: Wifi, title: "Works offline", body: "USSD fallback means rides without internet or smartphones." },
              { icon: ShieldCheck, title: "Verified drivers", body: "Background checks, license verification, real-time tracking." },
              { icon: Phone, title: "Any device", body: "Works on phone, tablet, laptop — even feature phones." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-card border border-border p-6 hover:shadow-soft transition-all">
                <div className="h-11 w-11 rounded-xl bg-primary/10 grid place-items-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="container-wide text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance max-w-3xl mx-auto leading-tight text-foreground">
            Your next ride is one tap away.
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Sign up free in 60 seconds. Earn as a driver, save as a rider.
          </p>
          <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow h-14 px-10 text-base">
            <Link to="/auth">Get started — it's free</Link>
          </Button>
        </div>
      </section>

      <footer className="bg-card border-t border-border">
        <div className="container-wide py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <Car className="h-4 w-4 text-primary" />
            <span>© {new Date().getFullYear()} SwiftGo. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-foreground">
            <Link to="/ussd" className="hover:text-primary">USSD</Link>
            <a href="#how" className="hover:text-primary">How it works</a>
            <Link to="/auth" className="hover:text-primary">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
