import { FlatList, SafeAreaView, ScrollView } from "react-native";
import { Order } from "./types";
import useGlobal from "core/globals";
import { OrderCard } from "./components/order-card";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

type Props = {
   navigation: any;
};
export function OrdersScreen({ navigation }: Props): JSX.Element {
   const handleScreen =
      (name: string, params?: { data: Order }) => (): void => {
         navigation.navigate(name, params);
      };

   const customer = useGlobal((state) => state.customer);
   return (
      <SafeAreaView className="flex-1">
         <FlatList
            data={customer?.orders?.sort(
               (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
            )}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <OrderCard
                  order={item}
                  onPress={handleScreen("TrackOrders", { data: item })}
               />
            )}
            contentContainerStyle={{
               paddingVertical: 8,
               paddingHorizontal: 12,
               gap: 12,
               paddingBottom: useBottomTabBarHeight(),
            }}
         />
      </SafeAreaView>
   );
}
