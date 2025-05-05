import {
   Alert,
   ScrollView,
   View,
   Text,
   TouchableOpacity,
   SafeAreaView,
   StatusBar,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";

import { Singout } from "@/services/firebase/Singout";
import { UserConfigButton, Option } from "components";

import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AuthContext } from "context/AuthContext";
import { usePaymentSheet } from "@stripe/stripe-react-native";
import { getPaymentParams } from "services/api/getPaymantParams";
import useGlobal from "core/globals";

const AccountScreen = ({ navigation }) => {
   const { token } = useGlobal()
   const customerUser = useGlobal(state => state.customer)


   const { isCompany } = useContext(AuthContext);
   const handleSingout = async () => {
      await Singout().catch((e) => {
         Alert.alert("Error", e.message);
      });
   };

   const handleScreen = (name) => {
      navigation.navigate(name);
   };



   // Datos Bancarios
   const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
   const [loadingPayments, setLoadingPayments] = useState(false);
   const [isModalActivePayment, setIsModalActivePayment] = useState(false);


   useEffect(() => {
      initializePaymentSheet();
   }, []);

   const fetchPaymentSheetParams = async () => {
      try {
         const { ephemeralKey, setupIntent } = await getPaymentParams(token).catch((error) => {
            throw new Error(error.message)
         });
         return { ephemeralKey, setupIntent };
      } catch (error) {
         console.error('Error fetching payment sheet parameters:', error);
         Alert.alert('Error', error.message);
      }
   };

   const initializePaymentSheet = async () => {
      setLoadingPayments(false);
      const { ephemeralKey, setupIntent } = await fetchPaymentSheetParams();

      if (ephemeralKey && setupIntent) {
         const { error } = await initPaymentSheet({
            customerEphemeralKeySecret: ephemeralKey,
            merchantDisplayName: "User",
            allowsDelayedPaymentMethods: true,
            returnURL: 'workit://stripe-return',
            setupIntentClientSecret: setupIntent,
            customerId: customerUser.customerId,
         });

         if (error) {
            console.error('Error initializing payment sheet:', error);
            Alert.alert('Error', error.message);
         } else {
            setLoadingPayments(true);
         }
      }
   };

   const handleNewCard = async () => {
      if (!loadingPayments) return;
      setIsModalActivePayment(true);
      await initializePaymentSheet();
      await presentPaymentSheet();
      setIsModalActivePayment(false);
   };

   return (
      <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
         <ScrollView className="px-3 pt-3 w-full" style={{ flex: 1 }}>
            <View style={{ gap: 12 }} className="flex flex-col">
               <Text className="order-0 text-dark font-bold text-[22px]">
                  Configuracion
               </Text>
               <UserConfigButton onPress={() => handleScreen("Perfil")} />

               <View className="rounded-lg overflow-hidden flex flex-col">
                  <Option
                     styles="bg-gray-500"
                     icon={Feather}
                     iconName="lock"
                     label="Privacidad"
                  />
               </View>

               <View className="rounded-lg overflow-hidden flex flex-col">
                  <Option
                     styles="bg-cyan-400"
                     icon={AntDesign}
                     iconName="addfile"
                     label="Datos de Facturacion"
                     onPress={() => handleScreen("InvoiceData")}
                  />
                  <Option
                     styles="bg-orange-500"
                     icon={MaterialIcons}
                     iconName="support-agent"
                     label="Soporte"
                     onPress={() => handleScreen("Support")}
                  />
               </View>

               <View className="rounded-lg overflow-hidden flex flex-col">
                  <Option
                     onPress={handleNewCard}
                     styles="bg-red-500"
                     icon={AntDesign}
                     iconName="creditcard"
                     label="Datos Bancarios"
                     disabled={isModalActivePayment}
                     loading={loadingPayments}
                  />
               </View>

               <TouchableOpacity
                  onPress={handleSingout}
                  className="bg-white rounded-lg px-4 py-2"
               >
                  <Text className="text-red-500 text-center">
                     Cerrar Sesion
                  </Text>
               </TouchableOpacity>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

export default AccountScreen;
