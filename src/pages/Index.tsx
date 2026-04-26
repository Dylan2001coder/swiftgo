import { Link } from "react-router-dom";
import { ArrowRight, Plane, Compass, Map, Hotel } from "lucide-react";
import Hero from "@/components/Hero";
import DestinationCard from "@/components/DestinationCard";
import { destinations } from "@/data/destinations";

const Index = () => {
  return (
    <>
      <Hero />

      {/* Marquee ticker */}
      <section className="bg-primary text-primary-foreground py-6 border-y border-primary-foreground/10 overflow-hidden">
        <div className="ticker-mask">
          <div className="flex gap-16 whitespace-nowrap animate-marquee">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex gap-16 items-center font-display text-2xl shrink-0">
                {["Lisbon", "Reykjavik", "Hanoi", "Cape Town", "Mendoza", "Hoi An", "Cartagena", "Sevilla", "Tbilisi", "Oaxaca"].map((c) => (
                  <span key={`${dup}-${c}`} className="flex items-center gap-16">
                    <span className="italic text-highlight">— {c}</span>
                    <Plane className="h-4 w-4 text-primary-foreground/40" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro / Manifesto */}
      <section className="container-wide py-24 md:py-36 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">Our Approach</span>
        </div>
        <div className="md:col-span-8">
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-balance mb-8">
            We don't sell trips. We design <em>quiet, deliberate</em> ways of seeing the world.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Every Odyssée itinerary begins with a long conversation. We listen, we map, we sketch — and we send you somewhere you didn't know you needed. Locally hosted. Carbon-considered. Always under-scheduled.
          </p>
        </div>
      </section>

      {/* Featured destinations */}
      <section className="container-wide pb-24 md:pb-36">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent mb-3 block">Featured Destinations</span>
            <h2 className="font-display text-4xl md:text-5xl">Where we're sending people now</h2>
          </div>
          <Link to="/destinations" className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-foreground hover:text-accent transition-colors">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {destinations.slice(0, 6).map((d, i) => (
            <DestinationCard key={d.slug} d={d} index={i} />
          ))}
        </div>
      </section>

      {/* Editorial split */}
      <section className="bg-sand">
        <div className="container-wide py-24 md:py-36 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={destinations[3].image}
              alt="Bamboo path in Kyoto"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent mb-4 block">Field Notes</span>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mb-6 text-balance">
              The art of the slow morning, in Arashiyama.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              A guide to bamboo light, pre-dawn temples, and the small ceremony of breakfast at a 200-year-old ryokan — written from the road by our Kyoto host, Maiko.
            </p>
            <Link to="/about" className="inline-flex items-center gap-3 border-b border-foreground pb-1 text-sm uppercase tracking-wider hover:border-accent hover:text-accent transition-colors">
              Read the journal <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-wide py-24 md:py-36">
        <div className="max-w-2xl mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-accent mb-4 block">How it works</span>
          <h2 className="font-display text-4xl md:text-5xl">Three steps. Zero algorithm.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {[
            { icon: Compass, title: "Tell us your shape of trip", body: "A 30-minute call. We ask about pace, palette, and the kind of evenings you want." },
            { icon: Map, title: "We design the route", body: "A bespoke itinerary, hand-illustrated, with hosts and tables held in your name." },
            { icon: Hotel, title: "We stay close, you stay present", body: "On-the-ground concierge through every leg, in your timezone, on your terms." },
          ].map((s, i) => (
            <div key={s.title} className="border-t border-border pt-8">
              <span className="font-display text-5xl text-accent block mb-6">0{i + 1}</span>
              <s.icon className="h-6 w-6 mb-4 text-foreground" strokeWidth={1.3} />
              <h3 className="font-display text-2xl mb-3">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-gradient-ocean text-background">
        <div className="container-wide py-24 md:py-32 text-center">
          <h2 className="font-display text-4xl md:text-6xl mb-6 text-balance max-w-3xl mx-auto leading-tight">
            Ready to plan something <em className="text-highlight">unhurried?</em>
          </h2>
          <p className="text-background/80 max-w-xl mx-auto mb-10 text-lg">
            Open dates start six weeks out. We take twelve commissions a month.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-background text-primary px-8 py-4 text-sm uppercase tracking-wider hover:bg-highlight transition-colors"
          >
            Begin the conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Index;
