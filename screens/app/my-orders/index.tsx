import { SafeAreaView, View, Text, ScrollView } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { OrderCard } from "./components/order-card";
import { Order } from "./types";

type Props = {
   navigation: any;
};
export function MyOrdersScreen({ navigation }: Props): JSX.Element {
   const handleBack = (): void => {
      navigation.goBack();
   };

   const handleScreen =
      (name: string, params?: { data: Order }) => (): void => {
         navigation.navigate(name, params);
      };

   return (
      <SafeAreaView className="flex-1">
         <View className="flex flex-col space-y-4 px-3 py-2">
            <View className="flex flex-row items-center justify-between space-x-3">
               <FontAwesome
                  name="arrow-left"
                  size={20}
                  color={Colors.principal.DEFAULT}
                  onPress={handleBack}
               />
               <View className="flex flex-row items-center space-x-4">
                  <FontAwesome
                     name="search"
                     size={20}
                     color={Colors.principal.DEFAULT}
                  />
                  <FontAwesome
                     name="shopping-bag"
                     size={20}
                     color={Colors.principal.DEFAULT}
                  />
               </View>
            </View>
            <Text className="text-lg text-dark font-bold">Mis Pedidos</Text>
         </View>
         <ScrollView className="flex-1 px-3 my-3 space-y-2">
            <View>
               <OrderCard
                  order={{
                     numberOrder: 999012,
                     dateCreated: "20-Dic-2019, 3:00 PM",
                     deliveryDate: "22 Dic",
                     rating: 0,
                     name: "Pedido 1",
                  }}
                  onPress={handleScreen("TrackOrders", {
                     data: {
                        numberOrder: 999012,
                        dateCreated: "20-Dic-2019, 3:00 PM",
                        deliveryDate: "22 Dic",
                        rating: 0,
                        name: "Pedido 1",
                     },
                  })}
               />
            </View>
            <View>
               <OrderCard
                  order={{
                     numberOrder: 999013,
                     dateCreated: "21-Dic-2019, 3:00 PM",
                     deliveryDate: "24 Dic",
                     rating: 3,
                     name: "Pedido 2",
                     delivered: true,
                  }}
                  onPress={handleScreen("TrackOrders", {
                     data: {
                        numberOrder: 999013,
                        dateCreated: "21-Dic-2019, 3:00 PM",
                        deliveryDate: "24 Dic",
                        rating: 3,
                        name: "Pedido 2",
                        delivered: true,
                     },
                  })}
               />
            </View>
            <View>
               <OrderCard
                  order={{
                     numberOrder: 999014,
                     dateCreated: "22-Dic-2019, 3:00 PM",
                     deliveryDate: "26 Dic",
                     rating: 3,
                     name: "Pedido 3",
                     delivered: true,
                  }}
                  onPress={handleScreen("TrackOrders", {
                     data: {
                        numberOrder: 999014,
                        dateCreated: "22-Dic-2019, 3:00 PM",
                        deliveryDate: "26 Dic",
                        rating: 3,
                        name: "Pedido 3",
                        delivered: true,
                     },
                  })}
               />
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}
