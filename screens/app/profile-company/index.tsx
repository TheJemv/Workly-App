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
import { CardService } from "./components/card-service";
import { ButtonIconLink } from "./components/button-link";
import { TimesOpen } from "./components/times-open";
import type { SocialMedia, Service } from "./types";
import { socialMedia, services } from "./data";

type Props = {};
export const ProfileCompanyScreen = ({}: Props): JSX.Element => {
   const handleOpenLink = (url: string) => async (): Promise<void> => {
      try {
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
   const handleCall = (phoneNumber: string) => async (): Promise<void> => {
      try {
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
            <View className="flex flex-col space-y-3">
               <View className="flex flex-row items-center space-x-3">
                  <View className="w-12 h-12 rounded-full bg-light/25" />
                  <View className="flex flex-col space-y-1">
                     <Text className="text-base text-dark font-semibold">
                        Google Inc.
                     </Text>
                     <View className="flex flex-row items-center space-x-1">
                        <FontAwesome
                           name="map-marker"
                           size={20}
                           color={Colors.buttonColor}
                        />
                        <Text className="text-sm text-text font-medium">
                           Valle de Mexico #18
                        </Text>
                     </View>
                  </View>
               </View>
               <Text
                  className="text-base text-text font-medium"
                  numberOfLines={3}
               >
                  Google, LLC es una empresa de tecnología de Google que se
                  dedica a proporcionar servicios de internet y servicios de
                  aplicaciones a los usuarios.
               </Text>
               <View className="flex flex-col space-y-3">
                  <View>
                     <TimesOpen />
                  </View>
                  <View className="flex flex-row items-center justify-between space-x-2">
                     {socialMedia.map(
                        (
                           socialMedia: SocialMedia,
                           index: number
                        ): JSX.Element => {
                           return (
                              <View key={index}>
                                 {socialMedia.isCall ? (
                                    <ButtonIconLink
                                       icon={socialMedia.icon}
                                       color={socialMedia.color}
                                       onPress={handleCall(socialMedia.phone)}
                                    />
                                 ) : (
                                    <ButtonIconLink
                                       icon={socialMedia.icon}
                                       color={socialMedia.color}
                                       onPress={handleOpenLink(socialMedia.url)}
                                    />
                                 )}
                              </View>
                           );
                        }
                     )}
                  </View>
               </View>
            </View>
            <View className="flex flex-col space-y-3">
               <Text className="text-lg text-dark font-bold">
                  Servicios que ofrezco
               </Text>
               <View className="flex flex-col space-y-2">
                  {services.map(
                     (service: Service, index: number): JSX.Element => {
                        return (
                           <View key={index}>
                              <CardService
                                 title={service.title}
                                 description={service.description}
                                 price={service.price}
                              />
                           </View>
                        );
                     }
                  )}
               </View>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};
