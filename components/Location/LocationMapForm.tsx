import {
    StyleSheet,
    Alert,
    Text,
    View,
    TextInput as RNTextInput,
    TouchableOpacity,
    Pressable,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import Constants from 'expo-constants';

import React, { useEffect, useMemo, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as ExpoLocation from "expo-location";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Colors } from "lib";
import { Entypo } from "@expo/vector-icons";

import { getStreetName } from "services/api/google.api";
import { GOOGLE_API_MAP } from "@env";
import { placesAutocompleteNew, placeDetailsNew } from "services/google/placesNew.api";
import { getUserMessage } from "services/api/errors";

import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import LoadingScreen from "components/LoadingScreen";
import SpinLoading from "components/SpinLoading";
import { TextInput as FieldInput } from "components/Profile/Billing/components/text-input";
import { Container, CardInfo, CardContent, Row } from "components/CardInfo";

export type LocationFormValues = {
    name: string;
    details: string;
    country: string;
    state: string;
    city: string;
    postalCode: string;
    neighborhood: string;
    street: string;
    streetNumber: string;
};

export type LocationSubmitPayload = LocationFormValues & {
    latitude: number;
    longitude: number;
};

type Coords = { latitude: number; longitude: number };

type Props = {
    /** "Nueva dirección" / "Nueva sucursal". Título del bloque de datos. */
    formTitle?: string;
    nameLabel?: string;
    namePlaceholder?: string;
    defaultName?: string;
    detailsLabel?: string;
    detailsPlaceholder?: string;
    searchPlaceholder?: string;
    /** Validación extra (rangos del backend). Devuelve el mensaje de error, o null si pasa. */
    validate?: (data: LocationFormValues) => string | null;
    onSubmit: (payload: LocationSubmitPayload) => Promise<void>;
};

/**
 * Mapa + buscador (Google Places) + form de dirección, reusado por la
 * dirección del cliente (`/location`) y por las sucursales de la empresa
 * (`/company/locations`) — mismo shape de campos en las dos.
 */
export default function LocationMapForm({
    formTitle = "Datos del lugar",
    nameLabel = "Alias",
    namePlaceholder = "Ej. Casa, Oficina",
    defaultName = "Mi ubicacion",
    detailsLabel = "Detalles del lugar",
    detailsPlaceholder = "Ej. Casa azul, portón negro",
    searchPlaceholder = "Buscar ubicación...",
    validate,
    onSubmit,
}: Props) {
    const router = useRouter();

    const [userLocation, setUserLocation] = useState<Coords | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Coords | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingSave, setLoadingSave] = useState<boolean>(false);

    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState<
        { placeId: string; mainText: string; secondaryText: string; fullText: string }[]
    >([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchDebounceRef = useRef<any>(null);

    const [data, setData] = useState<LocationFormValues>({
        name: defaultName,
        details: "",
        country: "",
        state: "",
        city: "",
        postalCode: "",
        neighborhood: "",
        street: "",
        streetNumber: "",
    });

    const bottomSheetRef = useRef<BottomSheet>(null);
    const mapRef = useRef<MapView>(null);
    const snapPoints = useMemo(() => ["40%", "82%"], []);

    const handleSubmit = async () => {
        if (!data.name.trim() || !data.details.trim() || !selectedLocation) {
            Alert.alert("Faltan datos", `Completa ${nameLabel.toLowerCase()}, los detalles, y elige un punto en el mapa.`);
            return;
        }

        const validationError = validate?.(data);
        if (validationError) {
            Alert.alert("Revisa los datos", validationError);
            return;
        }

        try {
            setLoadingSave(true);
            await onSubmit({
                ...data,
                name: data.name.trim(),
                details: data.details.trim(),
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
            });
        } catch (error) {
            Alert.alert("Error", getUserMessage(error));
        } finally {
            setLoadingSave(false);
        }
    };

    // --- Autocomplete (Google Places New) ---
    const runSearch = async (text: string) => {
        try {
            const list = await placesAutocompleteNew({
                input: text,
                apiKey: GOOGLE_API_MAP,
                includedRegionCodes: ["mx"],
                languageCode: "es",
            });

            setSuggestions(list);
            setShowSuggestions(true);
        } catch (e: any) {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const onChangeSearch = (text: string) => {
        setSearchText(text);

        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

        const clean = text.trim();
        if (clean.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        searchDebounceRef.current = setTimeout(() => {
            runSearch(clean);
        }, 250);
    };

    const handleSelectSuggestion = async (item: { placeId: string; fullText: string }) => {
        try {
            setShowSuggestions(false);
            setSuggestions([]);
            setSearchText(item.fullText);

            const details = await placeDetailsNew({ placeId: item.placeId, apiKey: GOOGLE_API_MAP });
            const lat = details.latitude;
            const lng = details.longitude;

            if (typeof lat !== "number" || typeof lng !== "number") return;

            setSelectedLocation({ latitude: lat, longitude: lng });

            mapRef.current?.animateToRegion(
                { latitude: lat, longitude: lng, latitudeDelta: 0.002, longitudeDelta: 0.002 },
                1000
            );

            const address = await getStreetName(lat, lng);
            if (address) {
                setData((prev) => ({
                    ...prev,
                    country: address.country || "",
                    state: address.state || "",
                    city: address.city || "",
                    postalCode: address.postalCode || "",
                    neighborhood: address.neighborhood || "",
                    street: address.street || "",
                    streetNumber: address.streetNumber || "",
                }));
            }
        } catch (e: any) {
            console.log("Select place FAIL:", e?.message ?? e);
        }
    };

    useEffect(() => {
        (async () => {
            const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permiso denegado", "Necesitamos acceso a tu ubicación");
                setLoading(false);
                return;
            }

            try {
                const currentLocation = await ExpoLocation.getCurrentPositionAsync({
                    accuracy: ExpoLocation.Accuracy.Balanced,
                });

                const userCoords = {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                };

                setUserLocation(userCoords);
                setSelectedLocation(userCoords);

                const getAddress = await getStreetName(userCoords.latitude, userCoords.longitude);
                if (getAddress) {
                    setData((prev) => ({ ...prev, ...getAddress }));
                    setSearchText(getAddress.formatted || "");
                }
            } catch (error) {
                const lastLocation = await ExpoLocation.getLastKnownPositionAsync();
                if (lastLocation) {
                    const userCoords = {
                        latitude: lastLocation.coords.latitude,
                        longitude: lastLocation.coords.longitude,
                    };
                    setUserLocation(userCoords);
                    setSelectedLocation(userCoords);
                } else {
                    const fallback = { latitude: 19.4326, longitude: -99.1332 };
                    setUserLocation(fallback);
                    setSelectedLocation(fallback);
                    Alert.alert("Ubicación no disponible", "Activa el GPS para mayor precisión.");
                }
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleMapPress = async (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });

        mapRef.current?.animateToRegion(
            { latitude, longitude, latitudeDelta: 0.002, longitudeDelta: 0.002 },
            500
        );

        const newAddress = await getStreetName(latitude, longitude);
        if (newAddress) {
            setData((prev) => ({
                ...prev,
                country: newAddress.country || "",
                state: newAddress.state || "",
                city: newAddress.city || "",
                postalCode: newAddress.postalCode || "",
                neighborhood: newAddress.neighborhood || "",
                street: newAddress.street || "",
                streetNumber: newAddress.streetNumber || "",
            }));
            setSearchText(newAddress.formatted || "");
        }
    };

    if (loading || !userLocation || !selectedLocation) return <LoadingScreen />;

    const mapRegion = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView edges={["top"]} style={styles.headerSafe}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.pillBtn} activeOpacity={0.75}>
                            <Entypo name="chevron-left" size={20} color={Colors.principal.DEFAULT} />
                        </TouchableOpacity>

                        <View style={styles.searchWrap}>
                            <RNTextInput
                                value={searchText}
                                onChangeText={onChangeSearch}
                                placeholder={searchPlaceholder}
                                placeholderTextColor="#8a8a8f"
                                style={styles.searchInput}
                                onFocus={() => {
                                    if (suggestions.length > 0) setShowSuggestions(true);
                                }}
                            />
                        </View>

                        <TouchableOpacity
                            disabled={loadingSave}
                            onPress={handleSubmit}
                            style={[styles.pillBtn, styles.saveBtn]}
                            activeOpacity={0.75}
                        >
                            {loadingSave ? (
                                <SpinLoading size={16} color="#fff" />
                            ) : (
                                <Entypo name="check" size={18} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            {showSuggestions && suggestions.length > 0 && (
                <Pressable style={styles.backdrop} onPress={() => setShowSuggestions(false)} />
            )}

            {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsOverlay}>
                    <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 240 }}>
                        {suggestions.map((sug) => (
                            <TouchableOpacity
                                key={sug.placeId}
                                onPress={() => handleSelectSuggestion({ placeId: sug.placeId, fullText: sug.fullText })}
                                style={styles.suggestionItem}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.suggestionMain}>{sug.mainText || sug.fullText}</Text>
                                {!!sug.secondaryText && (
                                    <Text style={styles.suggestionSecondary}>{sug.secondaryText}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <MapView
                ref={mapRef}
                showsUserLocation
                style={styles.map}
                initialRegion={mapRegion}
                showsMyLocationButton
                onPress={handleMapPress}
            >
                <Marker coordinate={selectedLocation} />

                {userLocation.latitude !== selectedLocation.latitude ||
                    userLocation.longitude !== selectedLocation.longitude ? (
                    <Polyline
                        coordinates={[userLocation, selectedLocation]}
                        strokeColor={Colors.principal.DEFAULT}
                        strokeWidth={3}
                        lineDashPattern={[5, 5]}
                    />
                ) : null}
            </MapView>

            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                android_keyboardInputMode="adjustResize"
                enableOverDrag={false}
                overDragResistanceFactor={0}
                handleIndicatorStyle={{ backgroundColor: "#d8d8dc", width: 40 }}
            >
                <KeyboardAvoidingView className="flex-1" behavior="padding" keyboardVerticalOffset={90}>
                    <BottomSheetScrollView
                        style={styles.contentContainer}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ gap: 12 }}>
                            <View
                                className="bg-white rounded-2xl border border-border-soft"
                                style={{ padding: 14, gap: 14 }}
                            >
                                <Text className="text-dark font-semibold text-[15px]">{formTitle}</Text>

                                <FieldInput
                                    label={nameLabel}
                                    placeholder={namePlaceholder}
                                    value={data.name}
                                    onChange={(v) => setData((prev) => ({ ...prev, name: v }))}
                                    maxLength={40}
                                />

                                <FieldInput
                                    label={detailsLabel}
                                    placeholder={detailsPlaceholder}
                                    value={data.details}
                                    onChange={(v) => setData((prev) => ({ ...prev, details: v }))}
                                    multiline
                                    maxLength={120}
                                />
                            </View>

                            <Container>
                                <CardInfo
                                    title="Dirección detectada"
                                    icon="map-pin"
                                    variant="heading"
                                />
                                <CardContent>
                                    <Row label="Calle y número" value={[data.street, data.streetNumber].filter(Boolean).join(" #") || "—"} />
                                    <Row label="Colonia" value={data.neighborhood || "—"} />
                                    <Row label="Ciudad" value={data.city || "—"} />
                                    <Row label="Estado" value={data.state || "—"} />
                                    <Row label="País" value={data.country || "—"} />
                                    <Row label="Código postal" value={data.postalCode || "—"} />
                                </CardContent>
                            </Container>

                            <Text className="text-text-light text-[12px] px-1">
                                Se llena sola al buscar arriba o al tocar el mapa — toca donde esté el lugar exacto.
                            </Text>
                        </View>
                    </BottomSheetScrollView>
                </KeyboardAvoidingView>
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1, marginBottom: 140 },

    headerSafe: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
    },
    headerContainer: {
        paddingHorizontal: 12,
        paddingBottom: 10,
        paddingTop: 0,
        height: 40,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        height: 44,
    },
    pillBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderWidth: 1,
        borderColor: "#00000012",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    saveBtn: {
        backgroundColor: Colors.principal.DEFAULT,
        borderColor: Colors.principal.DEFAULT,
    },
    searchWrap: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.95)",
        borderWidth: 1,
        borderColor: "#00000012",
        paddingHorizontal: 14,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        fontSize: 14,
        paddingVertical: 0,
        height: 44,
        color: "#040404",
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9998,
        backgroundColor: "transparent",
    },
    suggestionsOverlay: {
        position: "absolute",
        top: 44 + Constants.statusBarHeight + 12,
        left: 12,
        right: 12,
        zIndex: 9999,
        elevation: 20,
        backgroundColor: "#fff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#00000010",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
    },
    suggestionItem: {
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderBottomColor: "#00000008",
    },
    suggestionMain: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111",
    },
    suggestionSecondary: {
        fontSize: 12,
        color: "#717171",
        marginTop: 2,
    },

    contentContainer: { flex: 1, paddingHorizontal: 12 },
    scrollContent: { paddingTop: 4, paddingBottom: 100 },
});
