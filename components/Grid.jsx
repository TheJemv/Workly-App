import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const ItemGrid = ({ Icon: IconComponent, IconName, handle, label="texto" }) => {
   return (
      <TouchableOpacity onPress={handle} className="bg-[#F8F6FF] w-24 h-24 rounded-lg items-center justify-center flex flex-col">
         <IconComponent color={"#354671"} size={12} name={IconName} />
      </TouchableOpacity>
   )
}

const Grid = ({ data }) => {
   return (
      <View className="w-full flex flex-col items-center flex-1">
         <View className="flex flex-row w-[85%] justify-center flex-1">
            <View className="flex flex-row flex-wrap justify-center mt-4" style={{gap: 22}}>
               {data.map((value, index) => (
                  <ItemGrid 
                     key={index + 1} 
                     Icon={value?.Icon} 
                     IconName={value?.IconName} 
                     handle={value?.handle}
                     label={value?.label}   
                  />
               ))}
            </View>
         </View>
      </View>
   )
}

export default Grid