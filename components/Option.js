import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react'
import Entypo from "@expo/vector-icons/Entypo"

const Option = ({icon: IconComponent, iconName="plus", label="Option", colorIcon="#fff", onPress, styles}) => {
   const handlePress = () => console.log(label, "- Button")
   return (
      <TouchableOpacity onPress={onPress ? onPress : handlePress} className="flex flex-row bg-white p-2 h-10 items-center" style={{gap: 4}}>
         {IconComponent && (
            <View className={`flex rounded flex-row items-center justify-center h-full max-h-10 relative aspect-square ${ styles }`}>
               <IconComponent name={iconName} color={colorIcon} size={14} />
            </View>
         )}
         <Text className="text-text">{label}</Text>

         <Entypo name='chevron-small-right' color={"#444"} style={{marginLeft: "auto"}} size={18} />
      </TouchableOpacity>
   )
}


export default Option