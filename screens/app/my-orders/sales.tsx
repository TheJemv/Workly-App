import { FlatList, SafeAreaView, ScrollView, View } from "react-native";
import { Order } from "./types";
import useGlobal from "core/globals";
import { OrderCard } from "./components/order-card";
import { useCallback, useEffect } from "react";
import SpinLoading from "components/SpinLoading";
import { Colors } from "lib";

type Props = {
   navigation: any;
};
export function SalesScreen({ navigation }: Props): JSX.Element {
   const handleScreen =
      (name: string, params?: { data: Order }) => (): void => {
         navigation.navigate(name, params);
      };

   // Variables globales
   const companyData = useGlobal((state) => state.company);
   const sales = useGlobal((state) => state.sales);

   // Funciones globales
   const getSales = useGlobal((state) => state.getSales);

   const reloadSales = useCallback(() => {
      if (companyData) {
         getSales();
      }
   }, [companyData]);

   useEffect(() => {
      if (sales === null) {
         setTimeout(() => {
            reloadSales();
         }, 1000);
      }
   }, [sales]);

   return sales !== null ? (
      sales.loaded ? (
         <SafeAreaView className="flex-1 ">
            <ScrollView className="flex-1">
               <FlatList
                  data={sales?.data?.sort(
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
                  scrollEnabled={false}
                  contentContainerStyle={{
                     paddingVertical: 8,
                     paddingHorizontal: 12,
                     gap: 12,
                  }}
                  ListFooterComponent={() => <View className="my-4" />}
               />
            </ScrollView>
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
