import { useState, useRef, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";

interface LocationPickerProps {
  label: string;
  value?: string;
  lat?: number;
  lon?: number;
  onLocationChange: (location: string, lat: number, lon: number) => void;
  placeholder?: string;
}

// Simple geocoding service using Nominatim (free, no API key needed)
// For production, use Google Maps API
async function geocodeLocation(query: string) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`
    );
    const results = await response.json();
    if (results.length > 0) {
      return {
        display_name: results[0].display_name,
        lat: parseFloat(results[0].lat),
        lon: parseFloat(results[0].lon),
      };
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return null;
}

export const LocationPicker = ({
  label,
  value = "",
  lat,
  lon,
  onLocationChange,
  placeholder = "Enter location or click map…",
}: LocationPickerProps) => {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = async (text: string) => {
    setInput(text);
    if (text.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            text
          )}&limit=5`
        );
        const results = await response.json();
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const location = suggestion.display_name;
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    setInput(location);
    setSuggestions([]);
    setShowSuggestions(false);
    onLocationChange(location, lat, lon);
  };

  const handleUseCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const result = await response.json();
            const location = result.display_name || `${latitude}, ${longitude}`;
            setInput(location);
            setSuggestions([]);
            setShowSuggestions(false);
            onLocationChange(location, latitude, longitude);
          } catch (error) {
            console.error("Reverse geocoding error:", error);
            setInput(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            onLocationChange(
              `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              latitude,
              longitude
            );
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <div className="relative flex items-center">
          <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-10"
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          {input && (
            <button
              type="button"
              onClick={() => {
                setInput("");
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="absolute right-3 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border border-border bg-card shadow-soft max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors text-sm border-b border-border last:border-0"
              >
                <div className="font-medium text-foreground">
                  {suggestion.display_name.split(",")[0]}
                </div>
                <div className="text-xs text-muted-foreground">
                  {suggestion.display_name.split(",").slice(1, 3).join(",")}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleUseCurrentLocation}
        className="w-full text-xs"
      >
        📍 Use my current location
      </Button>

      {lat && lon && (
        <div className="text-xs text-muted-foreground p-2 rounded-md bg-secondary">
          Coordinates: {lat.toFixed(6)}, {lon.toFixed(6)}
        </div>
      )}
    </div>
  );
};
