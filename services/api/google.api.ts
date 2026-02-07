import { GOOGLE_API_MAP } from "@env";
export type ReverseGeocodeResult = {
   street?: string;
   streetNumber?: string;
   neighborhood?: string;
   city?: string;
   state?: string;
   country?: string;
   postalCode?: string;
   formatted?: string;
};

const GOOGLE_GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const pick = (components: any[], type: string) =>
   components?.find((c) => Array.isArray(c.types) && c.types.includes(type));

export const getStreetName = async (
   latitude: number,
   longitude: number
): Promise<ReverseGeocodeResult | null> => {
   try {
      const apiKey = GOOGLE_API_MAP;
      console.log(apiKey)
      if (!apiKey) throw new Error("Falta GOOGLE_API_MAP");

      const url =
         `${GOOGLE_GEOCODING_URL}?latlng=${latitude},${longitude}` +
         `&key=${encodeURIComponent(apiKey)}` +
         `&language=es`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.status !== "OK" || !Array.isArray(data.results) || data.results.length === 0) {
         return null;
      }

      const best = data.results[0];
      const comps = best.address_components ?? [];

      const route = pick(comps, "route")?.long_name;
      const streetNumber = pick(comps, "street_number")?.long_name;
      const neighborhood =
         pick(comps, "sublocality_level_1")?.long_name ||
         pick(comps, "sublocality")?.long_name ||
         pick(comps, "neighborhood")?.long_name;
      const city =
         pick(comps, "locality")?.long_name ||
         pick(comps, "administrative_area_level_2")?.long_name;
      const state = pick(comps, "administrative_area_level_1")?.long_name;
      const country = pick(comps, "country")?.long_name;
      const postalCode = pick(comps, "postal_code")?.long_name;

      return {
         street: route,
         streetNumber,
         neighborhood,
         city,
         state,
         country,
         postalCode,
         formatted: best.formatted_address,
      };
   } catch (error: any) {
      throw new Error(error?.message ?? "Error en geocodificación inversa");
   }
};

// Nueva función: Dirección → Coordenadas (Geocoding)
export const getCoordinatesFromAddress = async (
   address: string
): Promise<{ latitude: number; longitude: number } | null> => {
   try {
      const apiKey = process.env.GOOGLE_API_MAP;
      if (!apiKey) throw new Error("Falta GOOGLE_API_MAP");

      const url =
         `${GOOGLE_GEOCODING_URL}?address=${encodeURIComponent(address)}` +
         `&key=${encodeURIComponent(apiKey)}` +
         `&language=es`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.status !== "OK" || !Array.isArray(data.results) || data.results.length === 0) {
         return null;
      }

      const location = data.results[0].geometry.location;

      return {
         latitude: location.lat,
         longitude: location.lng,
      };
   } catch (error: any) {
      console.error('Error en geocodificación:', error?.message);
      return null;
   }
};