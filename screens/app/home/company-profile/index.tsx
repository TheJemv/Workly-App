import { useLayoutEffect, useState, useContext } from "react";
import {
   SafeAreaView,
   ScrollView,
   View,
   Text,
   Linking,
   Alert,
   Image,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { CardService } from "./components/card-service";
import { ButtonIconLink } from "./components/button-link";
import { TimesOpen } from "./components/times-open";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { getCompanyById } from "services/api/company.api";
import { AuthContext } from "context/AuthContext";

type Props = {
   route: {
      params: {
         id: string;
      };
   };
   navigation: any;
};
const ProfileCompanyScreen = ({ route }: Props): JSX.Element => {
   const { token } = useContext(AuthContext);
   const [loading, setLoading] = useState(true);
   const [company, setCompany] = useState<any>(null);

   useLayoutEffect(() => {
      setLoading(true);
      getCompanyById(token, route.params.id)
         .then((data) => {
            if (data?.company) {
               setCompany(data.company);
            }
         })
         .finally(() => {
            setLoading(false);
         });
   }, [route.params.id]);

   const handleRefresh = () => {
      setLoading(true);
      getCompanyById(token, route.params.id)
         .then((data) => {
            console.log("Company data:", data);
            if (data?.company) {
               setCompany(data.company);
            }
         })
         .finally(() => {
            setLoading(false);
         });
   };

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

   if (loading) {
      return (
         <SafeAreaView className="flex-1 items-center justify-center">
            <Text className="text-lg text-dark font-semibold">Cargando...</Text>
         </SafeAreaView>
      );
   }

   return (
      <SafeAreaView className="flex-1 bg-white">
         <ScrollView
            className="flex-1 px-3 my-3 space-y-5"
            style={{ marginBottom: useBottomTabBarHeight() }}
         >
            <View className="flex flex-col space-y-3 bg-light/10 p-4 rounded-2xl">
               <View className="flex flex-row items-center space-x-3">
                  <View className="w-16 h-16 rounded-full bg-light/25">
                     <Image
                        className="w-full h-full rounded-full"
                        source={{
                           uri: company.profile.photo,
                        }}
                     />
                  </View>
                  <View className="flex flex-col space-y-1">
                     <Text className="text-xl text-dark font-semibold">
                        {company.profile.name}
                     </Text>
                     <View className="flex flex-row items-center space-x-1">
                        <FontAwesome
                           name="map-marker"
                           size={20}
                           color={Colors.buttonColor}
                        />
                        <Text className="text-base text-text font-medium">
                           Valle de Mexico #18
                        </Text>
                     </View>
                  </View>
               </View>
               <Text
                  className="text-base text-text font-medium"
                  numberOfLines={3}
               >
                  {company.profile.description}
               </Text>
               <View className="flex flex-col space-y-3">
                  <View>
                     <TimesOpen openingHours={company.profile.openingHours} />
                  </View>
                  <View className="flex flex-row items-center justify-between space-x-2">
                     {company.profile.contact.facebook && (
                        <ButtonIconLink
                           icon="facebook-square"
                           color="#1775f9"
                           onPress={handleOpenLink(company.profile.facebook)}
                        />
                     )}
                     {company.profile.contact.linkedin && (
                        <ButtonIconLink
                           icon="linkedin-square"
                           color="#0679b1"
                           onPress={handleOpenLink(company.profile.linkedin)}
                        />
                     )}
                     {company.profile.contact.phone && (
                        <ButtonIconLink
                           icon="phone-square"
                           color="#48c462"
                           onPress={handleCall(company.profile.contact.phone)}
                        />
                     )}
                     {company.profile.contact.instagram && (
                        <ButtonIconLink
                           icon="instagram"
                           color="#e25168"
                           onPress={handleOpenLink(company.profile.instagram)}
                        />
                     )}
                  </View>
               </View>
            </View>
            <View className="flex flex-col space-y-6">
               <Text className="text-xl text-dark font-bold">
                  Servicios que ofrezco
               </Text>
               <View className="flex flex-col space-y-5">
                  {company.services.map(
                     (service, index: number): JSX.Element => {
                        return (
                           <View key={index}>
                              <CardService
                                 service={service}
                                 refresh={handleRefresh}
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

export default ProfileCompanyScreen;
