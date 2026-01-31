import { View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
export default function LoadingScreen() {
    return (
        <View className="flex pb-[70px] h-full flex-col items-center justify-center">
            <FontAwesome name="hourglass-end" color={"#B1B1B4"} size={52} />
        </View>
    );
}
