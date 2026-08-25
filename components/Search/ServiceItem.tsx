import { Image, Text, TouchableOpacity, View } from "react-native";
import ServiceType from "../Home/ServicesTrending/types/ServiceType.types";
import formatterUnit from "utils/fomatterUnit";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

export default function ServiceItem({ service }: { service: ServiceType }) {
   const handleService = () => {
      router.navigate({
         pathname: "/(home)/service/[id]",
         params: { id: service.id }
      })
   };

   return (
      <TouchableOpacity
         onPress={handleService}
         className="w-36 flex flex-col gap-y-1 overflow-hidden"
      >
         <View className="h-36 w-full rounded-[12px] overflow-hidden max-w-24">
            <Image
               resizeMode="cover"
               className="w-full h-full"
               source={{
                  uri: service.photo,
               }}
            />
         </View>

         <View>
            <Text numberOfLines={1} className="uppercase w-full text-[13px]">
               {service.name}
            </Text>
            <Text
               numberOfLines={1}
               className="uppercase text-[15px] font-semibold"
            >{`${service.currency}${formatterUnit.format(service.unit_amount / 100)}`}</Text>
         </View>
      </TouchableOpacity>
   );
}
