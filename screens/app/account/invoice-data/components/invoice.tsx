import { View, Text, Alert } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { ButtonOption } from "./button-option";
import { DetailInfo } from "./detail-info";
import { useNavigation } from "@react-navigation/native";
import { delBilling } from "services/api/billing.api";
import useGlobal from "core/globals";

const Invoice = ({ data }) => {
   const { token } = useGlobal();
   const navigation = useNavigation<any>();

   const handleScreen = (name: string, params?: any) => (): void => {
      navigation.navigate(name, params);
   };

   const handleDelete = (): void => {
      Alert.alert("Eliminar", "¿Estás seguro de eliminar este registro?", [
         {
            text: "Cancelar",
            style: "destructive",
         },
         {
            text: "Eliminar",
            onPress: () => {
               delBilling(token, data.id);
            },
         },
      ]);
   };

   return (
      <View className="flex flex-col space-y-5 bg-[#00000010] overflow-hidden rounded-lg">
         <View className="flex flex-col space-y-5 px-3 py-3">
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
                  <DetailInfo title="Calle:">{data.street}</DetailInfo>
                  <DetailInfo title="Colonia o Fraccionamiento:">
                     {data.division}
                  </DetailInfo>
                  <DetailInfo title="No. Exterior:">
                     {data.number_ext}
                  </DetailInfo>
                  <DetailInfo title="No. Interior:">
                     {data.number_int}
                  </DetailInfo>
                  <DetailInfo title="C.P.">{data.cp}</DetailInfo>
                  <DetailInfo title="Pais:">{data.country}</DetailInfo>
                  <DetailInfo title="Estado:">{data.state}</DetailInfo>
                  <DetailInfo title="Ciudad:">{data.city}</DetailInfo>
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
                  <DetailInfo title="Regimen fiscal:">
                     {data.tax_regime}
                  </DetailInfo>
               </View>
            </View>
         </View>

         <View className="flex flex-row border-t border-light/25">
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
      </View>
   );
};

export default Invoice;
