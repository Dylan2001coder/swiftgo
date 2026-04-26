import { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", destination: "", dates: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message received", {
      description: "We'll be in touch within two working days.",
    });
    setForm({ name: "", email: "", destination: "", dates: "", message: "" });
  };

  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-16 bg-gradient-warm">
        <div className="container-wide grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="text-xs uppercase tracking-[0.3em] text-accent mb-4 block">Begin the conversation</span>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-balance">
              Tell us where your mind keeps <em>wandering off to.</em>
            </h1>
          </div>
          <div className="md:col-span-4 text-muted-foreground leading-relaxed">
            Reply within two working days. No sales pipeline, no upsells — just one of us, reading carefully.
          </div>
        </div>
      </section>

      {/* Form + info */}
      <section className="container-wide py-20 md:py-28 grid lg:grid-cols-12 gap-12 lg:gap-20">
        <form onSubmit={submit} className="lg:col-span-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Field label="Where to?" placeholder="Patagonia, Kyoto, surprise us…" value={form.destination} onChange={(v) => setForm({ ...form, destination: v })} />
            <Field label="When?" placeholder="Spring 2026, flexible" value={form.dates} onChange={(v) => setForm({ ...form, dates: v })} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Tell us about the trip</label>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-transparent border-b border-foreground/30 focus:border-accent outline-none py-3 text-lg transition-colors resize-none"
              placeholder="The shape of trip, who you're traveling with, the kind of evenings you want…"
            />
          </div>
          <button
            type="submit"
            className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-wider hover:bg-accent transition-colors"
          >
            Send message
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <aside className="lg:col-span-4 space-y-10 lg:pl-12 lg:border-l border-border">
          <Info icon={Mail} label="Email" value="hello@odyssee.travel" />
          <Info icon={Phone} label="Phone" value="+33 1 84 88 42 12" />
          <Info icon={MapPin} label="Studio" value="Rua da Boavista 84, Lisbon" />

          <div className="pt-6 border-t border-border">
            <h3 className="font-display text-2xl mb-3">Office hours</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Monday – Friday<br />
              09:00 – 18:00 WET<br />
              <span className="text-foreground">On-trip concierge: 24/7</span>
            </p>
          </div>
        </aside>
      </section>

      {/* Bottom band */}
      <section className="bg-primary text-background">
        <div className="container-wide py-20 md:py-24 text-center">
          <p className="font-display text-3xl md:text-5xl text-balance leading-tight max-w-3xl mx-auto">
            "Somewhere, something incredible is waiting to be known."
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-highlight">— Carl Sagan</p>
        </div>
      </section>
    </>
  );
};

const Field = ({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) => (
  <div>
    <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">{label}</label>
    <input
      type={type}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border-b border-foreground/30 focus:border-accent outline-none py-3 text-lg transition-colors"
    />
  </div>
);

const Info = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div>
    <Icon className="h-5 w-5 text-accent mb-3" strokeWidth={1.4} />
    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">{label}</p>
    <p className="font-display text-2xl">{value}</p>
  </div>
);

export default Contact;
