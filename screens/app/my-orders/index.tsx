import { SafeAreaView, FlatList, Text, View } from "react-native";
import { OrderCard } from "./components/order-card";
import { Order } from "./types";
import { useEffect, useLayoutEffect } from "react";
import useGlobal from "core/globals";
import SpinLoading from "components/SpinLoading";
import { Colors } from "lib";

type Props = {
   navigation: any;
};
export function MyOrdersScreen({ navigation }: Props): JSX.Element {
   const handleScreen =
      (name: string, params?: { data: Order }) => (): void => {
         navigation.navigate(name, params);
      };

   useLayoutEffect(() => {
      navigation.setOptions({
         title: "Mis Pedidos",
      });
   }, []);

   // Variables globales
   const customer = useGlobal((state) => state.customer);
   const orders = useGlobal((state) => state.orders);

   // Funciones globales
   const getOrders = useGlobal((state) => state.getOrders);

   // Efectos
   useEffect(() => {
      if (customer) {
         getOrders();
      }
   }, [customer]);

   return orders !== null ? (
      orders?.loaded ? (
         <SafeAreaView className="flex-1">
            <FlatList
               data={orders?.data?.sort(
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
               }}
               ListHeaderComponent={() => (
                  <View className="flex flex-row border-b-[0.3px] border-gray-400 pb-1 w-full">
                     <Text className="text-primary font-semibold text-xl">
                        Mis Ordenes
                     </Text>
                  </View>
               )}
               ListFooterComponent={() => <View className="my-4" />}
            />
         </SafeAreaView>
      ) : (
         <SafeAreaView className="flex-1">
            <SpinLoading size={48} color={Colors.principal.DEFAULT} />
         </SafeAreaView>
      )
   ) : (
      <SafeAreaView className="flex-1">
         <SpinLoading size={48} color={Colors.principal.DEFAULT} />
      </SafeAreaView>
   );
}
