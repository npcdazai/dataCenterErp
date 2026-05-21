"use client";

import { useEffect, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap
} from "react-leaflet";
import L from "leaflet";
import { resolveCoords } from "@/lib/geo";

// Fix default Leaflet marker icons in bundlers (otherwise broken paths).
const defaultIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Props {
  origin: string;
  destination: string;
  delivered?: boolean;
}

function FitToRoute({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);
  return null;
}

export function ShipmentMap({ origin, destination, delivered }: Props) {
  const [tileVariant, setTileVariant] = useState<"light" | "dark">("light");

  // React to current theme using the .dark class on <html>
  useEffect(() => {
    const update = () =>
      setTileVariant(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    return () => observer.disconnect();
  }, []);

  const from = resolveCoords(origin);
  const to = resolveCoords(destination);
  const points: [number, number][] = [from, to];

  const tileUrl =
    tileVariant === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <MapContainer
      center={from}
      zoom={6}
      scrollWheelZoom={false}
      className="z-0 h-full w-full"
      style={{ minHeight: "100%", background: "transparent" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={tileUrl}
      />

      {/* Route line */}
      <Polyline
        positions={points}
        pathOptions={{
          color: delivered ? "#10b981" : "#6366f1",
          weight: 3,
          dashArray: "6 8",
          opacity: 0.95,
          lineCap: "round"
        }}
      />

      {/* Origin pin */}
      <Marker position={from} icon={defaultIcon}>
        <Popup>
          <div className="text-xs font-semibold">Origin</div>
          <div className="text-xs">{origin}</div>
        </Popup>
      </Marker>

      {/* Destination — pulsing circle marker */}
      <CircleMarker
        center={to}
        radius={9}
        pathOptions={{
          color: delivered ? "#10b981" : "#f59e0b",
          fillColor: delivered ? "#10b981" : "#f59e0b",
          fillOpacity: 0.9,
          weight: 3
        }}
      >
        <Popup>
          <div className="text-xs font-semibold">Destination</div>
          <div className="text-xs">{destination}</div>
        </Popup>
      </CircleMarker>

      <FitToRoute points={points} />
    </MapContainer>
  );
}
