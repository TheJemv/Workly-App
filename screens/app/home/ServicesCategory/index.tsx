import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { View, FlatList, Alert } from "react-native";

import { ServiceItem } from "./components";
import { useEffect, useLayoutEffect, useState } from "react";
import useGlobal from "core/globals";
import { getServices } from "services/api/services.api";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

export default function ServicesCategory({ route }) {
   const { label } = route.params;
   const navigation = useNavigation();
   const token = useGlobal((state) => state.token);
   const tabBarHeight = useBottomTabBarHeight();

   const [services, setServices] = useState<any[] | null>(null);
   const [loading, setLoading] = useState<boolean>();

   const capitalize = (str: string) => {
      if (!str) return ""; // Evita errores si llega null o undefined
      return str.charAt(0).toUpperCase() + str.slice(1);
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: capitalize(label),
      });
   }, []);

   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);
            let dataToRender = [];
            await getServices(token, label).then((data) => {
               dataToRender = data.services;
            });

            if (dataToRender.length % 2 !== 0) {
               dataToRender.push("empty");
            }

            setServices(dataToRender);
         } catch (error) {
            Alert.alert("Error", error.message);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   return loading || !services ? (
      <View className="flex pb-[70px] h-full flex-col items-center justify-center">
         <FontAwesome name="hourglass-end" color={"#B1B1B4"} size={52} />
      </View>
   ) : (
      <FlatList
         data={services}
         keyExtractor={(item) => item.id || item.toString()}
         numColumns={2}
         columnWrapperStyle={{ gap: 12 }}
         contentContainerStyle={{
            paddingHorizontal: 12,
            gap: 12,
            paddingBottom: tabBarHeight + 12,
         }}
         className="h-full"
         renderItem={({ item }) =>
            item === "empty" ? (
               <View className="flex-1 h-32 p-4" />
            ) : (
               <View key={item.id} className="flex-1 h-44  rounded-lg justify-center items-center">
                  <ServiceItem key={item.id} item={item} />
               </View>
            )
         }
      />
   );
}
