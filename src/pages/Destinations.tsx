import DestinationCard from "@/components/DestinationCard";
import { destinations } from "@/data/destinations";

const regions = ["All", "Europe", "Asia", "Americas", "Africa", "Islands"];

const Destinations = () => {
  return (
    <>
      {/* Page header */}
      <section className="pt-40 pb-20 bg-gradient-warm">
        <div className="container-wide grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="text-xs uppercase tracking-[0.3em] text-accent mb-4 block">The Atlas</span>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-balance">
              Forty-two corners of the world we know <em>by heart.</em>
            </h1>
          </div>
          <div className="md:col-span-4 text-muted-foreground leading-relaxed">
            Each destination here is one we've walked, slept in, eaten through, and returned to. Filter by region or scroll the full atlas.
          </div>
        </div>
      </section>

      {/* Filter strip */}
      <section className="border-y border-border bg-background sticky top-20 z-30 backdrop-blur-xl bg-background/80">
        <div className="container-wide flex gap-2 md:gap-6 py-5 overflow-x-auto">
          {regions.map((r, i) => (
            <button
              key={r}
              className={`text-xs uppercase tracking-wider px-3 py-1.5 transition-colors whitespace-nowrap ${
                i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="container-wide py-16 md:py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {destinations.map((d, i) => (
            <DestinationCard key={d.slug} d={d} index={i} />
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="bg-sand">
        <div className="container-wide py-24 md:py-36 max-w-4xl">
          <p className="font-display text-3xl md:text-5xl leading-tight text-balance italic">
            "Travel is the only thing you buy that makes you richer — and the only thing worth taking your time with."
          </p>
          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-muted-foreground">— Anaïs, Founder</p>
        </div>
      </section>
    </>
  );
};

export default Destinations;
