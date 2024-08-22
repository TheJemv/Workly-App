import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { usePaymentSheet } from "@stripe/stripe-react-native"
import SpinLoading from "components/SpinLoading"
import { AuthContext } from "context/AuthContext"
import { Colors } from "lib"
import { useContext, useEffect, useState } from "react"
import { Text, SafeAreaView, ScrollView, View, Image, TouchableOpacity, TextInput, Alert } from "react-native"
import { getService, getServicePayment } from "services/api/services.api"


const Stats = ({name = 'Ordenes', value = 50}) => (
   <View style={{gap: 6}} className="flex-1 rounded-lg shadow-lg py-3 bg-zinc-300 flex flex-col items-center">
      <Text numberOfLines={1} className="text-gray-500" style={{fontWeight: 700, fontSize: 18}}>{value}</Text>
      <Text numberOfLines={1} className="text-text">{name}</Text>
   </View>
)



const ServiceHire = ({ route }) => {
   const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet()

   const { token, customer } = useContext(AuthContext)
   const bottomHeight = useBottomTabBarHeight()

   const [infoUserNote, setInfoUserNote] = useState("")
   const [dataService, setDataService] = useState(null)
   const [loading, setLoading] = useState(true)
   const [enableButton, setEnableButton] = useState(false)


   useEffect(() => {
      getService(token, route?.params?.id).then(async data => {
         setDataService(data?.service)
         setLoading(false)
      }).catch((error) => {
         Alert.alert("Error", error.message)
      })
   }, [])


   // Stripe Payment
   const handlePayService = async () => {
      setEnableButton(true)
      try {
         const { paymentintent, ephemeralKey } = await getServicePayment(token, dataService?.id)

         await initializePaymentSheet(paymentintent, ephemeralKey)
         await presentPaymentSheet()
      } catch (error) {
         Alert.alert(error?.message)
      } finally {
         setEnableButton(false)
      }
   }

   const initializePaymentSheet = async (payment, key) => {
      const { error } = await initPaymentSheet({
         customerEphemeralKeySecret: key,
         merchantDisplayName: dataService?.name,
         allowsDelayedPaymentMethods: true,
         returnURL: 'workit://stripe-return',
         paymentIntentClientSecret: payment,
         customerId: customer?.customer?.customerId,
      })

      if(error) {
         throw new Error(error.message)
      }
   }



   return (
      loading ? (
         <View className="flex-1 flex-col items-center justify-center">
            <SpinLoading color={Colors.principal.DEFAULT} size={48}/>
         </View>
      ) : (
         <SafeAreaView style={{flex:1}}>
            <ScrollView className="py-2 px-2 flex flex-col">
               <View className="flex flex-col" style={{gap: 32, paddingBottom: bottomHeight}}>
                  <Text className="text-dark" style={{fontWeight:700, fontSize: 24}}>Ordenar Servicio</Text>

                  <View className="flex flex-col items-center justify-center overflow-hidden" style={{gap: 8}}>
                     <Image
                        resizeMode="cover"
                        source={{uri: dataService?.photo?dataService?.photo:"https://1.bp.blogspot.com/-CLJH1C9LCj8/U_qBzC3WCII/AAAAAAACR9g/_QV42D7tkO8/s1600/imagenes%2Bbonitas%2By%2Bfotos%2Bde%2Bpaisajes%2Bnaturales%2B-%2Bamazing%2Bfree%2Bwallpapers%2B(1).jpg"}}
                        width={110} height={110}
                        className="rounded-lg"
                     />
                     <TouchableOpacity className="flex flex-row" style={{gap: 4}}>
                        <Text style={{fontSize: 14, fontWeight: 600, color: Colors.principal.DEFAULT}}>Empresa</Text>
                     </TouchableOpacity>
                     <Text className="text-text" style={{fontSize: 12}}>{dataService?.name?dataService?.name:'Servicio'}</Text>
                  </View>

                  <View style={{gap: 12}} className="w-full flex flex-row">
                     <Stats name="Ordenes" value={"1.2k"} />
                     <Stats name="Vistas" value={"4.2k"} />
                     <Stats name="Creado" value={"52d"} />
                  </View>

                  <View className="py-2 px-3 shadow-lg bg-white rounded-lg flex flex-col" style={{gap: 6}}>
                     <Text style={{color: Colors.principal.DEFAULT, fontWeight: 600, fontSize: 16}}>Descripcion del servicio</Text>
                     <Text className="text-text">{dataService?.description}</Text>
                  </View>

                  <View className="flex flex-col" style={{gap: 6}}>
                     <Text style={{color: Colors.principal.DEFAULT, fontWeight: 600, fontSize: 16}}>Horarios de la empresa</Text>
                     <Text className="pl-2 text-text" style={{fontWeight:600}}>10AM - 7PM</Text>
                     <Text className="pl-2 text-text" style={{fontWeight:600}}>Lunes, Marts y Miercoles</Text>
                  </View>

                  <View className="flex flex-col" style={{gap: 6}}>
                     <Text style={{color: Colors.principal.DEFAULT, fontWeight: 600, fontSize: 16}}>Agregar Notas</Text>
                     <TextInput
                        placeholder="Agregar notas..."
                        multiline
                        className="bg-white rounded-lg py-2 px-3"
                        style={{
                           height: 120
                        }}
                        value={infoUserNote}
                        onChangeText={(e) => setInfoUserNote(e)}
                     />
                  </View>

                  <TouchableOpacity disabled={enableButton} onPress={handlePayService} className="flex flex-col items-center justify-center py-3 rounded-lg shadow-lg" style={{backgroundColor: Colors.principal.DEFAULT}}>
                     <Text className="text-white" style={{fontWeight: 600, fontSize: 18}}>${dataService.unit_amount / 100} {dataService?.currency.toUpperCase()}</Text>
                  </TouchableOpacity>
               </View>
            </ScrollView>
         </SafeAreaView>
      )
   )
}

export default ServiceHire