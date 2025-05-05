import { View, Text, TouchableOpacity, Image } from "react-native";
import { Order } from "../types";
import OrderStatusEnum from "enum/OrderStatusEnum";

type Props = {
   order: Order;
   onPress?: () => void;
};

export function OrderCard({ order, onPress }: Props): JSX.Element {
   console.log(order);
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
               {/* <Text
                  numberOfLines={1}
                  className="text-text text-xs font-semibold"
               >
                  Order#: {order?.id}
               </Text> */}
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
               ${order.status === OrderStatusEnum.Pending && "bg-yellow-500"}
               ${order.status === OrderStatusEnum.Processing && "bg-blue-500"}
               ${order.status === OrderStatusEnum.Completed && "bg-green-500"}

               ${order.status === OrderStatusEnum.Cancel && "bg-red-500"}
               ${order.status === OrderStatusEnum.Failed && "bg-red-500"}
            `}
         >
            <Text
               className="text-white"
               style={{ fontWeight: 600, fontSize: 16 }}
            >
               {order?.status}
            </Text>
         </View>

         {/* <View></View>
         <View className="flex flex-col flex-1">

         </View> */}
      </TouchableOpacity>
   );
}
