import {
    View,
    Linking,
    Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { ButtonLink } from "components/Profile/Support";
import { ScrollView } from "react-native-gesture-handler";

export default function Support() {
    const handleSendEmail = async (): Promise<void> => {
        try {
            const email: string = "example@example.com";
            const subject: string = "Hello";
            const body: string = "This is the body of the email";
            const url: string = `mailto:${email}?subject=${encodeURIComponent(
                subject
            )}&body=${encodeURIComponent(body)}`;
            const supported: boolean = await Linking.canOpenURL(url);
            if (!supported) {
                Alert.alert(
                    "Error",
                    "No se puede abrir el cliente de correo electrónico."
                );
            } else {
                return Linking.openURL(url);
            }
        } catch (error) {
            console.error("Error al intentar abrir el correo:", error);
        }
    };

    const handleCall = async (): Promise<void> => {
        try {
            const phoneNumber: string = "+1234567890";
            const url: string = `tel:${phoneNumber}`;
            const supported: boolean = await Linking.canOpenURL(url);
            if (!supported) {
                Alert.alert(
                    "Error",
                    "No se puede abrir la aplicación de llamadas."
                );
            } else {
                return Linking.openURL(url);
            }
        } catch (error) {
            console.error("Error al intentar hacer la llamada:", error);
        }
    };

    return (
        <ScrollView className="flex-1 px-3 my-3 space-y-3">
            <View>
                <ButtonLink
                    icon={
                        <FontAwesome
                            name="phone"
                            size={20}
                            color={Colors.principal.DEFAULT}
                        />
                    }
                    onPress={handleCall}
                >
                    Llamar al Soporte
                </ButtonLink>
            </View>
            <View>
                <ButtonLink
                    icon={
                        <FontAwesome
                            name="envelope"
                            size={20}
                            color={Colors.principal.DEFAULT}
                        />
                    }
                    onPress={handleSendEmail}
                >
                    Enviar Correo al Soporte
                </ButtonLink>
            </View>
        </ScrollView>
    );
}
