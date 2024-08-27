import { SafeAreaView, View, Text, ScrollView } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { Order } from "./types";
import { StepTrack } from "./components/step-track";

type Props = {
   navigation: any;
   route: any;
};
export function TrackOrdersScreen({ navigation, route }: Props): JSX.Element {
   const order: Order = route.params.data;

   const handleBack = (): void => {
      navigation.goBack();
   };

   return (
      <SafeAreaView className="flex-1">
         <View className="flex flex-col space-y-4 px-3 py-2">
            <View className="flex flex-row items-center justify-between space-x-3">
               <FontAwesome
                  name="arrow-left"
                  size={20}
                  color={Colors.principal.DEFAULT}
                  onPress={handleBack}
               />
               <View className="flex flex-row items-center space-x-4">
                  <FontAwesome
                     name="search"
                     size={20}
                     color={Colors.principal.DEFAULT}
                  />
                  <FontAwesome
                     name="shopping-bag"
                     size={20}
                     color={Colors.principal.DEFAULT}
                  />
               </View>
            </View>
            <Text className="text-lg text-dark font-bold">
               Seguimiento de Pedidos
            </Text>
         </View>
         <ScrollView className="flex-1 px-3 my-3 space-y-2">
            <View className="flex flex-col rounded-xl bg-white shadow-md shadow-dark/25">
               <View className="p-4 border-b-2 border-b-light/25">
                  <Text className="text-base text-dark font-semibold">
                     Order#: {order.numberOrder}
                  </Text>
               </View>
               <View className="flex flex-col space-y-5 p-4 border-b-2 border-b-light/25">
                  <View className="flex flex-row items-start justify-between space-x-4">
                     <View className="flex flex-col space-y-1">
                        <Text className="text-base text-dark font-bold">
                           {order.name}
                        </Text>
                        <Text className="text-sm text-text font-medium">
                           Rs.160
                        </Text>
                     </View>
                     <View className="w-20 h-20 rounded-xl bg-light/25" />
                  </View>
                  <View className="flex flex-row items-center justify-between space-x-4">
                     <Text className="text-sm text-text font-medium">
                        {!order.delivered ? (
                           <>Valoración</>
                        ) : (
                           <>Usted calificó</>
                        )}
                     </Text>
                     <View className="flex flex-row items-center space-x-1">
                        {Array.from({ length: 5 }).map(
                           (_, index: number): JSX.Element => {
                              let name: any = "star-o";
                              if (index < order.rating) {
                                 name = "star";
                              }
                              return (
                                 <FontAwesome
                                    key={index}
                                    name={name}
                                    size={16}
                                    color={Colors.principal.DEFAULT}
                                 />
                              );
                           }
                        )}
                     </View>
                  </View>
               </View>
               <View className="flex flex-col space-y-6 p-4">
                  <View className="flex flex-row items-center justify-between space-x-3">
                     <Text className="text-sm text-dark font-semibold">
                        Orden de Seguimiento
                     </Text>
                     <FontAwesome
                        name="chevron-up"
                        size={16}
                        color={Colors.principal.DEFAULT}
                     />
                  </View>
                  <View className="flex flex-col -space-y-0.5">
                     <StepTrack
                        icon="file-text"
                        title="Pedido Realizado"
                        description="Hemos recibido su pedido en 20-Dic-2022"
                        stepProcess
                     />
                     <StepTrack
                        icon="credit-card"
                        title="Pedido Confirmado"
                        description="Hemos sido confirmados en 20-Dic-2022"
                        stepProcess
                     />
                     <StepTrack
                        icon="check"
                        title="Pedido Procesado"
                        description="Estamos preparando su pedido"
                        stepSelected
                     />
                     <StepTrack
                        icon="dropbox"
                        title="Envío Inmediato"
                        description="Su pedido está listo para el envío"
                     />
                     <StepTrack
                        icon="bus"
                        title="En espera de entrega"
                        description="Su pedido está listo para la entrega"
                     />
                  </View>
               </View>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}
