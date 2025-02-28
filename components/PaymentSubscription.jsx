import { usePaymentSheet } from "@stripe/stripe-react-native";
import { AuthContext } from "context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Alert, View, Text, TouchableOpacity, Image } from "react-native"
import { getPaymantCompany } from "services/api/getPaymentCompany"
import SpinLoading from "./SpinLoading";
import { Colors } from "lib";
import DescriptionSubscription from "data/DescriptionSubscription.json"
import AntDesign from "@expo/vector-icons/AntDesign"

import ImageSubscription from "assets/Subscription.png"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import PaywallScreen from "screens/PaywallScreen/PaywallScreen";
import Purchases from "react-native-purchases";
import { ENTITLEMENT_ID } from "constants/index";


const PaymentSubscription = () => {
   const [ showPaywall, setShowPaywall ] = useState(false);
   const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
   const { token } = useContext(AuthContext)

   const [loading, setLoading] = useState(true)
   const [product, setProduct] = useState(null)
   const [enableButton, setEnableButton] = useState(false)


   useEffect(() => {
      initializePaymentSheet()
      checkSubscription()
   }, [])


   const initializePaymentSheet = async () => {
      setLoading(true)
      const { ephemeralKey, paymentIntent, product } = await getPaymantCompany(token)
      setProduct(product)
      if(!ephemeralKey && !paymentIntent) throw new Error("No se encontraron los datos.")

      const { error } = await initPaymentSheet({
         customerEphemeralKeySecret: ephemeralKey,
         merchantDisplayName: 'Suscripcion',
         allowsDelayedPaymentMethods: true,
         returnURL: 'workit://stripe-return',
         paymentIntentClientSecret: paymentIntent
      })

      if(error) {
         throw new Error(error.message)
      }

      setLoading(false)
   }

   const checkSubscription = async () => {
      try {
         const customerInfo = await Purchases.getCustomerInfo();
         console.log("🚀 ~ checkSubscription ~ customerInfo:", customerInfo)

         if (typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined') {
             console.log('User is subscribed');
         } else {
         //   navigation.navigate('Paywall');
         }
       } catch (e) {
         Alert.alert('Error fetching customer info', e.message);
       }
   }


   const handleCompanyRegister = async () => {
      // setShowPaywall(true)
      // setEnableButton(true)
      // try {
      //    await presentPaymentSheet()
      // } catch(error) {
      //    Alert.alert("Error", error.message)
      // } finally {
      //    setLoading(false)
      //    setEnableButton(false)
      // }

      console.log("Suscribirse...")
   }


   const bottomHeight = useBottomTabBarHeight()


   return (
      <>
         {showPaywall ? (<PaywallScreen />) : (
      <View className="py-0 flex px-6 flex-col items-center justify-center" style={{flex:1,gap:32,paddingBottom:bottomHeight}}>
         <View className="w-full px-0">
            <Image className="w-full" style={{
               height: 220,
            }} source={ImageSubscription} />
         </View>

         <Text className="text-[#3C4470]" style={{fontWeight:700, fontSize:28}}>Conviertete a Empresa</Text>
         <View className="flex flex-col" style={{gap:12}}>
            {DescriptionSubscription.data.map((content, index) => (
               <View key={index} className="flex flex-row items-center" style={{gap:8}}>
                  <AntDesign name="checkcircle" size={22} color={"#58DCC7"} />
                  <Text className="text-text">{content}</Text>
               </View>
            ))}
         </View>

         <View className="flex flex-row items-end justify-center" style={{gap:0}}>
            <Text style={{fontWeight:600,fontSize:14,paddingTop:8,alignSelf:'flex-start'}} className="text-[#979FCC]">$</Text>
            <Text style={{fontWeight:700,fontSize:42}} className="text-[#3C4470]">100</Text>
            <Text style={{fontWeight:600,fontSize:14,paddingBottom:8}} className="text-[#979FCC]">mensuales</Text>
         </View>

         <TouchableOpacity disabled={enableButton} onPress={handleCompanyRegister} className="bg-indigo-600 w-full items-center py-6 rounded-lg">
            <Text style={{fontWeight:700,fontSize:18}} className="text-white">Suscribirse</Text>
         </TouchableOpacity>
      </View>
         )}
      </>
   )
}

export default PaymentSubscription