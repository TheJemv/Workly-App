import { SafeAreaView, ScrollView, View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { ButtonOption } from "./components/button-option";
import { Button } from "./components/button";
import { DetailInfo } from "./components/detail-info";
import { Header } from "./components/header";
import { InvoiceData } from "./types";

type Props = {
   navigation: any;
};
export function InvoiceDataScreen({ navigation }: Props): JSX.Element {
   const data: InvoiceData = {
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

   const handleBack = (): void => {
      navigation.goBack();
   };

   const handleScreen = (name: string, params?: any) => (): void => {
      navigation.navigate(name, params);
   };

   const handleDelete = (): void => {
      console.log("Eliminado");
   };

   return (
      <SafeAreaView className="flex-1">
         <Header onBack={handleBack}>Datos de Facturacion</Header>
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
                     {data.name}
                  </Text>
               </View>
               <View className="flex flex-row items-center space-x-3">
                  <FontAwesome
                     name="money"
                     size={20}
                     color={Colors.principal.DEFAULT}
                  />
                  <View className="flex flex-col">
                     <DetailInfo title="RFC:">{data.rfc}</DetailInfo>
                  </View>
               </View>
               <View className="flex flex-row items-baseline space-x-3">
                  <FontAwesome
                     name="home"
                     size={20}
                     color={Colors.principal.DEFAULT}
                  />
                  <View className="flex flex-col">
                     <DetailInfo title="Calle:">{data.calle}</DetailInfo>
                     <DetailInfo title="Colonia:">{data.colonia}</DetailInfo>
                     <DetailInfo title="Del.">{data.del}</DetailInfo>
                     <DetailInfo title="C.P.">{data.cp}</DetailInfo>
                     <DetailInfo title="Estado:">{data.state}</DetailInfo>
                  </View>
               </View>
               <View className="flex flex-row items-center space-x-3">
                  <FontAwesome
                     name="phone"
                     size={20}
                     color={Colors.principal.DEFAULT}
                  />
                  <View className="flex flex-col space-y-1">
                     <DetailInfo title="Tel.">{data.phone}</DetailInfo>
                  </View>
               </View>
               <View className="flex flex-row items-baseline space-x-3">
                  <FontAwesome
                     name="envelope"
                     size={20}
                     color={Colors.principal.DEFAULT}
                  />
                  <View className="flex flex-col">
                     <DetailInfo title="Correo:">{data.email}</DetailInfo>
                     <DetailInfo title="Regimen fiscal:">
                        {data.tax_regime}
                     </DetailInfo>
                     <DetailInfo title="Uso CFDI:">{data.cfdi}</DetailInfo>
                  </View>
               </View>
            </View>
            <View className="flex flex-row items-baseline">
               <ButtonOption
                  icon="pencil"
                  onPress={handleScreen("EditInvoice", { data })}
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
