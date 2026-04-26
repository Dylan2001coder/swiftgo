import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        body: ['"Work Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        highlight: "hsl(var(--highlight))",
        sand: "hsl(var(--sand))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        'gradient-sky': 'var(--gradient-sky)',
        'gradient-ocean': 'var(--gradient-ocean)',
        'gradient-warm': 'var(--gradient-warm)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        deep: 'var(--shadow-deep)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "plane-fly": {
          "0%": { transform: "translateX(-30vw) translateY(20px) rotate(-2deg)" },
          "50%": { transform: "translateX(40vw) translateY(-10px) rotate(0deg)" },
          "100%": { transform: "translateX(120vw) translateY(-30px) rotate(2deg)" },
        },
        "cloud-drift-slow": {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(10%)" },
        },
        "cloud-drift-fast": {
          "0%": { transform: "translateX(-20%)" },
          "100%": { transform: "translateX(20%)" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1) translate(0,0)" },
          "100%": { transform: "scale(1.08) translate(-1%, -1%)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.7s var(--transition-smooth) both",
        "fade-up": "fade-up 0.9s var(--transition-smooth) both",
        "plane-fly": "plane-fly 22s linear infinite",
        "cloud-drift-slow": "cloud-drift-slow 60s ease-in-out infinite alternate",
        "cloud-drift-fast": "cloud-drift-fast 40s ease-in-out infinite alternate",
        "ken-burns": "ken-burns 18s ease-in-out infinite alternate",
        "marquee": "marquee 40s linear infinite",
        "float": "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
