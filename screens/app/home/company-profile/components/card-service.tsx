import { useState, useContext } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { useNavigation } from "@react-navigation/native";
import { delService } from "services/api/services.api";
import { AuthContext } from "context/AuthContext";
import SpinLoading from "components/SpinLoading";

type Props = {
   service: any;
   refresh?: () => void;
};
export const CardService = ({ service, refresh }: Props): JSX.Element => {
   const { token } = useContext(AuthContext);
   const navigation = useNavigation<any>();
   const [loading, setLoading] = useState(false);

   const handleEdit = () => {
      navigation.navigate("StackCompany", {
         screen: "editservice",
         params: { service },
      });
   };

   const handleDelete = () => {
      Alert.alert(
         "Confirmación",
         "¿Estás seguro de que quieres continuar?",
         [
            {
               text: "Cancelar",
               style: "default",
            },
            {
               text: "Aceptar",
               onPress: () => {
                  setLoading(true);
                  delService(token, service.id)
                     .catch((e) => {
                        Alert.alert(
                           "Error",
                           "Ah ocurrido un error al borrar el servicio..."
                        );
                     })
                     .finally(() => {
                        setLoading(false);
                        refresh();
                     });
               },
               style: "destructive",
            },
         ],
         { cancelable: false }
      );
   };

   return (
      <View className="flex flex-col items-end space-y-3 bg-white border-2 border-border rounded-xl p-4">
         {!loading ? (
            <>
               <View className="flex flex-row space-x-3">
                  <View className="flex items-center justify-center w-10 h-10 rounded-lg bg-light/10">
                     <FontAwesome
                        name="location-arrow"
                        size={20}
                        color={Colors.principal.DEFAULT}
                     />
                  </View>
                  <View className="flex flex-1 flex-col space-y-1">
                     <Text
                        className="text-base text-dark font-semibold"
                        numberOfLines={1}
                     >
                        {service.name}
                     </Text>
                     <Text
                        className="text-sm text-text font-medium"
                        numberOfLines={2}
                     >
                        {service.description}
                     </Text>
                  </View>
               </View>
               <Text className="text-sm text-dark font-bold">
                  Desde ${service.unit_amount / 100}.00 {service.currency}
               </Text>
               <View className="flex flex-row items-center justify-end space-x-3">
                  <Pressable
                     onPress={handleEdit}
                     className="bg-yellow border-2 border-yellow rounded-lg px-4 py-1"
                  >
                     <Text className="text-sm text-dark font-medium">
                        Editar
                     </Text>
                  </Pressable>
                  <Pressable
                     onPress={handleDelete}
                     className="bg-red-500 border-2 border-red-500 rounded-lg px-4 py-1"
                  >
                     <Text className="text-sm text-white font-medium">
                        Eliminar
                     </Text>
                  </Pressable>
               </View>
            </>
         ) : (
            <View className="flex flex-col justify-center items-center flex-1 w-full my-9">
               <SpinLoading size={32} />
            </View>
         )}
      </View>
   );
};
