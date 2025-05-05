import { useContext, useEffect, useState } from "react";
import { Alert, View, Text, TouchableOpacity, Image } from "react-native"
import DescriptionSubscription from "data/DescriptionSubscription.json"
import AntDesign from "@expo/vector-icons/AntDesign"

import ImageSubscription from "assets/Subscription.png"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import PaywallScreen from "screens/PaywallScreen/PaywallScreen";

const PaymentSubscription = () => {
   const [ showPaywall, setShowPaywall ] = useState(false);

   const [loading, setLoading] = useState(true)
   const [enableButton, setEnableButton] = useState(false)
   const [packages, setPackages] = useState()
   const [products, setProducts] = useState([]);

   const productIds = [
      "company_subscription_one_year",
      "company_subscription_6_month",
      "company_subscription_3_month",
   ]

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const availableProducts = await Purchases.getProducts(productIds);
            console.log("Fetched Products:", availableProducts);
            setProducts(availableProducts);
         } catch (error) {
            console.error("Error fetching products:", error);
         }
      };

      () => fetchProducts();
   }, []);

   // useEffect(() => {
   //    // Get current available packages
   //    const getPackages = async () => {
   //       try {
   //          const offerings = await Purchases.getOfferings();

   //          if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
   //             setPackages(offerings.current.availablePackages);
   //          }
   //       } catch (e) {
   //          console.error(e.message)
   //          Alert.alert('Error getting offers', e.message);
   //       }
   //    };

   //    getPackages();
   // }, []);



   const handleCompanyRegister = async () => {
      try {
         console.log("Este....")
      } catch(error) {
         Alert.alert("Error", error.message)
      }
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