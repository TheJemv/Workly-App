import { useNavigation } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import SpinLoading from "components/SpinLoading";
import { AuthContext } from "context/AuthContext";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { getPaymantParams } from "services/api/getPaymantParams"

const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const { customer, token } = useContext(AuthContext);
  const router = useNavigation();

   useLayoutEffect(() => {
      router.setOptions({
         headerTitle: "Datos Bancarios",
      });
   }, [router]);

   useEffect(() => {
      initializePaymentSheet();
   }, []);

   const fetchPaymentSheetParams = async () => {
      try {
         const { ephemeralKey, setupIntent } = await getPaymantParams(token).catch((error) => {
            throw new Error(error.message)
         });
         return { ephemeralKey, setupIntent };
      } catch (error) {
         console.error('Error fetching payment sheet parameters:', error);
         Alert.alert('Error', error.message);
      }
   };

   const initializePaymentSheet = async () => {
      const { ephemeralKey, setupIntent } = await fetchPaymentSheetParams();
      if (ephemeralKey && setupIntent) {
         const { error } = await initPaymentSheet({
            customerId: customer.customerId,
            customerEphemeralKeySecret: ephemeralKey,
            setupIntentClientSecret: setupIntent,
            merchantDisplayName: "User",
            allowsDelayedPaymentMethods: true,
            returnURL: 'workit://stripe-return',
         });
         
         if (error) {
            console.error('Error initializing payment sheet:', error);
            Alert.alert('Error', error.message);
         } else {
            setLoading(true);
         }
      }
   };

   const handleNewCard = async () => {
      if (!loading) return;
      setIsModalActive(true);
      await initializePaymentSheet();
      await presentPaymentSheet();
      setIsModalActive(false);
   };

   const downloadHistory = async() => {
      console.log("DOWNLOAD HISTORY")
   }

   return (
      <View className="px-3 pt-3 w-full flex flex-col" style={{ flex: 1, gap: 12 }}>
         <TouchableOpacity className="rounded-lg overflow-hidden flex bg-white flex-row py-3 px-5" onPress={downloadHistory}>
            <Text className="text-text">Descargar historial de compras</Text>
         </TouchableOpacity>

         <TouchableOpacity
            onPress={handleNewCard}
            className="rounded-lg overflow-hidden bg-white py-3 px-5"
            disabled={isModalActive}
         >
            {loading ? (
               <Text className="text-dark text-center" style={{ fontSize: 14, fontWeight: 500 }}>
                  Gestionar Tarjetas
               </Text>
            ) : (
               <SpinLoading size={18} color={"#040404"} />
            )}
         </TouchableOpacity>
      </View>
   );
};

export default PaymentScreen;