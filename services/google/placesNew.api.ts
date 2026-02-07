// services/api/placesNew.api.ts
type AutocompleteSuggestion = {
    placePrediction?: {
        placeId?: string;
        text?: { text?: string };
        structuredFormat?: {
            mainText?: { text?: string };
            secondaryText?: { text?: string };
        };
    };
};

export async function placesAutocompleteNew(params: {
    input: string;
    apiKey: string;
    languageCode?: string;
    includedRegionCodes?: string[];
}) {
    const { input, apiKey, languageCode = "es", includedRegionCodes = ["mx"] } = params;
    if (!input?.trim()) return [];

    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
                "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat",
        },
        body: JSON.stringify({
            input,
            languageCode,
            includedRegionCodes,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(`Autocomplete(New) error: ${JSON.stringify(data)}`);
    }

    const suggestions: AutocompleteSuggestion[] = data?.suggestions ?? [];
    return suggestions
        .map((s) => ({
            placeId: s?.placePrediction?.placeId ?? "",
            // Texto bonito:
            mainText: s?.placePrediction?.structuredFormat?.mainText?.text
                ?? s?.placePrediction?.text?.text
                ?? "",
            secondaryText: s?.placePrediction?.structuredFormat?.secondaryText?.text ?? "",
            fullText: s?.placePrediction?.text?.text ?? "",
        }))
        .filter((x) => x.placeId && (x.mainText || x.fullText));
}

export async function placeDetailsNew(params: { placeId: string; apiKey: string }) {
    const { placeId, apiKey } = params;

    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(
        placeId
    )}?fields=location,formattedAddress`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "X-Goog-Api-Key": apiKey,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(`PlaceDetails(New) error: ${JSON.stringify(data)}`);
    }

    // location: { latitude, longitude }
    return {
        latitude: data?.location?.latitude,
        longitude: data?.location?.longitude,
        formattedAddress: data?.formattedAddress ?? "",
    };
}