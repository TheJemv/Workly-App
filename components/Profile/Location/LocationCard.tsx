import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import MapView, { Marker } from 'react-native-maps'

import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { Colors } from 'lib'
import { delLocation } from 'services/api/location.api'

interface Location {
    id: string
    name: string
    details: string

    latitude: number
    longitude: number

    street: string
    streetNumber: string
    neighborhood: string
    city: string
    state: string
    postalCode: string
}
interface Props {
    location: Location,
    deleteLocation: (location: string) => Promise<void>
}

const toStreet = (location: Location) => `${location.street} #${location.streetNumber}, ${location.postalCode} ${location.neighborhood}, ${location.city}, ${location.state}`
export default function LocationCard({ location, deleteLocation }: Props) {
    const handleDelete = () => {
        Alert.alert("Eliminar", `¿Estás seguro de eliminar la ubicacion "${location.name}"?`, [
            {
                text: "Cancelar",
                style: "cancel",
            },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => await deleteLocation(location.id)
            },
        ]);
    }
    return (
        <View className='flex-1 flex flex-col gap-4 shadow-lg' key={location.id}>
            <View style={{ gap: 8 }} className='flex flex-row bg-white rounded-lg overflow-hidden'>
                <MapView
                    style={{ width: 130, height: 90 }}
                    region={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.002,
                        longitudeDelta: 0.002,
                    }}
                >
                    <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} pinColor={Colors.principal.DEFAULT} />
                </MapView>

                <View className='py-[0.5] flex-1 flex flex-row '>
                    <View className='flex flex-col flex-1 justify-between h-full py-5'>
                        <View className='flex flex-row items-center gap-1'>
                            <FontAwesome5 name="location-arrow" size={14} color="black" />
                            <Text style={{ fontWeight: 600 }}>{location.name}</Text>
                        </View>

                        <Text style={{ fontSize: 10 }} ellipsizeMode='tail' className='text-text' numberOfLines={2}>{toStreet(location)}</Text>
                    </View>

                    <TouchableOpacity className='my-auto px-2' onPress={handleDelete}>
                        <MaterialIcons name="delete" size={24} className='text-red-600 bg-red-500' color={"#dc2626"} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}