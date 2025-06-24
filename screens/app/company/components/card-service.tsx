import { useNavigation, NavigationProp } from "@react-navigation/native";
import SpinLoading from "components/SpinLoading";
import { AuthContext } from "context/AuthContext";
import { useContext, useState } from "react";
import { View, Text, Image, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { delService } from "services/api/services.api";

type RootStackParamList = {
   Home: undefined;
   editservice: {
      service: any;
   }; // Aquí puedes agregar los parámetros necesarios para esta pantalla
};
type EditServiceNavigationProp = NavigationProp<
   RootStackParamList,
   "editservice"
>;
type Props = {
   id: string;
   title: string;
   description: string;
   price: number;
   currency: string;
   photo: string;
   data: any;
};
export const CardService = ({
   title,
   description,
   price,
   currency,
   photo,
   data,
}: Props): JSX.Element => {
   const [loading, setLoading] = useState<Boolean>(false);
   const { token } = useContext(AuthContext);
   const navigation = useNavigation<EditServiceNavigationProp>();

   class handleService {
      static Edit() {
         navigation.navigate("editservice", { service: data });
      }

      static Delete() {
         Alert.alert(
            "Confirmación", // Título de la alerta
            "¿Estás seguro de que quieres continuar?", // Mensaje de la alerta
            [
               {
                  text: "Cancelar", // Botón de cancelar
                  style: "default",
               },
               {
                  text: "Aceptar", // Botón de aceptar
                  onPress: () => {
                     setLoading(true);
                     delService(token, data?.id)
                        .catch((e) => {
                           Alert.alert(
                              "Error",
                              "Ah ocurrido un error al borrar el servicio..."
                           );
                        })
                        .finally(() => {
                           setLoading(false);
                        });
                  }, // Acción cuando se presiona "Aceptar"
                  style: "destructive",
               },
            ],
            { cancelable: false } // Si es true, la alerta puede ser cerrada al hacer clic fuera de ella
         );
      }
   }

   return (
      <View className="flex flex-col items-end space-y-3 bg-white border-2 border-border rounded-xl p-4">
         {!loading ? (
            <>
               <View className="flex flex-row space-x-3">
                  <View className="flex items-center justify-center w-14 h-14 overflow-hidden rounded-lg bg-light/10">
                     <Image source={{ uri: photo }} className="w-full h-full" />
                  </View>
                  <View className="flex flex-1 flex-col space-y-1">
                     <Text
                        className="text-base text-dark font-semibold"
                        numberOfLines={1}
                     >
                        {title}
                     </Text>
                     <Text
                        className="text-sm text-text font-medium"
                        numberOfLines={2}
                     >
                        {description}
                     </Text>
                  </View>
               </View>
               {!data?.indefinite && (
                  <Text className="text-base text-dark font-bold">
                     Desde ${(price / 100).toFixed(2)} {currency.toUpperCase()}
                  </Text>
               )}
               <View className="flex flex-row items-center justify-end space-x-3">
                  <TouchableOpacity
                     onPress={handleService.Edit}
                     className="bg-yellow-400 border-2 border-yellow-400 rounded-lg px-4 py-1"
                  >
                     <Text className="text-sm text-dark font-medium">
                        Editar
                     </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     onPress={handleService.Delete}
                     className="bg-red-500 border-2 border-red-500 rounded-lg px-4 py-1"
                  >
                     <Text className="text-sm text-white font-medium">
                        Eliminar
                     </Text>
                  </TouchableOpacity>
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
