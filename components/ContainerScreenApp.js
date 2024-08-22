import { View } from 'react-native'
import React from 'react'

const ContainerScreenApp = ({children}) => {
   return (
      <View className="flex-1">
         {children}
      </View>
   )
}

export default ContainerScreenApp