import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/destinations", label: "Destinations" },
  { to: "/tours", label: "Tours" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const onHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const transparent = onHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent"
          : "bg-background/80 backdrop-blur-xl border-b border-border/60"
      )}
    >
      <div className="container-wide flex items-center justify-between h-20">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-2 font-display text-2xl tracking-tight transition-colors",
            transparent ? "text-background" : "text-foreground"
          )}
        >
          <Compass className="h-5 w-5" strokeWidth={1.5} />
          <span>Odyssée</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative px-4 py-2 text-sm tracking-wide uppercase transition-colors duration-300",
                  transparent ? "text-background/90 hover:text-background" : "text-foreground/70 hover:text-foreground",
                  isActive && (transparent ? "text-background" : "text-foreground")
                )
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={cn(
                      "absolute left-4 right-4 -bottom-0.5 h-px origin-left transition-transform duration-500",
                      transparent ? "bg-background" : "bg-accent",
                      isActive ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/contact"
          className={cn(
            "hidden md:inline-flex items-center text-sm uppercase tracking-wider px-5 py-2.5 border transition-all duration-500",
            transparent
              ? "border-background/40 text-background hover:bg-background hover:text-primary"
              : "border-foreground/20 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
          )}
        >
          Plan a trip
        </Link>

        <button
          className={cn("md:hidden p-2", transparent ? "text-background" : "text-foreground")}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden bg-background border-b border-border transition-all duration-500",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="container-wide flex flex-col py-6 gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "py-3 text-lg font-display border-b border-border/50 transition-colors",
                  isActive ? "text-accent" : "text-foreground"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="mt-4 text-center bg-primary text-primary-foreground py-3 text-sm uppercase tracking-wider"
          >
            Plan a trip
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
