import { GOOGLE_API_MAP } from "@env";

export const getStreetName = async (latitude: number, longitude: number) => {
   try {
      const URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_API_MAP}&latlng=${latitude},${longitude}`;
      console.log(URL);
      const response = await fetch(URL);
      const data = await response.json();
      if (!data || !data.results || data.results.length === 0) {
         throw new Error("No se encontraron resultados");
      }

      const result = data.results[0];
      const addressComponents = result.address_components;

      const streetNumber =
         addressComponents.find((component) =>
            component.types.includes("street_number")
         )?.long_name || "";
      const streetName =
         addressComponents.find((component) =>
            component.types.includes("route")
         )?.long_name || "";
      const city =
         addressComponents.find((component) =>
            component.types.includes("locality")
         )?.long_name || "";
      const state =
         addressComponents.find((component) =>
            component.types.includes("administrative_area_level_1")
         )?.long_name || "";
      const country =
         addressComponents.find((component) =>
            component.types.includes("country")
         )?.long_name || "";
      const postalCode =
         addressComponents.find((component) =>
            component.types.includes("postal_code")
         )?.long_name || "";

      const fullAddress = `${streetName} ${
         "#" + streetNumber
      }, ${postalCode}, ${country}, ${state}, ${city}`;

      return fullAddress;
   } catch (error) {
      throw new Error(error.message);
   }
};
