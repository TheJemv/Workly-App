import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "lib"
import { router } from "expo-router";
import type { ReactNode } from "react";

export default function CustomBackButton(): ReactNode | undefined {
    return router.canGoBack() ? (
        <TouchableOpacity disabled={!router.canGoBack()} className='flex ml-[0.8] flex-col items-center justify-center' onPress={router.back}>
            <Ionicons size={28} className='mx-auto' name='chevron-back' color={Colors.principal.DEFAULT} />
        </TouchableOpacity>
    ) : undefined
}
