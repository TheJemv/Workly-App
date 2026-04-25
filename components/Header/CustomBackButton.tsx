import type { ReactNode } from "react";
import { TouchableOpacity } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { Colors } from "lib";


export default function CustomBackButton(): ReactNode {
    const navigation = useNavigation();
    const handlePress = () => {
        if (navigation.canGoBack()) {
            navigation.goBack()
        }
    };

    return (
        <TouchableOpacity
            className="flex ml-[0.8] flex-col items-center justify-center"
            onPress={handlePress}
        >
            <Ionicons
                size={28}
                className="mx-auto"
                name="chevron-back"
                color={Colors.principal.DEFAULT}
            />
        </TouchableOpacity>
    );
}
