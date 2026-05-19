import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const emailSchema = z.string().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "At least 8 characters").max(72);
const nameSchema = z.string().trim().min(1, "Name required").max(80);

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate("/app"); }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");

    const eRes = emailSchema.safeParse(email);
    const pRes = passwordSchema.safeParse(password);
    if (!eRes.success) return toast.error(eRes.error.issues[0].message);
    if (!pRes.success) return toast.error(pRes.error.issues[0].message);

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate("/app");
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const phone = String(fd.get("phone") ?? "");

    const nRes = nameSchema.safeParse(name);
    const eRes = emailSchema.safeParse(email);
    const pRes = passwordSchema.safeParse(password);
    if (!nRes.success) return toast.error(nRes.error.issues[0].message);
    if (!eRes.success) return toast.error(eRes.error.issues[0].message);
    if (!pRes.success) return toast.error(pRes.error.issues[0].message);

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        data: { full_name: nRes.data, phone },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created");
    navigate("/app");
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/app`,
    });
    if (result.error) toast.error("Google sign-in failed");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex relative bg-secondary p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Car className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl">SwiftGo</span>
        </Link>
        <div className="max-w-md">
          <h2 className="text-4xl font-bold leading-tight mb-4 text-foreground">Move your way.<br />Name your fare.</h2>
          <p className="text-muted-foreground text-lg">Join thousands riding and earning on the fairest ride-hailing platform.</p>
        </div>
        <p className="text-xs text-muted-foreground">© SwiftGo</p>
      </div>

      <div className="flex flex-col px-6 md:px-12 py-8 md:py-12">
        <Link to="/" className="md:hidden inline-flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="m-auto w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-2">Welcome</h1>
          <p className="text-muted-foreground mb-8">Sign in or create an account to start riding.</p>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 rounded-full">
              <TabsTrigger value="signin" className="rounded-full">Sign in</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="si-pass">Password</Label>
                  <Input id="si-pass" name="password" type="password" required />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="su-name">Full name</Label>
                  <Input id="su-name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-phone">Phone (optional)</Label>
                  <Input id="su-phone" name="phone" type="tel" placeholder="+233…" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-pass">Password</Label>
                  <Input id="su-pass" name="password" type="password" required minLength={8} />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {loading ? "Creating account…" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3 text-xs uppercase text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" onClick={handleGoogle} className="w-full h-11 rounded-full">
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
