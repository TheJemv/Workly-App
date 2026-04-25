import { View, Text, TouchableOpacity, Platform, Linking } from 'react-native'
import { memo, useCallback } from 'react'
import FontAwesomeIcon from "@expo/vector-icons/FontAwesome"
import { Colors } from 'lib'
import MapView, { Marker } from 'react-native-maps'

export const LocationSendView = ({ data }: any) => (
    <View className='flex flex-col w-full' style={{ gap: 8 }}>
        <MapView
            style={{ width: '100%', height: 160, borderRadius: 12 }}
            scrollEnabled={false}
            zoomEnabled={false}
            initialRegion={{
                latitude: parseFloat(data.latitude),
                longitude: parseFloat(data.longitude),
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
        >
            <Marker coordinate={{ latitude: parseFloat(data.latitude), longitude: parseFloat(data.longitude) }} />
        </MapView>
        <View className='px-2' style={{ gap: 4 }}>
            <View className="flex flex-row items-center space-x-3">
                <FontAwesomeIcon name="map-marker" size={16} color={Colors.principal.DEFAULT} />
                <Text className="text-base text-text font-medium">{data.name}</Text>
            </View>
            <Text className="text-sm text-text/70">
                {data.street} {data.streetNumber}, {data.neighborhood}, {data.city}, {data.state}
            </Text>
            {data.details ? <Text className="text-sm text-text/50">{data.details}</Text> : null}
        </View>
    </View>
)

const LocationBubble = memo(({ location, isMe }: any) => {
    const openMap = useCallback(() => {
        const lat = parseFloat(location.latitude)
        const lng = parseFloat(location.longitude)
        const label = encodeURIComponent(location.name)
        const url = Platform.select({
            ios: `maps:?q=${label}&ll=${lat},${lng}`,
            android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`
        })
        Linking.openURL(url)
    }, [location])

    return (
        <TouchableOpacity
            onPress={openMap}
            className="flex flex-row py-0.5 px-2"
            style={{ justifyContent: isMe ? "flex-end" : "flex-start" }}
        >
            <View style={{
                backgroundColor: isMe ? '#303040' : '#f0f0f0',
                borderRadius: 16,
                borderBottomRightRadius: isMe ? 4 : 16,
                borderBottomLeftRadius: isMe ? 16 : 4,
                overflow: 'hidden',
                maxWidth: '80%',
            }}>
                <MapView
                    style={{ width: 240, height: 140 }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    initialRegion={{
                        latitude: parseFloat(location.latitude),
                        longitude: parseFloat(location.longitude),
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                >
                    <Marker coordinate={{ latitude: parseFloat(location.latitude), longitude: parseFloat(location.longitude) }} />
                </MapView>
                <View style={{ padding: 10, gap: 4 }}>
                    <View className="flex flex-row items-center" style={{ gap: 6 }}>
                        <FontAwesomeIcon name="map-marker" size={13} color={isMe ? '#fff' : Colors.principal.DEFAULT} />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: isMe ? '#fff' : '#050505' }}>{location.name}</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: isMe ? '#ffffffCC' : '#333', flexShrink: 1 }}>
                        {location.street} {location.streetNumber}, {location.neighborhood}, {location.city}
                    </Text>
                    {location.details ? (
                        <Text style={{ fontSize: 11, color: isMe ? '#ffffffAA' : '#555' }}>{location.details}</Text>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    )
})

export default LocationBubble