"use client";

import { useEffect, useMemo, useState } from "react";
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
import { makeTruckIcon } from "./TruckIcon";

// Default Leaflet marker (icons broken by bundlers without this)
const pinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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

function bearingBetween(
  a: [number, number],
  b: [number, number]
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const [lat1, lon1] = [toRad(a[0]), toRad(a[1])];
  const [lat2, lon2] = [toRad(b[0]), toRad(b[1])];
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function ShipmentMap({ origin, destination, delivered }: Props) {
  const [tileVariant, setTileVariant] = useState<"light" | "dark">("light");
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [truckIdx, setTruckIdx] = useState(0);

  // Theme-aware tiles
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

  const from = useMemo(() => resolveCoords(origin), [origin]);
  const to = useMemo(() => resolveCoords(destination), [destination]);

  // Fetch road geometry from OSRM (free public demo, no API key)
  useEffect(() => {
    let cancelled = false;
    async function fetchRoute() {
      try {
        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`OSRM ${res.status}`);
        const data = await res.json();
        const coords = data.routes?.[0]?.geometry?.coordinates as
          | [number, number][]
          | undefined;
        if (!cancelled && coords && coords.length) {
          // OSRM returns [lng, lat]; Leaflet wants [lat, lng]
          setRoute(coords.map(([lng, lat]) => [lat, lng] as [number, number]));
        } else if (!cancelled) {
          setRoute([from, to]);
        }
      } catch {
        if (!cancelled) setRoute([from, to]);
      }
    }
    fetchRoute();
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  // Animate truck along the route
  useEffect(() => {
    if (!route || route.length < 2) return;
    if (delivered) {
      setTruckIdx(route.length - 1);
      return;
    }
    setTruckIdx(0);
    const total = route.length;
    // ~18 seconds for a full traverse — slower & steadier than before
    const step = Math.max(120, Math.round(18_000 / total));
    const id = setInterval(() => {
      setTruckIdx((i) => (i + 1) % total);
    }, step);
    return () => clearInterval(id);
  }, [route, delivered]);

  // Heading uses a look-ahead window so short, noisy segments don't twitch the truck.
  // We pick a point ~8 nodes ahead (or the destination if near the end).
  const LOOKAHEAD = 8;
  const truckPos = route?.[truckIdx] ?? from;
  const lookIdx = route
    ? Math.min(truckIdx + LOOKAHEAD, route.length - 1)
    : 0;
  const nextPos = route?.[lookIdx] ?? to;
  const heading = bearingBetween(truckPos, nextPos);

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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a> · routing by <a href="https://project-osrm.org/">OSRM</a>'
        url={tileUrl}
      />

      {/* Routed road geometry (or straight fallback) */}
      {route && (
        <Polyline
          positions={route}
          pathOptions={{
            color: delivered ? "#10b981" : "#6366f1",
            weight: 4,
            opacity: 0.9,
            lineCap: "round"
          }}
        />
      )}

      {/* Origin pin */}
      <Marker position={from} icon={pinIcon}>
        <Popup>
          <div className="text-xs font-semibold">Origin</div>
          <div className="text-xs">{origin}</div>
        </Popup>
      </Marker>

      {/* Destination — pulsing circle */}
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

      {/* 3D truck mascot */}
      {route && route.length > 1 && (
        <Marker position={truckPos} icon={makeTruckIcon(heading)}>
          <Popup>
            <div className="text-xs font-semibold">In transit</div>
            <div className="text-xs">Heading {Math.round(heading)}°</div>
          </Popup>
        </Marker>
      )}

      {route && <FitToRoute points={route} />}
    </MapContainer>
  );
}
