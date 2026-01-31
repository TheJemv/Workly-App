import { Easing, Text, TouchableOpacity, View } from 'react-native';
import React from 'react'
import Entypo from "@expo/vector-icons/Entypo"
import { Animated } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const Option = ({ icon: IconComponent, iconName = "plus", label = "Option", colorIcon = "#fff", disabled = false, onPress, styles, loading = true }) => {
   const spinValue = new Animated.Value(0)

   Animated.loop(
      Animated.timing(spinValue, {
         toValue: 1,
         duration: 3000,
         easing: Easing.linear,
         useNativeDriver: true
      })
   ).start()

   const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
   })

   return (
      <TouchableOpacity disabled={disabled} onPress={onPress} className="flex flex-row bg-white p-2 h-10 items-center" style={{ gap: 4 }}>
         {loading ?
            (
               <>
                  {IconComponent && (
                     <View className={`flex rounded flex-row items-center justify-center h-full max-h-10 relative aspect-square ${styles}`}>
                        <IconComponent name={iconName} color={colorIcon} size={14} />
                     </View>
                  )}
                  <Text className="text-text">{label}</Text>

                  <Entypo name='chevron-small-right' color={"#444"} style={{ marginLeft: "auto" }} size={18} />
               </>
            )
            : (
               <Animated.View
                  style={{
                     transform: [{
                        rotate: spin
                     }],
                     marginVertical: 'auto',
                  }}
                  className={"flex flex-row w-full h-full"}
               >
                  <AntDesign
                     name='loading'
                     className='text-primary'
                     size={16}
                     style={{
                        marginVertical: "auto",
                        marginHorizontal: "auto",
                     }}
                  />
               </Animated.View>
            )}

         {/* {IconComponent && (
            <View className={`flex rounded flex-row items-center justify-center h-full max-h-10 relative aspect-square ${ styles }`}>
               <IconComponent name={iconName} color={colorIcon} size={14} />
            </View>
         )}
         <Text className="text-text">{label}</Text>

         <Entypo name='chevron-small-right' color={"#444"} style={{marginLeft: "auto"}} size={18} /> */}
      </TouchableOpacity>
   )
}


export default Option