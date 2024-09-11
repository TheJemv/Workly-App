import { SafeAreaView, ScrollView, View, Text, FlatList } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { ButtonOption } from "./components/button-option";
import { Button } from "./components/button";
import { DetailInfo } from "./components/detail-info";
import { Header } from "./components/header";
import { InvoiceData } from "./types";
import { useLayoutEffect } from "react";
import Invoice from "./components/invoice";

type Props = {
   navigation: any;
};
export function InvoiceDataScreen({ navigation }: Props): JSX.Element {
   const test: InvoiceData = {
      id: "1",
      name: "Montes",
      rfc: "12345678",
      calle: "Valle de Mexico 18 Int",
      colonia: "Valle Alto",
      del: "Matamoros",
      cp: "87380",
      state: "Tamaulipas",
      phone: "(555) 555-5555",
      email: "amontes990@gmail.com",
      tax_regime: "Resico",
      cfdi: "No",
   };

   const data = [test, test, test];

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: "Datos de facturación",
      });
   }, []);

   const handleScreen = (name: string, params?: any) => (): void => {
      navigation.navigate(name, params);
   };

   const handleDelete = (): void => {
      console.log("Eliminado");
   };

   return (
      <SafeAreaView className="flex-1">
         <ScrollView className="flex-1">
            <View className="flex flex-col space-y-5 px-3 py-5 mb-20">
               <Button
                  icon="address-book"
                  onPress={handleScreen("CreateInvoice")}
                  background={Colors.principal.DEFAULT}
               >
                  Crear datos de facturacion
               </Button>

               <FlatList
                  data={data}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <Invoice data={item} />}
                  contentContainerStyle={{
                     paddingVertical: 8,
                     gap: 12,
                  }}
               />
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}
