import { View, Text } from 'react-native'
import React from 'react'

const ItemPriceOrderDetails = ({ main=false, label="Subtotal", data="$2.9" }) =>  {
   return (
      <View className="flex flex-row justify-between items-center">
         <Text className={main ? 'font-semibold text-xl text-orange-500' : 'text-text text-lg'}>{label}</Text>
         <Text className={main ? "font-semibold text-xl text-orange-500" : 'text-dark font-semibold'}>{data}</Text>
      </View>
   )
}

export default ItemPriceOrderDetails