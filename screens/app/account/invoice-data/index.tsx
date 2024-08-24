import { SafeAreaView, ScrollView, View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { ButtonOption } from "./components/button-option";
import { Button } from "./components/button";
import { DetailInfo } from "./components/detail-info";
import { Header } from "./components/header";

type Props = {
   navigation: any;
};
export function InvoiceDataScreen({ navigation }: Props): JSX.Element {
   const handleScreen = (name: string, params?: any) => (): void => {
      navigation.navigate(name, params);
   };

   const handleDelete = (): void => {
      console.log("Eliminado");
   };

   return (
      <SafeAreaView className="flex-1">
         <Header>Datos de Facturacion</Header>
         <ScrollView className="flex-1">
            <View className="flex flex-col space-y-5 px-3 py-5 mb-20">
               <Button
                  icon="address-book"
                  onPress={handleScreen("CreateInvoice")}
               >
                  Crear datos de facturacion
               </Button>
               <View className="flex flex-row items-center space-x-3">
                  <FontAwesome
                     name="user"
                     size={20}
                     color={Colors.principal.DEFAULT}
                  />
                  <Text className="text-base text-text font-medium">
                     Montes
                  </Text>
               </View>
               <View className="flex flex-row items-center space-x-3">
                  <FontAwesome
                     name="money"
                     size={20}
                     color={Colors.principal.DEFAULT}
                  />
                  <View className="flex flex-col">
                     <DetailInfo title="RFC:">12345678</DetailInfo>
                  </View>
               </View>
               <View className="flex flex-row items-baseline space-x-3">
                  <FontAwesome
                     name="home"
                     size={20}
                     color={Colors.principal.DEFAULT}
                  />
                  <View className="flex flex-col">
                     <DetailInfo title="Calle:">
                        Valle de Mexico 18 Int
                     </DetailInfo>
                     <DetailInfo title="Colonia:">Valle Alto</DetailInfo>
                     <DetailInfo title="Del.">Matamoros</DetailInfo>
                     <DetailInfo title="C.P.">87380</DetailInfo>
                     <DetailInfo title="Estado:">Tamaulipas</DetailInfo>
                  </View>
               </View>
               <View className="flex flex-row items-center space-x-3">
                  <FontAwesome
                     name="phone"
                     size={20}
                     color={Colors.principal.DEFAULT}
                  />
                  <View className="flex flex-col space-y-1">
                     <DetailInfo title="Tel.">(555) 555-5555</DetailInfo>
                  </View>
               </View>
               <View className="flex flex-row items-baseline space-x-3">
                  <FontAwesome
                     name="envelope"
                     size={20}
                     color={Colors.principal.DEFAULT}
                  />
                  <View className="flex flex-col">
                     <DetailInfo title="Correo:">
                        amontes990@gmail.com
                     </DetailInfo>
                     <DetailInfo title="Regimen fiscal:">Resico</DetailInfo>
                     <DetailInfo title="Uso CFDI:">No</DetailInfo>
                  </View>
               </View>
            </View>
            <View className="flex flex-row items-baseline">
               <ButtonOption
                  icon="pencil"
                  onPress={handleScreen("EditInvoice", { id: 1 })}
               >
                  Editar
               </ButtonOption>
               <ButtonOption icon="trash" onPress={handleDelete}>
                  Eliminar
               </ButtonOption>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}
