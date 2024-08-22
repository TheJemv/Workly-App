import { ScrollView, TouchableOpacity, View, Text, Alert  } from "react-native"
import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { AuthContext } from "context/AuthContext"
import { Colors } from "lib"
import { usePaymentSheet } from "@stripe/stripe-react-native"
import formatterUnit from "utils/fomatterUnit"
import { getPaymantCompany } from "services/api/getPaymentCompany"
import SpinLoading from "components/SpinLoading"
import { useNavigation } from "@react-navigation/native"
import CustomCompany from "components/CustomCompany"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"


const RegisterScreen = () => {
   const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
   const { statusSubscription, isCompany } = useContext(AuthContext)
   const { customer } = useContext(AuthContext)
   const [isModalActive, setIsModalActive] = useState(false);
   const { token } = useContext(AuthContext)
   const [companyProduct, setCompanyProduct] = useState(null)
   const [loading, setLoading] = useState(false)
   const [isError, setIsError] = useState(false)
   const route = useNavigation()
   const bottomTab = useBottomTabBarHeight()

   useEffect(() => {
      if(statusSubscription) return
      initializePaymentSheet()
   }, [])

   const fetchPaymentSheetParams = async () => {
      try {
         return { ephemeralKey, paymentIntent } = await getPaymantCompany(token);
      } catch (error) {
         console.error('Error fetching payment sheet parameters:', error);
         Alert.alert('Error', error.message);
      }
   };

   const initializePaymentSheet = async () => {
      const { ephemeralKey, paymentIntent } = await fetchPaymentSheetParams()
      if (ephemeralKey && paymentIntent) {
         const { error } = await initPaymentSheet({
            customerId: customer.customerId,
            customerEphemeralKeySecret: ephemeralKey,
            merchantDisplayName: companyProduct?.name || 'Merchant',
            allowsDelayedPaymentMethods: true,
            returnURL: 'workit://stripe-return',
            paymentIntentClientSecret: paymentIntent
         });

         setLoading(true)
         if (error) {
            console.error('Error initializing payment sheet:', error);
            Alert.alert('Error', error.message);
            setIsError(true)
            return
         }
      }
   };

   const handleCompanyRegister = async () => {
      try {
         const { error } = await presentPaymentSheet();
         if(error) {
            setIsError(true)
         }
      } catch (error) {
         setIsError(true)
      } finally {
         setIsModalActive(false);
      }
   }; 

   useLayoutEffect(() => {
      route.setOptions({
         headerTitle: isCompany?"Personaliza":"Registra tu empresa"
      })
   }, [route])

   return (
      <View className="px-3 w-full" style={{flex:1}}>
         <View className="rounded-lg overflow-hidden flex flex-col py-3 flex-1" style={{marginBottom:bottomTab}}>
            {statusSubscription ? (
               <CustomCompany />
            ): (
               loading ? (
                  isError ? (
                     <View>
                        <Text>Hay un error en tu compra, intentalo mas tarde.</Text>
                     </View>
                  ) : (
                     <TouchableOpacity disabled={isModalActive} onPress={handleCompanyRegister} className="rounded-lg overflow-hidden bg-white py-5 px-5 flex flex-col" style={{gap: 24}}>
                        <View className="flex flex-col" style={{gap: 6}}>
                           <Text className="text-dark" style={{ fontWeight: 700, fontSize: 32 }}>{ companyProduct?.name }</Text>
                           <Text className="text-text" style={{ fontWeight: 600, fontSize: 15 }}>Comienza desde los {formatterUnit.format(companyProduct?.price / 100)} pesos mensuales.</Text>
                        </View>

                        <Text className="text-text text-justify">{ companyProduct?.description }</Text>

                        <Text className="text-center py-2 text-white overflow-hidden" style={{backgroundColor: Colors.principal.DEFAULT, fontWeight: 700, borderRadius: 6, fontSize: 16}}>Unete Ahora</Text>
                     </TouchableOpacity>
                  )
               ) : (
                  <View className="rounded-lg overflow-hidden py-5 px-5 flex flex-col bg-gray-200" style={{ height: 240 }}>
                     <SpinLoading size={42} />
                  </View>
               )
            )}
         </View>
      </View>
   )
}

export default RegisterScreen