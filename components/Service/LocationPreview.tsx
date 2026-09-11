import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Linking, Platform, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import { Colors } from "lib";
import type { LocationLike } from "@/types/Location";

// Acepta tanto una dirección de cliente (`Location`) como una sucursal de
// empresa (`CompanyLocation`) — mismo shape de campos en ambas.
type Props = { location: LocationLike };

/**
 * Vista previa de una ubicación (mapa + dirección + botón "Ver"), pensada para ir
 * dentro de un <CardContent>. Mismo lenguaje visual que el resto del checkout.
 */
export default function LocationPreview({ location }: Props) {
    const lat = parseFloat(location.latitude);
    const lng = parseFloat(location.longitude);
    const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

    const coords = { latitude: lat, longitude: lng };

    const openMap = useCallback(() => {
        if (!hasCoords) return;
        const label = encodeURIComponent(location.name);
        const url = Platform.select({
            ios: `maps:?q=${label}&ll=${lat},${lng}`,
            android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
            default: `https://maps.google.com/?q=${lat},${lng}`,
        });
        if (url) Linking.openURL(url);
    }, [hasCoords, lat, lng, location.name]);

    const fullAddress = [
        [location.street, location.streetNumber].filter(Boolean).join(" "),
        location.neighborhood,
        location.postalCode,
        location.city,
        location.state,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <View className="p-3" style={{ gap: 10 }}>
            {hasCoords && (
                <View style={styles.mapContainer}>
                    <MapView
                        style={StyleSheet.absoluteFillObject}
                        initialRegion={{ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        pointerEvents="none"
                    >
                        <Marker coordinate={coords} pinColor={Colors.principal.DEFAULT} />
                    </MapView>
                </View>
            )}

            <View className="flex-row items-center justify-between" style={{ gap: 8 }}>
                <View className="flex-row items-center flex-1" style={{ gap: 8 }}>
                    <View
                        className="items-center justify-center rounded-full"
                        style={{ width: 32, height: 32, backgroundColor: Colors.principal[100] }}
                    >
                        <Feather name="map-pin" size={15} color={Colors.principal.DEFAULT} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-semibold" style={{ color: "#040404" }} numberOfLines={1}>
                            {location.name}
                        </Text>
                        {location.details ? (
                            <Text className="text-xs" style={{ color: "#717171" }} numberOfLines={1}>
                                {location.details}
                            </Text>
                        ) : null}
                    </View>
                </View>

                {hasCoords && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={openMap}
                        className="py-1.5 px-4 rounded-full"
                        style={{ backgroundColor: Colors.principal.DEFAULT }}
                    >
                        <Text className="text-white text-xs font-semibold">Ver</Text>
                    </TouchableOpacity>
                )}
            </View>

            {fullAddress ? (
                <Text className="text-xs" style={{ color: "#717171" }} numberOfLines={2}>
                    {fullAddress}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        height: 150,
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
    },
});
