import santorini from "@/assets/dest-santorini.jpg";
import patagonia from "@/assets/dest-patagonia.jpg";
import maldives from "@/assets/dest-maldives.jpg";
import kyoto from "@/assets/dest-kyoto.jpg";
import iceland from "@/assets/dest-iceland.jpg";
import marrakech from "@/assets/dest-marrakech.jpg";
import type { Destination } from "@/components/DestinationCard";

export const destinations: Destination[] = [
  {
    slug: "santorini",
    name: "Santorini",
    region: "Greece · Cyclades",
    tagline: "Whitewashed cliffs, indigo domes, and sunsets that hush a crowd.",
    image: santorini,
    coords: "36.39°N 25.46°E",
  },
  {
    slug: "patagonia",
    name: "Patagonia",
    region: "Chile · Argentina",
    tagline: "Wind-carved peaks above water the color of forgotten glaciers.",
    image: patagonia,
    coords: "49.27°S 73.04°W",
  },
  {
    slug: "maldives",
    name: "Maldives",
    region: "Indian Ocean",
    tagline: "An archipelago suspended between sky and shallow turquoise.",
    image: maldives,
    coords: "3.20°N 73.22°E",
  },
  {
    slug: "kyoto",
    name: "Kyoto",
    region: "Japan · Kansai",
    tagline: "Bamboo cathedrals, tea houses, and the soft poetry of stillness.",
    image: kyoto,
    coords: "35.01°N 135.76°E",
  },
  {
    slug: "iceland",
    name: "Iceland",
    region: "North Atlantic",
    tagline: "Glacial lagoons, black sand, and a horizon that never quite ends.",
    image: iceland,
    coords: "64.96°N 19.02°W",
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    region: "Morocco · Maghreb",
    tagline: "Spice-thick alleys, terracotta walls, and cobalt courtyard light.",
    image: marrakech,
    coords: "31.63°N 7.99°W",
  },
];
