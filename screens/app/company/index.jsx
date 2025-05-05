import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect } from "react";
import {
   View, Text,
   SafeAreaView, Image,
   StyleSheet, TouchableOpacity,
   Linking, Platform,
   FlatList
} from "react-native";
import { ServiceItem } from "components"
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign"

import useGlobal from "core/globals";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { TimesOpen } from "./components/times-open";
import { socialMedia } from "./data";
import { ButtonIconLink } from "./components/button-link";
import { CardService } from "./components/card-service";
import { StatusBar } from "react-native";


const handleOpenLink = (url) => async () => {
   try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
         // Alert.alert(
         //    "Error",
         //    "No se puede abrir la aplicación."
         // );
      } else {
         return Linking.openURL(url);
      }
   } catch (error) {
      console.error("Error al intentar hacer la llamada:", error);
   }
};

const handleCall = async (phoneNumber) => {
   try {
      const url = `tel:${phoneNumber}`;
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
         // Alert.alert(
         //    "Error",
         //    "No se puede abrir la aplicación de llamadas."
         // );
      } else {
         return Linking.openURL(url);
      }
   } catch (error) {
      console.error("Error al intentar hacer la llamada:", error);
   }
};





const ProfileScreen = () => {
   const navigation = useNavigation();

   const companyData = useGlobal((state) => state.company);
   const servicesData = useGlobal((state) => state.services);

   const getServices = useGlobal((state) => state.getServices);
   useLayoutEffect(() => {
      navigation.setOptions({
         headerShown: false,
      });
   }, [])

   useEffect(() => {
      getServices();
   }, [companyData]);

   return (
      <SafeAreaView className="flex-1" style={{
         marginTop: StatusBar.currentHeight
      }}>
         <View
            className="flex-1 px-3 my-3 space-y-5"
            style={{ marginBottom: useBottomTabBarHeight() }}
         >
            <View className="flex flex-col space-y-3">
               <View className="flex flex-row items-center space-x-3 w-full">
                  <View className="w-12 h-12 rounded-full bg-light/25">
                     <Image
                        className="w-full h-full rounded-full"
                        source={{
                           uri: companyData?.profile?.photo
                        }}
                     />
                  </View>
                  <View className="flex flex-col space-y-1">
                     <View className="flex flex-row justify-between">
                        <Text className="text-base text-dark font-semibold">
                           { companyData?.profile?.name }
                        </Text>
                     </View>
                     {companyData?.profile?.address && (
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
                     )}
                  </View>

                  <TouchableOpacity style={{
                     marginStart: "auto"
                  }} onPress={() => navigation.navigate("edit")} className="bg-primary p-1.5 rounded-full justify-self-end">
                     <AntDesign color={"white"} size={14} name="edit" />
                  </TouchableOpacity>
               </View>

               <Text
                  className="text-base text-text font-medium"
                  numberOfLines={3}
               >{ companyData?.profile?.description }</Text>

               <View className="flex flex-col space-y-3">
                  <View>
                     <TimesOpen />
                  </View>

                  <View className="flex flex-row items-center justify-evenly space-x-2">
                     {/* {socialMedia.map((socialMedia, index) => {
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
                        )
                     })} */}

                     {Object.entries(companyData.profile.contact).map(([key, value]) => {
                        const dataMedia = ["instagram", "facebook", "phone", "linkedin"]
                        if(key in dataMedia && value) {
                           return (
                              <View key={key}>
                                 <ButtonIconLink
                                    icon={socialMedia.icon}
                                    color={socialMedia.color}
                                    onPress={key === "phone" ? handleCall(socialMedia.phone) : handleOpenLink(socialMedia.url)}
                                 />
                              </View>
                           )
                        }
                     })}
                  </View>
               </View>
            </View>

            {/* Los Servioc que ofrece la empresa */}
            <FlatList
               data={servicesData?.data?.slice().reverse()}
               keyExtractor={(item) => item.id.toString()}
               renderItem={({ item }) => (
                  <CardService
                     key={item.id}
                     id={item.id}
                     title={item.name}
                     description={item.description}
                     price={item.unit_amount}
                     currency={item.currency}
                     photo={item.photo}
                     data={item}
                  />
               )}
               contentContainerStyle={{
                  gap: 8,
               }}
               ListHeaderComponent={() => (
                  <TouchableOpacity
                     onPress={() => navigation.navigate("newservice")}
                     className="flex flex-row items-center space-x-2 p-2 bg-light/25 rounded-lg"
                  >
                     <AntDesign
                        name="pluscircle"
                        size={24}
                        color={Colors.buttonColor}
                     />
                     <Text className="text-base text-dark font-semibold">
                        Agregar un nuevo servicio
                     </Text>
                  </TouchableOpacity>
               )}
            />
         </View>
      </SafeAreaView>
   );
};


export default ProfileScreen;