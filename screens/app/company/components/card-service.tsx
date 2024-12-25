import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
   title: string;
   description: string;
   price: number;
   currency: string;
   photo: string;
};
export const CardService = ({
   title,
   description,
   price,
   currency,
   photo,
}: Props): JSX.Element => {
   return (
      <View className="flex flex-col items-end space-y-3 bg-white border-2 border-border rounded-xl p-4">
         <View className="flex flex-row space-x-3">
            <View className="flex items-center justify-center w-10 h-10 overflow-hidden rounded-lg bg-light/10">
               <Image source={{ uri: photo }} className="w-full h-full" />
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
         <Text className="text-sm text-dark font-bold">
            Desde ${(price / 100).toFixed(2)} {currency.toUpperCase()}
         </Text>
         <View className="flex flex-row items-center justify-end space-x-3">
            <TouchableOpacity className="rounded-lg bg-light px-5 py-1">
               <Text className="text-sm text-white font-medium">Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity className="rounded-lg bg-light px-5 py-1">
               <Text className="text-sm text-white font-medium">Eliminar</Text>
            </TouchableOpacity>
         </View>
      </View>
   );
};
