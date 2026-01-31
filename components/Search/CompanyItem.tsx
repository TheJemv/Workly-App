import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import ServiceItem from "./ServiceItem";
import { Company as CompanyType } from "@/types/Company";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";

export default function CompanyItem({ item }: { item: CompanyType }) {
   const handleCompany = () => {
      router.navigate({
         pathname: "/company/[id]",
         params: { id: item.id }
      })
   };

   return (
      <View className="bg-white w-full border-border rounded-[12px] flex flex-col p-2">
         <TouchableOpacity
            onPress={handleCompany}
            className="flex flex-row gap-x-2 pb-4"
         >
            <Image
               resizeMode="cover"
               source={{
                  uri: item.profile.photo,
               }}
               width={72}
               height={72}
               className="rounded-[8px]"
            />

            <View className="flex-1 flex flex-col">
               <View className="flex flex-row items-center ">
                  <Text className="text-inhrit-400 font-semibold">
                     {item.profile.name}
                  </Text>

                  <Entypo name="chevron-right" size={14} />
               </View>
               <Text numberOfLines={3} className="text-inhrit-400 text-text">
                  {item.profile.description}
               </Text>
            </View>
         </TouchableOpacity>

         {item.services.length > 0 && (
            <FlatList
               contentContainerStyle={{
                  gap: 16
               }}
               data={item.services}
               renderItem={({ item }) => <ServiceItem service={item} />}
               horizontal={true}
            />
         )}
      </View>
   );
}
