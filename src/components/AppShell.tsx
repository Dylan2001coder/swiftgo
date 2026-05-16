import { Link, NavLink, useNavigate } from "react-router-dom";
import { Car, History, LayoutDashboard, LogOut, Menu, Phone, Navigation2, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isDriver = roles.includes("driver");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { to: "/app", icon: LayoutDashboard, label: "Home", end: true },
    { to: "/app/request", icon: Car, label: "Request ride" },
    ...(isDriver ? [{ to: "/app/drive", icon: Navigation2, label: "Drive" }] : []),
    { to: "/app/history", icon: History, label: "History" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container-wide flex items-center justify-between h-16">
          <Link to="/app" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Car className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight">SwiftGo</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )
                }
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden lg:inline">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="container-wide py-4 flex flex-col gap-1">
              {navItems.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                      isActive ? "bg-foreground text-background" : "text-foreground hover:bg-secondary"
                    )
                  }
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </NavLink>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-secondary text-left"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </nav>
          </div>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
};

export default AppShell;
