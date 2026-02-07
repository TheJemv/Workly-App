import { View, Text, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { router, useFocusEffect, useNavigation } from 'expo-router'
import { Colors } from 'lib'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { delLocation, getLocations } from 'services/api/location.api';
import { LoadingScreen } from 'components/Home';
import MapView, { Marker } from 'react-native-maps';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import LocationCard from 'components/Profile/Location/LocationCard';

export default function Location() {
    const navigation = useNavigation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState<boolean>(false)

    const reloadLocations = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getLocations();
            setData(res.data);
        } catch (error: any) {
            alert(error.message);
        }
    }, []);


    useFocusEffect(
        useCallback(() => {
            reloadLocations().then(() => setLoading(false));
        }, [reloadLocations])
    );

    const deleteLocation = async (location: string) => {
        try {
            setLoading(true)
            await delLocation(location)
            await reloadLocations()
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    className='flex ml-1'
                    onPress={() => router.push("/location/create")}
                    style={{
                        height: '100%',
                    }}
                >
                    <MaterialIcons
                        size={28}
                        name='add-location-alt'
                        color={Colors.principal.DEFAULT}
                    />
                </TouchableOpacity>
            )
        })
    }, [navigation])

    if (loading) return <LoadingScreen />
    return data.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
            <Image
                source={require("assets/Empty/Locations.png")}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
            />
            <View className="mt-8">
                <Text className="text-gray-800 text-xl font-semibold text-center mb-1">
                    No hay ubicaciones guardadas
                </Text>
                <Text className="text-gray-500 text-base text-center">
                    Crea tu primera ubicacion donde puedas recibir algun pedido si es necesario.
                </Text>
            </View>
        </View>
    ) : (
        <ScrollView className='flex-1 flex flex-col'>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <LocationCard location={item} deleteLocation={deleteLocation} />
                )}
                contentContainerStyle={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    gap: 12,
                    paddingBottom: 32
                }}
            />
        </ScrollView>
    )
}