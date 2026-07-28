import { Colors } from "lib";
import { View, Text, TouchableOpacity } from "react-native";
import { Service as ServiceType } from "@/types/Service";
import formatterUnit from "utils/fomatterUnit";
import { router } from "expo-router";
import { Image } from 'expo-image'

type Props = {
   item: ServiceType;
};

const CardService = ({ item }: Props) => {
   const handleService = () => {
      router.navigate({
         pathname: '/(home)/service/[id]',
         params: { id: item.id }
      })
   };

   return (
      <TouchableOpacity onPress={handleService} className="bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden">
         <View className="p-4">
            <View className="flex items-start flex-row gap-3 mb-3">
               <View className="flex items-center justify-center overflow-hidden w-[56px] h-[56px] rounded-[6px] bg-light/10">
                  <Image
                     className="w-full h-full"
                     source={{ uri: item.photo }}
                     contentFit="cover"
                  />
               </View>

               <View className="flex flex-1 flex-col">
                  <View className="flex flex-col space-y-[-2]">
                     <Text
                        className="text-base text-dark font-semibold"
                        numberOfLines={1}
                     >
                        {item.name}
                     </Text>
                     <Text className="text-sm text-text">{item.category}</Text>
                  </View>
               </View>
            </View>

            <Text numberOfLines={3} className="text-xs text-text-default leading-relaxed mb-3">
               {item.description}
            </Text>

            <View className="flex items-center justify-between pt-3 border-t border-border-soft flex-row">
               <Text className="text-xs text-text-light">Precio desde</Text>

               <Text
                  style={{ paddingTop: 8, color: Colors.principal.DEFAULT }}
                  className="text-sm font-bold text-brand font-heading"
               >
                  {item.indefinite ? "Precio indefinido" : `${formatterUnit.format(item.unit_amount / 100)} ${item.currency.toUpperCase()}`}
               </Text>
            </View>
         </View>
      </TouchableOpacity>
   );
};

export default CardService;
