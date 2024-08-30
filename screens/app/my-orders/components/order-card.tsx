import { View, Text, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { Order } from "../types";

type Props = {
   order: Order;
   onPress?: () => void;
};
export function OrderCard({ order, onPress }: Props): JSX.Element {
   return (
      <Pressable
         className="flex flex-col space-y-4 p-4 rounded-xl bg-white shadow-lg shadow-dark/10 active:bg-white/80"
         onPress={onPress}
      >
         <View className="flex flex-row items-end justify-between">
            <View className="flex flex-col space-y-1">
               <Text className="text-base text-dark font-bold">
                  {order.name}
               </Text>
               <Text className="text-base text-dark font-semibold">
                  Order#: {order.numberOrder}
               </Text>
               <Text className="text-sm text-text font-medium">
                  {order.dateCreated}
               </Text>
            </View>
            <View className="w-20 h-20 rounded-xl bg-light/25" />
         </View>
         <View className="flex flex-row items-center justify-between space-x-3">
            <Text className="text-sm text-dark font-semibold">
               {!order.delivered ? <>Entrega estimada el</> : <>Entregado el</>}{" "}
               {order.deliveryDate}
            </Text>
            <View className="flex flex-col items-end space-y-1">
               <Text className="text-sm text-text font-medium">
                  {!order.delivered ? <>Valoración</> : <>Usted calificó</>}
               </Text>
               <View className="flex flex-row items-center space-x-1">
                  {Array.from({ length: 5 }).map(
                     (_, index: number): JSX.Element => {
                        let name: any = "star-o";
                        if (index < order.rating) {
                           name = "star";
                        }
                        return (
                           <FontAwesome
                              key={index}
                              name={name}
                              size={16}
                              color={Colors.principal.DEFAULT}
                           />
                        );
                     }
                  )}
               </View>
            </View>
         </View>
      </Pressable>
   );
}
