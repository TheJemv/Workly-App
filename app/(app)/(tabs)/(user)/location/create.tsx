import {
    StyleSheet,
    Alert,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    ScrollView,
    Pressable,
    Platform,
} from "react-native";
import Constants from 'expo-constants';

import React, { useEffect, useState, useMemo, useRef } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import LoadingScreen from "components/LoadingScreen";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Colors } from "lib";
import { useKeyboard } from "@react-native-community/hooks";
import { Entypo } from "@expo/vector-icons";

import { getStreetName } from "services/api/google.api";
import { GOOGLE_API_MAP } from "@env";
import { placesAutocompleteNew, placeDetailsNew } from "services/google/placesNew.api";

import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { postLocation } from "services/api/location.api";

export default function LocationCreate() {
    const router = useRouter();

    const [userLocation, setUserLocation] = useState<any>(null);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingSave, setLoadingSave] = useState<boolean>(false);

    // Search state
    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState<
        { placeId: string; mainText: string; secondaryText: string; fullText: string }[]
    >([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchDebounceRef = useRef<any>(null);

    const [data, setData] = useState({
        name: "Mi ubicacion",
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

    const keyboard = useKeyboard();
    const snapPoints = useMemo(() => ["35%", "80%"], []);

    const handleSubmit = async () => {
        if (!data.name || !data.details || !selectedLocation) return alert("Faltan datos para Guardar la ubicacion, como el alias o detalles.");
        try {
            setLoadingSave(true)
            const postData = {
                ...data,
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
            };

            await postLocation(postData).then((e) => {
                if (router.canGoBack()) router.back()
            })
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingSave(false)
        }
    };

    // --- Autocomplete (New) ---
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
            console.log("Autocomplete(New) FAIL:", e?.message ?? e);
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
                {
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.002,
                    longitudeDelta: 0.002,
                },
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
        if (keyboard.keyboardShown) bottomSheetRef.current?.snapToIndex(1);
        else bottomSheetRef.current?.snapToIndex(0);
    }, [keyboard.keyboardShown]);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permiso denegado", "Necesitamos acceso a tu ubicación");
                setLoading(false);
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            const userCoords = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            };

            setUserLocation(userCoords);
            setSelectedLocation(userCoords);

            const getAddress = await getStreetName(userCoords.latitude, userCoords.longitude);
            if (getAddress) {
                setData((prev) => ({
                    ...prev,
                    country: getAddress.country || "",
                    state: getAddress.state || "",
                    city: getAddress.city || "",
                    postalCode: getAddress.postalCode || "",
                    neighborhood: getAddress.neighborhood || "",
                    street: getAddress.street || "",
                    streetNumber: getAddress.streetNumber || "",
                }));
                setSearchText(getAddress.formatted || "");
            }

            setLoading(false);
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
            {/* Oculta header nativo */}
            <Stack.Screen options={{ headerShown: false }} />

            {/* HEADER CUSTOM (nativo-like) */}
            <SafeAreaView edges={["top"]} style={styles.headerSafe}>
                {Platform.OS === "ios" ? (
                    <View style={styles.headerContainer}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.pillBtn} activeOpacity={0.75}>
                                <Entypo name="chevron-left" size={20} color={Colors.principal.DEFAULT} />
                            </TouchableOpacity>

                            <View style={styles.searchWrap}>
                                <TextInput
                                    value={searchText}
                                    onChangeText={onChangeSearch}
                                    placeholder="Buscar ubicación..."
                                    placeholderTextColor="#666"
                                    style={styles.searchInput}
                                    onFocus={() => {
                                        if (suggestions.length > 0) setShowSuggestions(true);
                                    }}
                                />
                            </View>

                            <TouchableOpacity onPress={handleSubmit} style={styles.pillBtn} activeOpacity={0.75}>
                                <Entypo name="save" size={18} color={Colors.principal.DEFAULT} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.headerContainer, styles.headerAndroid]}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.pillBtn} activeOpacity={0.75}>
                                <Entypo name="chevron-left" size={20} color={Colors.principal.DEFAULT} />
                                <Text style={styles.pillText}>Atrás</Text>
                            </TouchableOpacity>

                            <View style={styles.searchWrap}>
                                <TextInput
                                    value={searchText}
                                    onChangeText={onChangeSearch}
                                    placeholder="Buscar ubicación..."
                                    placeholderTextColor="#666"
                                    style={styles.searchInput}
                                    onFocus={() => {
                                        if (suggestions.length > 0) setShowSuggestions(true);
                                    }}
                                />
                            </View>

                            <TouchableOpacity onPress={handleSubmit} style={styles.pillBtn} activeOpacity={0.75}>
                                <Entypo name="save" size={18} color={Colors.principal.DEFAULT} />
                                <Text style={styles.pillText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </SafeAreaView>

            {/* Backdrop para que el mapa NO reciba toques cuando hay dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <Pressable style={styles.backdrop} onPress={() => setShowSuggestions(false)} />
            )}

            {/* Dropdown REAL (fuera del header nativo), ahora sí clickeable */}
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
                // cuando hay dropdown, bloquea interacción
                onPress={handleMapPress}
            >
                <Marker coordinate={selectedLocation} pinColor={Colors.principal.DEFAULT} />

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
            >
                <KeyboardAvoidingView className="flex-1" behavior="padding" keyboardVerticalOffset={90}>
                    <BottomSheetScrollView
                        style={styles.contentContainer}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Alias</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="alias"
                                value={data.name}
                                onChangeText={(e) => setData({ ...data, name: e })}
                                onFocus={() => bottomSheetRef.current?.snapToIndex(1)}
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Detalles del lugar</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="detalles"
                                value={data.details}
                                onChangeText={(e) => setData({ ...data, details: e })}
                                onFocus={() => bottomSheetRef.current?.snapToIndex(1)}
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Pais</Text>
                            <TextInput value={data.country} style={styles.input} placeholder="pais" editable={false} />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Estado</Text>
                            <TextInput value={data.state} style={styles.input} placeholder="estado" editable={false} />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Ciudad</Text>
                            <TextInput value={data.city} style={styles.input} placeholder="ciudad" editable={false} />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Codigo Postal</Text>
                            <TextInput value={data.postalCode} style={styles.input} placeholder="codigo postal" editable={false} />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Fraccionamiento</Text>
                            <TextInput value={data.neighborhood} style={styles.input} placeholder="fraccionamiento" editable={false} />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Calle</Text>
                            <TextInput value={data.street} style={styles.input} placeholder="calle" editable={false} />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Numero</Text>
                            <TextInput value={data.streetNumber} style={styles.input} placeholder="numero" editable={false} />
                        </View>
                    </BottomSheetScrollView>
                </KeyboardAvoidingView>
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1, marginBottom: 120 },

    // Header custom
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
    headerAndroid: {
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#00000010",
        elevation: 6,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        height: 40,
    },
    pillBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        height: 42,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.85)",
        borderWidth: 1,
        borderColor: "#00000012",
    },
    pillText: {
        fontSize: 13,
        fontWeight: "700",
        color: Colors.principal.DEFAULT,
    },
    searchWrap: {
        flex: 1,
        height: 40,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.92)",
        borderWidth: 1,
        borderColor: "#00000012",
        paddingHorizontal: 10,
        justifyContent: "center",
    },
    searchInput: {
        fontSize: 14,
        paddingVertical: 0,
        height: 42,
    },

    // Dropdown
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9998,
        backgroundColor: "transparent",
    },
    suggestionsOverlay: {
        position: "absolute",
        top: 40 + Constants.statusBarHeight + 12, // queda debajo del header (safe + padding). Si ves que tapa, súbele a 96.
        left: 12,
        right: 12,
        zIndex: 9999,
        elevation: 20,
        backgroundColor: "#fff",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#00000010",
        overflow: "hidden",
    },
    suggestionItem: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#00000008",
    },
    suggestionMain: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111",
    },
    suggestionSecondary: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },

    // BottomSheet content
    contentContainer: { flex: 1, paddingHorizontal: 12 },
    scrollContent: { paddingTop: 8, paddingBottom: 100 },
    inputWrapper: { width: "100%", marginBottom: 16 },
    label: {
        color: Colors.principal.DEFAULT,
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 6,
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderColor: "#04040410",
        borderWidth: 1,
        backgroundColor: "#fff",
        fontSize: 16,
    },
});