import {
   SafeAreaView,
   ScrollView,
   View,
   Text,
   Linking,
   Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { Buttonlink } from "./components/button-link";
import { useLayoutEffect } from "react";

type Props = {
   navigation: any;
};
export function SupportScreen({ navigation }: Props): JSX.Element {
   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: "Soporte",
      });
   }, []);

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
      <SafeAreaView className="flex-1">
         <ScrollView className="flex-1 px-3 my-3 space-y-5">
            <View>
               <Buttonlink
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
               </Buttonlink>
            </View>
            <View>
               <Buttonlink
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
               </Buttonlink>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}
