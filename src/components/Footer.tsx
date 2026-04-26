import { Link } from "react-router-dom";
import { Compass, Instagram, Twitter, Send } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container-wide py-20 grid gap-12 md:grid-cols-12">
      <div className="md:col-span-5 space-y-6">
        <Link to="/" className="flex items-center gap-2 font-display text-3xl">
          <Compass className="h-6 w-6" strokeWidth={1.5} />
          Odyssée
        </Link>
        <p className="text-primary-foreground/70 max-w-sm leading-relaxed">
          Crafted journeys for the curious traveler. We design slow, intentional escapes to the world's most quietly extraordinary places.
        </p>
        <div className="flex gap-3">
          <a className="p-2 border border-primary-foreground/20 hover:bg-accent hover:border-accent transition-colors" href="#" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
          <a className="p-2 border border-primary-foreground/20 hover:bg-accent hover:border-accent transition-colors" href="#" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
        </div>
      </div>

      <div className="md:col-span-3">
        <h4 className="text-xs uppercase tracking-widest text-highlight mb-5">Explore</h4>
        <ul className="space-y-3 text-primary-foreground/80">
          <li><Link to="/destinations" className="hover:text-highlight transition-colors">Destinations</Link></li>
          <li><Link to="/tours" className="hover:text-highlight transition-colors">Curated Tours</Link></li>
          <li><Link to="/about" className="hover:text-highlight transition-colors">Our Story</Link></li>
          <li><Link to="/contact" className="hover:text-highlight transition-colors">Contact</Link></li>
        </ul>
      </div>

      <div className="md:col-span-4">
        <h4 className="text-xs uppercase tracking-widest text-highlight mb-5">Letters from afar</h4>
        <p className="text-primary-foreground/70 text-sm mb-4">
          Field notes, recommendations and quiet inspiration — once a month, never more.
        </p>
        <form className="flex border border-primary-foreground/20" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-transparent px-4 py-3 text-sm placeholder:text-primary-foreground/40 focus:outline-none"
          />
          <button className="px-4 bg-accent hover:bg-highlight transition-colors" aria-label="Subscribe">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>

    <div className="border-t border-primary-foreground/10">
      <div className="container-wide py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-primary-foreground/50 uppercase tracking-wider">
        <span>© {new Date().getFullYear()} Odyssée Travel Atelier</span>
        <span>Designed in transit · Made with care</span>
      </div>
    </div>
  </footer>
);

export default Footer;
