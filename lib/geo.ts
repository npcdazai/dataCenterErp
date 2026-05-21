/**
 * Lat/lng for the cities used in mock data. Used to render real map markers
 * via OpenStreetMap. Add new entries as needed — fallback is Mumbai.
 */
export const CITY_COORDS: Record<string, [number, number]> = {
  Mumbai: [19.076, 72.8777],
  Bhiwandi: [19.2967, 73.0631],
  Pune: [18.5204, 73.8567],
  Bengaluru: [12.9716, 77.5946],
  Bangalore: [12.9716, 77.5946],
  Delhi: [28.6139, 77.209],
  "Delhi NCR": [28.6139, 77.209],
  Gurugram: [28.4595, 77.0266],
  Noida: [28.5355, 77.391],
  Chennai: [13.0827, 80.2707],
  Hyderabad: [17.385, 78.4867],
  Kolkata: [22.5726, 88.3639],
  Ahmedabad: [23.0225, 72.5714],
  Surat: [21.1702, 72.8311],
  Jaipur: [26.9124, 75.7873],
  Kochi: [9.9312, 76.2673],
  Lucknow: [26.8467, 80.9462],
  Indore: [22.7196, 75.8577],
  Chandigarh: [30.7333, 76.7794],
  Coimbatore: [11.0168, 76.9558],
  Visakhapatnam: [17.6868, 83.2185],
  Patna: [25.5941, 85.1376],
  Bhubaneswar: [20.2961, 85.8245]
};

const STATE_FALLBACK: Record<string, [number, number]> = {
  Maharashtra: [19.6, 75.55],
  Karnataka: [14.5, 75.7],
  Delhi: [28.6139, 77.209],
  "Tamil Nadu": [11.1, 78.65],
  Gujarat: [22.25, 71.15],
  Telangana: [18.1, 79.0],
  "West Bengal": [22.95, 87.85],
  Rajasthan: [27.0, 74.2],
  Kerala: [10.85, 76.27],
  Haryana: [29.05, 76.08]
};

/**
 * Resolve a free-form location string (e.g. "Pune, Maharashtra" or
 * "Warehouse · Bhiwandi") to a lat/lng. Falls back to Mumbai.
 */
export function resolveCoords(location: string): [number, number] {
  // Try exact city names
  for (const city of Object.keys(CITY_COORDS)) {
    if (location.toLowerCase().includes(city.toLowerCase())) {
      return CITY_COORDS[city];
    }
  }
  // Try state fallback
  for (const state of Object.keys(STATE_FALLBACK)) {
    if (location.toLowerCase().includes(state.toLowerCase())) {
      return STATE_FALLBACK[state];
    }
  }
  return CITY_COORDS.Mumbai;
}
