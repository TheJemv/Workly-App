
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from 'expo-router'

import MapCurrentlyDue from "constants/MapCurrentlyDue";

export default function OnboardingInformation() {
    const handleGoBack = () => router.canGoBack() && router.back()
    const params = useLocalSearchParams()
    const data = JSON.parse(params.data as string)

    return (
        <ScrollView style={styles.container}>
            <View className="pt-5 px-2 pb-4 flex flex-col" style={{ gap: 22 }}>
                <Text className="text-dark font-semibold text-[22px] text-center">
                    Estado de Verificacion
                </Text>

                <View className="flex flex-col" style={{ gap: 4 }}>
                    {data.map((e, k) => (
                        <View
                            className="flex flex-row items-center"
                            style={{ gap: 4 }}
                            key={k}
                        >
                            <Ionicons
                                name="information-circle-outline"
                                size={24}
                                color="#6b6c69"
                            />

                            <Text className="text-[14px] text-[#6B6C69]" key={k}>
                                {MapCurrentlyDue[e] || e}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                onPress={handleGoBack}
                className="items-center justify-center bg-primary border-0 py-3 mt-auto rounded-lg border-transparent"
            >
                <Text className="text-white font-bold text-[16px]">Cerrar</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}
//className="flex flex-1 flex-col px-2 justify-center h-full pt-4 pb-16"
const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 8,
        paddingTop: 16,
        marginBottom: 64,
        gap: 12
    }
})