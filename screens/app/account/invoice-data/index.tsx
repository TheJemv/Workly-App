import {
   SafeAreaView,
   ScrollView,
   View,
   Text,
   FlatList,
   Alert,
} from "react-native";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
// import { ButtonOption } from "./components/button-option";
import { Button } from "./components/button";
// import { DetailInfo } from "./components/detail-info";
// import { Header } from "./components/header";
// import { InvoiceData } from "./types";
import { useEffect, useLayoutEffect, useState } from "react";
import Invoice from "./components/invoice";
import { getBillings } from "services/api/billing.api";
import useGlobal from "core/globals";

type Props = {
   navigation: any;
};
export function InvoiceDataScreen({ navigation }: Props): JSX.Element {
   const [data, setData] = useState();
   const [loading, setLoading] = useState(true);
   const { token } = useGlobal();

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: "Datos de Facturación",
      });
   }, []);

   const handleScreen = (name: string, params?: any) => (): void => {
      navigation.navigate(name, params);
   };

   const handleDelete = (): void => {
      console.log("Eliminado");
   };

   useEffect(() => {
      getBillings(token)
         .then((data) => {
            setData(data.data);
         })
         .catch((e) => {
            Alert.alert("Error", (e as Error).message);
         })
         .finally(() => {
            setLoading(false);
         });
   }, []);

   return (
      <SafeAreaView className="flex-1">
         {loading ? (
            <Text>Loading</Text>
         ) : (
            <ScrollView className="flex-1">
               <View className="flex flex-col space-y-5 px-3 py-5 mb-20">
                  <Button
                     icon="address-book"
                     onPress={handleScreen("CreateInvoice")}
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
         )}
      </SafeAreaView>
   );
}
