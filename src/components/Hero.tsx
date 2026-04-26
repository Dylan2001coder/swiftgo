import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroSky from "@/assets/hero-sky.jpg";
import plane from "@/assets/plane.png";

const Hero = () => {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-primary">
      {/* Sky background with subtle Ken Burns */}
      <div className="absolute inset-0 animate-ken-burns">
        <img
          src={heroSky}
          alt="Cinematic sky over open ocean at golden hour"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
      </div>

      {/* Drifting cloud overlays */}
      <div className="absolute inset-0 cloud-layer animate-cloud-drift-slow opacity-70 mix-blend-screen" />
      <div className="absolute inset-0 cloud-layer animate-cloud-drift-fast opacity-40 mix-blend-screen" />

      {/* Sky tone wash */}
      <div className="absolute inset-0 bg-gradient-sky" />

      {/* Flying plane with vapor trail */}
      <div className="absolute top-[28%] left-0 w-full pointer-events-none">
        <div className="relative animate-plane-fly will-change-transform">
          {/* Vapor trail */}
          <div className="absolute right-[60%] top-1/2 -translate-y-1/2 h-[2px] w-[40vw] bg-gradient-to-l from-background/80 via-background/30 to-transparent blur-[1px]" />
          <img
            src={plane}
            alt=""
            aria-hidden
            className="relative h-16 md:h-24 w-auto drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full container-wide flex flex-col justify-end pb-24 md:pb-32">
        <div className="max-w-3xl text-background animate-fade-up">
          <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-background/80 mb-6">
            <span className="h-px w-10 bg-background/60" />
            Est. 2014 · Slow Travel Atelier
          </span>
          <h1 className="font-display text-balance text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8">
            The world is waiting <em className="text-highlight">— quietly,</em> just over the horizon.
          </h1>
          <p className="text-pretty text-lg md:text-xl text-background/80 max-w-xl mb-10 leading-relaxed">
            Hand-crafted journeys to the places that move us. Fewer stops, deeper meaning, longer evenings.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/destinations"
              className="group inline-flex items-center gap-3 bg-background text-primary px-7 py-4 text-sm uppercase tracking-wider hover:bg-highlight hover:text-primary transition-all duration-500"
            >
              Explore destinations
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/tours"
              className="inline-flex items-center gap-3 border border-background/40 text-background px-7 py-4 text-sm uppercase tracking-wider hover:bg-background hover:text-primary transition-all duration-500"
            >
              View tours
            </Link>
          </div>
        </div>

        {/* Bottom meta strip */}
        <div className="mt-16 hidden md:flex items-end justify-between text-background/70 text-xs uppercase tracking-widest">
          <span>Scroll to wander ↓</span>
          <div className="flex gap-12">
            <div>
              <div className="text-background font-display text-3xl mb-1">42</div>
              countries curated
            </div>
            <div>
              <div className="text-background font-display text-3xl mb-1">11k</div>
              quiet evenings
            </div>
            <div>
              <div className="text-background font-display text-3xl mb-1">4.9</div>
              traveler rating
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
