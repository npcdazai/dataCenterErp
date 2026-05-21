import L from "leaflet";

/**
 * Isometric 3D-style truck SVG. Faces RIGHT (east) by default so we can
 * rotate it by `bearing - 90` to align with the direction of travel.
 */
const TRUCK_SVG = `
<svg viewBox="0 0 88 56" xmlns="http://www.w3.org/2000/svg">
  <!-- Soft shadow on the ground -->
  <ellipse cx="44" cy="50" rx="36" ry="4" fill="#000" opacity="0.22"/>

  <!-- Trailer: front face -->
  <path d="M 6 18 L 6 40 L 50 40 L 50 18 Z" fill="#cbd5e1"/>
  <!-- Trailer: top face (isometric) -->
  <path d="M 6 18 L 14 10 L 58 10 L 50 18 Z" fill="#e2e8f0"/>
  <!-- Trailer: side panel (right) -->
  <path d="M 50 18 L 58 10 L 58 32 L 50 40 Z" fill="#94a3b8"/>
  <!-- Trailer panel detail -->
  <path d="M 14 22 L 14 36 L 44 36 L 44 22 Z" fill="none" stroke="#94a3b8" stroke-width="0.8"/>
  <line x1="29" y1="22" x2="29" y2="36" stroke="#94a3b8" stroke-width="0.8"/>

  <!-- Cab: front face -->
  <path d="M 50 22 L 50 40 L 76 40 L 76 26 L 68 22 Z" fill="#6366f1"/>
  <!-- Cab: top face -->
  <path d="M 50 22 L 58 14 L 76 14 L 76 26 L 68 22 Z" fill="#818cf8"/>
  <!-- Cab: side -->
  <path d="M 76 14 L 76 40 L 82 32 L 82 18 Z" fill="#4f46e5"/>

  <!-- Windshield -->
  <path d="M 52 26 L 64 26 L 66 32 L 52 32 Z" fill="#bae6fd"/>
  <!-- Door window -->
  <rect x="56" y="30" width="6" height="6" fill="#bae6fd" opacity="0.7" rx="0.5"/>

  <!-- Headlight -->
  <circle cx="74" cy="36" r="1.4" fill="#fde68a"/>

  <!-- Wheels -->
  <circle cx="16" cy="42" r="4" fill="#0f172a"/>
  <circle cx="16" cy="42" r="1.5" fill="#94a3b8"/>
  <circle cx="38" cy="42" r="4" fill="#0f172a"/>
  <circle cx="38" cy="42" r="1.5" fill="#94a3b8"/>
  <circle cx="64" cy="42" r="4" fill="#0f172a"/>
  <circle cx="64" cy="42" r="1.5" fill="#94a3b8"/>
</svg>
`;

export function makeTruckIcon(bearingDeg: number) {
  // SVG faces east; bearing 0 = north → rotate(bearing - 90).
  // No vertical flip — the flip was causing the truck to mirror itself
  // whenever the route curved across the 90°/270° boundary, which read as wobble.
  const rotation = bearingDeg - 90;
  return L.divIcon({
    className: "truck-icon",
    html: `<div style="transform: rotate(${rotation}deg); transform-origin: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));" class="truck-mascot">${TRUCK_SVG}</div>`,
    iconSize: [56, 36],
    iconAnchor: [28, 28]
  });
}
