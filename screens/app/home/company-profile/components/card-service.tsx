import { View, Text, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";

type Props = {
   title: string;
   description: string;
   price: number;
};
export const CardService = ({
   title,
   description,
   price,
}: Props): JSX.Element => {
   return (
      <View className="flex flex-col items-end space-y-3 bg-white border-2 border-border rounded-xl p-4">
         <View className="flex flex-row space-x-3">
            <View className="flex items-center justify-center w-10 h-10 rounded-lg bg-light/10">
               <FontAwesome
                  name="location-arrow"
                  size={20}
                  color={Colors.principal.DEFAULT}
               />
            </View>
            <View className="flex flex-1 flex-col space-y-1">
               <Text
                  className="text-base text-dark font-semibold"
                  numberOfLines={1}
               >
                  {title}
               </Text>
               <Text
                  className="text-sm text-text font-medium"
                  numberOfLines={2}
               >
                  {description}
               </Text>
            </View>
         </View>
         <Text className="text-sm text-dark font-bold">Desde ${price} USD</Text>
         <View className="flex flex-row items-center justify-end space-x-3">
            <Pressable className="bg-yellow border-2 border-yellow rounded-lg px-4 py-1">
               <Text className="text-sm text-dark font-medium">Editar</Text>
            </Pressable>
            <Pressable className="bg-red border-2 border-red rounded-lg px-4 py-1">
               <Text className="text-sm text-white font-medium">Eliminar</Text>
            </Pressable>
         </View>
      </View>
   );
};
