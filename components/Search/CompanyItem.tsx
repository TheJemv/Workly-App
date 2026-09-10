import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Company as CompanyType } from "@/types/Company";
import ServiceItem from "./ServiceItem";

export default function CompanyItem({ item }: { item: CompanyType }) {
   const handleCompany = () => {
      router.navigate({
         pathname: "/company/[id]",
         params: { id: item.id },
      });
   };

   const address = item.location?.address;
   const hasServices = item.services?.length > 0;

   return (
      <View
         className="bg-white rounded-2xl"
         style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
         }}
      >
         <TouchableOpacity
            onPress={handleCompany}
            activeOpacity={0.7}
            className="flex-row items-center p-3"
            style={{ gap: 12 }}
         >
            <Image
               source={{ uri: item.profile.photo }}
               style={{ width: 56, height: 56, borderRadius: 12 }}
               contentFit="cover"
               transition={200}
            />

            <View style={{ flex: 1, gap: 2 }}>
               <Text
                  numberOfLines={1}
                  className="text-dark font-semibold text-[15px]"
               >
                  {item.profile.name}
               </Text>

               {address ? (
                  <View className="flex-row items-center" style={{ gap: 3 }}>
                     <Ionicons name="location-outline" size={12} color="#717171" />
                     <Text numberOfLines={1} className="text-text text-[12px] flex-1">
                        {address}
                     </Text>
                  </View>
               ) : null}

               <Text numberOfLines={2} className="text-text text-[12px]">
                  {item.profile.description}
               </Text>
            </View>

            <Entypo name="chevron-right" size={18} color="#9fa8c9" />
         </TouchableOpacity>

         {hasServices ? (
            <View style={{ paddingBottom: 12 }}>
               <Text
                  className="text-text-light text-[11px] font-semibold uppercase"
                  style={{ letterSpacing: 0.5, paddingHorizontal: 12, paddingBottom: 8 }}
               >
                  Servicios
               </Text>
               <FlatList
                  data={item.services}
                  keyExtractor={(service) => service.id}
                  renderItem={({ item: service }) => <ServiceItem service={service} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
               />
            </View>
         ) : (
            <Text
               className="text-text-light text-[12px]"
               style={{ paddingHorizontal: 12, paddingBottom: 12 }}
            >
               Sin servicios publicados
            </Text>
         )}
      </View>
   );
}
