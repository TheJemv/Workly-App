import { View, Text, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image' // ✅ expo-image
import React from 'react'
import AntDesign from "@expo/vector-icons/AntDesign"
import useGlobal from 'core/globals'

const UserConfigButton = ({ onPress }) => {
   const { customer } = useGlobal()
   const profile = customer?.profile
   const name = (profile?.name ? profile?.name : "") + " " + (profile?.lastName ? profile?.lastName : "")

   return (
      <TouchableOpacity onPress={onPress} className="bg-white w-full relative flex flex-row items-center rounded-lg px-4 py-2">
         <View style={{ gap: 8 }} className="relative flex flex-row items-center flex-1">
            <Image
               className="rounded-full bg-theme-light"
               source={{ uri: customer?.profile?.photo }}
               style={{ width: 72, height: 72, borderRadius: 100 }} // ✅ expo-image no acepta width/height como props
               contentFit="cover" // ✅ resizeMode → contentFit
            />
            <View className="flex-1 flex flex-col">
               <Text className="text-dark font-semibold text-base">{name}</Text>
               <Text className="text-sm text-text">{customer?.profile?.email}</Text>
            </View>
         </View>
         <AntDesign name='right' className="text-text" />
      </TouchableOpacity>
   )
}

export default UserConfigButton