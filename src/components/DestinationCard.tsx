import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export type Destination = {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  image: string;
  coords: string;
};

const DestinationCard = ({ d, index = 0 }: { d: Destination; index?: number }) => (
  <Link
    to="/destinations"
    className="group relative block overflow-hidden bg-muted"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    <div className="aspect-[4/5] overflow-hidden">
      <img
        src={d.image}
        alt={d.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent opacity-90" />
    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between text-background">
      <div className="flex justify-between items-start text-[10px] uppercase tracking-[0.25em] text-background/80">
        <span>{d.region}</span>
        <span>{d.coords}</span>
      </div>
      <div>
        <h3 className="font-display text-3xl md:text-4xl leading-tight mb-2">{d.name}</h3>
        <p className="text-background/80 text-sm max-w-xs mb-4">{d.tagline}</p>
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-highlight transition-all duration-500 group-hover:gap-3">
          Discover <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  </Link>
);

export default DestinationCard;
