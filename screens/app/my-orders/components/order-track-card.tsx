import { Pressable, View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { Order } from "../types";

type Props = {
   order: Order;
   onPress?: () => void;
   onCancel?: () => void;
};
export function OrderTrackCard({
   order,
   onPress,
   onCancel,
}: Props): JSX.Element {
   return (
      <Pressable
         className="flex flex-col space-y-5 p-4 rounded-xl bg-white shadow-lg shadow-dark/10 active:bg-white/80"
         onPress={onPress}
      >
         <View className="flex flex-row items-start space-x-3">
            <View className="w-20 h-20 rounded-xl bg-light/25" />
            <View>
               <Text className="text-base text-dark font-semibold">
                  Order#: {order.numberOrder}
               </Text>
               <Text className="text-sm text-text font-medium">
                  {order.dateCreated}
               </Text>
            </View>
         </View>
         <View className="relative flex flex-row items-center justify-center">
            <View className="absolute top-4 left-4 right-4 h-2 rounded-full overflow-hidden bg-dark/25">
               <View
                  className="absolute top-0 left-0 right-0 h-2 rounded-full bg-dark"
                  style={{ width: `${(order.percentComplete / 100) * 100}%` }}
               />
            </View>
            <View className="flex flex-row items-center justify-between space-x-6">
               <View className="flex flex-1 flex-col items-center space-y-1">
                  <View className="flex items-center justify-center w-10 h-10 rounded-full bg-dark border-2 border-dark">
                     <FontAwesome name="send" size={20} color={Colors.white} />
                  </View>
                  <Text
                     className="text-sm text-center text-text font-medium"
                     numberOfLines={1}
                  >
                     Solicitado
                  </Text>
               </View>
               <View className="flex flex-1 flex-col items-center space-y-1">
                  <View className="flex items-center justify-center w-10 h-10 rounded-full bg-dark border-2 border-dark">
                     <FontAwesome
                        name="clock-o"
                        size={20}
                        color={Colors.white}
                     />
                  </View>
                  <Text
                     className="text-sm text-text font-medium"
                     numberOfLines={1}
                  >
                     Aceptado
                  </Text>
               </View>
               <View className="flex flex-1 flex-col items-center space-y-1">
                  <View className="flex items-center justify-center w-10 h-10 rounded-full bg-dark border-2 border-dark">
                     <FontAwesome name="bus" size={20} color={Colors.white} />
                  </View>
                  <Text
                     className="text-sm text-text font-medium"
                     numberOfLines={1}
                  >
                     En proceso
                  </Text>
               </View>
               <View className="flex flex-1 flex-col items-center space-y-1">
                  <View className="flex items-center justify-center w-10 h-10 rounded-full bg-dark border-2 border-dark">
                     <FontAwesome name="check" size={20} color={Colors.white} />
                  </View>
                  <Text
                     className="text-sm text-text font-medium"
                     numberOfLines={1}
                  >
                     Finalizado
                  </Text>
               </View>
            </View>
         </View>
         <Pressable
            className="flex items-center justify-center bg-white border-2 border-dark rounded-xl px-4 py-2 active:bg-light/25"
            onPress={onCancel}
         >
            <Text className="text-base text-dark font-semibold">Cancelar</Text>
         </Pressable>
      </Pressable>
   );
}
