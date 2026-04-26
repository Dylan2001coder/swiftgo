import portrait from "@/assets/about-portrait.jpg";
import iceland from "@/assets/dest-iceland.jpg";
import marrakech from "@/assets/dest-marrakech.jpg";

const About = () => (
  <>
    {/* Hero */}
    <section className="pt-40 pb-24 bg-gradient-warm">
      <div className="container-wide grid md:grid-cols-12 gap-12 items-end">
        <div className="md:col-span-7">
          <span className="text-xs uppercase tracking-[0.3em] text-accent mb-6 block">About Odyssée</span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.92] text-balance">
            We are a tiny atelier of <em>twelve people</em> on four continents.
          </h1>
        </div>
        <div className="md:col-span-5 text-muted-foreground text-lg leading-relaxed">
          Founded in a Lisbon back-room in 2014, Odyssée has spent a decade quietly designing journeys for people who are tired of itineraries that look like spreadsheets.
        </div>
      </div>
    </section>

    {/* Founder */}
    <section className="container-wide py-24 md:py-36 grid md:grid-cols-12 gap-12 items-center">
      <div className="md:col-span-5">
        <img src={portrait} alt="Anaïs, founder of Odyssée" loading="lazy" className="w-full aspect-[4/5] object-cover" />
      </div>
      <div className="md:col-span-7 md:pl-8">
        <span className="text-xs uppercase tracking-[0.3em] text-accent mb-4 block">Letter from the founder</span>
        <h2 className="font-display text-3xl md:text-5xl leading-tight mb-8 text-balance">
          "I started Odyssée because I was tired of being sold somewhere. I wanted to be <em>taken</em> there."
        </h2>
        <div className="space-y-5 text-muted-foreground leading-relaxed text-lg">
          <p>I was an editor at a travel magazine for nine years. Every week, a new "must-see" list. Every month, the same five hotels in the same five cities. I wanted to make the opposite — long, slow, generous trips for people who care more about a single morning than a packed week.</p>
          <p>Today, we work with hosts in 42 countries. They're chefs, naturalists, weavers, sailors. They're not guides. They're friends we've made over a decade — and they're the real reason every Odyssée trip feels less like tourism and more like being invited in.</p>
        </div>
        <p className="mt-8 font-display text-3xl">Anaïs Moreau</p>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Founder & Curator</p>
      </div>
    </section>

    {/* Values */}
    <section className="bg-primary text-background">
      <div className="container-wide py-24 md:py-36">
        <span className="text-xs uppercase tracking-[0.3em] text-highlight mb-4 block">What we believe</span>
        <h2 className="font-display text-4xl md:text-6xl mb-16 max-w-3xl leading-tight text-balance">
          Five principles that shape every trip we design.
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-px bg-primary-foreground/15">
          {[
            { n: "01", t: "Less, but longer", b: "Three places in two weeks, not eight." },
            { n: "02", t: "Locally hosted", b: "Every stay, table, and route is led by someone who lives there." },
            { n: "03", t: "Carbon honest", b: "We measure, offset, and disclose. No greenwashing." },
            { n: "04", t: "Quietly luxurious", b: "Comfort without spectacle. Beauty without branding." },
            { n: "05", t: "Endlessly editable", b: "Every itinerary is a draft until you say it isn't." },
          ].map((v) => (
            <div key={v.n} className="bg-primary p-8 hover:bg-secondary transition-colors duration-500">
              <span className="font-display text-4xl text-highlight block mb-4">{v.n}</span>
              <h3 className="font-display text-2xl mb-3">{v.t}</h3>
              <p className="text-background/70 text-sm leading-relaxed">{v.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Image strip */}
    <section className="grid md:grid-cols-2">
      <img src={iceland} alt="Iceland glacial lagoon" loading="lazy" className="w-full aspect-[4/3] object-cover" />
      <img src={marrakech} alt="Marrakech market" loading="lazy" className="w-full aspect-[4/3] object-cover" />
    </section>

    {/* Stats */}
    <section className="container-wide py-24 md:py-32 grid md:grid-cols-4 gap-8 text-center">
      {[
        { n: "10y", l: "of slow travel" },
        { n: "42", l: "countries curated" },
        { n: "120+", l: "local hosts" },
        { n: "4.9★", l: "traveler rating" },
      ].map((s) => (
        <div key={s.l}>
          <p className="font-display text-6xl md:text-7xl text-accent">{s.n}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.l}</p>
        </div>
      ))}
    </section>
  </>
);

export default About;
