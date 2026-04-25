import { useCallback } from "react";
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';

import { Location } from "@/types/Location";
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
    location: Location
}

const TrackLocation = ({ location }: Props) => {
    const lat = parseFloat(location.latitude);
    const lng = parseFloat(location.longitude);

    const openMap = useCallback(() => {
        const label = encodeURIComponent(location.name)
        const url = Platform.select({
            ios: `maps:?q=${label}&ll=${lat},${lng}`,
            android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`
        })
        Linking.openURL(url)
    }, [location])

    const destinationCoords = {
        latitude: lat,
        longitude: lng,
    };

    const fullAddress = [
        `${location.street} #${location.streetNumber}`,
        location.postalCode,
        location.city,
        location.state,
        location.country,
    ].filter(Boolean).join(", ");

    return (
        <View className="flex flex-col space-y-1 p-4 border-b-2 border-b-light/25" style={{ gap: 8 }}>
            <Text className="text-sm text-dark font-semibold">
                Detalles de envio
            </Text>

            {/* Contenedor del Mapa Nativo */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{ ...destinationCoords, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                >
                    <Marker
                        coordinate={destinationCoords}
                        title="Destino de envío"
                        description={location.details}
                        pinColor="red"
                    />
                </MapView>
            </View>

            {/* Detalles de ubicacion */}
            <View className="flex flex-row justify-between items-center">
                <View className="flex flex-row items-center" style={{ gap: 4 }}>
                    <View className="w-8 h-8 flex flex-col items-center justify-center bg-[#E4E4E4]/90 rounded-full">
                        <Ionicons name="bookmark" size={18} color="black" />
                    </View>
                    <View>
                        <Text className="text-[#080808] font-semibold">{location.name}</Text>
                        <Text numberOfLines={1} className="text-text text-[10px]">{location.details}</Text>
                    </View>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={openMap} className="bg-[#080808] w-fit py-1 px-4 flex flex-col items-center justify-center rounded-full shadow-2xl h-[28px]">
                    <Text className="text-white">Ver</Text>
                </TouchableOpacity>
            </View>
            <Text numberOfLines={2} className="text-text">{fullAddress}</Text>
        </View>
    );
}

// Estilos para el contenedor y el mapa
const styles = StyleSheet.create({
    mapContainer: {
        height: 200, // Altura del mapa
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden', // Para bordes redondeados
        marginTop: 8,
    },
    map: {
        ...StyleSheet.absoluteFillObject, // Ocupa todo el contenedor
    },
});

export default TrackLocation;