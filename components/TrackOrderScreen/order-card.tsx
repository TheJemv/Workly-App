import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

import { Order } from "@/types/Order";
import OrderStatusEnum from "enum/OrderStatusEnum";

type Props = {
   order: Order;
   onPress?: () => void;
};

export function OrderCard({ order, onPress }: Props) {
   return (
      <TouchableOpacity
         className="flex flex-col space-y-4 p-4 rounded-xl bg-white shadow-lg shadow-dark/10 active:bg-white/80"
         onPress={onPress}
      >
         <View className="flex flex-row justify-between">
            <View className="flex flex-col flex-1 overflow-hidden">
               <Text className="text-base text-dark font-bold">
                  {order?.serviceName}
               </Text>

               <Text
                  className="text-xs text-text font-medium"
                  numberOfLines={3}
               >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Explicabo laboriosam molestias voluptates enim exercitationem
                  reiciendis excepturi eligendi. Corporis fuga, consequuntur
                  quis tempora, inventore nisi est perferendis unde at, ut
                  doloribus?
               </Text>
            </View>

            <Image
               source={{ uri: order?.servicePhoto }}
               style={{
                  width: 70,
                  height: 70,
                  borderRadius: 12,
                  backgroundColor: "#00000080",
               }}
            />
         </View>


         <View
            className={`
               flex flex-row items-center justify-center rounded-md py-1
               ${order.status === OrderStatusEnum.PENDING && "bg-yellow-500"}
               ${order.status === OrderStatusEnum.DATE_MODIFIED && "bg-blue-500"}
               ${order.status === OrderStatusEnum.CONFIRMED && "bg-indigo-600"}
               ${order.status === OrderStatusEnum.DELIVERED && "bg-green-600"}
               ${order.status === OrderStatusEnum.CANCELLED && "bg-gray-600"}
               ${order.status === OrderStatusEnum.FAILED && "bg-red-600"}
            `}
         >
            <Text
               className="text-white"
               style={{ fontWeight: 600, fontSize: 16 }}
            >

               {order.status === OrderStatusEnum.PENDING && "Orden pendiente"}
               {order.status === OrderStatusEnum.DATE_MODIFIED && "Fecha modificada"}
               {order.status === OrderStatusEnum.CONFIRMED && "Orden en curso"}
               {order.status === OrderStatusEnum.DELIVERED && "Orden entregada"}
               {order.status === OrderStatusEnum.CANCELLED && "Orden cancelada"}
               {order.status === OrderStatusEnum.FAILED && "Pedido fallido"}
            </Text>
         </View>
      </TouchableOpacity>
   );
}
