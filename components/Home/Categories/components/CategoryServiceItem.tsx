import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";

import formatterUnit from "utils/fomatterUnit";
import { serviceCover } from "utils/serviceGallery";
import { Colors } from "lib";
import { ServiceType } from "components/Home/ServicesTrending/types";

export default function CategoryServiceItem({ item }: { item: ServiceType }) {
   const handleService = () => {
      router.navigate({
         pathname: "/(home)/service/[id]",
         params: { id: item.id },
      });
   };

   const price = item.indefinite
      ? "Por consumo"
      : `${formatterUnit.format(item.unit_amount / 100)} ${(item.currency ?? "").toUpperCase()}`.trim();

   return (
      <TouchableOpacity
         onPress={handleService}
         activeOpacity={0.85}
         className="bg-white rounded-2xl flex-row items-center"
         style={{
            padding: 10,
            gap: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
         }}
      >
         <View
            className="bg-border-soft"
            style={{ width: 104, height: 88, borderRadius: 12, overflow: "hidden" }}
         >
            <Image
               source={{ uri: serviceCover(item) }}
               style={{ width: "100%", height: "100%" }}
               contentFit="cover"
               transition={200}
            />

            {item.company?.profile?.photo ? (
               <View
                  style={{
                     position: "absolute",
                     left: 6,
                     bottom: 6,
                     width: 26,
                     height: 26,
                     borderRadius: 7,
                     overflow: "hidden",
                     borderWidth: 1.5,
                     borderColor: "#fff",
                  }}
               >
                  <Image
                     source={{ uri: item.company.profile.photo }}
                     style={{ width: "100%", height: "100%" }}
                     contentFit="cover"
                  />
               </View>
            ) : null}
         </View>

         <View style={{ flex: 1, gap: 3 }}>
            <Text numberOfLines={2} className="text-dark font-semibold text-[14px]">
               {item.name}
            </Text>
            <Text
               numberOfLines={1}
               className="text-[13px] font-semibold"
               style={{ color: Colors.principal.DEFAULT }}
            >
               {price}
            </Text>
         </View>

         <Entypo name="chevron-right" size={18} color="#9fa8c9" />
      </TouchableOpacity>
   );
}
