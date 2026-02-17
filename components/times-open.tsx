import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import type { DataDays, DayName } from "@/types/Schedule";


const daysArray: DayName[] = [
   'Lunes',
   'Martes',
   'Miércoles',
   'Jueves',
   'Viernes',
   'Sábado',
   'Domingo'
];

type Props = {
   businessHours?: DataDays[];
};

export const TimesOpen = ({ businessHours }: Props) => {
   const [show, setShow] = useState<boolean>(false);

   const handleShow = (): void => {
      setShow(!show);
   };
   return (
      <View className="flex flex-col space-y-1">
         <View className="flex flex-row items-center space-x-2">
            <FontAwesome name="clock-o" size={20} color={Colors.buttonColor} />
            <Text className="text-base text-text font-medium">
               Horarios de la empresa
            </Text>
            <Pressable className="active:opacity-80" onPress={handleShow}>
               {show ? (
                  <FontAwesome
                     name="chevron-up"
                     size={16}
                     color={Colors.gray.DEFAULT}
                  />
               ) : (
                  <FontAwesome
                     name="chevron-down"
                     size={16}
                     color={Colors.gray.DEFAULT}
                  />
               )}
            </Pressable>
         </View>
         {show && businessHours && (
            <View className="flex flex-col space-y-1 mb-3">
               {daysArray.map((day) => {
                  const dayData = businessHours[day];
                  return (
                     <View key={day} className="flex flex-row pl-4 justify-between items-center">
                        <Text className="text-sm font-medium text-gray-700 w-24">
                           {day}
                        </Text>

                        {dayData.open ? (
                           <View className="flex flex-row items-center space-x-2">
                              <Text className="text-sm text-gray-600">
                                 {dayData.intervals.start}
                              </Text>
                              <Text className="text-sm text-gray-400">-</Text>
                              <Text className="text-sm text-gray-600">
                                 {dayData.intervals.end}
                              </Text>
                           </View>
                        ) : (
                           <Text className="text-sm text-gray-400 italic">
                              Cerrado
                           </Text>
                        )}
                     </View>
                  )
               })}
            </View>
         )}
      </View>
   );
};
