import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Users, MapPin } from "lucide-react";
import santorini from "@/assets/dest-santorini.jpg";
import patagonia from "@/assets/dest-patagonia.jpg";
import maldives from "@/assets/dest-maldives.jpg";
import kyoto from "@/assets/dest-kyoto.jpg";
import marrakech from "@/assets/dest-marrakech.jpg";

const tours = [
  {
    title: "The Aegean Slow Sail",
    region: "Greek Islands",
    days: 9,
    group: "8 max",
    from: 4200,
    image: santorini,
    blurb: "A private gulet drifting between Cycladic ports. Long lunches, hidden coves, no rigid schedule.",
  },
  {
    title: "Patagonia in Wool & Wind",
    region: "Chile & Argentina",
    days: 12,
    group: "6 max",
    from: 6800,
    image: patagonia,
    blurb: "Estancia stays, glacier ridge hikes, and quiet evenings under the cleanest sky on earth.",
  },
  {
    title: "Atolls & Antiquity",
    region: "Maldives",
    days: 7,
    group: "Private",
    from: 5500,
    image: maldives,
    blurb: "An overwater retreat with marine biologists, free-diving lessons, and a chef-led reef-to-table table.",
  },
  {
    title: "Kyoto, In Layers",
    region: "Japan",
    days: 10,
    group: "4 max",
    from: 5200,
    image: kyoto,
    blurb: "Tea ceremony, woodblock studios, and a private kaiseki dinner at a 200-year-old machiya.",
  },
  {
    title: "Medina & Atlas",
    region: "Morocco",
    days: 8,
    group: "10 max",
    from: 3400,
    image: marrakech,
    blurb: "Souks at first light, a riad you'll dream about, and three nights in the Atlas mountains.",
  },
];

const Tours = () => {
  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-20 bg-primary text-background">
        <div className="container-wide grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="text-xs uppercase tracking-[0.3em] text-highlight mb-4 block">Curated Tours</span>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-balance">
              Small groups, <em className="text-highlight">long evenings,</em> impeccable taste.
            </h1>
          </div>
          <div className="md:col-span-4 text-background/70 leading-relaxed">
            Five signature itineraries, each capped at a dozen travelers. Departures every season. Each tour can also be redesigned as a fully private commission.
          </div>
        </div>
      </section>

      {/* Tour list */}
      <section className="container-wide py-16 md:py-24 space-y-8 md:space-y-16">
        {tours.map((t, i) => (
          <article
            key={t.title}
            className={`grid md:grid-cols-12 gap-6 md:gap-12 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="md:col-span-7 aspect-[16/10] overflow-hidden bg-muted group">
              <img
                src={t.image}
                alt={t.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
              />
            </div>
            <div className="md:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] text-accent">№ 0{i + 1} · {t.region}</span>
              <h2 className="font-display text-4xl md:text-5xl leading-tight text-balance">{t.title}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{t.blurb}</p>
              <div className="flex flex-wrap gap-6 text-sm border-y border-border py-4">
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> {t.days} days</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> {t.group}</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> {t.region}</span>
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">From</span>
                  <p className="font-display text-3xl">${t.from.toLocaleString()} <span className="text-sm text-muted-foreground">/ person</span></p>
                </div>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-wider hover:bg-accent transition-colors"
                >
                  Reserve interest
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
};

export default Tours;
