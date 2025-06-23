import {
   SafeAreaView,
   View,
   Text,
   ScrollView,
   Image,
   Alert,
   TouchableWithoutFeedback,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { Order } from "./types";
import { StepTrack } from "./components/step-track";
import { useContext, useLayoutEffect, useState } from "react";
import OrderStatusEnum from "enum/OrderStatusEnum";
import { TouchableOpacity } from "react-native-gesture-handler";
import useGlobal from "core/globals";
import { API_HOST } from "@env";
import { AuthContext } from "context/AuthContext";
import SpinLoading from "components/SpinLoading";
import formatDateService from "functions/formatDateService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DatePicker from "react-native-date-picker";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
   cancelOrder,
   nextOrder,
   updateRequestedDate,
} from "services/api/orders.api";
import InvoiceOrder from "components/InvoiceOrder";

type Props = {
   navigation: any;
   route: any;
};
export function TrackOrdersScreen({ navigation, route }: Props): JSX.Element {
   useLayoutEffect(() => {
      navigation.setOptions({
         title: `Pedido#: ${order.id}`,
      });
   }, []);

   // Variables globales
   const sales = useGlobal((state) => state.sales);
   const orders = useGlobal((state) => state.orders);

   const { token } = useContext(AuthContext);

   const [loading, setLoading] = useState<boolean>(false);
   const [loadingRequestDate, setLoadingRequestDate] = useState<boolean>(false);
   const [loadingCancel, setLoadingCancel] = useState<boolean>(false);
   const [showEditDate, setShowEditDate] = useState<boolean>(false);

   let order: Order = route.params.data;
   if (orders?.data?.find((o) => o.id === order.id)) {
      order = orders.data.find((o) => o.id === order.id);
   } else if (sales?.data?.find((o) => o.id === order.id)) {
      order = sales.data.find((o) => o.id === order.id);
   }

   const handleCancel = async () => {
      setLoadingCancel(true);
      await cancelOrder(token, order.id)
         .catch((error) => {
            console.error("Error:", error);
            Alert.alert("Error", "No se pudo realizar la acción");
         })
         .finally(() => {
            setLoadingCancel(false);
         });
   };

   const handleNext = async () => {
      setLoading(true);
      await nextOrder(token, order.id)
         .catch((error) => {
            console.error("Error:", error);
            Alert.alert("Error", "No se pudo realizar la acción");
         })
         .finally(() => {
            setLoading(false);
            navigation.navigate("StackHome", {
               screen: "Home",
            });
         });
   };

   const handleUpdateRequestDate = async (date: Date) => {
      setLoadingRequestDate(true);
      await updateRequestedDate(token, order.id, date)
         .catch((error) => {
            console.error("Error:", error);
            Alert.alert("Error", "No se pudo realizar la acción");
         })
         .finally(() => {
            setLoadingRequestDate(false);
            navigation.navigate("StackHome", {
               screen: "Home",
            });
         });
   };

   return (
      <>
         <SafeAreaView className="flex-1">
            {loadingRequestDate && (
               <View className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-white/80 flex items-center justify-center">
                  <SpinLoading color={Colors.principal.DEFAULT} size={40} />
               </View>
            )}
            <ScrollView className="flex-1 px-3 space-y-2">
               <View
                  className="flex flex-col rounded-xl bg-white shadow-md shadow-dark/25"
                  style={{
                     marginBottom: useBottomTabBarHeight(),
                  }}
               >
                  <View className="p-4 border-b-2 border-b-light/25">
                     <Text
                        numberOfLines={1}
                        className="text-sm text-dark font-semibold"
                     >
                        Order#: {order.id}
                     </Text>
                  </View>

                  <View className="flex flex-col space-y-5 p-4 border-b-2 border-b-light/25">
                     <View className="flex flex-row items-start justify-between space-x-4">
                        <View className="flex flex-1 flex-col space-y-1">
                           <Text className="text-base text-dark font-bold">
                              {order?.serviceName}
                           </Text>
                           <Text
                              className="text-sm text-text font-medium"
                              numberOfLines={3}
                           >
                              {order?.serviceDescription}
                           </Text>
                        </View>
                        <Image
                           source={{
                              uri: order.servicePhoto,
                           }}
                           className="w-20 h-20 rounded-xl bg-light/25"
                        />
                     </View>
                  </View>

                  <View className="flex flex-col space-y-1 p-4 border-b-2 border-b-light/25">
                     <Text className="text-sm text-dark font-semibold">
                        Notas del Pedido
                     </Text>
                     <Text className="text-text">{order?.notes}</Text>
                  </View>

                  <View className="flex flex-col space-y-1 p-4 border-b-2 border-b-light/25">
                     <View className="flex flex-row justify-between">
                        <Text className="text-sm text-dark font-semibold">
                           Fecha Solicitada
                        </Text>

                        {order?.status ===
                           (OrderStatusEnum.Pending ||
                              OrderStatusEnum.Processing) &&
                           sales?.data?.find((o) => o.id === order.id) && (
                              <TouchableOpacity
                                 onPress={() => {
                                    setShowEditDate(true);
                                    console.log("Edit Date");
                                 }}
                              >
                                 <MaterialIcons
                                    name="edit"
                                    size={20}
                                    color={Colors.principal.DEFAULT}
                                 />
                              </TouchableOpacity>
                           )}
                     </View>
                     <Text className="text-text">
                        {formatDateService(new Date(order?.dateRequest))}
                     </Text>
                  </View>

                  {/* Billing Information */}
                  {order?.billing && (
                     <View className="flex flex-col space-y-1 p-4 border-b-2 border-b-light/25">
                        <Text className="text-sm text-dark pb-2 font-semibold">
                           Información de Facturación
                        </Text>
                        <InvoiceOrder data={order.billing} />
                     </View>
                  )}

                  {/* Customer Information */}
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
                           description="Aun no ha sido confirmado"
                           // status={OrderStatusEnum.Pending}
                           stepProcess={
                              order.status === OrderStatusEnum.Pending ||
                              order.status === OrderStatusEnum.Processing ||
                              order.status === OrderStatusEnum.Completed ||
                              order.status === OrderStatusEnum.Cancel
                           }
                        />
                        <StepTrack
                           icon="credit-card"
                           title="Pedido Confirmado"
                           description="Ha sido confirmado el pedido"
                           stepProcess={
                              order.status === OrderStatusEnum.Processing ||
                              order.status === OrderStatusEnum.Completed ||
                              order.status === OrderStatusEnum.Cancel
                           }
                        />

                        {order?.status === OrderStatusEnum.Cancel ? (
                           <StepTrack
                              icon="times"
                              title="Pedido Cancelado"
                              description="Su pedido ha sido cancelado"
                              stepProcess={
                                 order.status === OrderStatusEnum.Cancel
                              }
                           />
                        ) : (
                           <StepTrack
                              icon="check"
                              title="Pedido Completado"
                              description="Su pedido ha sido completado"
                              stepProcess={
                                 order.status === OrderStatusEnum.Completed
                              }
                           />
                        )}
                     </View>
                  </View>

                  {(order.status === OrderStatusEnum.Processing ||
                     order.status === OrderStatusEnum.Pending) &&
                     sales?.data?.find((o) => o.id === order.id) && (
                        <View
                           className="flex flex-row p-2 w-full"
                           style={{ gap: 8 }}
                        >
                           <TouchableWithoutFeedback
                              onPress={handleNext}
                              disabled={loading}
                           >
                              <View className="bg-green-500 py-2 rounded-md flex flex-row items-center justify-center flex-1">
                                 {loading ? (
                                    <SpinLoading color={"white"} size={22} />
                                 ) : (
                                    <Text className="text-white text-base">
                                       {order.status ===
                                          OrderStatusEnum.Pending &&
                                          "Aceptar Pedido"}
                                       {order.status ===
                                          OrderStatusEnum.Processing &&
                                          "Completar Pedido"}
                                    </Text>
                                 )}
                              </View>
                           </TouchableWithoutFeedback>

                           <TouchableWithoutFeedback
                              onPress={handleCancel}
                              disabled={loadingCancel}
                           >
                              <View className="bg-red-500 py-2 rounded-md flex flex-row items-center justify-center flex-1">
                                 {loadingCancel ? (
                                    <SpinLoading color={"white"} size={22} />
                                 ) : (
                                    <Text className="text-white text-base">
                                       {order.status ===
                                          OrderStatusEnum.Pending &&
                                          "Rechazar Pedido"}
                                       {order.status ===
                                          OrderStatusEnum.Processing &&
                                          "Cancelar Pedido"}
                                    </Text>
                                 )}
                              </View>
                           </TouchableWithoutFeedback>
                        </View>
                     )}

                  {(order.status === OrderStatusEnum.Processing ||
                     order.status === OrderStatusEnum.Pending) &&
                     orders?.data?.find((o) => o.id === order.id) && (
                        <View className="p-2 w-full" style={{ gap: 8 }}>
                           <TouchableOpacity
                              onPress={handleCancel}
                              className="bg-red-500 py-2 rounded-md flex flex-row items-center justify-center flex-1"
                              disabled={loadingCancel}
                           >
                              {loadingCancel ? (
                                 <SpinLoading color={"white"} size={22} />
                              ) : (
                                 <Text className="text-white text-base">
                                    {order.status === OrderStatusEnum.Pending &&
                                       "Cancelar Pedido"}
                                    {order.status ===
                                       OrderStatusEnum.Processing &&
                                       "Cancelar Pedido"}
                                 </Text>
                              )}
                           </TouchableOpacity>
                        </View>
                     )}
               </View>
            </ScrollView>
         </SafeAreaView>

         <DatePicker
            modal
            mode="datetime"
            date={new Date(order?.dateRequest)}
            onConfirm={(date) => {
               if (date === new Date(order.dateRequest)) return;
               setShowEditDate(false);
               Alert.alert(
                  "Actualizar Fecha",
                  '¿Estás seguro de actualizar la fecha de solicitud a "' +
                     formatDateService(date) +
                     '"?',
                  [
                     {
                        text: "Cancelar",
                        style: "destructive",
                     },
                     {
                        text: "Actualizar",
                        onPress: () => handleUpdateRequestDate(date),
                     },
                  ]
               );
            }}
            onCancel={() => {
               setShowEditDate(false);
            }}
            locale="es"
            open={showEditDate}
            // minimumDate={
            //    new Date(new Date().setMinutes(new Date().getMinutes() + 30))
            // }
         />
      </>
   );
}
