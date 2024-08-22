import { View, TouchableOpacity, Text, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker } from "react-native-maps"

import AntDesign from "@expo/vector-icons/AntDesign"
import Entypo from "@expo/vector-icons/Entypo"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"

import { getMap } from "../../../functions/getMap"
import { getOrder } from "../../../services/api/getOrders"
import { ItemPriceOrderDetails } from '../../../components'

const OrderDetails = ({ navigation, route }) => {
   const [data, setData] = useState({})
   const [loading, setLoading] = useState(false)
   const { orderId } = route.params;
   const region = {
      latitude: 25.851693454138523,
      longitude: -97.51120983065576,
   };

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true)
         try {
            await getOrder(orderId).then((data) => {
               setLoading(true)
               setData(data)
            })
         } catch(e) {
            throw new Error(e)
         } finally {
            setLoading(false)
         }
      }

      fetchData()
   }, [orderId])


   return (
      <View className="flex-1 flex flex-col justify-between bg-gray-200">
         {/* Go Back */}
         <TouchableOpacity className="px-3">
            <View className="rounded-full">
               <AntDesign size={22} onPress={() => navigation.goBack()} name="arrowleft" />
            </View>
         </TouchableOpacity>

         <View style={{ gap: 16 }} className="flex flex-col">
            {/* Title */}
            <View className="flex flex-row items-center justify-between px-3">
               <Text style={{ fontSize: 26 }} className="text-black font-bold">Order Information</Text>
            </View>

            {/* Map */}
            <View className="flex flex-col px-3" style={{gap: 6}}>
               <View className="flex flex-row justify-between">
                  <Text className="text-text font-semibold">Delivery to</Text>
                  <TouchableOpacity onPress={() => getMap(region, "prueba.")}>
                     <Text className="text-orange-400 font-semibold">Open in maps</Text>
                  </TouchableOpacity>
               </View>

               <View style={{gap: 12}} className="p-1 border border-gray-400/40 rounded-lg flex flex-row">
                  <View className="h-[124] w-[152] overflow-hidden rounded-lg">
                     <MapView className="w-full h-full"
                        region={{
                           ...region,
                           latitudeDelta: 0.003,
                           longitudeDelta: 0.003
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                     >
                        <Marker
                           coordinate={{
                              latitude: 25.851693454138523,
                              longitude: -97.51120983065576,
                           }}
                        />
                     </MapView>
                  </View>

                  <View className="flex flex-col justify-center" style={{gap: 8}}>
                     <View className="flex flex-row items-center" style={{gap: 12}}>
                        <Entypo name='location' color={"gray"} size={14} />
                        <Text className="text-dark font-semibold" numberOfLines={1}>8542 Crist Mount</Text>
                     </View>


                     <View className="flex flex-row items-center" style={{gap: 12}}>
                        <FontAwesome5 name='building' color={"gray"} size={14} />
                        <Text className="text-light font-semibold" numberOfLines={1}>Cremin - Klein</Text>
                     </View>


                     <View className="flex flex-row items-center" style={{gap: 12}}>
                        <Entypo name='phone' color={"gray"} size={14} />
                        <Text className="text-light font-semibold" numberOfLines={1}>(911) 975-7881 x748</Text>
                     </View>
                  </View>
               </View>
            </View>

            {/* Delivery Time */}
            <View className="flex flex-row bg-theme-light py-1 justify-between px-3">
               <Text className="text-dark font-semibold">Delivery Time</Text>
               <Text className="text-text">10:11 AM</Text>
               <Text className="text-text">Oct 6, 2024</Text>
            </View>

            {/* Information */}
            <View className="px-3">
               <View className="flex flex-row items-center" style={{gap: 12}}>
                  <Image
                     source={{ uri: data?.image }}
                     className="rounded-lg w-[82] aspect-square object-cover"
                  />

                  <View className="flex flex-col" style={{gap: 4}}>
                     <Text className="text-dark font-semibold text-[24]" numberOfLines={1}>Servicio</Text>
                     <Text className="text-text font-semibold text-[24]" numberOfLines={2}>descripcion</Text>
                  </View>
               </View>

               <View className="flex flex-col py-3" style={{ gap: 6 }}>
                  <ItemPriceOrderDetails label='Subtotal' data='$2.9' />
                  <ItemPriceOrderDetails label='Fee' data='$0.23' />
                  <ItemPriceOrderDetails main label='Total' data='$3.33' />
               </View>
            </View>

            {/* Note */}
            <View className="flex flex-col" style={{ gap: 12 }}>
               <View className="flex flex-row bg-theme-light py-1 justify-between px-3">
                  <Text className="text-dark font-semibold">Note</Text>
               </View>

               <View className="w-full px-3">
                  <View className="bg-white w-full h-[120] rounded-lg">
                     <Text className="px-2 py-1 text-dark text-justify">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis quidem esse facilis iste repudiandae harum nostrum porro molestiae nisi, explicabo distinctio asperiores repellat inventore animi quis? Ipsa asperiores corrupti dolore!</Text>
                  </View>
               </View>
            </View>
         </View>
         {/* Raiting */}
         <TouchableOpacity className="px-3">
            <View className="w-full h-12 bg-orange-500 flex flex-col justify-center rounded-lg">
               <Text className="text-white text-center text-[22px] font-semibold">Raiting</Text>
            </View>
         </TouchableOpacity>
      </View>
   )
}

export default OrderDetails